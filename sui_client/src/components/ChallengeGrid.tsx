import React from 'react';
import { Link } from 'react-router-dom';

type Challenge = {
  id: number;
  title: string;
  status: 'coming-soon' | 'active';
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Challenge 1: Counter',
    status: 'active',
  },
  {
    id: 2,
    title: 'Challenge 2: FlashLoan',
    status: 'active',
  },
  {
    id: 3,
    title: 'Challenge 3: Simple Game',
    status: 'coming-soon',
  },
  {
    id: 4,
    title: 'Coming Soon',
    status: 'coming-soon',
  },
  {
    id: 5,
    title: 'Coming Soon',
    status: 'coming-soon',
  },
  {
    id: 6,
    title: 'Coming Soon',
    status: 'coming-soon',
  },
];

const ChallengeGrid: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
      {CHALLENGES.map((challenge) => (
        <div
          key={challenge.id}
          className="flex flex-col gap-4 transition-transform hover:scale-105"
        >
          {challenge.status === 'active' ? (
            <Link
              to={`/challenge_${challenge.id}`}
              className="bg-[#D5E3FF] rounded-full p-6 flex items-center justify-center h-16 border border-gray-300 shadow-md"
            >
              <h3 className="text-[#1A1B1F] text-lg font-bold">
                {challenge.title}
              </h3>
            </Link>
          ) : (
            <div className="bg-[#6B7280]/30 rounded-full p-6 flex items-center justify-center h-16 border border-gray-500 shadow-md">
              <h3 className="text-white/70 text-lg font-bold">
                {challenge.title}
              </h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChallengeGrid;