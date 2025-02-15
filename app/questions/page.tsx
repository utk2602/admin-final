'use client'

import { useState, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";
import { fetchQuestions, addQuestion } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { Question } from "../services/api";

const DOMAIN_MAPPING = [
  "UI/UX", "GRAPHIC DESIGN", "VIDEO EDITING", "EVENTS", "PNM", 
  "WEB", "IOT", "APP", "AI/ML", "RND"
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ type: "", question: "", options: "", correct_answer: "", round: "1" });
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (selectedSubDomain) {
          const response = await fetchQuestions(selectedSubDomain);
          setQuestions(response.questions);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    loadData();
  }, [selectedSubDomain]);

  const handleAddQuestion = async () => {
    if (!selectedSubDomain || !imageFile || !newQuestion.question || !newQuestion.type) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("domain", selectedSubDomain);
    formData.append("question", newQuestion.question);
    formData.append("round", newQuestion.round);
    formData.append("type", newQuestion.type);
    if (newQuestion.type === "Objective" && newQuestion.options) {
      formData.append("options", JSON.stringify(newQuestion.options.split(",")));
      formData.append("correct_answer", newQuestion.correct_answer);
    }

    try {
      const response = await addQuestion(formData);
      if (response.status_code === 200) {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ type: "", question: "", options: "", correct_answer: "", round: "1" });
        setImageFile(null);
        toast({ title: "Success", description: "Question added successfully." });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to add the question.", variant: "destructive" });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">Question Management</h1>

        <Card className="bg-gray-900 border-gradient mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font">Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedSubDomain} onValueChange={setSelectedSubDomain}>
                <SelectTrigger><SelectValue placeholder="Select Subdomain" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {DOMAIN_MAPPING.map((domain, index) => (
                    <SelectItem key={index} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value })}>
                <SelectTrigger><SelectValue placeholder="Select Question Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Subjective">Subjective</SelectItem>
                  <SelectItem value="Objective">Objective</SelectItem>
                </SelectContent>
              </Select>

              <Textarea placeholder="Question" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="bg-gray-800 text-white" />
              {newQuestion.type === "Objective" && (
                <>
                  <Textarea placeholder="Options (comma-separated)" value={newQuestion.options} onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })} className="bg-gray-800 text-white" />
                  <Input type="text" placeholder="Correct Answer (Index)" value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} className="bg-gray-800 text-white" />
                </>
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-gray-800 text-white" />
              
              <div className="flex justify-end space-x-2">
                <Button onClick={handleAddQuestion} className="bg-[#f4b41a] text-black hover:bg-[#e8b974]">Add Question</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
