import { useEffect, useRef } from 'react'
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  CircleGeometry,
  WebGLRenderer,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from 'three'
import LayerStackFallback from './LayerStackFallback.jsx'

const INK = 0x191a17
const PAPER = 0xf4f3ef
const ACCENT = 0x586be9
const ACCENT_SOFT = 0xe4e8ff
const ACCENT_LIGHT = 0xb5bfff

const WIDTH = 1.56
const HEIGHT = 1.04

function roundedRect(width, height, radius) {
  const x = -width / 2
  const y = -height / 2
  const shape = new Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return new ShapeGeometry(shape, 10)
}

/* small flat element placed on a layer, (x, y) measured from the layer's top-left */
function chip(layer, { x, y, w, h, r = 0.02, color, z = 0.004 }) {
  const mesh = new Mesh(roundedRect(w, h, Math.min(r, h / 2, w / 2)), new MeshBasicMaterial({ color }))
  mesh.position.set(-WIDTH / 2 + x + w / 2, HEIGHT / 2 - y - h / 2, z)
  layer.add(mesh)
  return mesh
}

function dot(layer, { x, y, r, color, z = 0.004 }) {
  const mesh = new Mesh(new CircleGeometry(r, 24), new MeshBasicMaterial({ color }))
  mesh.position.set(-WIDTH / 2 + x, HEIGHT / 2 - y, z)
  layer.add(mesh)
  return mesh
}

function makeLayer(color, edgeColor, edgeOpacity) {
  const layer = new Group()
  const geometry = roundedRect(WIDTH, HEIGHT, 0.08)
  layer.add(new Mesh(geometry, new MeshBasicMaterial({ color })))
  const edges = new LineSegments(new EdgesGeometry(geometry), new LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeOpacity }))
  edges.position.z = 0.002
  layer.add(edges)
  return layer
}

const shadowFragment = /* glsl */`
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * vec2(1.0, 1.5)) * 2.0;
    gl_FragColor = vec4(0.098, 0.102, 0.09, (1.0 - smoothstep(0.0, 1.0, d)) * uOpacity);
  }
`

