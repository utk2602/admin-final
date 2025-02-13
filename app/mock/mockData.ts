export const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    mobile: "+1234567890",
    domains: {
      management: {
        events: {
          score: 85,
          status: "pending",
        },
        "p&m": {
          score: 90,
          status: "pending",
        },
      },
      tech: {
        web: {
          score: 78,
          status: "pending",
        },
        iot: {
          score: 88,
          status: "pending",
        },
        app: {
          score: 82,
          status: "pending",
        },
      },
      design: {
        "ui/ux": {
          score: 80,
          status: "pending",
        },
        video_editing: {
          score: 92,
          status: "pending",
        },
      },
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    mobile: "+1987654321",
    domains: {
      management: {
        events: {
          score: 92,
          status: "pending",
        },
        "p&m": {
          score: 88,
          status: "pending",
        },
      },
      tech: {
        web: {
          score: 95,
          status: "pending",
        },
        app: {
          score: 90,
          status: "pending",
        },
      },
      design: {
        "ui/ux": {
          score: 87,
          status: "pending",
        },
      },
    },
  },
]

export const mockDomains = [
  {
    id: 1,
    name: "Management",
    subDomains: ["events", "p&m"],
  },
  {
    id: 2,
    name: "Tech",
    subDomains: ["web", "iot", "app"],
  },
  {
    id: 3,
    name: "Design",
    subDomains: ["ui/ux", "video_editing"],
  },
]

export interface Question {
  id: number
  title: string
  content: string
  domain: string
  subDomain: string
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: "What is the difference between UI and UX?",
    content: "Can someone explain the key differences between UI (User Interface) and UX (User Experience) design?",
    domain: "Design",
    subDomain: "ui/ux",
  },
  {
    id: 2,
    title: "Best practices for React state management",
    content: "What are some recommended approaches for managing state in large React applications?",
    domain: "Tech",
    subDomain: "web",
  },
]

