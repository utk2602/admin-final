"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";
import { fetchDomainData, submitStatus, Student } from "../services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
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
  "CC",
];

const STATUS_OPTIONS = ["unmarked", "pending", "qualified", "unqualified"];

export default function DomainsPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState("start");
  const [selectedDomain, setSelectedDomain] = useState("WEB");
  const [selectedStatus, setSelectedStatus] = useState("unmarked");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchDomainData(
      selectedDomain,
      2,
      selectedStatus,
      lastEvaluatedKey
    );
    if (response.data && response.data.items) {
      setStudentsData((prevData) => [...prevData, ...response.data.items]);
      setLastEvaluatedKey(response.data.last_evaluated_key || "");
      console.log("Fetched students data:", response.data.items);
    } else {
      setStudentsData([]);
      setError("No data found.");
    }
    setLoading(false);
  };

  const getData = async () => {
    setStudentsData([]); // Reset data before fetching new data
    await fetchData();
  };

  useEffect(() => {
    console.log("useEffect triggered with", { selectedDomain, selectedStatus });

    getData();
  }, [selectedDomain, selectedStatus]);

  const handleStatusUpdate = async (email: string, newStatus: string) => {
    if (statusUpdateLoading) return;

    setStatusUpdateLoading(true);
    try {
      const response = await submitStatus(email, selectedDomain, newStatus);

      setStudentsData((prevData) =>
        prevData.map((student) =>
          student.email === email
            ? { ...student, qualification_status1: newStatus }
            : student
        )
      );

      setSelectedStudent(null);
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const openStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#f4b41a] pixel-font">
          Domains
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-900 border-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">
                Select Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border border-gray-700">
                  {DOMAIN_MAPPING.map((domain) => (
                    <SelectItem
                      key={domain}
                      value={domain}
                      className="focus:bg-gray-700"
                    >
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">
                Filter by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border border-gray-700">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="focus:bg-gray-700"
                    >
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
              {selectedDomain} -{" "}
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 bg-gray-800 p-2 rounded text-sm">
              <Info size={16} className="text-[#f4b41a]" />
              <span className="text-gray-300">
                Note: Scores are only displayed for MCQ sections
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse text-gray-400">
                  Loading data...
                </div>
              </div>
            )}
            {error && (
              <p className="text-red-500 p-4 bg-red-900/20 rounded">{error}</p>
            )}
            {!loading && !error && studentsData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <p>No students found for this domain and status.</p>
                <p className="text-sm mt-2">
                  Try changing the filters or check back later.
                </p>
              </div>
            )}
            {studentsData.length > 0 && (
              <div className="overflow-x-auto rounded border border-gray-800">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-left">
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Year</th>
                      <th className="p-3 font-semibold">Score</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {studentsData.map((student) => (
                        <motion.tr
                          key={student.email} // Use email as key (ensure emails are unique)
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-semibold text-[#f4b41a]">
                              {student.email}
                            </span>
                          </td>
                          <td className="p-3">{/* Year */}</td>
                          <td className="p-3">
                            {student.score1 !== undefined ? (
                              <span className="font-semibold text-white">
                                {student.score1}
                              </span>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                student.qualification_status1 === "qualified"
                                  ? "bg-green-900 text-green-300"
                                  : student.qualification_status1 === "pending"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : student.qualification_status1 ===
                                    "unqualified"
                                  ? "bg-red-900 text-red-300"
                                  : "bg-gray-800 text-gray-300"
                              }`}
                            >
                              {student.qualification_status1 || "unmarked"}
                            </span>
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
              {/* Pagination or Load More Button */}
            </CardFooter>
          )}
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-gray-900 text-white border border-gray-700 sm:max-w-3xl md:max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#f4b41a] pixel-font">
                Student Details
              </DialogTitle>
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
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {selectedStudent.email}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="bg-gray-700 px-3 py-1 rounded-full">
                            <span className="text-gray-300 text-sm">
                              Domain:{" "}
                            </span>
                            <span className="text-[#f4b41a] font-medium">
                              {selectedDomain}
                            </span>
                          </div>
                          <div className="bg-gray-700 px-3 py-1 rounded-full">
                            <span className="text-gray-300 text-sm">
                              Year:{" "}
                            </span>
                          </div>
                          <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-gray-300 text-sm">
                              MCQ Score:{" "}
                            </span>
                            <span className="text-white font-bold">
                              {selectedStudent.score1 !== undefined
                                ? selectedStudent.score1
                                : "N/A"}
                            </span>
                          </div>
                          <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-gray-300 text-sm">
                              Status:{" "}
                            </span>
                            <span
                              className={`text-white font-bold ${
                                selectedStudent.qualification_status1 ===
                                "qualified"
                                  ? "text-green-300"
                                  : selectedStudent.qualification_status1 ===
                                    "pending"
                                  ? "text-yellow-300"
                                  : selectedStudent.qualification_status1 ===
                                    "unqualified"
                                  ? "text-red-300"
                                  : "text-gray-300"
                              }`}
                            >
                              {selectedStudent.qualification_status1 ||
                                "unmarked"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleStatusUpdate(
                              selectedStudent.email,
                              "qualified"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={statusUpdateLoading}
                        >
                          {statusUpdateLoading ? "Updating..." : "Qualified"}
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusUpdate(selectedStudent.email, "pending")
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          disabled={statusUpdateLoading}
                        >
                          {statusUpdateLoading ? "Updating..." : "Pending"}
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusUpdate(
                              selectedStudent.email,
                              "unqualified"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={statusUpdateLoading}
                        >
                          {statusUpdateLoading ? "Updating..." : "Unqualified"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Responses Sections - Both Round 1 and Round 2 */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Round 1 Responses */}
                  {/* <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#f4b41a]">Round 1 Responses</h3>
                      <div className="flex items-center text-sm bg-gray-800 px-3 py-1 rounded-full">
                        <Info size={14} className="mr-1 text-[#f4b41a]" />
                        <span className="text-gray-300">Questions: {selectedStudent.round1.length}</span>
                      </div>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-4 pb-4 max-h-64">
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
                  </div> */}

                  {/* Round 2 Responses */}
                  {selectedStudent.round2 &&
                    selectedStudent.round2.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-[#f4b41a]">
                            Round 2 Responses
                          </h3>
                          <div className="flex items-center text-sm bg-gray-800 px-3 py-1 rounded-full">
                            <Info size={14} className="mr-1 text-[#f4b41a]" />
                            <span className="text-gray-300">
                              {selectedStudent.round2.length} Links
                            </span>
                          </div>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-4 pb-4 max-h-64">
                          {selectedStudent.round2.map((link, index) => (
                            <Card
                              key={index}
                              className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                              <CardContent className="p-4">
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline break-all"
                                >
                                  {link}
                                </a>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
