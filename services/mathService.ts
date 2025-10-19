import type { Problem } from '../types';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateProblem = (depth: number, difficultySetting: number = 3): Problem => {
  let question = '';
  let answer = 0;
  const gameDifficulty = Math.max(1, Math.floor(depth / 10));

  const difficultyMultipliers: { [key: number]: number } = {
    1: 0.6,  // Easy
    2: 0.8,
    3: 1.0,  // Normal (Default)
    4: 1.25,
    5: 1.5,  // Hard
  };
  const multiplier = difficultyMultipliers[difficultySetting] || 1.0;

  const operations = ['addition'];
  if (depth >= 15) operations.push('subtraction');
  if (depth >= 30) operations.push('multiplication');
  if (depth >= 45) operations.push('division');
  
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let a: number, b: number, res: number;

  switch (operation) {
    case 'addition':
      a = rand(1 + Math.floor(depth / 4), 5 + Math.floor(depth * 1.2));
      b = rand(1 + Math.floor(depth / 4), 5 + Math.floor(depth * 1.2));
      a = Math.max(1, Math.round(a * multiplier));
      b = Math.max(1, Math.round(b * multiplier));
      question = `${a} + ${b} = ?`;
      answer = a + b;
      break;

    case 'subtraction':
      // Start with smaller numbers when subtraction is introduced
      a = rand(5 + Math.floor(Math.max(0, depth - 15) / 2), 10 + Math.floor(Math.max(0, depth - 15) * 1.2));
      a = Math.max(2, Math.round(a * multiplier));
      // Ensure b is always smaller than a
      b = rand(1, a - 1);
      question = `${a} - ${b} = ?`;
      answer = a - b;
      break;

    case 'multiplication':
      // Start with single-digit multiplication and scale up more gradually
      a = rand(2, 2 + Math.floor(Math.max(0, depth - 30) / 4));
      b = rand(2, 3 + Math.floor(Math.max(0, depth - 30) / 3));
      // Dampen the multiplier effect slightly for multiplication to avoid huge numbers
      a = Math.max(2, Math.round(a * (1 + (multiplier - 1) * 0.5)));
      b = Math.max(2, Math.round(b * (1 + (multiplier - 1) * 0.5)));
      question = `${a} × ${b} = ?`;
      answer = a * b;
      break;

    case 'division':
      // Start with simple single-digit division problems
      b = rand(2, 2 + Math.floor(Math.max(0, depth - 45) / 5));
      res = rand(2, 3 + Math.floor(Math.max(0, depth - 45) / 4));
      b = Math.max(2, Math.round(b * (1 + (multiplier - 1) * 0.5)));
      res = Math.max(2, Math.round(res * (1 + (multiplier - 1) * 0.5)));
      a = b * res;
      question = `${a} ÷ ${b} = ?`;
      answer = res;
      break;
  }

  const problem: Problem = { question, answer, difficulty: gameDifficulty };
  
  if (depth < 50) {
    const hints = new Set<number>([answer]);
    while (hints.size < 3) {
        const offset = rand(1, Math.max(5, Math.floor(answer * 0.3)));
        let wrongAnswer = answer + (Math.random() > 0.5 ? offset : -offset);
        
        if (wrongAnswer < 0 || wrongAnswer === answer) {
            wrongAnswer = answer + offset;
        }
        hints.add(wrongAnswer);
    }
    problem.hints = Array.from(hints).sort(() => Math.random() - 0.5);
  }

  return problem;
};