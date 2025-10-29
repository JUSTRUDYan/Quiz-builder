// src/pages/index/index.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizzes, deleteQuiz } from '../store/quizSlice';
import { RootState, AppDispatch } from '../store/store';
import Link from 'next/link';

export default function QuizList() {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading } = useSelector((state: RootState) => state.quiz);

  useEffect(() => { dispatch(fetchQuizzes()); }, [dispatch]);

  useEffect(() => {
    console.log(quizzes);
  }, [quizzes]);

  const list = Array.isArray(quizzes) ? quizzes : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
      <Link href="/create" className="text-blue-500 mb-4 inline-block">Create New Quiz</Link>
      {loading && <p>Loading...</p>}
      <ul className="space-y-2">
        {list.map(q => (
          <li key={q.id} className="flex justify-between items-center border p-2 rounded">
            <Link href={`/${encodeURIComponent(q.id)}`} className="font-semibold">{q.title} ({q.questionCount})</Link>
            <button className="text-red-500" onClick={() => dispatch(deleteQuiz(q.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
