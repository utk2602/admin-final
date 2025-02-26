"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Header from "../components/header"
import { addQuestion, fetchQuestions, getQuestionCount, type Question } from "../services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Toaster, toast } from "react-hot-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

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
  const [loadingCount, setLoadingCount] = useState(false)
  const [lastKey, setLastKey] = useState<string>("start")
  const [questionCount, setQuestionCount] = useState<number>(0)
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    setShowPopup(false)
  }, [])
  
  const loadQuestionCount = async () => {
    if (!selectedSubDomain) return
    
    setLoadingCount(true)
    try {
      const count = await getQuestionCount(selectedSubDomain)
      setQuestionCount(count)
    } catch (error) {
      console.error("Error fetching question count:", error)
      
      setQuestionCount(0)
      toast.error("Failed to load question count. Using default value.")
    } finally {
      setLoadingCount(false)
    }
  }
  
  const loadQuestions = async (isInitialLoad: boolean = false) => {
    if (!selectedSubDomain) return

    setLoading(true)
    try {
      const response = await fetchQuestions(selectedSubDomain, isInitialLoad ? "start" : lastKey)
      
      if (response.questions && Array.isArray(response.questions)) {
        if (isInitialLoad) {
          setQuestions(response.questions)
        } else {
          setQuestions(prev => [...prev, ...response.questions])
        }
        
        if (response.content && response.content[selectedSubDomain]) {
          const newLastKey = response.content[selectedSubDomain].last_evaluated_key
          setLastKey(newLastKey || "")
        }
        
        if (response.meta?.total_count !== undefined) {
          setQuestionCount(response.meta.total_count)
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        
      } else {
        console.error("Error fetching questions:", error)
        
        if (error.response?.status !== 404) {
          toast.error("Failed to load questions. Please try again.")
        }
      }
      
      setQuestions([])
    } finally {
      setLoading(false)
      setInitialLoadDone(true)
    }
  }

  useEffect(() => {
    if (selectedSubDomain) {
      setLastKey("start")
      setQuestions([])
      setInitialLoadDone(false)
      loadQuestionCount() 
      loadQuestions(true) 
    }
  }, [selectedSubDomain])

  

  const handleAddQuestion = async () => {
    const trimmedQuestion = newQuestion.question.trim()
    if (!trimmedQuestion) {
      toast.error("Question cannot be empty. Please enter a question.")
      return
    }
    
    if (!selectedSubDomain) {
      toast.error("Please select a subdomain before adding a question.")
      return
    }
  
    const filteredOptions = newQuestion.options.map(opt => opt.trim()).filter(opt => opt !== "")
  
    if (filteredOptions.length !== 0 && filteredOptions.length !== 4) {
      toast.error("Please enter either all 4 options for an objective question or leave all options empty for a subjective question.")
      return
    }
  
    const isObjective = filteredOptions.length === 4;
  
    const toastId = toast.loading("Adding question...")
  
    try {
      const response = await addQuestion(
        newQuestion.round,
        selectedSubDomain,
        trimmedQuestion,
        isObjective ? filteredOptions : [], 
        isObjective ? newQuestion.correctIndex : null,
        newQuestion.Image
      )
      
      if (!response) {
        toast.error("No response received from server. Please try again.", { id: toastId })
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
  
        setLastKey("start")
        loadQuestionCount()
        loadQuestions(true)
      } else {
        toast.success("Question successfully submitted", { id: toastId })
      }
    } catch (err) {
      console.error("Error occurred:", err)
      toast.error("Failed to add question. Please try again later.", { id: toastId })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setNewQuestion((prev) => ({ ...prev, Image: file }))
  }

  const getQuestionType = (question: Question) => {
    if (question.type) {
      return question.type === "objective" ? "Objective" : "Subjective";
    }
    
    if (!question.options || question.options.length === 0) return "Subjective";
    if (question.options.length === 4) return "Objective";
    return "Invalid";
  }

  const handleImageError = (index: number) => {
    setImageError(prev => ({...prev, [index]: true}))
  }

  
  const getImageUrl = (question: Question): string | undefined => {
    
    return question.image_url || question.image;
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

              {selectedSubDomain && (
                <div className="text-sm text-gray-300">
                  {loadingCount ? (
                    <span>Loading question count...</span>
                  ) : questionCount === 0 ? (
                    <span>No questions added yet. This will be question #1.</span>
                  ) : (
                    <>
                      Current question count: {questionCount} 
                      <span> (Next question will be #{questionCount + 1})</span>
                    </>
                  )}
                </div>
              )}

              <Textarea
                placeholder="Question (required)"
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
                        onValueChange={(value) => {
                          setNewQuestion({
                            ...newQuestion,
                            correctIndex: parseInt(value)
                          })
                        }}
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
                <Button 
                  onClick={handleAddQuestion} 
                  className="bg-[#f4b41a] text-black hover:bg-[#e8b974]"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {!selectedSubDomain ? (
          <Card className="bg-gray-900 border-gradient mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-400">Please select a subdomain to view questions.</p>
            </CardContent>
          </Card>
        ) : loading && !initialLoadDone ? (
          <Card className="bg-gray-900 border-gradient mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg">Loading questions...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gradient mt-8">
            <CardHeader>
              <CardTitle className="text-2xl text-[#f4b41a] pixel-font">
                Existing Questions for {selectedSubDomain}
                {questionCount > 0 && ` (${questionCount} total)`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <>
                  <ul className="space-y-4">
                  {questions.map((question, index) => {
                    const isObjective = question.type === "objective" || 
                      (Array.isArray(question.options) && question.options.length === 4);
                    
                   
                    const imageUrl = getImageUrl(question);
                    
                    return (
                      <li key={index} className="border-b border-gray-700 pb-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold mb-2">{question.question}</h3>
                          <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                            #{question.index || "?"}
                          </span>
                        </div>
                        
                        {/* Display image if available */}
                        {imageUrl && !imageError[index] && (
                          <div className="mb-3">
                            <img 
                              src={imageUrl}
                              alt={`Image for question ${question.index || index + 1}`}
                              className="max-w-full md:max-w-md rounded-md border border-gray-700" 
                              onError={() => handleImageError(index)}
                            />
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-400 mb-2">
                          Type: {getQuestionType(question)}
                        </div>
                        
                        {/* Only show options list for objective questions */}
                        {isObjective ? (
                          <ul className="list-disc pl-6">
                            {question.options.map((option, optionIndex) => (
                              <li key={optionIndex} className={
                                isObjective && question.correctIndex !== undefined && question.correctIndex === optionIndex 
                                  ? "text-[#f4b41a] font-bold" : ""
                              }>
                                {option} {
                                  isObjective && 
                                  question.correctIndex !== undefined && 
                                  question.correctIndex === optionIndex && 
                                  "✓"
                                }
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-400">Subjective question (no options)</p>
                        )}
                        
                        {/* Use strict comparison for correctIndex check */}
                        {isObjective && question.correctIndex !== undefined && question.correctIndex !== null && (
                          <p className="mt-2 text-sm text-[#f4b41a]">
                            Correct answer: Option {question.correctIndex + 1}
                          </p>
                        )}
                      </li>
                    );
                  })}
                  </ul>
                  {lastKey && lastKey !== "" && (
                    <div className="flex justify-center mt-6">
                      
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-5xl text-gray-700 mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No questions yet</h3>
                  <p className="text-gray-500 max-w-md">
                    No questions have been added for the {selectedSubDomain} subdomain yet. 
                    Use the form above to add your first question.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}