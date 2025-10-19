import React, { useState, useEffect, useRef } from 'react';
import type { Problem } from '../types';
import { DynamiteIcon } from './icons/GameIcons';
import { Language, t } from '../services/translation';

interface MathModalProps {
  problem: Problem;
  onSolve: (isCorrect: boolean, useDynamite: boolean) => void;
  dynamiteCount: number;
  language: Language;
  title: string;
  allowDynamite: boolean;
}

export const MathModal: React.FC<MathModalProps> = ({ problem, onSolve, dynamiteCount, language, title, allowDynamite }) => {
  const [answer, setAnswer] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [useDynamite, setUseDynamite] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to generate and shuffle hints
  const generateShuffledHints = (correctAnswer: number) => {
    const hints = new Set<number>([correctAnswer]);
    while (hints.size < 3) {
        const offset = Math.floor(Math.random() * 10) + 1;
        let wrongAnswer = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
        if (wrongAnswer < 0) {
          wrongAnswer = correctAnswer + offset;
        }
        hints.add(wrongAnswer);
    }
    return Array.from(hints).sort(() => Math.random() - 0.5);
  };

  const [currentHints, setCurrentHints] = useState<number[]>(problem.hints || []);
  const [wrongHint, setWrongHint] = useState<number | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = Number(answer) === problem.answer;
    if (isCorrect) {
      onSolve(true, useDynamite);
    } else {
      setIsWrong(true);
      setAnswer('');
      setTimeout(() => setIsWrong(false), 1000);
    }
  };

  const handleHintClick = (hint: number) => {
    if (hint === problem.answer) {
      onSolve(true, useDynamite);
    } else {
      // Set the wrong hint to trigger the animation
      setWrongHint(hint);
      
      // After the animation finishes, clear the wrong state and generate new hints
      setTimeout(() => {
        setWrongHint(null);
        setCurrentHints(generateShuffledHints(problem.answer));
      }, 820); // Sync with shake animation
    }
  };

  const wrongAnswerClasses = isWrong ? 'animate-shake border-red-500' : 'border-gray-600';
  const dynamiteActiveClasses = useDynamite ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-stone-800 animate-pulse' : '';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
      <div className="bg-stone-800 p-8 rounded-lg shadow-2xl border border-stone-700 w-full max-w-md mx-4">
        <div className="flex justify-between items-start">
            <div className="flex-grow">
                <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">
                {title}
                </h2>
                <p className="text-center text-5xl font-bold mb-8 text-white tabular-nums">
                {problem.question}
                </p>
            </div>
            {allowDynamite && dynamiteCount > 0 && (
                 <button
                    onClick={() => setUseDynamite(d => !d)}
                    disabled={dynamiteCount <= 0}
                    className={`relative p-2 rounded-full transition-all ${dynamiteActiveClasses} ${dynamiteCount > 0 ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-900 opacity-50 cursor-not-allowed'}`}
                    title={t('dynamiteTitle', language, { dynamiteCount })}
                >
                    <DynamiteIcon className="w-10 h-10" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {dynamiteCount}
                    </span>
                </button>
            )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={`w-full p-4 text-3xl text-center bg-stone-900 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all ${wrongAnswerClasses}`}
          />
          
          {currentHints.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-stone-400 mb-3 text-sm">{t('pickAnswer', language)}</p>
              <div className="flex justify-center gap-4">
                {currentHints.map((hint, index) => (
                  <button
                    key={`${hint}-${index}`}
                    type="button"
                    onClick={() => handleHintClick(hint)}
                    className={`w-24 py-3 font-bold text-xl rounded-md transition-all duration-200 text-white shadow-lg ${
                      wrongHint === hint
                        ? 'animate-shake bg-red-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
                type="button"
                onClick={() => onSolve(false, false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
                {t('cancel', language)}
            </button>
            <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
                {t('check', language)}
            </button>
          </div>
        </form>
      </div>
      {/* FIX: Removed 'jsx' prop from style tag as it's not supported in standard React. */}
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};