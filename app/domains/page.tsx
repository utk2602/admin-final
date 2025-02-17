"use client";
import { useState, useEffect } from "react";
import { fetchDomainData, fetchQuestions, SubmitResponse } from "../services/api";

import { Question, LoadQuestionsResponse, SubmitResponse } from "../services/api";

export default function Domains() {
    const [domainData, setDomainData] = useState<QuestionData[]>([]);
    const [lastIndex, setLastIndex] = useState("start");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("unmarked");
    const [selectedStudent, setSelectedStudent] = useState<QuestionData | null>(null);
    const [questions, setQuestions] = useState<any[]>([]); // Adjust type accordingly to match API
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubdomainMenuOpen, setIsSubdomainMenuOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState("WEB");

    const subdomains = [
        "UI/UX", "GRAPHIC DESIGN", "VIDEO EDITING", "EVENTS", "PNM", "WEB", "IOT", "APP", "AI/ML", "RND"
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetchDomainData(selectedDomain, 1, selectedStatus, lastIndex);
                console.log("API Response:", response);

                // Ensure data is present before accessing properties
                if (response && response.content && response.content.items) {
                    setDomainData(response.content.items as QuestionData[]);
                } else {
                    setDomainData([]);
                    setError("No data found.");
                }
            } catch (err) {
                setError("Failed to fetch data. Please try again.");
                console.error("Fetch error:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [lastIndex, selectedStatus, selectedDomain]);

    const handleNextPage = () => {
        if (domainData.length > 0) {
            const nextIndex = domainData[domainData.length - 1]?.email;
            if (nextIndex) {
                setLastIndex(nextIndex);
            }
        }
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedStatus(event.target.value);
        setLastIndex("start"); // Reset pagination when status changes
    };

    const handleViewResponses = async (student: QuestionData) => {
        console.log("Requesting responses for:", student);
        setSelectedStudent(student);
        setLoading(true);
        try {
            // Pass the selected domain, not student email
            const response: LoadQuestionsResponse = await fetchQuestions(selectedDomain);  // Fetch questions by domain
    
            console.log("API Response:", response);
    
            if (response?.content && response.content[student.email]?.items) {
                setQuestions(response.content[student.email].items);
            } else {
                setQuestions([]);
            }
        } catch (err) {
            console.error("Failed to fetch questions:", err);
            setQuestions([]);
        }
        setLoading(false);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (status: string) => {
        if (!selectedStudent) return;

        const responseData = { email: selectedStudent.email, status };
        try {
            const response: SubmitResponse = await submitResponse(responseData);
            if (response.status_code === 200) {
                alert(response.message);
                setSelectedStudent(null);
                setIsModalOpen(false);
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Domain Data</h2>

            {/* Subdomain Selection Button */}
            <div className="mb-4">
                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={() => setIsSubdomainMenuOpen(!isSubdomainMenuOpen)}
                >
                    Select Subdomain: {selectedDomain}
                </button>

                {/* Subdomain Dropdown Menu */}
                {isSubdomainMenuOpen && (
                    <div className="absolute bg-white shadow-lg border rounded mt-2 p-2">
                        {subdomains.map((subdomain) => (
                            <div
                                key={subdomain}
                                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                    setSelectedDomain(subdomain);
                                    setIsSubdomainMenuOpen(false);
                                }}
                            >
                                {subdomain}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Filter */}
            <div className="mb-4">
                {["pending", "unmarked", "qualified", "unqualified"].map((status) => (
                    <label key={status} className="mr-4">
                        <input 
                            type="radio" 
                            value={status} 
                            checked={selectedStatus === status} 
                            onChange={handleStatusChange} 
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                ))}
            </div>

            {loading && <p className="text-gray-600">Loading data...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Table to Display Data */}
            {domainData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-2 px-4 border">Email</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Domain</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {domainData.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{item.email || "N/A"}</td>
                                    <td className="py-2 px-4 border">{item.name || "N/A"}</td>
                                    <td className="py-2 px-4 border">{item.domain || "N/A"}</td>
                                    <td className="py-2 px-4 border">{item.status || "N/A"}</td>
                                    <td className="py-2 px-4 border">
                                        <button 
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                            onClick={() => handleViewResponses(item)}
                                        >
                                            View Responses
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loading && <p className="text-gray-500">No domain data available.</p>
            )}

            {/* Pagination Button */}
            <button
                onClick={handleNextPage}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Loading..." : "Next Page"}
            </button>

            {/* Modal for Viewing Responses */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                        <h3 className="text-xl font-semibold mb-4">Responses for {selectedStudent.name}</h3>
                        
                        {loading ? (
                            <p>Loading responses...</p>
                        ) : questions.length > 0 ? (
                            <ul className="mb-4">
                                {questions.map((q, index) => (
                                    <li key={index} className="border-b py-2">
                                        <p className="font-semibold">{q.question}</p>
                                        <p className="text-gray-600">{q.answer}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No responses available.</p>
                        )}

                        {/* Status Update Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button 
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                onClick={() => handleStatusUpdate("qualified")}
                            >
                                Mark Qualified
                            </button>
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                onClick={() => handleStatusUpdate("unqualified")}
                            >
                                Mark Unqualified
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
