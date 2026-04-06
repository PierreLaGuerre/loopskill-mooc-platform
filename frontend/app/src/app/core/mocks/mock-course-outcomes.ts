export interface CourseOutcome {
  id: number;
  courseId: number;
  text: string;
  displayOrder: number;
}

export const MOCK_COURSE_OUTCOMES: CourseOutcome[] = [
  {
    id: 1,
    courseId: 1,
    text: 'Write basic Python programs using variables, loops and functions.',
    displayOrder: 1
  },
  {
    id: 2,
    courseId: 1,
    text: 'Understand core programming logic and syntax.',
    displayOrder: 2
  },
  {
    id: 3,
    courseId: 1,
    text: 'Solve beginner-friendly coding exercises.',
    displayOrder: 3
  },
  {
    id: 4,
    courseId: 1,
    text: 'Build confidence to continue into more advanced Python topics.',
    displayOrder: 4
  },

  {
    id: 5,
    courseId: 2,
    text: 'Understand the principles of object-oriented programming.',
    displayOrder: 1
  },
  {
    id: 6,
    courseId: 2,
    text: 'Create Java classes and objects correctly.',
    displayOrder: 2
  },
  {
    id: 7,
    courseId: 2,
    text: 'Apply inheritance and polymorphism in simple projects.',
    displayOrder: 3
  },
  {
    id: 8,
    courseId: 2,
    text: 'Structure Java code in a more maintainable way.',
    displayOrder: 4
  },

  {
    id: 9,
    courseId: 3,
    text: 'Build Angular applications using components and templates.',
    displayOrder: 1
  },
  {
    id: 10,
    courseId: 3,
    text: 'Configure routing and navigation flows.',
    displayOrder: 2
  },
  {
    id: 11,
    courseId: 3,
    text: 'Use services to organize application logic.',
    displayOrder: 3
  },
  {
    id: 12,
    courseId: 3,
    text: 'Create scalable frontend project structures.',
    displayOrder: 4
  },

  {
    id: 13,
    courseId: 4,
    text: 'Understand component-based development with React.',
    displayOrder: 1
  },
  {
    id: 14,
    courseId: 4,
    text: 'Manage state and props effectively.',
    displayOrder: 2
  },
  {
    id: 15,
    courseId: 4,
    text: 'Work with hooks in practical examples.',
    displayOrder: 3
  },
  {
    id: 16,
    courseId: 4,
    text: 'Build modern frontend interfaces with reusable components.',
    displayOrder: 4
  },

  {
    id: 17,
    courseId: 5,
    text: 'Write SQL queries to retrieve filtered data.',
    displayOrder: 1
  },
  {
    id: 18,
    courseId: 5,
    text: 'Use joins, grouping and aggregation correctly.',
    displayOrder: 2
  },
  {
    id: 19,
    courseId: 5,
    text: 'Understand relational database concepts.',
    displayOrder: 3
  },
  {
    id: 20,
    courseId: 5,
    text: 'Work with practical SQL exercises and datasets.',
    displayOrder: 4
  },

  {
    id: 21,
    courseId: 6,
    text: 'Design structured relational schemas in MySQL.',
    displayOrder: 1
  },
  {
    id: 22,
    courseId: 6,
    text: 'Apply normalization principles correctly.',
    displayOrder: 2
  },
  {
    id: 23,
    courseId: 6,
    text: 'Use primary and foreign keys effectively.',
    displayOrder: 3
  },
  {
    id: 24,
    courseId: 6,
    text: 'Model databases for real application scenarios.',
    displayOrder: 4
  },

  {
    id: 25,
    courseId: 7,
    text: 'Understand PostgreSQL core features and workflows.',
    displayOrder: 1
  },
  {
    id: 26,
    courseId: 7,
    text: 'Write more advanced PostgreSQL queries.',
    displayOrder: 2
  },
  {
    id: 27,
    courseId: 7,
    text: 'Use indexes and optimization basics.',
    displayOrder: 3
  },
  {
    id: 28,
    courseId: 7,
    text: 'Build more robust data solutions with PostgreSQL.',
    displayOrder: 4
  },

  {
    id: 29,
    courseId: 8,
    text: 'Understand the basics of NoSQL databases.',
    displayOrder: 1
  },
  {
    id: 30,
    courseId: 8,
    text: 'Work with collections and documents in MongoDB.',
    displayOrder: 2
  },
  {
    id: 31,
    courseId: 8,
    text: 'Query document-based data effectively.',
    displayOrder: 3
  },
  {
    id: 32,
    courseId: 8,
    text: 'Choose MongoDB appropriately for application scenarios.',
    displayOrder: 4
  },

  {
    id: 33,
    courseId: 9,
    text: 'Understand the main concepts behind cloud computing.',
    displayOrder: 1
  },
  {
    id: 34,
    courseId: 9,
    text: 'Identify key AWS services and their purpose.',
    displayOrder: 2
  },
  {
    id: 35,
    courseId: 9,
    text: 'Understand the basics of AWS architecture.',
    displayOrder: 3
  },
  {
    id: 36,
    courseId: 9,
    text: 'Build confidence for further cloud learning paths.',
    displayOrder: 4
  },

  {
    id: 37,
    courseId: 10,
    text: 'Get familiar with Microsoft Azure core services.',
    displayOrder: 1
  },
  {
    id: 38,
    courseId: 10,
    text: 'Understand basic cloud deployment ideas.',
    displayOrder: 2
  },
  {
    id: 39,
    courseId: 10,
    text: 'Explore Azure from a beginner-friendly perspective.',
    displayOrder: 3
  },
  {
    id: 40,
    courseId: 10,
    text: 'Develop a foundation for more advanced Azure learning.',
    displayOrder: 4
  },

  {
    id: 41,
    courseId: 11,
    text: 'Create and manage Docker images and containers.',
    displayOrder: 1
  },
  {
    id: 42,
    courseId: 11,
    text: 'Use Docker Compose in local workflows.',
    displayOrder: 2
  },
  {
    id: 43,
    courseId: 11,
    text: 'Prepare applications for container-based deployment.',
    displayOrder: 3
  },
  {
    id: 44,
    courseId: 11,
    text: 'Understand the role of Docker in cloud workflows.',
    displayOrder: 4
  },

  {
    id: 45,
    courseId: 12,
    text: 'Understand the role of Kubernetes in orchestration.',
    displayOrder: 1
  },
  {
    id: 46,
    courseId: 12,
    text: 'Work with pods, deployments and services.',
    displayOrder: 2
  },
  {
    id: 47,
    courseId: 12,
    text: 'Understand scaling and cluster basics.',
    displayOrder: 3
  },
  {
    id: 48,
    courseId: 12,
    text: 'Deploy containerized apps in a more advanced environment.',
    displayOrder: 4
  },

  {
    id: 49,
    courseId: 13,
    text: 'Use Python to inspect and transform datasets.',
    displayOrder: 1
  },
  {
    id: 50,
    courseId: 13,
    text: 'Clean and prepare data for analysis.',
    displayOrder: 2
  },
  {
    id: 51,
    courseId: 13,
    text: 'Apply practical exploratory data analysis steps.',
    displayOrder: 3
  },
  {
    id: 52,
    courseId: 13,
    text: 'Build a strong base for analytics workflows.',
    displayOrder: 4
  },

  {
    id: 53,
    courseId: 14,
    text: 'Manipulate structured data with Pandas.',
    displayOrder: 1
  },
  {
    id: 54,
    courseId: 14,
    text: 'Use NumPy for numerical operations.',
    displayOrder: 2
  },
  {
    id: 55,
    courseId: 14,
    text: 'Combine tabular and numerical workflows effectively.',
    displayOrder: 3
  },
  {
    id: 56,
    courseId: 14,
    text: 'Prepare datasets for later analysis or modeling.',
    displayOrder: 4
  },

  {
    id: 57,
    courseId: 15,
    text: 'Understand the foundations of machine learning.',
    displayOrder: 1
  },
  {
    id: 58,
    courseId: 15,
    text: 'Differentiate supervised learning concepts.',
    displayOrder: 2
  },
  {
    id: 59,
    courseId: 15,
    text: 'Evaluate simple models with basic metrics.',
    displayOrder: 3
  },
  {
    id: 60,
    courseId: 15,
    text: 'Recognize common ML workflows and terminology.',
    displayOrder: 4
  },

  {
    id: 61,
    courseId: 16,
    text: 'Create reports and dashboards with Power BI.',
    displayOrder: 1
  },
  {
    id: 62,
    courseId: 16,
    text: 'Visualize business and analytical data clearly.',
    displayOrder: 2
  },
  {
    id: 63,
    courseId: 16,
    text: 'Build interactive visual reporting experiences.',
    displayOrder: 3
  },
  {
    id: 64,
    courseId: 16,
    text: 'Communicate insights through well-structured dashboards.',
    displayOrder: 4
  },

  {
    id: 65,
    courseId: 17,
    text: 'Use Git for version control in real projects.',
    displayOrder: 1
  },
  {
    id: 66,
    courseId: 17,
    text: 'Work with repositories, branches and merges.',
    displayOrder: 2
  },
  {
    id: 67,
    courseId: 17,
    text: 'Understand pull request workflows on GitHub.',
    displayOrder: 3
  },
  {
    id: 68,
    courseId: 17,
    text: 'Collaborate more effectively in software teams.',
    displayOrder: 4
  },

  {
    id: 69,
    courseId: 18,
    text: 'Navigate Linux systems using the terminal.',
    displayOrder: 1
  },
  {
    id: 70,
    courseId: 18,
    text: 'Understand common deployment-related commands.',
    displayOrder: 2
  },
  {
    id: 71,
    courseId: 18,
    text: 'Manage files, permissions and basic processes.',
    displayOrder: 3
  },
  {
    id: 72,
    courseId: 18,
    text: 'Build confidence in Linux-based deployment environments.',
    displayOrder: 4
  },

  {
    id: 73,
    courseId: 19,
    text: 'Understand CI/CD principles and pipeline stages.',
    displayOrder: 1
  },
  {
    id: 74,
    courseId: 19,
    text: 'Identify how automation improves software delivery.',
    displayOrder: 2
  },
  {
    id: 75,
    courseId: 19,
    text: 'Design basic integration and deployment workflows.',
    displayOrder: 3
  },
  {
    id: 76,
    courseId: 19,
    text: 'Connect DevOps practices with modern delivery pipelines.',
    displayOrder: 4
  },

  {
    id: 77,
    courseId: 20,
    text: 'Use Docker as part of DevOps workflows.',
    displayOrder: 1
  },
  {
    id: 78,
    courseId: 20,
    text: 'Improve consistency across development environments.',
    displayOrder: 2
  },
  {
    id: 79,
    courseId: 20,
    text: 'Understand container-based automation practices.',
    displayOrder: 3
  },
  {
    id: 80,
    courseId: 20,
    text: 'Apply Docker concepts to modern delivery pipelines.',
    displayOrder: 4
  },

  {
    id: 81,
    courseId: 21,
    text: 'Understand the fundamentals of Node.js runtime and architecture.',
    displayOrder: 1
  },
  {
    id: 82,
    courseId: 21,
    text: 'Build backend logic with modules, routing and asynchronous patterns.',
    displayOrder: 2
  },
  {
    id: 83,
    courseId: 21,
    text: 'Create simple APIs for modern web applications.',
    displayOrder: 3
  },
  {
    id: 84,
    courseId: 21,
    text: 'Structure server-side JavaScript projects in a scalable way.',
    displayOrder: 4
  }
];