"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import { fetchDomainData, submitStatus } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Question {
  question: string
  answer: string
}

interface Student {
  email: string
  name: string
  domain: string
  status: string
  round1: Question[]
  score1: number
}

const DOMAIN_MAPPING = [
  "UI/UX",
  "GRAPHIC DESIGN",
  "VIDEO EDITING",
  "EVENTS",
  "PNM",
  "WEB",
  "IOT",
  "APP",
  "AI/ML",
  "RND",
]

const STATUS_OPTIONS = ["unmarked", "pending", "qualified", "unqualified"]

export default function DomainsPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState("start")
  const [selectedDomain, setSelectedDomain] = useState("WEB")
  const [selectedStatus, setSelectedStatus] = useState("unmarked")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchDomainData(selectedDomain, 1, selectedStatus, lastEvaluatedKey)
      if (response && response.content && response.content.items) {
        setStudentsData(response.content.items as Student[])
        setLastEvaluatedKey(response.content.last_evaluated_key || "")
      } else {
        setStudentsData([])
        setError("No data found.")
      }
    } catch (err) {
      setError("Failed to fetch data. Please Relogin.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedDomain, selectedStatus])

  const handleLoadMore = () => {
    if (lastEvaluatedKey) {
      fetchData()
    }
  }

  const handleStatusUpdate = async (email: string, newStatus: string) => {
    try {
      const response = await submitStatus(email, selectedDomain, newStatus)
      toast({
        title: "Status Updated",
        description: response.data.detail,
      })
      setStudentsData((prevData) => prevData.filter((student) => student.email !== email))
      setSelectedStudent(null)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Domains</h1>

        <div className="flex space-x-4 mb-6">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white">
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border border-gray-700">
              {DOMAIN_MAPPING.map((domain) => (
                <SelectItem key={domain} value={domain} className="focus:bg-gray-700">
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border border-gray-700">
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status} className="focus:bg-gray-700">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-gray-900 border-gradient">
          <CardHeader>
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font">
              {selectedDomain} - {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-gray-400">Loading data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && studentsData.length === 0 && <p className="text-gray-400">No students found.</p>}
            {studentsData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="p-2">Email</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {studentsData.map((student) => (
                        <motion.tr
                          key={student.email}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-b border-gray-700"
                        >
                          <td className="p-2">
                            <span className="font-semibold text-[#f4b41a]">{student.email}</span>
                          </td>
                          <td className="p-2">{student.name}</td>
                          <td className="p-2">{student.status}</td>
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
                              <DialogContent className="bg-gray-900 text-white max-h-96 overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Student Details</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <h3 className="text-lg font-semibold mb-2">Email: {selectedStudent?.email}</h3>
                                  <h4 className="text-md font-semibold mb-2">Questions:</h4>
                                  <div className="max-h-72 overflow-y-auto">
                                    {selectedStudent?.round1.map((question, index) => (
                                      <div key={index} className="mb-4">
                                        <p className="font-semibold">{question.question}</p>
                                        <p className="italic">{question.answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button
                                    onClick={() => handleStatusUpdate(selectedStudent?.email || "", "qualified")}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    Mark Qualified
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusUpdate(selectedStudent?.email || "", "pending")}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  >
                                    Move to Pending
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusUpdate(selectedStudent?.email || "", "unqualified")}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    Mark Unqualified
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
            {lastEvaluatedKey && (
              <Button
                onClick={handleLoadMore}
                className="mt-4 bg-[#f4b41a] text-black hover:bg-[#e8b974]"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}