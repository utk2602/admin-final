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
  round: string,
  domain: string,
  question: string,
  options: string[] = [],
  correctIndex: number = 0,
  Image: File | null
): Promise<SubmitResponse> {
  const formData = new FormData();
  formData.append("round", round);
  formData.append("domain", domain);
  formData.append("question", question);

  // Check if all 4 options are filled (no empty strings)
  const allOptionsFilled = options.every(opt => opt.trim() !== "");

  if (options.length === 4 && allOptionsFilled) {
    formData.append("options", JSON.stringify(options));
    formData.append("correctIndex", correctIndex.toString());
  }

  // Append image only if it exists
  if (Image) {
    formData.append("image", Image);
  }

  try {
    const response = await ProtectedRequest<SubmitResponse>("POST", "/admin/questions", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while adding the question.");
  }
}



