"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import { fetchDomains, fetchStudents, updateStudentStatus } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

interface Domain {
  id: number
  name: string
  subDomains: string[]
}

interface StudentSubDomain {
  score: number
  status: "pending" | "accepted" | "rejected"
}

interface Student {
  id: number
  name: string
  email: string
  mobile: string
  domains: {
    [key: string]: {
      [key: string]: StudentSubDomain
    }
  }
}

export default function DomainsPage() {
  // Commented out API calls and state for now
  // const [domains, setDomains] = useState([])
  // const [domainsLoading, setDomainsLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [domainsData, studentsData] = await Promise.all([fetchDomains(), fetchStudents()])
        setDomains(domainsData as Domain[])
        setStudents(studentsData as Student[])
        setLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    loadData()
  }, [])
   // useEffect(() => {
  //   const loadDomains = async () => {
  //     try {
  //       const data = await fetchDomains()
  //       setDomains(data)
  //     } catch (err) {
  //       setError("Failed to load domains. Please try again later.")
  //     } finally {
  //       setDomainsLoading(false)
  //     }
  //   }

  const handleStatus = async (
    studentId: number,
    domainName: string,
    subDomain: string,
    newStatus: "accepted" | "rejected" | "pending",
  ) => {
    try {
      await updateStudentStatus(studentId, domainName, subDomain, newStatus)
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                domains: {
                  ...student.domains,
                  [domainName.toLowerCase()]: {
                    ...student.domains[domainName.toLowerCase()],
                    [subDomain]: {
                      ...student.domains[domainName.toLowerCase()][subDomain],
                      status: newStatus,
                    },
                  },
                },
              }
            : student,
        ),
      )
      toast({
        title: "Status Updated",
        description: `Student status for ${domainName} - ${subDomain} has been updated to ${newStatus}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update student status. Please try again.",
        variant: "destructive",
      })
    }
  }
  //   loadDomains()
  // }, [])
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
            <Card key={domain.id} className="bg-gray-900 border-gradient">
              <CardHeader>
                <CardTitle className="text-2xl text-[#f4b41a] pixel-font">{domain.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {domain.subDomains.map((subDomain) => (
                    <AccordionItem key={subDomain} value={subDomain}>
                      <AccordionTrigger className="text-xl text-[#e8b974] pixel-font">{subDomain}</AccordionTrigger>
                      <AccordionContent>
                        <Tabs defaultValue="pending" className="w-full">
                          <TabsList className="bg-gray-800 border-gradient">
                            <TabsTrigger
                              value="pending"
                              className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black"
                            >
                              Pending
                            </TabsTrigger>
                            <TabsTrigger
                              value="accepted"
                              className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black"
                            >
                              Accepted
                            </TabsTrigger>
                            <TabsTrigger
                              value="rejected"
                              className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black"
                            >
                              Rejected
                            </TabsTrigger>
                          </TabsList>

                          {["pending", "accepted", "rejected"].map((status) => (
                            <TabsContent key={status} value={status}>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-left">
                                      <th className="p-2">Name</th>
                                      <th className="p-2">Email</th>
                                      <th className="p-2">Mobile</th>
                                      <th className="p-2">Score</th>
                                      <th className="p-2">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <AnimatePresence>
                                      {students
                                        .filter(
                                          (student) =>
                                            student.domains[domain.name.toLowerCase()] &&
                                            student.domains[domain.name.toLowerCase()][subDomain] &&
                                            student.domains[domain.name.toLowerCase()][subDomain].status === status,
                                        )
                                        .map((student) => (
                                          <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`border-b border-gray-700 ${
                                              status === "accepted"
                                                ? "bg-green-900"
                                                : status === "rejected"
                                                  ? "bg-red-900"
                                                  : "bg-gray-800"
                                            }`}
                                          >
                                            <td className="p-2">
                                              <span
                                                className={`font-semibold ${
                                                  status === "accepted"
                                                    ? "text-green-300"
                                                    : status === "rejected"
                                                      ? "text-red-300"
                                                      : "text-[#f4b41a]"
                                                }`}
                                              >
                                                {student.name}
                                              </span>
                                            </td>
                                            <td className="p-2">{student.email}</td>
                                            <td className="p-2">{student.mobile}</td>
                                            <td className="p-2">
                                              {student.domains[domain.name.toLowerCase()][subDomain].score}
                                            </td>
                                            <td className="p-2">
                                              {status === "pending" && (
                                                <div className="flex space-x-2">
                                                  <Button
                                                    onClick={() =>
                                                      handleStatus(student.id, domain.name, subDomain, "accepted")
                                                    }
                                                    className="bg-green-500 hover:bg-green-600 text-black"
                                                  >
                                                    Accept
                                                  </Button>
                                                  <Button
                                                    onClick={() =>
                                                      handleStatus(student.id, domain.name, subDomain, "rejected")
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-black"
                                                  >
                                                    Reject
                                                  </Button>
                                                </div>
                                              )}
                                              {status === "accepted" && (
                                                <Button
                                                  onClick={() =>
                                                    handleStatus(student.id, domain.name, subDomain, "pending")
                                                  }
                                                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                                >
                                                  Move to Pending
                                                </Button>
                                              )}
                                              {status === "rejected" && (
                                                <Button
                                                  onClick={() =>
                                                    handleStatus(student.id, domain.name, subDomain, "pending")
                                                  }
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

