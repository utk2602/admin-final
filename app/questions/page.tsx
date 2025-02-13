"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/header"
import { fetchQuestions, addQuestion, updateQuestion, deleteQuestion, fetchDomains } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import type { Question, Domain } from "../services/api"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    type: "objective",
    domain: "",
    subDomain: "",
    content: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const [selectedDomain, setSelectedDomain] = useState<string | "">("")
  const [selectedSubDomain, setSelectedSubDomain] = useState<string | "">("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsData, domainsData] = await Promise.all([fetchQuestions(), fetchDomains()])
        setQuestions(questionsData as Question[])
        setDomains(domainsData as Domain[])
        setLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddQuestion = async () => {
    try {
      const addedQuestion = await addQuestion(newQuestion)
      setQuestions([...questions, addedQuestion])
      setNewQuestion({
        type: "objective",
        domain: "",
        subDomain: "",
        content: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      })
      toast({
        title: "Question Added",
        description: "The new question has been successfully added.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add the question. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return
    try {
      const updatedQuestion = await updateQuestion(editingQuestion)
      
      // Update the questions list with the updated question
      setQuestions(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
      
      // Reset to no editing
      setEditingQuestion(null)
      toast({
        title: "Question Updated",
        description: "The question has been successfully updated.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update the question. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuestion(id)
      setQuestions(questions.filter((q) => q.id !== id))
      toast({
        title: "Question Deleted",
        description: "The question has been successfully deleted.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the question. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredQuestions = questions.filter((q) => {
    return (
      (selectedDomain ? q.domain === selectedDomain : true) &&
      (selectedSubDomain ? q.subDomain === selectedSubDomain : true)
    )
  })

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question)
    setNewQuestion({
      type: question.type,
      domain: question.domain,
      subDomain: question.subDomain,
      content: question.content,
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer,
    })
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setNewQuestion({
      type: "objective",
      domain: "",
      subDomain: "",
      content: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })
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
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Question Management</h1>

        {/* Add New Question Section */}
        <Card className="bg-gray-900 border-gradient mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={newQuestion.type}
                onValueChange={(value: "objective" | "subjective") =>
                  setNewQuestion({ ...newQuestion, type: value })
                }
                className="bg-gray-800 text-white"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Question Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="objective">Objective</SelectItem>
                  <SelectItem value="subjective">Subjective</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={newQuestion.domain}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, domain: value, subDomain: "" })}
                className="bg-gray-800 text-white"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.name} className="bg-green-100" >
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newQuestion.subDomain}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, subDomain: value })}
                disabled={!newQuestion.domain} // Disable subdomain if domain is not selected
                className="bg-gray-800 text-white"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subdomain" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {domains
                    .find((d) => d.name === newQuestion.domain)
                    ?.subDomains.map((subDomain) => (
                      <SelectItem key={subDomain} value={subDomain}>
                        {subDomain}
                      </SelectItem>
                   ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Question Content"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                className="bg-gray-800 text-white"
              />

              {newQuestion.type === "objective" && (
                <>
                  {newQuestion.options?.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(newQuestion.options || [])]
                        newOptions[index] = e.target.value
                        setNewQuestion({ ...newQuestion, options: newOptions })
                      }}
                      className="bg-gray-800 text-white"
                    />
                  ))}
                  <Select
                    value={newQuestion.correctAnswer?.toString()}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, correctAnswer: Number.parseInt(value) })
                    }
                    className="bg-gray-800 text-white"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Correct Answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {newQuestion.options?.map((_, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Option {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                  className="bg-[#f4b41a] text-black hover:bg-[#e8b974]"
                >
                  {editingQuestion ? "Save Changes" : "Add Question"}
                </Button>
                {editingQuestion && (
                  <Button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain and Subdomain Filter */}
        <div className="mb-8">
          <Select
            value={selectedDomain}
            onValueChange={(value) => {
              setSelectedDomain(value)
              setSelectedSubDomain("") // Reset subdomain when domain changes
            }}
            className="bg-gray-800 text-white"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.name} >
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSubDomain}
            onValueChange={(value) => setSelectedSubDomain(value)}
            disabled={!selectedDomain} // Disable subdomain if domain is not selected
            className="bg-gray-800 text-white"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Subdomain" />
            </SelectTrigger>
            <SelectContent>
              {domains
                .find((d) => d.name === selectedDomain)
                ?.subDomains.map((subDomain) => (
                  <SelectItem key={subDomain} value={subDomain}>
                    {subDomain}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display Questions based on selected Domain and Subdomain */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-800 border-gradient">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
              All Questions
            </TabsTrigger>
            <TabsTrigger value="objective" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
              Objective
            </TabsTrigger>
            <TabsTrigger value="subjective" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-black">
              Subjective
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="bg-gray-900 border-gradient">
                      <CardHeader>
                        <CardTitle className="text-xl text-[#e8b974] pixel-font">
                          {question.type === "objective" ? "Objective" : "Subjective"} Question
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{question.content}</p>
                        <p className="text-sm text-gray-400">
                          Domain: {question.domain} | Subdomain: {question.subDomain}
                        </p>
                        {question.type === "objective" && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Options:</h4>
                            <ul className="list-disc list-inside">
                              {question.options?.map((option, index) => (
                                <li key={index} className={index === question.correctAnswer ? "text-green-500" : ""}>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            onClick={() => handleEditClick(question)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
