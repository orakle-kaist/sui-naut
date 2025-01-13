import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { challengeConfig } from "../config/challengeConfig";
import { useValidateFlag } from "../hooks/useValidateFlag";

const ChallengeGrid: React.FC = () => {
  const { userHasFlag, updateUserHasFlag } = useValidateFlag();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    updateUserHasFlag();
  }, [currentAccount?.address]);

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
      {challengeConfig.map(({ title, packageId }, index) => (
        <div
          key={packageId}
          className="flex flex-col gap-4 transition-transform hover:scale-105"
        >
          {packageId ? (
            <Link
              to={`/challenge/${packageId}`}
              className="bg-[#D5E3FF] rounded-full p-6 flex items-center justify-center h-16 border border-gray-300 shadow-md"
            >
              <h3 className="text-[#1A1B1F] text-lg font-bold">{`Challenge ${index + 1}: ${title} ${userHasFlag?.[packageId] ? "✅" : ""}`}</h3>
            </Link>
          ) : (
            <div className="bg-[#6B7280]/30 rounded-full p-6 flex items-center justify-center h-16 border border-gray-500 shadow-md">
              <h3 className="text-white/70 text-lg font-bold">{title}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChallengeGrid;
