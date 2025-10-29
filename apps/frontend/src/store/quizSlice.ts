import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL =
  (typeof window === 'undefined'
    ? process.env.API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || '/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export interface Question {
  text: string;
  type: 'boolean' | 'input' | 'checkbox';
  options?: string[];
  answer?: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions?: Question[];
  questionCount?: number;
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
};

type ItemResponse<T> = { data: T } | T;

export type QuizListItem = {
  id: number;
  title: string;
  questionCount: number;
};

export const fetchQuizzes = createAsyncThunk<QuizListItem[], void>(
  'index/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<QuizListItem[]>('/quizzes');
      console.log('GET /quizzes', res.status, res.data);
      if (!Array.isArray(res.data)) {
        return rejectWithValue('Response is not an array');
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Unknown error');
    }
  }
);

export const createQuiz = createAsyncThunk('index/create', async (quiz: Omit<Quiz, 'id'>) => {
  const res = await api.post<ItemResponse<Quiz>>('/quizzes', quiz);
  const payload = (res.data as { data: Quiz })?.data ?? (res.data as Quiz);

  if (!payload || typeof payload !== 'object' || typeof (payload as Quiz).id !== 'number') {
    throw new Error('Invalid createQuiz response');
  }
  return payload as Quiz;
});

export const deleteQuiz = createAsyncThunk('index/delete', async (id: number) => {
  await api.delete(`/quizzes/${id}`);
  return id;
});

export const getQuiz = createAsyncThunk('index/getOne', async (id: number) => {
  const res = await api.get<ItemResponse<Quiz>>(`/quizzes/${id}`);
  return (res.data as { data: Quiz })?.data ?? (res.data as Quiz);
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<QuizListItem[]>) => {
        state.loading = false;
        state.quizzes = action.payload as Quiz[];
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message ?? 'Failed to fetch quizzes');
      })
      .addCase(getQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentQuiz = null;
      })
      .addCase(getQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(getQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load quiz';
      })

      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        const q = action.payload;
        if (q && typeof q === 'object' && 'id' in q && 'title' in q) {
          state.quizzes.unshift(q);
        }
      })
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<number>) => {
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
      });
  },
});

export default quizSlice.reducer;
