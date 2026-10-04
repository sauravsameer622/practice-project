import { Student, CourseInfo, AcademicTask, SystemNotification } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    mobile: "9876543210",
    course: "JavaScript",
    marks: 85,
    grade: "A",
    result: "PASS",
    enrolledDate: "2024-09-02",
    attendanceRate: 94
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@gmail.com",
    mobile: "9812345678",
    course: "Python",
    marks: 92,
    grade: "A+",
    result: "PASS",
    enrolledDate: "2024-09-02",
    attendanceRate: 98
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@gmail.com",
    mobile: "9823456789",
    course: "Java",
    marks: 35,
    grade: "F",
    result: "FAIL",
    enrolledDate: "2024-09-03",
    attendanceRate: 72
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    mobile: "9834567890",
    course: "Full Stack Development",
    marks: 78,
    grade: "B",
    result: "PASS",
    enrolledDate: "2024-09-04",
    attendanceRate: 88
  },
  {
    id: 5,
    name: "Vikram Rao",
    email: "vikram@gmail.com",
    mobile: "9845678901",
    course: "Data Science",
    marks: 64,
    grade: "C",
    result: "PASS",
    enrolledDate: "2024-09-05",
    attendanceRate: 84
  }
];

export const COURSES_CATALOG: CourseInfo[] = [
  {
    id: "js-core",
    name: "JavaScript",
    code: "CS-201",
    instructor: "Prof. Elena Rostova",
    credits: 4,
    schedule: "Mon & Wed • 10:00 AM",
    description: "Core DOM tree manipulation, asynchronous events, lexical scopes, and reactive UI architecture.",
    topics: ["Event Loop", "DOM Engine", "Closures", "Fetch API", "Web Components"]
  },
  {
    id: "py-data",
    name: "Python",
    code: "CS-204",
    instructor: "Dr. Marcus Vance",
    credits: 4,
    schedule: "Tue & Thu • 02:00 PM",
    description: "Data-oriented programming, NumPy vectorization, Pandas analytical pipelines, and statistical modeling.",
    topics: ["OOP Patterns", "Pandas & NumPy", "Data Cleaning", "Matplotlib", "FastAPI"]
  },
  {
    id: "java-ent",
    name: "Java",
    code: "CS-301",
    instructor: "Prof. Rajesh Nair",
    credits: 4,
    schedule: "Mon & Fri • 01:00 PM",
    description: "Enterprise class architecture, multi-threading, Spring Boot microservices, and database connectors.",
    topics: ["JVM Internals", "Generics", "Spring Boot", "Concurrency", "Hibernate ORM"]
  },
  {
    id: "full-stack",
    name: "Full Stack Development",
    code: "CS-350",
    instructor: "Dr. Sarah Lin",
    credits: 5,
    schedule: "Tue & Fri • 11:30 AM",
    description: "End-to-end full-stack engineering with modern React frontends, RESTful Node APIs, and state engines.",
    topics: ["React 19 Hooks", "Express Routing", "Tailwind CSS", "Authentication", "Cloud Deployment"]
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    code: "CS-240",
    instructor: "Prof. David Miller",
    credits: 3,
    schedule: "Wed & Fri • 03:30 PM",
    description: "Exploratory data analysis, SQL querying, Business Intelligence reporting, and hypothesis testing.",
    topics: ["SQL Aggregations", "Tableau Dashboards", "Statistical Tests", "KPI Metrics", "ETL Pipelines"]
  },
  {
    id: "data-science",
    name: "Data Science",
    code: "CS-410",
    instructor: "Dr. Sophia Sterling",
    credits: 4,
    schedule: "Thu & Sat • 09:30 AM",
    description: "Machine learning algorithms, predictive feature engineering, and neural network foundations.",
    topics: ["Regression Models", "Scikit-Learn", "Clustering", "Cross-Validation", "Model Evaluation"]
  }
];

export const INITIAL_TASKS: AcademicTask[] = [
  {
    id: "task-1",
    title: "DOM Manipulation & Event Registry Project",
    course: "JavaScript",
    dueDate: "2024-10-15",
    weight: 25,
    totalMarks: 100,
    completedCount: 4
  },
  {
    id: "task-2",
    title: "NumPy Matrix Operations & Data Cleaning",
    course: "Python",
    dueDate: "2024-10-18",
    weight: 20,
    totalMarks: 100,
    completedCount: 5
  },
  {
    id: "task-3",
    title: "Multithreaded Banking Queue Simulation",
    course: "Java",
    dueDate: "2024-10-22",
    weight: 30,
    totalMarks: 100,
    completedCount: 2
  },
  {
    id: "task-4",
    title: "Full-Stack Authentication & State Integration",
    course: "Full Stack Development",
    dueDate: "2024-10-28",
    weight: 35,
    totalMarks: 100,
    completedCount: 3
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Academic Intervention Required",
    description: "Amit Verma (Java) scored 35/100, falling below the 40 mark pass threshold.",
    time: "10 mins ago",
    read: false,
    type: "warning"
  },
  {
    id: "notif-2",
    title: "Valedictorian Record Achieved",
    description: "Priya Singh achieved 92/100 (Grade A+) in Python Data Programming.",
    time: "1 hour ago",
    read: false,
    type: "success"
  },
  {
    id: "notif-3",
    title: "Mid-Term Registry Synchronized",
    description: "DOM Engine v3.4 successfully synchronized 5 active student records to memory.",
    time: "3 hours ago",
    read: true,
    type: "info"
  }
];
