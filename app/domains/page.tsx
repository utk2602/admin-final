"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import { fetchDomainData, submitStatus, Student } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Info } from "lucide-react"

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
  "CC",
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
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchDomainData(selectedDomain, 1, selectedStatus, lastEvaluatedKey)
      if (response && response.content && response.content.items) {
        setStudentsData(response.content.items)
        setLastEvaluatedKey(response.content.last_evaluated_key || "")
        console.log("Fetched students data:", response.content.items)
      } else {
        setStudentsData([])
        setError("No data found.")
      }
    } catch (err) {
      console.error("Error fetching domain data:", err)
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
      setDialogOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Domains</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-900 border-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Select Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
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
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Filter by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
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
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gradient mb-6">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font flex items-center gap-2">
              {selectedDomain} - {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 bg-gray-800 p-2 rounded text-sm">
              <Info size={16} className="text-[#f4b41a]" />
              <span className="text-gray-300">Note: Scores are only displayed for MCQ sections</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse text-gray-400">Loading data...</div>
              </div>
            )}
            {error && <p className="text-red-500 p-4 bg-red-900/20 rounded">{error}</p>}
            {!loading && !error && studentsData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <p>No students found for this domain and status.</p>
                <p className="text-sm mt-2">Try changing the filters or check back later.</p>
              </div>
            )}
            {studentsData.length > 0 && (
              <div className="overflow-x-auto rounded border border-gray-800">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-left">
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Score</th>
                      <th className="p-3 font-semibold">Actions</th>
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
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-semibold text-[#f4b41a]">{student.email}</span>
                          </td>
                          <td className="p-3">
                            {student.score1 !== undefined ? 
                              <span className="font-semibold text-white">{student.score1}</span> : 
                              <span className="text-gray-500">N/A</span>}
                          </td>
                          <td className="p-3">
                            <Button
                              onClick={() => openStudentDetails(student)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              View Details
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          {lastEvaluatedKey && (
            <CardFooter className="border-t border-gray-800 pt-4">
              <Button
                onClick={handleLoadMore}
                className="w-full bg-[#f4b41a] text-black hover:bg-[#e8b974] font-medium"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Students"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="bg-gray-900 text-white border border-gray-700 sm:max-w-3xl md:max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
    <DialogHeader>
      <DialogTitle className="text-2xl text-[#f4b41a] pixel-font">Student Details</DialogTitle>
      <DialogDescription className="text-gray-400">
        Review responses and update qualification status
      </DialogDescription>
    </DialogHeader>
    {selectedStudent && (
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Student Info & Actions Card */}
        <Card className="bg-gray-800 border border-gray-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{selectedStudent.email}</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-700 px-3 py-1 rounded-full">
                    <span className="text-gray-300 text-sm">Domain: </span>
                    <span className="text-[#f4b41a] font-medium">{selectedDomain}</span>
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-gray-300 text-sm">MCQ Score: </span>
                    <span className="text-white font-bold">
                      {selectedStudent.score1 !== undefined ? selectedStudent.score1 : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleStatusUpdate(selectedStudent.email, "qualified")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Qualified
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedStudent.email, "pending")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Pending
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedStudent.email, "unqualified")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Unqualified
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Responses Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#f4b41a]">Responses</h3>
            <div className="flex items-center text-sm bg-gray-800 px-3 py-1 rounded-full">
              <Info size={14} className="mr-1 text-[#f4b41a]" />
              <span className="text-gray-300">Total Questions: {selectedStudent.round1.length}</span>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 space-y-4 pb-4">
            {selectedStudent.round1.map((question, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader className="pb-2 border-b border-gray-700">
                  <CardTitle className="text-md font-semibold text-[#f4b41a]">
                    Question {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="bg-gray-900 p-3 rounded-md">
                    <p className="text-white">{question.question}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Student's Answer:</p>
                    <div className="bg-gray-900 p-3 rounded-md">
                      <p className="text-white whitespace-pre-line">{question.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
      </main>
    </div>
  )
}