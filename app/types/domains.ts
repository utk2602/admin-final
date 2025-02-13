export interface Student {
  id: number
  rollNumber: string
  name: string
  scores: {
    [key: string]: {
      correct: number
      total: number
    }
  }
  status: "pending" | "accepted" | "rejected"
}

export interface SubDomain {
  name: string
  students: Student[]
  tests: string[]
}

export interface Domain {
  name: string
  subDomains: SubDomain[]
}

function generateRandomScore(totalQuestions: number) {
  const correct = Math.floor(Math.random() * (totalQuestions + 1))
  return { correct, total: totalQuestions }
}

function generateRandomName() {
  const firstNames = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

function generateRollNumber() {
  return `IEEE-${Math.floor(10000 + Math.random() * 90000)}`
}

let globalStudentId = 1

function generateStudents(count: number, tests: { [key: string]: number }): Student[] {
  return Array.from({ length: count }, () => {
    const student: Student = {
      id: globalStudentId++,
      rollNumber: generateRollNumber(),
      name: generateRandomName(),
      scores: Object.entries(tests).reduce(
        (acc, [test, totalQuestions]) => ({
          ...acc,
          [test]: generateRandomScore(totalQuestions),
        }),
        {},
      ),
      status: "pending",
    }
    return student
  })
}

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const domains: Domain[] = [
  {
    name: "Management",
    subDomains: [
      {
        name: "Publicity and Marketing",
        students: [],
        tests: ["Communication", "Marketing Strategy"],
      },
      {
        name: "Events",
        students: [],
        tests: ["Event Planning", "Team Management"],
      },
    ],
  },
  {
    name: "Technical",
    subDomains: [
      {
        name: "App Development",
        students: [],
        tests: ["Mobile Development", "UI/UX"],
      },
      {
        name: "Web Development",
        students: [],
        tests: ["Frontend", "Backend"],
      },
      {
        name: "Backend",
        students: [],
        tests: ["Database Design", "API Development"],
      },
      {
        name: "IoT",
        students: [],
        tests: ["Embedded Systems", "Networking"],
      },
      {
        name: "Video Editing",
        students: [],
        tests: ["Video Production", "Post-processing"],
      },
    ],
  },
  {
    name: "Design",
    subDomains: [
      {
        name: "UI/UX Design",
        students: [],
        tests: ["Design Principles", "Prototyping"],
      },
    ],
  },
]

// Generate a pool of students
const studentPool = generateStudents(100, {
  Communication: 20,
  "Marketing Strategy": 25,
  "Event Planning": 30,
  "Team Management": 20,
  "Mobile Development": 40,
  "UI/UX": 30,
  Frontend: 35,
  Backend: 35,
  "Database Design": 25,
  "API Development": 30,
  "Embedded Systems": 30,
  Networking: 25,
  "Video Production": 20,
  "Post-processing": 25,
  "Design Principles": 30,
  Prototyping: 25,
})

// Assign students to subdomains
domains.forEach((domain) => {
  domain.subDomains.forEach((subDomain) => {
    const studentsForSubDomain = getRandomItems(studentPool, Math.floor(Math.random() * 20) + 5)
    subDomain.students = studentsForSubDomain.map((student) => ({
      ...student,
      scores: Object.fromEntries(subDomain.tests.map((test) => [test, student.scores[test]])),
    }))
  })
})

