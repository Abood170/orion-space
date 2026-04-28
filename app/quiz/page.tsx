import type { Metadata } from 'next';
import { QuizGame } from '@/components/quiz/quiz-game';

export const metadata: Metadata = {
  title: 'Space Quiz',
  description:
    'Test your knowledge of the solar system, space history, and astronomy with our interactive space quiz.',
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <QuizGame />
    </div>
  );
}
