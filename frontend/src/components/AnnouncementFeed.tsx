import type { Announcement } from '../mock/data'
import { postedLabel } from '../lib/format'
import './AnnouncementFeed.css'

type Props = { announcements: Announcement[] }

function AnnouncementFeed({ announcements }: Props) {
  const sorted = [...announcements].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())

  return (
    <ol className="announcement-feed">
      {sorted.map((a) => (
        <li key={a.id} className="announcement">
          <span className="announcement-node" aria-hidden="true" />
          <span className="announcement-meta">
            <time dateTime={a.postedAt.toISOString()}>{postedLabel(a.postedAt)}</time>
            <span className="announcement-course">{a.course}</span>
          </span>
          <span className="announcement-title">{a.title}</span>
          <p className="announcement-excerpt">{a.excerpt}</p>
        </li>
      ))}
    </ol>
  )
}

export default AnnouncementFeed