export default function LayerStackScene() {
  const host = useRef(null)

  useEffect(() => {
    let cancelled = false
    let teardown = () => {}
    const start = () => {
      if (cancelled || !host.current) return
      const node = host.current
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
      const scene = new Scene()
      const camera = new PerspectiveCamera(30, 1, 0.1, 100)
      camera.position.set(0, 0, 6)
      let renderer
      try {
        renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
      } catch {
        node.dataset.fallback = 'true'
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setClearColor(0x000000, 0)
      node.appendChild(renderer.domElement)
      node.dataset.ready = 'true'

      const rig = new Group()
      scene.add(rig)
      const stack = new Group()
      stack.rotation.set(-0.82, 0, 0.58)
      rig.add(stack)

      const shadowMaterial = new ShaderMaterial({
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: shadowFragment,
        uniforms: { uOpacity: { value: 0.16 } },
        transparent: true,
        depthWrite: false,
      })
      const shadow = new Mesh(new PlaneGeometry(WIDTH * 1.5, HEIGHT * 1.5), shadowMaterial)
      shadow.position.z = -0.12
      shadow.renderOrder = -1
      stack.add(shadow)

      /* base: solid accent with a hairline dot grid */
      const base = makeLayer(ACCENT, PAPER, 0.35)
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 7; col += 1) dot(base, { x: 0.22 + col * 0.19, y: 0.2 + row * 0.21, r: 0.012, color: ACCENT_LIGHT })
      }

      /* middle: soft blue panel with a little bar chart */
      const middle = makeLayer(ACCENT_SOFT, ACCENT, 0.4)
      chip(middle, { x: 0.12, y: 0.12, w: 0.42, h: 0.05, color: ACCENT })
      const bars = [0.28, 0.42, 0.34, 0.56, 0.46, 0.68, 0.6].map((height, index) => chip(middle, {
        x: 0.14 + index * 0.18, y: 0.9 - height, w: 0.1, h: height, r: 0.025, color: index === 5 ? ACCENT : ACCENT_LIGHT,
      }))

      /* top: paper window — traffic dots, text lines, a </> chip */
      const top = makeLayer(PAPER, INK, 0.18)
      ;[0, 1, 2].forEach((index) => dot(top, { x: 0.12 + index * 0.07, y: 0.11, r: 0.022, color: index === 0 ? ACCENT : 0xc9cabf }))
      chip(top, { x: 0, y: 0.2, w: WIDTH, h: 0.006, r: 0, color: 0xdcdcd3 })
      chip(top, { x: 0.12, y: 0.32, w: 0.62, h: 0.07, color: INK })
      chip(top, { x: 0.12, y: 0.46, w: 0.9, h: 0.035, color: 0xc9cabf })
      chip(top, { x: 0.12, y: 0.54, w: 0.74, h: 0.035, color: 0xc9cabf })
      chip(top, { x: 0.12, y: 0.62, w: 0.82, h: 0.035, color: 0xc9cabf })
      chip(top, { x: 0.12, y: 0.78, w: 0.36, h: 0.12, r: 0.06, color: INK })
      const codeChip = chip(top, { x: 1.06, y: 0.3, w: 0.38, h: 0.26, r: 0.05, color: ACCENT })
      // "</>" drawn as three strokes on the chip
      const strokeMaterial = new MeshBasicMaterial({ color: PAPER })
      const stroke = (x, y, length, angle) => {
        const mesh = new Mesh(new PlaneGeometry(length, 0.018), strokeMaterial)
        mesh.position.set(x, y, 0.003)
        mesh.rotation.z = angle
        codeChip.add(mesh)
      }
      stroke(-0.105, 0.025, 0.07, 0.75); stroke(-0.105, -0.025, 0.07, -0.75)
      stroke(0, 0, 0.15, 1.2)
      stroke(0.105, 0.025, 0.07, -0.75); stroke(0.105, -0.025, 0.07, 0.75)

      const layers = [base, middle, top]
      layers.forEach((layer) => stack.add(layer))

      let frame = 0
      let pointerX = 0
      let pointerY = 0
      let targetX = 0
      let targetY = 0
      let scroll = 0
      let targetScroll = 0
      let spread = 0
      let inView = false
      let hovered = false
      let lastTime = 0
      let elapsed = 0
      const onPointer = (event) => {
        if (!finePointer.matches) return
        const bounds = node.getBoundingClientRect()
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
      }
      const onPointerEnter = () => { hovered = true }
      const onPointerLeave = () => { hovered = false; pointerX = 0; pointerY = 0 }
      const onTap = () => { if (!finePointer.matches) hovered = !hovered }
      const onScroll = () => { targetScroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) }
      const resize = () => {
        const { width, height } = node.getBoundingClientRect()
        if (!width || !height) return
        camera.aspect = width / height
        camera.position.z = width < 300 ? 5.6 : 4.9
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
        renderer.render(scene, camera)
      }
      const draw = (now = performance.now()) => {
        const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.05)
        lastTime = now
        if (!reduceMotion) elapsed += dt
        const t = elapsed
        scroll += (targetScroll - scroll) * 0.06
        targetX += (pointerX - targetX) * 0.06
        targetY += (pointerY - targetY) * 0.06
        spread += ((hovered ? 1 : 0) - spread) * 0.07

        rig.rotation.y = targetX * 0.22
        rig.rotation.x = targetY * 0.16
        rig.position.y = Math.sin(t * 0.7) * 0.035 - scroll * 0.15
        rig.position.x = scroll * 0.2
        stack.rotation.z = 0.58 + scroll * 0.22 + Math.sin(t * 0.35) * 0.025

        const gap = 0.26 + spread * 0.2 + scroll * 0.16
        layers.forEach((layer, index) => {
          const centered = index - 1
          layer.position.z = centered * gap + Math.sin(t * 0.9 + index * 1.3) * 0.012
          layer.position.x = centered * spread * 0.05
        })
        shadow.position.z = -gap - 0.2
        shadowMaterial.uniforms.uOpacity.value = 0.16 - spread * 0.04
        bars.forEach((bar, index) => {
          const pulse = reduceMotion ? 1 : 0.92 + Math.sin(t * 1.4 + index * 0.8) * 0.08
          bar.scale.y = pulse
        })

        renderer.render(scene, camera)
        if (!reduceMotion && !document.hidden && inView) frame = requestAnimationFrame(draw)
      }
      const startLoop = () => {
        cancelAnimationFrame(frame)
        lastTime = performance.now()
        frame = requestAnimationFrame(draw)
      }
      let observer
      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(frame)
        else if (inView && !reduceMotion) startLoop()
      }
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting
          if (entry.isIntersecting && !reduceMotion && !document.hidden) startLoop()
          else cancelAnimationFrame(frame)
        }, { threshold: 0.02 })
        observer.observe(node)
      } else {
        inView = true
        if (!reduceMotion) startLoop()
      }
      window.addEventListener('resize', resize)
      window.addEventListener('scroll', onScroll, { passive: true })
      node.addEventListener('pointermove', onPointer)
      node.addEventListener('pointerenter', onPointerEnter)
      node.addEventListener('pointerleave', onPointerLeave)
      node.addEventListener('click', onTap)
      document.addEventListener('visibilitychange', onVisibility)
      onScroll()
      resize()
      draw()
      teardown = () => {
        cancelAnimationFrame(frame)
        observer?.disconnect()
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
        node.removeEventListener('pointermove', onPointer)
        node.removeEventListener('pointerenter', onPointerEnter)
        node.removeEventListener('pointerleave', onPointerLeave)
        node.removeEventListener('click', onTap)
        document.removeEventListener('visibilitychange', onVisibility)
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose()
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material]
            materials.forEach((material) => material.dispose())
          }
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
    start()
    return () => { cancelled = true; teardown() }
  }, [])

  return <div className="orbit-scene" ref={host} aria-hidden="true"><LayerStackFallback/></div>
}
