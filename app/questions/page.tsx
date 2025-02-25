"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Header from "../components/header"
import { addQuestion, fetchQuestions, type Question } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Toaster, toast } from "react-hot-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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

export default function QuestionsPage() {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    round: "1",
    Image: null as File | null,
  })

  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("")
  const [showPopup, setShowPopup] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [lastKey, setLastKey] = useState<string>("start")

  useEffect(() => {
    setShowPopup(false)
  }, [])

  const loadQuestions = async (isInitialLoad: boolean = false) => {
    if (!selectedSubDomain) return

    setLoading(true)
    try {
      const response = await fetchQuestions(selectedSubDomain, lastKey)
      
      if (response.questions && Array.isArray(response.questions)) {
        const newQuestions = response.questions.map(q => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer || '',
          correctIndex: q.correctIndex
        }))

        if (isInitialLoad) {
          setQuestions(newQuestions)
        } else {
          setQuestions(prev => [...prev, ...newQuestions])
        }
        
        // Update last key from response
        if (response.content && response.content[selectedSubDomain]) {
          const newLastKey = response.content[selectedSubDomain].last_evaluated_key
          setLastKey(newLastKey || "")
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
      } else {
        toast.error("Failed to fetch questions. Please try again.")
      }
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSubDomain) {
      // Reset state and load initial questions when subdomain changes
      setLastKey("start")
      setQuestions([])
      loadQuestions(true)
    }
  }, [selectedSubDomain])

  const handleLoadMore = () => {
    if (!loading && lastKey) {
      loadQuestions()
    }
  }

  const handleAddQuestion = async () => {
    const filteredOptions = newQuestion.options.filter((opt) => opt.trim() !== "")

    if (filteredOptions.length !== 0 && filteredOptions.length !== 4) {
      toast.error("You must enter exactly 4 options or leave them all empty.")
      return
    }

    const toastId = toast.loading("Adding question...")

    try {
      const response = await addQuestion(
        newQuestion.round,
        selectedSubDomain,
        newQuestion.question,
        filteredOptions.length === 4 ? filteredOptions : [],
        newQuestion.correctIndex,
        newQuestion.Image
      )

      if (!response) {
        toast.error("No response received from server.", { id: toastId })
        return
      }

      if (response.ok) {
        toast.success("Question added successfully!", { id: toastId })

        setNewQuestion({
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          round: "1",
          Image: null,
        })

        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""

        // Refresh questions after adding new one
        setLastKey("start")
        loadQuestions(true)
      } else {
        toast.success("Question submitted")
      }
    } catch (err) {
      console.error("Error occurred:", err)
      toast.error("An error occurred. Please try again.", { id: toastId })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setNewQuestion((prev) => ({ ...prev, Image: file }))
  }

  // Helper function to determine question type
  const getQuestionType = (options: string[]) => {
    if (!options || options.length === 0) return "Subjective";
    if (options.length === 4) return "Objective";
    return "Invalid";
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Question Management</h1>

        <Card className="bg-gray-900 border-gradient mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font">Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedSubDomain} onValueChange={setSelectedSubDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subdomain" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {DOMAIN_MAPPING.map((domain, index) => (
                    <SelectItem key={index} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="bg-gray-800 text-white"
              />

              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  Leave all options empty for a subjective question or fill in all 4 for an objective question.
                </p>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...newQuestion.options]
                        updatedOptions[index] = e.target.value
                        setNewQuestion({ ...newQuestion, options: updatedOptions })
                      }}
                      className="bg-gray-800 text-white flex-grow"
                    />
                    {/* Only show radio buttons if there's text in at least one option */}
                    {newQuestion.options.some(opt => opt.trim() !== "") && (
                      <RadioGroup 
                        value={newQuestion.correctIndex.toString()} 
                        onValueChange={(value) => setNewQuestion({
                          ...newQuestion,
                          correctIndex: parseInt(value)
                        })}
                        className="flex"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem 
                            value={index.toString()} 
                            id={`correct-${index}`}
                            className="text-[#f4b41a]"
                          />
                          <Label htmlFor={`correct-${index}`} className="text-sm">
                            Correct
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                ))}
              </div>

              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-gray-800 text-white"
              />

              <div className="flex justify-end space-x-2">
                <Button onClick={handleAddQuestion} className="bg-[#f4b41a] text-black hover:bg-[#e8b974]">
                  Add Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && questions.length === 0 ? (
          <p className="text-center">Loading questions...</p>
        ) : (
          <Card className="bg-gray-900 border-gradient mt-8">
            <CardHeader>
              <CardTitle className="text-2xl text-[#f4b41a] pixel-font">
                Existing Questions for {selectedSubDomain}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {questions.map((question, index) => (
                      <li key={index} className="border-b border-gray-700 pb-4">
                        <h3 className="font-bold mb-2">{question.question}</h3>
                        <div className="text-sm text-gray-400 mb-2">
                          Type: {getQuestionType(question.options)}
                        </div>
                        {Array.isArray(question.options) && question.options.length > 0 ? (
                          <ul className="list-disc pl-6">
                            {question.options.map((option, optionIndex) => (
                              <li key={optionIndex} className={
                                optionIndex === question.correctIndex ? "text-[#f4b41a] font-bold" : ""
                              }>
                                {option} {optionIndex === question.correctIndex && "✓"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-400">Subjective question (no options)</p>
                        )}
                        {question.options.length === 4 && question.correctIndex !== undefined && (
                          <p className="mt-2 text-sm text-[#f4b41a]">
                            Correct answer: Option {question.correctIndex + 1}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  {lastKey && (
                    <div className="flex justify-center mt-6">
                      <Button 
                        onClick={handleLoadMore} 
                        disabled={loading || !lastKey}
                        className="bg-[#f4b41a] text-black hover:bg-[#e8b974]"
                      >
                        {loading ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p>No questions found for this subdomain.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}