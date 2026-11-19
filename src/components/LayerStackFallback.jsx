export default function LayerStackFallback() {
  return <div className="scene-fallback" aria-hidden="true">
    <span className="fallback-layer fallback-layer-base"/>
    <span className="fallback-layer fallback-layer-middle"/>
    <span className="fallback-layer fallback-layer-top"><i/><b/></span>
  </div>
}
