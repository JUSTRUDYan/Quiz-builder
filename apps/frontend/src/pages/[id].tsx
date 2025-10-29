import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {getQuiz, Quiz} from '../store/quizSlice';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch<AppDispatch>();
  const quiz = useSelector((s: RootState) => s.quiz.currentQuiz);

  useEffect(() => {
    if (!id) return;
    dispatch(getQuiz(Number(id)));
  }, [id, dispatch]);

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <ul className="space-y-2">
        {quiz.questions?.map((q, i) => (
          <li key={i} className="border p-2 rounded">
            <p className="font-semibold">{q.text}</p>
            <ul className="ml-4 list-disc">
              {q.options?.map((o, j) => <li key={j}>{o}</li>)}
            </ul>
            {q.answer && <p className="text-green-600">Answer: {q.answer}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
