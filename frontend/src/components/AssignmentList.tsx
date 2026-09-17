import type { Assignment } from '../lib/api'
import { daysUntil, dueLabel, shortDate, time, weekday } from '../lib/format'
import './AssignmentList.css'

type Props = { assignments: Assignment[] | null }

const status = (a: Assignment) => {
  if (a.done) return 'done'
  if (!a.dueAt) return 'undated'
  const days = daysUntil(a.dueAt)
  if (days < 0) return 'overdue'
  if (days <= 1) return 'soon'
  return ''
}

function AssignmentList({ assignments }: Props) {
  if (assignments === null) {
    return (
      <ol className="assignment-list" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="assignment assignment-skeleton">
            <span className="assignment-date">
              <span className="skeleton-line" />
              <span className="skeleton-line" />
            </span>
            <div className="assignment-body">
              <span className="skeleton-line" />
              <span className="skeleton-line" />
            </div>
            <span className="skeleton-line" />
          </li>
        ))}
      </ol>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="panel">
        <p className="label">All clear</p>
        <p>Nothing due in the next while.</p>
      </div>
    )
  }

  return (
    <ol className="assignment-list">
      {assignments.map((a) => (
        <li key={a.id} className={`assignment ${status(a)}`}>
          {a.dueAt ? (
            <time className="assignment-date" dateTime={a.dueAt.toISOString()}>
              <span className="assignment-weekday">{weekday.format(a.dueAt)}</span>
              <span className="assignment-day">{shortDate.format(a.dueAt)}</span>
            </time>
          ) : (
            <span className="assignment-date">
              <span className="assignment-weekday">Due</span>
              <span className="assignment-day">—</span>
            </span>
          )}
          <div className="assignment-body">
            <span className="assignment-title">{a.title}</span>
            <span className="assignment-meta">
              {a.course}
              {a.dueAt && ` · ${time.format(a.dueAt)}`}
              {a.points > 0 && ` · ${a.points} pts`}
            </span>
          </div>
          <span className="assignment-due">
            {a.done ? 'Done' : a.dueAt ? dueLabel(a.dueAt) : 'No date'}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default AssignmentList
