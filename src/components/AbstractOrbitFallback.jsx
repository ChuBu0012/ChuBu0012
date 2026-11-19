export default function AbstractOrbitFallback() {
  return <div className="scene-fallback" aria-hidden="true">
    <span className="fallback-orbit fallback-orbit-a"/>
    <span className="fallback-orbit fallback-orbit-b"/>
    <span className="fallback-glow"/>
    <span className="fallback-sphere"><i/><b/></span>
    <span className="fallback-node fallback-node-a"/>
    <span className="fallback-node fallback-node-b"/>
    <span className="fallback-connector"/>
  </div>
}
