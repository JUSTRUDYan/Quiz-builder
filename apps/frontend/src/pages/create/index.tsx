import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createQuiz } from '../../store/quizSlice';
import type { Question } from '../../store/quizSlice';
import { AppDispatch } from '../../store/store';
import {useRouter} from "next/router";

export default function CreateQuiz() {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', type: 'input', options: [], answer: '' },
  ]);

  const router = useRouter()

  const handleQuestionChange = <K extends keyof Question>(index: number, key: K, value: Question[K]) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { text: '', type: 'input', options: [], answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const addCheckboxOption = (qIndex: number) => {
    const curr = questions[qIndex].options ?? [];
    handleQuestionChange(qIndex, 'options', [...curr, '']);
  };

  const updateCheckboxOption = (qIndex: number, optIndex: number, value: string) => {
    const curr = questions[qIndex].options ?? [];
    const next = [...curr];
    next[optIndex] = value;
    handleQuestionChange(qIndex, 'options', next);
  };

  const removeCheckboxOption = (qIndex: number, optIndex: number) => {
    const curr = questions[qIndex].options ?? [];
    const next = curr.filter((_, i) => i !== optIndex);
    handleQuestionChange(qIndex, 'options', next);

    const selected = (questions[qIndex].answer ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const removedValue = curr[optIndex];
    const nextSelected = selected.filter(v => v !== removedValue);
    handleQuestionChange(qIndex, 'answer', nextSelected.length ? nextSelected.join(',') : undefined);
  };

  const toggleCheckboxCorrect = (qIndex: number, value: string, checked: boolean) => {
    const selected = (questions[qIndex].answer ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let nextSelected: string[];
    if (checked) {
      nextSelected = Array.from(new Set([...selected, value]));
    } else {
      nextSelected = selected.filter(v => v !== value);
    }

    handleQuestionChange(qIndex, 'answer', nextSelected.length ? nextSelected.join(',') : undefined);
  };

  const submit = () => {
    const cleanedTitle = title.trim();
    if (!cleanedTitle) {
      alert('Please enter a quiz title');
      return;
    }

    const cleanedQuestions = questions.map(q => {
      const base = {
        ...q,
        text: q.text.trim(),
      };

      if (q.type === 'boolean') {
        const normalized = q.answer === 'true' ? 'true' : q.answer === 'false' ? 'false' : undefined;
        return { ...base, answer: normalized, options: undefined };
      }

      if (q.type === 'checkbox') {
        const opts = (q.options ?? []).map(o => o.trim()).filter(Boolean);
        const selected = (q.answer ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const validSelected = selected.filter(v => opts.includes(v));
        return {
          ...base,
          options: opts,
          answer: validSelected.length ? validSelected.join(',') : undefined,
        };
      }

      router.push('/')

      return {
        ...base,
        options: undefined,
        answer: q.answer?.trim(),
      };
    });

    dispatch(createQuiz({ title: cleanedTitle, questions: cleanedQuestions }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Quiz Title"
        autoComplete="off"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {questions.map((q, i) => {
        const selectedValues = (q.answer ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        return (
          <div key={i} className="border p-2 mb-2 rounded">
            <input
              className="border p-1 mb-2 w-full"
              placeholder="Question text"
              autoComplete="off"
              value={q.text}
              onChange={e => handleQuestionChange(i, 'text', e.target.value)}
            />

            <select
              className="border p-1 mb-2 w-full"
              autoComplete="off"
              value={q.type}
              onChange={e => {
                const nextType = e.target.value as Question['type'];
                handleQuestionChange(i, 'type', nextType);
                if (nextType === 'boolean') {
                  handleQuestionChange(i, 'options', undefined);
                  handleQuestionChange(i, 'answer', undefined);
                } else if (nextType === 'checkbox') {
                  handleQuestionChange(i, 'options', q.options ?? []);
                  handleQuestionChange(i, 'answer', undefined);
                } else {
                  handleQuestionChange(i, 'options', undefined);
                }
              }}
            >
              <option value="boolean">Boolean</option>
              <option value="input">Input</option>
              <option value="checkbox">Checkbox</option>
            </select>

            {q.type === 'boolean' && (
              <div className="mb-2">
                <p className="text-sm text-gray-700 mb-1">Select correct answer:</p>
                <label className="mr-4">
                  <input
                    type="radio"
                    name={`bool-${i}`}
                    value="true"
                    checked={q.answer === 'true'}
                    onChange={() => handleQuestionChange(i, 'answer', 'true')}
                  />{' '}
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name={`bool-${i}`}
                    value="false"
                    checked={q.answer === 'false'}
                    onChange={() => handleQuestionChange(i, 'answer', 'false')}
                  />{' '}
                  False
                </label>
              </div>
            )}

            {q.type === 'input' && (
              <input
                className="border p-1 mb-2 w-full"
                placeholder="Answer (optional)"
                autoComplete="off"
                value={q.answer ?? ''}
                onChange={e => handleQuestionChange(i, 'answer', e.target.value)}
              />
            )}

            {q.type === 'checkbox' && (
              <div className="mb-2">
                <p className="text-sm text-gray-700 mb-1">Options and correct answers:</p>

                {/* Список опцій з інпутами для редагування */}
                {(q.options ?? []).map((opt, j) => {
                  const val = opt ?? '';
                  const isSelected = selectedValues.includes(val);
                  return (
                    <div key={j} className="flex items-center gap-2 mb-2">
                      <input
                        className="border p-1 flex-1"
                        placeholder={`Option ${j + 1}`}
                        autoComplete="off"
                        value={val}
                        onChange={e => updateCheckboxOption(i, j, e.target.value)}
                      />
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => toggleCheckboxCorrect(i, val, e.target.checked)}
                        />
                        Correct
                      </label>
                      <button
                        className="text-red-500"
                        onClick={() => removeCheckboxOption(i, j)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}

                <button
                  className="bg-gray-200 px-2 py-1 rounded"
                  onClick={() => addCheckboxOption(i)}
                >
                  Add option
                </button>
              </div>
            )}

            <button className="text-red-500" onClick={() => removeQuestion(i)}>
              Remove Question
            </button>
          </div>
        );
      })}

      <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={addQuestion}>
        Add Question
      </button>
      <button className="bg-green-500 text-white p-2 rounded" onClick={submit}>
        Create Quiz
      </button>
    </div>
  );
}
