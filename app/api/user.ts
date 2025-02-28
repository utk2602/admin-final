import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "https://enrollments-2025-backend.onrender.com";

export interface Question {
  question: string;
  answer: string;
}

interface QuestionData {
  email: string;
  round1?: Question[];
  score1?: number;
}

interface LoadQuestionsResponse {
  questions: Question[] | PromiseLike<Question[]>;
  status_code: number;
  content: {
    [key: string]: {
      items: QuestionData[];
      last_evaluated_key: string;
    };
  };
}

interface SubmitResponse {
  status_code: number;
  message: string;
}

export function getAuthToken(): string {
  const token = Cookies.get("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }
  return token;
}

const ProtectedRequest = async <T = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  data: Record<string, unknown> | FormData | null = null,
  params: Record<string, unknown> | null = null
): Promise<AxiosResponse<T>> => {
  try {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const config = {
      method,
      url: `${BACKEND_URL}${endpoint}`,
      headers,
      data,
      params,
    };

    const response = await axios<T>(config);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error with protected request to ${endpoint}:`, error.message);
    }
    throw error;
  }
};

export async function fetchQuestions(
  subdomain: string
): Promise<LoadQuestionsResponse> {
  const response = await ProtectedRequest<LoadQuestionsResponse>(
    "GET",
    "/domain/questions",
    null,
    { domain: subdomain, round: 1 }
  );
  return response.data;
}

export async function addQuestion(
  round: number,
  domain: string,
  question: string,
  imageFile?: File 
): Promise<SubmitResponse> {
  const formData = new FormData();
  formData.append("round", round.toString());
  formData.append("domain", domain);
  formData.append("question", question);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await ProtectedRequest<SubmitResponse>(
    "POST",
    "/admin/questions",
    formData
  );

  return response.data;
}


export const handleAddQuestion = async (
  newQuestion: {
    question: string;
    options?: string;
    correct_answer?: string;
    round: string;
  },
  selectedSubDomain: string,
  imageFile: File | null,
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>,
  setNewQuestion: React.Dispatch<
    React.SetStateAction<{
      question: string;
      options?: string;
      correct_answer?: string;
      round: string;
    }>
  >,
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
  toast: (options: { title: string; description: string; variant?: string }) => void
) => {
  try {
    if (!newQuestion.question.trim()) {
      toast({ title: "Error", description: "Question cannot be empty.", variant: "destructive" });
      return;
    }

    const response = await addQuestion(
      Number(newQuestion.round), 
      selectedSubDomain,
      newQuestion.question,
      imageFile ?? undefined
    );

    if (response.status_code === 200) {
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      setNewQuestion({ question: "", options: "", correct_answer: "", round: "1" });
      setImageFile(null);
      toast({ title: "Success", description: "Question added successfully." });
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("Error adding question:", err);
    toast({ title: "Error", description: "Failed to add the question.", variant: "destructive" });
  }
};
