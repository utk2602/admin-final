import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "https://enrollments-2025-backend.onrender.com";

export interface Question {
  options: any;
  question: string;
  answer: string;
}

interface QuestionData {
  email: string;
  round1?: Question[];
  score1?: number;
  options?: string[];
}

export interface LoadQuestionsResponse {
  questions: Question[] | PromiseLike<Question[]>;
  options: string[];
  status_code: number;
  content: {
    [key: string]: {
      items: QuestionData[];
      options: string[];
      last_evaluated_key: string;
    };
  };
}

export interface SubmitResponse {
  ok: any;
  status: number;
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
    const config = {
      method,
      url: `${BACKEND_URL}${endpoint}`,
      headers,
      data,
      params,
    };
    return await axios<T>(config);
  } catch (error: unknown) {
    throw error;
  }
};

interface DomainData {
  content: DomainData;
  items: string;
  lastKey: string;
}

interface StatusData {
  status: number;
  data: {
    detail: string;
  };
}

export async function fetchDomainData(
  domain: string,
  round: number,
  status: string,
  last_evaluated_key: string,
  option: string[]
): Promise<DomainData> {
  const response = await ProtectedRequest<DomainData>(
    "GET",
    "/admin/fetch",
    null,
    { domain, round, status, last_evaluated_key, option }
  );
  return response.data;
}

export async function submitStatus(
  user_email: string,
  domain: string,
  status: string
): Promise<StatusData> {
  const round = 1;
  return await ProtectedRequest<StatusData>(
    "POST",
    "/admin/qualify",
    { user_email, domain, status, round },
    null
  );
}

export async function fetchQuestions(subdomain: string): Promise<LoadQuestionsResponse> {
  const response = await ProtectedRequest<LoadQuestionsResponse>(
    "GET",
    "/domain/questions",
    null,
    { domain: subdomain, round: 1 }
  );
  return {
    ...response.data,
    questions: response.data.questions.map((q) => ({
      question: q.question,
      options: q.options || [],
      correctIndex: q.correctIndex ?? -1,
    })),
  };
}

export async function addQuestion(
  round: string,
  domain: string,
  question: string,
  options: string[],
  correctIndex: number | null,
  imageFile: File | null
): Promise<SubmitResponse> {
  const formData = new FormData();
  formData.append("round", round);
  formData.append("domain", domain);
  formData.append("question", question);

  if (options.length === 4 && correctIndex !== null) {
    formData.append("options", JSON.stringify(options));
    formData.append("correctIndex", (correctIndex - 1).toString());
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await ProtectedRequest<SubmitResponse>(
      "POST",
      "/admin/questions",
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while adding the question.");
  }
}