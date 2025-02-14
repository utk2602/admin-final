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
export const mockData = {
  status_code: 200,
  content: {
    management: {
      events: {
        items: [
          {
            email: "john.doe@example.com",
            round1: [
              {
                question: "What are the key components of event management?",
                answer: "Planning, organizing, staffing, directing, and controlling",
                options: [
                  "Planning, organizing, staffing, directing, and controlling",
                  "Budgeting, marketing, execution, and evaluation",
                  "Venue selection, catering, entertainment, and decoration",
                  "Risk assessment, ticketing, promotion, and logistics",
                ],
                selectedOption: 0,
              },
              {
                question: "Describe the importance of a project timeline in event management.",
                answer: "It helps in organizing tasks, setting deadlines, and ensuring smooth execution of the event",
              },
            ],
            score1: 90,
            status: "pending",
          },
        ],
        last_evaluated_key: "john.doe@example.com",
      },
      "p&m": {
        items: [
          {
            email: "jane.smith@example.com",
            round1: [
              {
                question: "What is the role of marketing in event management?",
                answer: "To promote the event, attract attendees, and create buzz",
                options: [
                  "To promote the event, attract attendees, and create buzz",
                  "To manage the event budget",
                  "To handle logistics and operations",
                  "To coordinate with vendors and suppliers",
                ],
                selectedOption: 0,
              },
              {
                question: "How do you handle unexpected issues during an event?",
                answer: "By having contingency plans and remaining calm and flexible",
              },
            ],
            score1: 85,
            status: "pending",
          },
        ],
        last_evaluated_key: "jane.smith@example.com",
      },
    },
    tech: {
      web: {
        items: [
          {
            email: "alice.johnson@example.com",
            round1: [
              {
                question: "What is the difference between HTTP and HTTPS?",
                answer: "HTTPS is encrypted and more secure than HTTP",
                options: [
                  "HTTPS is faster than HTTP",
                  "HTTP is more secure than HTTPS",
                  "HTTPS is encrypted and more secure than HTTP",
                  "There is no difference between HTTP and HTTPS",
                ],
                selectedOption: 2,
              },
              {
                question: "Explain the concept of responsive web design.",
                answer: "Creating web pages that look good on all devices (desktops, tablets, and phones)",
              },
            ],
            score1: 95,
            status: "pending",
          },
        ],
        last_evaluated_key: "alice.johnson@example.com",
      },
      iot: {
        items: [
          {
            email: "bob.williams@example.com",
            round1: [
              {
                question: "What is IoT?",
                answer: "Internet of Things - interconnected computing devices embedded in everyday objects",
                options: [
                  "Internet of Things - interconnected computing devices embedded in everyday objects",
                  "Internal Office Technology",
                  "Input/Output Technology",
                  "Integrated Online Tracking",
                ],
                selectedOption: 0,
              },
              {
                question: "Describe a potential application of IoT in smart homes.",
                answer: "Smart thermostats that learn user preferences and optimize energy usage",
              },
            ],
            score1: 88,
            status: "pending",
          },
        ],
        last_evaluated_key: "bob.williams@example.com",
      },
      app: {
        items: [
          {
            email: "charlie.brown@example.com",
            round1: [
              {
                question: "What is the difference between native and hybrid mobile apps?",
                answer:
                  "Native apps are built for specific platforms, while hybrid apps use web technologies and can run on multiple platforms",
                options: [
                  "Native apps are faster, hybrid apps are more secure",
                  "Native apps are built for specific platforms, while hybrid apps use web technologies and can run on multiple platforms",
                  "Hybrid apps are always better than native apps",
                  "There is no difference between native and hybrid apps",
                ],
                selectedOption: 1,
              },
              {
                question: "Explain the concept of app monetization.",
                answer:
                  "App monetization refers to the process of generating revenue from a mobile application, such as through in-app purchases, advertisements, or subscription models",
              },
            ],
            score1: 92,
            status: "pending",
          },
        ],
        last_evaluated_key: "charlie.brown@example.com",
      },
      ai: {
        items: [
          {
            email: "david.miller@example.com",
            round1: [
              {
                question: "What is machine learning?",
                answer:
                  "A subset of AI that enables systems to learn and improve from experience without being explicitly programmed",
                options: [
                  "A type of computer hardware",
                  "A programming language for AI",
                  "A subset of AI that enables systems to learn and improve from experience without being explicitly programmed",
                  "A database management system",
                ],
                selectedOption: 2,
              },
              {
                question: "Describe a real-world application of AI.",
                answer:
                  "AI-powered virtual assistants like Siri or Alexa, which use natural language processing to understand and respond to user queries",
              },
            ],
            score1: 97,
            status: "pending",
          },
        ],
        last_evaluated_key: "david.miller@example.com",
      },
      Rnd: {
        items: [
          {
            email: "emma.wilson@example.com",
            round1: [
              {
                question: "What is the importance of R&D in the tech industry?",
                answer:
                  "R&D drives innovation, creates new products and services, and helps companies stay competitive in the rapidly evolving tech landscape",
                options: [
                  "It's not important in the tech industry",
                  "It only matters for large tech companies",
                  "R&D drives innovation, creates new products and services, and helps companies stay competitive in the rapidly evolving tech landscape",
                  "R&D is only about improving existing products",
                ],
                selectedOption: 2,
              },
              {
                question: "Describe a recent technological breakthrough in your field of interest.",
                answer:
                  "The development of large language models like GPT-3, which have significantly advanced natural language processing capabilities",
              },
            ],
            score1: 94,
            status: "pending",
          },
        ],
        last_evaluated_key: "emma.wilson@example.com",
      },
    },
    design: {
      "ui/ux": {
        items: [
          {
            email: "frank.thomas@example.com",
            round1: [
              {
                question: "What is the difference between UI and UX?",
                answer:
                  "UI focuses on the visual elements of a product, while UX encompasses the entire user experience and interaction with the product",
                options: [
                  "UI and UX are the same thing",
                  "UI is about user research, UX is about visual design",
                  "UI focuses on the visual elements of a product, while UX encompasses the entire user experience and interaction with the product",
                  "UX is only relevant for websites, not mobile apps",
                ],
                selectedOption: 2,
              },
              {
                question: "Describe the importance of user testing in the design process.",
                answer:
                  "User testing helps identify usability issues, validate design decisions, and ensure the product meets user needs and expectations",
              },
            ],
            score1: 91,
            status: "pending",
          },
        ],
        last_evaluated_key: "frank.thomas@example.com",
      },
      video_editing: {
        items: [
          {
            email: "grace.lee@example.com",
            round1: [
              {
                question: "What is the rule of thirds in video composition?",
                answer:
                  "A guideline that divides the frame into a 3x3 grid, suggesting that important elements should be placed along these lines or at their intersections",
                options: [
                  "A rule that states videos should be divided into three equal parts",
                  "A guideline that divides the frame into a 3x3 grid, suggesting that important elements should be placed along these lines or at their intersections",
                  "A rule that requires using only three colors in a video",
                  "A principle that limits videos to three minutes in length",
                ],
                selectedOption: 1,
              },
              {
                question: "Explain the concept of color grading in video editing.",
                answer:
                  "Color grading is the process of altering and enhancing the color of a motion picture, video image, or still image to achieve a desired look or mood",
              },
            ],
            score1: 89,
            status: "pending",
          },
        ],
        last_evaluated_key: "grace.lee@example.com",
      },
      "graphic designing": {
        items: [
          {
            email: "henry.garcia@example.com",
            round1: [
              {
                question: "What is the importance of typography in graphic design?",
                answer:
                  "Typography plays a crucial role in conveying the message, setting the tone, and creating visual hierarchy in a design",
                options: [
                  "Typography is not important in graphic design",
                  "Typography is only about choosing fancy fonts",
                  "Typography plays a crucial role in conveying the message, setting the tone, and creating visual hierarchy in a design",
                  "Typography is only relevant for print design, not digital",
                ],
                selectedOption: 2,
              },
              {
                question: "Describe the concept of negative space in design.",
                answer:
                  "Negative space, also known as white space, is the area between and around objects in a design. It helps create balance, emphasis, and improve readability",
              },
            ],
            score1: 93,
            status: "pending",
          },
        ],
        last_evaluated_key: "henry.garcia@example.com",
      },
    },
  },
}

export const fetchStudentsByDomain = async (domain: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.content[domain as keyof typeof mockData.content])
    }, 1000)
  })
}


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
