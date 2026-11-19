import { useEffect, useRef } from 'react'
import {
  BufferGeometry,
  BackSide,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  Group,
} from 'three'
import AbstractOrbitFallback from './AbstractOrbitFallback.jsx'

export default function OrbitScene() {
  const host = useRef(null)

  useEffect(() => {
    let cancelled = false
    let teardown = () => {}
    const start = () => {
      if (cancelled || !host.current) return
      const node = host.current
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scene = new Scene()
      const camera = new PerspectiveCamera(34, 1, 0.1, 100)
      camera.position.set(0, 0, 5.6)
      let renderer
      try {
        renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
      } catch {
        node.dataset.fallback = 'true'
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setClearColor(0x000000, 0)
      node.appendChild(renderer.domElement)
      node.dataset.ready = 'true'

      const sculpture = new Group()
      scene.add(sculpture)
      const core = new Group()
      sculpture.add(core)

      const orbGeometry = new SphereGeometry(0.72, 18, 14)
      const orbShell = new Mesh(new SphereGeometry(0.84, 18, 14), new MeshBasicMaterial({
        color: 0x8493ff,
        transparent: true,
        opacity: 0.075,
        side: BackSide,
      }))
      const orb = new Mesh(orbGeometry, new MeshPhysicalMaterial({
        color: 0xd9ddff,
        emissive: 0x273db7,
        emissiveIntensity: 0.24,
        metalness: 0.12,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        transparent: true,
        opacity: 0.62,
      }))
      const orbWire = new Mesh(orbGeometry, new MeshBasicMaterial({
        color: 0x586be9,
        wireframe: true,
        transparent: true,
        opacity: 0.64,
      }))
      orbWire.scale.setScalar(1.008)
      core.add(orbShell, orb, orbWire)

      const accent = 0x586be9
      const orbitA = new Group()
      orbitA.rotation.set(0.92, 0.12, -0.34)
      sculpture.add(orbitA)
      const orbitMaterialA = new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.54 })
      orbitA.add(new Mesh(new TorusGeometry(1.22, 0.009, 6, 144), orbitMaterialA))
      const satellite = new Mesh(
        new SphereGeometry(0.075, 20, 16),
        new MeshPhysicalMaterial({ color: 0xf4f3ef, roughness: 0.19, metalness: 0.28, clearcoat: 1 }),
      )
      satellite.position.set(1.22, 0, 0)
      orbitA.add(satellite)

      const orbitB = new Group()
      orbitB.rotation.set(1.38, -0.45, 0.18)
      sculpture.add(orbitB)
      const orbitMaterialB = new MeshBasicMaterial({ color: 0xb5bfff, transparent: true, opacity: 0.32 })
      orbitB.add(new Mesh(new TorusGeometry(0.98, 0.006, 6, 128), orbitMaterialB))
      const satelliteB = new Mesh(
        new SphereGeometry(0.07, 12, 8),
        new MeshBasicMaterial({ color: 0x8493ff }),
      )
      satelliteB.position.set(-0.98, 0, 0)
      orbitB.add(satelliteB)

      const connectorGeometry = new BufferGeometry().setFromPoints([
        new Vector3(-0.46, 0.48, 0.1),
        new Vector3(-1.32, 0.94, 0.1),
      ])
      sculpture.add(new Line(connectorGeometry, new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.48 })))
      const connectorNode = new Mesh(
        new SphereGeometry(0.045, 16, 12),
        new MeshBasicMaterial({ color: 0x8493ff }),
      )
      connectorNode.position.set(-1.32, 0.94, 0.1)
      sculpture.add(connectorNode)

      scene.add(new HemisphereLight(0xf5f4ed, 0x4d526b, 2.1))
      const keyLight = new PointLight(0xffffff, 3.2, 10)
      keyLight.position.set(-2.5, 3.5, 4.2)
      scene.add(keyLight)
      const blueLight = new PointLight(0x8493ff, 3.6, 8)
      blueLight.position.set(2.8, -1.5, 2.8)
      scene.add(blueLight)

      let frame = 0
      let pointerX = 0
      let pointerY = 0
      let targetX = 0
      let targetY = 0
      let scroll = 0
      let targetScroll = 0
      let inView = false
      let hovered = false
      const onPointer = (event) => {
        const bounds = node.getBoundingClientRect()
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.26
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.22
      }
      const onPointerEnter = () => { hovered = true }
      const onPointerLeave = () => { hovered = false; pointerX = 0; pointerY = 0 }
      const onScroll = () => { targetScroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) }
      const resize = () => {
        const { width, height } = node.getBoundingClientRect()
        if (!width || !height) return
        camera.aspect = width / height
        camera.position.z = width < 520 ? 6.8 : 5.6
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
        renderer.render(scene, camera)
      }
      const draw = (time = 0) => {
        scroll += (targetScroll - scroll) * 0.035
        targetX += (pointerX - targetX) * 0.045
        targetY += (pointerY - targetY) * 0.045
        sculpture.rotation.y = targetX + scroll * 0.1 + (reduceMotion ? 0 : Math.sin(time * 0.00032) * 0.035)
        sculpture.rotation.x = -0.08 + targetY
        sculpture.position.x = 0.1 + scroll * 0.38 + targetX * 0.22
        sculpture.position.y = reduceMotion ? 0 : -targetY * 0.34 + Math.sin(time * 0.0006) * 0.04
        const targetScale = hovered ? 1.06 : 1
        const nextScale = sculpture.scale.x + (targetScale - sculpture.scale.x) * 0.085
        sculpture.scale.setScalar(nextScale)
        const targetRingScale = hovered ? 1.045 : 1
        orbitA.scale.setScalar(orbitA.scale.x + (targetRingScale - orbitA.scale.x) * 0.075)
        orbitB.scale.setScalar(orbitB.scale.x + (targetRingScale - orbitB.scale.x) * 0.075)
        orb.material.emissiveIntensity += ((hovered ? 0.32 : 0.24) - orb.material.emissiveIntensity) * 0.08
        blueLight.intensity += ((hovered ? 3.9 : 3.6) - blueLight.intensity) * 0.08
        const centerProximity = 1 - Math.min(Math.hypot(targetX, targetY) / 0.2, 1)
        orbWire.material.opacity = 0.54 + centerProximity * 0.13 + (hovered ? 0.035 : 0)
        orbitMaterialA.opacity = hovered ? 0.68 : 0.54
        orbitMaterialB.opacity = hovered ? 0.42 : 0.32
        core.rotation.y = time * 0.00007
        core.rotation.x = Math.sin(time * 0.0002) * 0.05
        orbitA.rotation.z = -0.34 + Math.sin(time * 0.00016) * 0.1
        orbitB.rotation.y = -0.45 + Math.sin(time * 0.00013) * 0.1
        renderer.render(scene, camera)
        if (!reduceMotion && !document.hidden) frame = requestAnimationFrame(draw)
      }
      let observer
      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(frame)
        else if (inView && !reduceMotion) frame = requestAnimationFrame(draw)
      }
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting
          if (entry.isIntersecting && !reduceMotion && !document.hidden) frame = requestAnimationFrame(draw)
          else cancelAnimationFrame(frame)
        }, { threshold: 0.02 })
        observer.observe(node)
      } else {
        inView = true
        if (!reduceMotion) frame = requestAnimationFrame(draw)
      }
      window.addEventListener('resize', resize)
      window.addEventListener('scroll', onScroll, { passive: true })
      node.addEventListener('pointermove', onPointer)
      node.addEventListener('pointerenter', onPointerEnter)
      node.addEventListener('pointerleave', onPointerLeave)
      document.addEventListener('visibilitychange', onVisibility)
      onScroll()
      resize()
      teardown = () => {
        cancelAnimationFrame(frame)
        observer?.disconnect()
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
        node.removeEventListener('pointermove', onPointer)
        node.removeEventListener('pointerenter', onPointerEnter)
        node.removeEventListener('pointerleave', onPointerLeave)
        document.removeEventListener('visibilitychange', onVisibility)
        sculpture.traverse((object) => {
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

  return <div className="orbit-scene" ref={host} aria-hidden="true"><AbstractOrbitFallback/></div>
}
