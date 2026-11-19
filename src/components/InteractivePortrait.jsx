import { useEffect, useRef, useState } from 'react'
import { resolvePortraitState } from '../portraitState.js'

const hoverImage = '/pornput-hover-head-tilt.webp'
const waveImage = '/pornput-click-wave.webp'
const waveDuration = 1500

export default function InteractivePortrait({ src, name }) {
  const [hovered, setHovered] = useState(false)
  const [waving, setWaving] = useState(false)
  const waveTimer = useRef(0)
  const state = resolvePortraitState({ hovered, waving })

  useEffect(() => () => window.clearTimeout(waveTimer.current), [])

  function handleActivate() {
    window.clearTimeout(waveTimer.current)
    setWaving(true)
    waveTimer.current = window.setTimeout(() => {
      waveTimer.current = 0
      setWaving(false)
    }, waveDuration)
  }

  return <button
    className={`portrait-interaction portrait-state-${state}`}
    type="button"
    aria-label={`Interactive portrait of ${name}; activate to wave`}
    aria-pressed={waving}
    onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHovered(true) }}
    onPointerLeave={(event) => { if (event.pointerType !== 'touch') setHovered(false) }}
    onClick={handleActivate}
  >
    <img className="portrait-image portrait-image-default" src={src} alt="" aria-hidden="true" width="1086" height="1448" fetchPriority="high" />
    <img className="portrait-image portrait-image-hover" src={hoverImage} alt="" aria-hidden="true" width="1086" height="1448" decoding="async" />
    <img className="portrait-image portrait-image-wave" src={waveImage} alt="" aria-hidden="true" width="1087" height="1447" decoding="async" />
  </button>
}
