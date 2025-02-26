import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "https://enrollments-2025-backend.onrender.com";

export interface Question {
  options: string[];
  question: string;
  answer?: string;
  correctIndex?: number | null;
  type?: "objective" | "subjective";
  index?: number;
  image_url?: string; 
}

interface QuestionData {
  email: string;
  round1?: Question[];
  score1?: number;
  options?: string[];
}

export interface LoadQuestionsResponse {
  questions?: Question[];
  mcq_questions?: {
    question: string;
    options: string[];
    correctIndex: number;
    image_url?: string; // Added image property
  }[];
  desc_questions?: {
    question: string;
    image_url?: string; // Added image property
  }[];
  options: string[];
  status_code: number;
  content: {
    [key: string]: {
      items: QuestionData[];
      options: string[];
      last_evaluated_key: string;
      questionCount?: number; 
    };
  };
  meta?: {
    mcq_count: number;
    desc_count: number;
    total_count?: number; 
  };
}

export interface SubmitResponse {
  ok: boolean;
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
    
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

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
  content: {
    items: QuestionData[];
    last_evaluated_key: string;
  };
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
  last_evaluated_key: string
): Promise<DomainData> {
  const response = await ProtectedRequest<DomainData>(
    "GET",
    "/admin/fetch",
    null,
    { domain, round, status, last_evaluated_key }
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


export async function getQuestionCount(subdomain: string): Promise<number> {
  try {
    
    const response = await ProtectedRequest<{ count: number }>(
      "GET",
      "/admin/question-count",
      null,
      { domain: subdomain, round: 1 }
    );
    return response.data.count;
  } catch (error: any) {
    console.error("Error fetching question count:", error);
    
    
    try {
      const response = await fetchQuestions(subdomain);
      
      
      if (response.meta?.total_count !== undefined) {
        return response.meta.total_count;
      }
      
      
      return response.questions?.length || 0;
    } catch (fetchError) {
      console.error("Error in fallback count method:", fetchError);
      
      return 0;
    }
  }
}

export async function fetchQuestions(
  subdomain: string,
  last_evaluated_key: string = "start"
): Promise<LoadQuestionsResponse> {
  try {
    const response = await ProtectedRequest<LoadQuestionsResponse>(
      "GET",
      "/admin/questions",
      null,
      { domain: subdomain, round: 1, last_evaluated_key }
    );
    
    const responseData = response.data;
    
    let transformedQuestions: Question[] = [];
    
    if (responseData.mcq_questions && Array.isArray(responseData.mcq_questions)) {
      const mcqQuestions = responseData.mcq_questions.map(mcq => ({
        question: mcq.question,
        options: mcq.options || ["", "", "", ""],
        correctIndex: mcq.correctIndex,
        type: "objective" as const,
        
        ...(mcq.image_url ? { image_url: mcq.image_url } : {})
      }));
      transformedQuestions = [...transformedQuestions, ...mcqQuestions];
    }
    
    if (responseData.desc_questions && Array.isArray(responseData.desc_questions)) {
      const descQuestions = responseData.desc_questions.map(desc => ({
        question: desc.question,
        options: [],
        correctIndex: null,
        type: "subjective" as const,
        
        ...(desc.image_url ? { image_url: desc.image_url } : {})
      }));
      transformedQuestions = [...transformedQuestions, ...descQuestions];
    }
    
    if (responseData.questions && Array.isArray(responseData.questions) && 
        (!responseData.mcq_questions && !responseData.desc_questions)) {
      transformedQuestions = responseData.questions;
    }
    
    const totalCount = 
      (responseData.meta?.mcq_count || 0) + 
      (responseData.meta?.desc_count || 0) ||
      transformedQuestions.length;
    
    return {
      questions: transformedQuestions,
      options: responseData.options || [],
      status_code: responseData.status_code || 200,
      content: responseData.content || {},
      meta: {
        mcq_count: (responseData.meta?.mcq_count || 0),
        desc_count: (responseData.meta?.desc_count || 0),
        total_count: totalCount
      }
    };
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.data?.message?.includes("no questions")) {
      return {
        questions: [],
        options: [],
        status_code: 200,
        content: {},
        meta: {
          mcq_count: 0,
          desc_count: 0,
          total_count: 0
        }
      };
    }
    throw error;
  }
}


export async function addQuestion(
  round: string,
  domain: string,
  question: string,
  options: string[],
  correctIndex: number | null,
  imageFile: File | null
): Promise<SubmitResponse> {
 
  const currentCount = await getQuestionCount(domain);
  
  
  const questionIndex = currentCount + 1;
  
  const formData = new FormData();
  formData.append("round", round);
  formData.append("domain", domain);
  formData.append("question", question);
  formData.append("index", questionIndex.toString()); 
  if (options.length === 4) {
    formData.append("options", JSON.stringify(options));
    
    if (correctIndex !== null && correctIndex !== undefined) {
      formData.append("correctIndex", correctIndex.toString());
    }
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
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred while adding the question.");
  }
}