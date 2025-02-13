"use client"

import { useState } from "react"
import Header from "../components/header"
import { students as initialStudents, type Student } from "../data/students"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents)

  const handleStatus = (id: number, status: "accepted" | "rejected") => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status } : student)))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Student List</h1>
        <Accordion type="single" collapsible className="w-full">
          {students.map((student) => (
            <AccordionItem key={student.id} value={`item-${student.id}`}>
              <AccordionTrigger className="text-xl">{student.name}</AccordionTrigger>
              <AccordionContent>
                <div className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Test Scores:</h3>
                  <ul className="mb-4">
                    {Object.entries(student.scores).map(([test, score]) => (
                      <li key={test} className="mb-1">
                        {test}: {score}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleStatus(student.id, "accepted")}
                      className="bg-green-500 hover:bg-green-600"
                      disabled={student.status !== "pending"}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatus(student.id, "rejected")}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={student.status !== "pending"}
                    >
                      Reject
                    </Button>
                  </div>
                  {student.status !== "pending" && (
                    <p className="mt-2 text-center font-semibold">
                      Status: {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}

