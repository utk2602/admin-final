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

  useEffect(() => {
    setShowPopup(false)
  }, [])

  useEffect(() => {
    if (selectedSubDomain) {
      setLoading(true)
      fetchQuestions(selectedSubDomain)
        .then((response) => {
          setQuestions(response.questions as Question[])
          setLoading(false)
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please log in again.")
          }
          console.error("Error fetching questions:", error)
          toast.error("Auth token expired. Please relogin again.")
          setLoading(false)
        })
    }
  }, [selectedSubDomain])

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

      console.log("Response:", response) 

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

        fetchQuestions(selectedSubDomain)
          .then((response) => setQuestions(response.questions as Question[]))
          .catch(() => {
            toast.error("Failed to fetch updated questions. Please login again.")
          })
      } else {
        toast.success("question submitted")
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
                {newQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options]
                      updatedOptions[index] = e.target.value
                      setNewQuestion({ ...newQuestion, options: updatedOptions })
                    }}
                    className="bg-gray-800 text-white"
                  />
                ))}
              </div>

              <Input
                type="number"
                placeholder="Correct Answer (Index)"
                value={newQuestion.correctIndex}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correctIndex: Number(e.target.value),
                  })
                }
                className="bg-gray-800 text-white"
              />

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

        {loading ? (
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
                <ul className="space-y-4">
                  {questions.map((question, index) => (
                    <li key={index} className="border-b border-gray-700 pb-4">
                      <h3 className="font-bold mb-2">{question.question}</h3>
                      <ul className="list-disc pl-6">
                        {Array.isArray(question.options) ? (
                          question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                          ))
                        ) : (
                          <li>No options available</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
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
