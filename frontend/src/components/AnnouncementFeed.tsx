import { useState } from 'react'
import type { Announcement } from '../lib/api'
import { postedLabel } from '../lib/format'
import AnnouncementModal from './AnnouncementModal'
import './AnnouncementFeed.css'

type Props = { announcements: Announcement[] | null }

function AnnouncementFeed({ announcements }: Props) {
  const [open, setOpen] = useState<{ announcement: Announcement; origin: DOMRect } | null>(null)

  if (announcements === null) {
    return (
      <ol className="announcement-feed" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="announcement announcement-skeleton">
            <span className="announcement-node" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
          </li>
        ))}
      </ol>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className="panel">
        <p className="label">Quiet channel</p>
        <p>No announcements in the last 30 days.</p>
      </div>
    )
  }

  return (
    <>
      <ol className="announcement-feed">
        {announcements.map((a) => (
          <li key={a.id} className="announcement">
            <span className="announcement-node" aria-hidden="true" />
            <button
              className="announcement-button"
              onClick={(e) =>
                setOpen({ announcement: a, origin: e.currentTarget.getBoundingClientRect() })
              }
            >
              <span className="announcement-meta">
                <time dateTime={a.postedAt.toISOString()}>{postedLabel(a.postedAt)}</time>
                <span className="announcement-course">{a.course}</span>
              </span>
              <span className="announcement-title">{a.title}</span>
              <span className="announcement-excerpt">{a.excerpt}</span>
            </button>
          </li>
        ))}
      </ol>

      {open && (
        <AnnouncementModal
          announcement={open.announcement}
          origin={open.origin}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}

export default AnnouncementFeed
