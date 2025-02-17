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

export interface LoadQuestionsResponse {
  questions: Question[] | PromiseLike<Question[]>;
  status_code: number;
  content: {
    [key: string]: {
      items: QuestionData[];
      last_evaluated_key: string;
    };
  };
}

export interface SubmitResponse {
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
    console.log(token, "token");
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

interface DomainData {
  content: DomainData;
  items: string;
  lastKey: string;
}

interface StatusData {
  status:number
  data:{
    detail:string
  }
}

export async function fetchDomainData(
  domain: string, round:number, status:string, last_evaluated_key:string
): Promise<DomainData> {
  console.log(last_evaluated_key, 'in api');
  const response = await ProtectedRequest<DomainData>(
    "GET",
    "/admin/fetch",
    null,
    {domain, round, status, last_evaluated_key}
  );
  console.log(response);
  return response.data;
}

export async function submitStatus(
  user_email: string,domain:string, status:string): Promise<StatusData> {
    //console.log(email, status, 'in api');
    const round=1;
  const response = await ProtectedRequest<StatusData>(
    "POST",
    "/admin/qualify",
    {user_email,domain, status,round},
    null
  );
  console.log(response);
  return response;
}

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
  options: string[],
  correctIndex: number | null,
  Image: File | null
): Promise<SubmitResponse> {
  console.log(round, domain, question, correctIndex );
  const formData = new FormData();
  formData.append("round", round);
  formData.append("domain", domain);
  formData.append("question", question);

  if (options.length === 4 && correctIndex) {
    formData.append("options", JSON.stringify(options));
    formData.append("correctIndex", correctIndex.toString());
  }

  if (Image) {
    formData.append("image", Image);
  }
  for (let pair of formData.entries()) {
    console.log('in for', pair[0] + ": " + pair[1]);
  }
  

  try {
    const response = await ProtectedRequest<SubmitResponse>("POST", "/admin/questions", formData);
    console.log(response, 'response');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while adding the question.");
  }
}


