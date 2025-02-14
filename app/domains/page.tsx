"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import { fetchDomains, fetchStudentsByDomain, updateStudentStatus } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Question {
  question: string
  answer: string
  options?: string[]
  selectedOption?: number
}

interface Student {
  email: string
  round1: Question[]
  score1: number
  status: "pending" | "accepted" | "rejected"
}

interface SubDomainData {
  items: Student[]
  last_evaluated_key: string
}

interface DomainData {
  [subDomain: string]: SubDomainData
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<string[]>([])
  const [studentsData, setStudentsData] = useState<{ [key: string]: DomainData }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const domainsData = (await fetchDomains()) as string[]
        setDomains(domainsData)

        const studentsPromises = domainsData.map((domain) => fetchStudentsByDomain(domain))
        const studentsResults = await Promise.all(studentsPromises)

        const newStudentsData: { [key: string]: DomainData } = {}
        domainsData.forEach((domain, index) => {
          newStudentsData[domain] = studentsResults[index] as DomainData
        })

        setStudentsData(newStudentsData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleStatusUpdate = async (
    email: string,
    domain: string,
    subDomain: string,
    newStatus: "accepted" | "rejected",
  ) => {
    try {
      await updateStudentStatus(email, domain, subDomain, newStatus)
      setStudentsData((prevData) => {
        const updatedData = { ...prevData }
        const student = updatedData[domain][subDomain].items.find((s) => s.email === email)
        if (student) {
          student.status = newStatus
        }
        return updatedData
      })
      toast({
        title: "Status Updated",
        description: `Student ${email} has been ${newStatus}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update student status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Domains</h1>

        <div className="grid gap-6">
          {domains.map((domain) => (
            <Card key={domain} className="bg-gray-900 border-gradient">
              <CardHeader>
                <CardTitle className="text-2xl text-[#f4b41a] pixel-font">{domain}</CardTitle>
              </CardHeader>
              <CardContent>
              <Accordion type="single" collapsible className="w-full">
  {studentsData[domain] &&
    Object.entries(studentsData[domain]).map(([subDomain, subDomainData]) => (
      <AccordionItem key={subDomain} value={subDomain}>
        <AccordionTrigger className="text-xl text-[#e8b974] pixel-font">{subDomain}</AccordionTrigger>
        <AccordionContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-gray-800 border-gradient">
              <TabsTrigger value="pending" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
                Pending
              </TabsTrigger>
              <TabsTrigger value="accepted" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
                Accepted
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
                Rejected
              </TabsTrigger>
            </TabsList>

            {["pending", "accepted", "rejected"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2">Email</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {subDomainData.items
                          ?.filter((student) => student.status === status)
                          .map((student) => (
                            <motion.tr
                              key={student.email}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="border-b border-gray-700 bg-gray-800"
                            >
                              <td className="p-2">
                                <span className="font-semibold text-[#f4b41a]">{student.email}</span>
                              </td>
                              <td className="p-2">{student.score1}</td>
                              <td className="p-2 space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      onClick={() => setSelectedStudent(student)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-gray-900 text-white">
                                    <DialogHeader>
                                      <DialogTitle>Student Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <h3 className="text-lg font-semibold mb-2">Email: {selectedStudent?.email}</h3>
                                      <h4 className="text-md font-semibold mb-2">Score: {selectedStudent?.score1}</h4>
                                      <h4 className="text-md font-semibold mb-2">Questions:</h4>
                                      {selectedStudent?.round1.map((question, index) => (
                                        <div key={index} className="mb-4">
                                          <p className="font-semibold">{question.question}</p>
                                          {question.options ? (
                                            <ul className="list-disc list-inside">
                                              {question.options.map((option, optionIndex) => (
                                                <li
                                                  key={optionIndex}
                                                  className={
                                                    optionIndex === question.selectedOption ? "text-green-500" : ""
                                                  }
                                                >
                                                  {option}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="italic">Answer: {question.answer}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                {status === "pending" && (
                                  <>
                                    <Button
                                      onClick={() => handleStatusUpdate(student.email, domain, subDomain, "accepted")}
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate(student.email, domain, subDomain, "rejected")}
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {(status === "accepted" || status === "rejected") && (
                                  <Button
                                    onClick={() => handleStatusUpdate(student.email, domain, subDomain, "pending")}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  >
                                    Move to Pending
                                  </Button>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    ))}
</Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

