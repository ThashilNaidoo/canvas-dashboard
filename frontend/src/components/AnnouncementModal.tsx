import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Announcement, TextRun } from '../lib/api'
import { longDate } from '../lib/format'
import './AnnouncementModal.css'

type Props = {
  announcement: Announcement
  origin: DOMRect
  onClose: () => void
}

const renderRuns = (runs: TextRun[]) =>
  runs.map((run, i) => {
    let node: React.ReactNode = run.text
    if (run.href) {
      node = (
        <a href={run.href} target="_blank" rel="noreferrer">
          {node}
        </a>
      )
    }
    if (run.bold) node = <strong>{node}</strong>
    if (run.highlight) node = <mark>{node}</mark>
    return <span key={i}>{node}</span>
  })

/* Grows out of the clicked item (FLIP) and shrinks back into it on close. */
function AnnouncementModal({ announcement, origin, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const fromTransform = useRef('')
  const [closing, setClosing] = useState(false)

  const close = useCallback(() => {
    const panel = panelRef.current!
    if (panel.style.opacity === '0') return
    setClosing(true)
    panel.style.transform = fromTransform.current
    panel.style.opacity = '0'
    panel.addEventListener('transitionend', onClose, { once: true })
  }, [onClose])

  useLayoutEffect(() => {
    const panel = panelRef.current!
    const target = panel.getBoundingClientRect()
    const dx = origin.left + origin.width / 2 - (target.left + target.width / 2)
    const dy = origin.top + origin.height / 2 - (target.top + target.height / 2)
    const scale = origin.width / target.width
    fromTransform.current = `translate(${dx}px, ${dy}px) scale(${scale})`

    panel.style.transform = fromTransform.current
    panel.style.opacity = '0'
    // Two frames so the initial transform is painted before it transitions away
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        panel.style.transform = ''
        panel.style.opacity = ''
        panel.focus()
      }),
    )
  }, [origin])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <div className={`modal-overlay ${closing ? 'closing' : ''}`} onClick={close}>
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-scroll">
          <span className="announcement-meta">
            <time dateTime={announcement.postedAt.toISOString()}>
              {longDate.format(announcement.postedAt)}
            </time>
            <span className="announcement-course">{announcement.course}</span>
          </span>
          <h2 id="announcement-title" className="modal-title">
            {announcement.title}
          </h2>
          {announcement.author && <p className="modal-author">From {announcement.author}</p>}

          <div className="modal-body">
            {announcement.body.map((block, i) =>
              block.kind === 'heading' ? (
                <h3 key={i} className="modal-subheading">
                  {renderRuns(block.runs)}
                </h3>
              ) : (
                <p key={i}>{renderRuns(block.runs)}</p>
              ),
            )}
          </div>

          <a className="modal-link" href={announcement.url} target="_blank" rel="noreferrer">
            Open in Canvas ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal
