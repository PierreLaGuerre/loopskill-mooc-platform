export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
}

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 1,
    userId: 1,
    courseId: 21,
    progress: 72,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 2,
    userId: 1,
    courseId: 3,
    progress: 45,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 3,
    userId: 1,
    courseId: 1,
    progress: 100,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 4,
    userId: 4,
    courseId: 1,
    progress: 35,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 5,
    userId: 4,
    courseId: 4,
    progress: 60,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 6,
    userId: 4,
    courseId: 18,
    progress: 20,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 7,
    userId: 5,
    courseId: 6,
    progress: 80,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 8,
    userId: 5,
    courseId: 13,
    progress: 45,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 9,
    userId: 5,
    courseId: 14,
    progress: 15,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 10,
    userId: 5,
    courseId: 16,
    progress: 10,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 11,
    userId: 6,
    courseId: 3,
    progress: 50,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 12,
    userId: 6,
    courseId: 10,
    progress: 30,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 13,
    userId: 6,
    courseId: 17,
    progress: 70,
    enrolledAt: '2026-03-08T17:21:07'
  },
  {
    id: 14,
    userId: 6,
    courseId: 20,
    progress: 25,
    enrolledAt: '2026-03-08T17:21:07'
  }
];