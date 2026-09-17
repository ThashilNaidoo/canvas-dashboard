/* Two arcs chasing each other: one long, one short, with even gaps. */
function SyncMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6.6 12.58A10 10 0 0 1 25.85 17.74" />
      <path d="M23.66 22.43A10 10 0 0 1 6.15 17.74" />
    </svg>
  )
}

export default SyncMark
