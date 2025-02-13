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
    subDomains: ["web", "iot", "app", "ai", "Rnd"],
  },
  {
    id: 3,
    name: "Design",
    subDomains: ["ui/ux", "video_editing", "graphic designing"],
  },
]

export interface Question {
  id: number
  type: "objective" | "subjective"
  domain: string
  subDomain: string
  content: string
  options?: string[]
  correctAnswer?: string | number
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    type: "objective",
    domain: "Tech",
    subDomain: "web",
    content: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Machine Learning",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    type: "subjective",
    domain: "Management",
    subDomain: "events",
    content: "Describe the key steps in organizing a successful tech conference.",
  },
  {
    id: 3,
    type: "objective",
    domain: "Design",
    subDomain: "ui/ux",
    content: "Which of the following is NOT a principle of user-centered design?",
    options: [
      "Empathy for users",
      "Focusing on aesthetics over functionality",
      "Iterative design process",
      "Usability testing",
    ],
    correctAnswer: 1,
  },
]

export const fetchDomains = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDomains)
    }, 1000) // Simulate network delay
  })
}

export const fetchStudents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStudents)
    }, 1000) // Simulate network delay
  })
}

export const updateStudentStatus = async (
  studentId: number,
  domainName: string,
  subDomain: string,
  status: "accepted" | "rejected" | "pending",
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application, this would update the backend
      // For now, we'll just return a success message
      resolve({ message: "Status updated successfully" })
    }, 500)
  })
}

export const fetchQuestions = async () => {
  return new Promise<Question[]>((resolve) => {
    setTimeout(() => {
      resolve(mockQuestions)
    }, 1000)
  })
}

export const addQuestion = async (question: Omit<Question, "id">) => {
  return new Promise<Question>((resolve) => {
    setTimeout(() => {
      const newQuestion = { ...question, id: mockQuestions.length + 1 }
      mockQuestions.push(newQuestion)
      resolve(newQuestion)
    }, 500)
  })
}

export const updateQuestion = async (question: Question) => {
  return new Promise<Question>((resolve) => {
    setTimeout(() => {
      const index = mockQuestions.findIndex((q) => q.id === question.id)
      if (index !== -1) {
        mockQuestions[index] = question
        resolve(question)
      } else {
        throw new Error("Question not found")
      }
    }, 500)
  })
}

export const deleteQuestion = async (id: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const index = mockQuestions.findIndex((q) => q.id === id)
      if (index !== -1) {
        mockQuestions.splice(index, 1)
        resolve()
      } else {
        throw new Error("Question not found")
      }
    }, 500)
  })
}

