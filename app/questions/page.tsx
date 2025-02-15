"use client";

import { useState } from "react";
import type React from "react";
import Header from "../components/header";
import { addQuestion } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

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
];

export default function QuestionsPage() {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""], // Initialize with 4 empty strings
    correct_answer: "",
    round: "1",
  });
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddQuestion = async () => {
    const filteredOptions = newQuestion.options.filter((opt) => opt.trim() !== "");
  
    // ❌ Validate: Only 0 or 4 options are allowed
    if (filteredOptions.length !== 0 && filteredOptions.length !== 4) {
      toast({
        title: "Error",
        description: "You must enter exactly 4 options or leave them all empty.",
        variant: "destructive",
      });
      return; // Stop execution
    }
  
    try {
      const response = await addQuestion(
        newQuestion.round,
        selectedSubDomain,
        newQuestion.question,
        filteredOptions.length === 4 ? filteredOptions : "", // Send "" if no options, otherwise array
        newQuestion.correct_answer,
        imageFile || null
      );
  
      if (response.status_code === 200) {
        setNewQuestion({
          question: "",
          options: ["", "", "", ""], // Reset options
          correct_answer: "",
          round: "1",
        });
        setImageFile(null);
        toast({
          title: "Success",
          description: "Question added successfully.",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to add the question. ${err}`,
        variant: "destructive",
      });
      console.log(newQuestion);
    }
  };
  
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">
          Question Management
        </h1>

        <Card className="bg-gray-900 border-gradient mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#f4b41a] pixel-font">
              Add New Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedSubDomain}
                onValueChange={setSelectedSubDomain}
              >
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
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                className="bg-gray-800 text-white"
              />

              {/* Options Inputs */}
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updatedOptions });
                    }}
                    className="bg-gray-800 text-white"
                  />
                ))}
              </div>

              <Input
                type="text"
                placeholder="Correct Answer (Index)"
                value={newQuestion.correct_answer}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correct_answer: e.target.value,
                  })
                }
                className="bg-gray-800 text-white"
              />
              <Input
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
      </main>
    </div>
  );
}
