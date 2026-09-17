import type { Assignment } from '../mock/data'
import { daysUntil, dueLabel, shortDate, time, weekday } from '../lib/format'
import './AssignmentList.css'

type Props = { assignments: Assignment[] }

const urgency = (date: Date) => {
  const days = daysUntil(date)
  if (days < 0) return 'overdue'
  if (days <= 1) return 'soon'
  return ''
}

function AssignmentList({ assignments }: Props) {
  const sorted = [...assignments].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())

  return (
    <ol className="assignment-list">
      {sorted.map((a) => (
        <li key={a.id} className={`assignment ${urgency(a.dueAt)}`}>
          <time className="assignment-date" dateTime={a.dueAt.toISOString()}>
            <span className="assignment-weekday">{weekday.format(a.dueAt)}</span>
            <span className="assignment-day">{shortDate.format(a.dueAt)}</span>
          </time>
          <div className="assignment-body">
            <span className="assignment-title">{a.title}</span>
            <span className="assignment-meta">
              {a.course} · {time.format(a.dueAt)}
              {a.points > 0 && ` · ${a.points} pts`}
            </span>
          </div>
          <span className="assignment-due">{dueLabel(a.dueAt)}</span>
        </li>
      ))}
    </ol>
  )
}

export default AssignmentList
