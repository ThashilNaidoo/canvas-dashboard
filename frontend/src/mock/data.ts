// Temporary stand-in for /api/assignments and /api/announcements.
// Dates are relative to now so the mock stays realistic.

export type Assignment = {
  id: number
  course: string
  title: string
  dueAt: Date
  points: number
}

export type Announcement = {
  id: number
  course: string
  title: string
  postedAt: Date
  excerpt: string
}

const daysFromNow = (days: number, hour = 23, minute = 59) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d
}

export const assignments: Assignment[] = [
  {
    id: 1,
    course: 'CMPT726 Machine Learning',
    title: 'Assignment 1: Linear regression & gradient descent',
    dueAt: daysFromNow(-1),
    points: 100,
  },
  {
    id: 2,
    course: 'CMPT742 Visual Computing Lab I',
    title: 'Lab 2: Image filtering pipeline',
    dueAt: daysFromNow(0, 17, 0),
    points: 50,
  },
  {
    id: 3,
    course: 'CMPT726 Machine Learning',
    title: 'Quiz 2: Probability refresher',
    dueAt: daysFromNow(2, 12, 0),
    points: 20,
  },
  {
    id: 4,
    course: 'Fall 2026 Graduate Student Orientation',
    title: 'Academic integrity module',
    dueAt: daysFromNow(5),
    points: 0,
  },
  {
    id: 5,
    course: 'CMPT742 Visual Computing Lab I',
    title: 'Project proposal',
    dueAt: daysFromNow(9),
    points: 75,
  },
  {
    id: 6,
    course: 'CMPT726 Machine Learning',
    title: 'Assignment 2: Logistic regression',
    dueAt: daysFromNow(14),
    points: 100,
  },
]

export const announcements: Announcement[] = [
  {
    id: 1,
    course: 'CMPT726 Machine Learning',
    title: 'Office hours moved to Thursday',
    postedAt: daysFromNow(0, 9, 12),
    excerpt:
      'This week only, office hours will run Thursday 2–4pm in TASC1 9204 instead of the usual Wednesday slot.',
  },
  {
    id: 2,
    course: 'CMPT742 Visual Computing Lab I',
    title: 'Lab 2 starter code released',
    postedAt: daysFromNow(-1, 16, 40),
    excerpt:
      'Starter code and the test images are now on the course GitHub. Read the README before the Tuesday lab.',
  },
  {
    id: 3,
    course: 'MPCS Seeking Student Resource Hub',
    title: 'Fall career fair registration open',
    postedAt: daysFromNow(-2, 11, 5),
    excerpt:
      'Registration for the October 8 career fair is open. Bring printed résumés; several labs are recruiting RAs.',
  },
  {
    id: 4,
    course: 'CMPT726 Machine Learning',
    title: 'Assignment 1 clarifications',
    postedAt: daysFromNow(-4, 20, 30),
    excerpt:
      'A few people asked about the learning-rate sweep in Q3. You only need to report the best three runs.',
  },
]
