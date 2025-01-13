import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ChallengeDescription from "../components/ChallengeDescription";
import PurpleButton from "../components/PurpleButton";
import RedButton from "../components/RedButton";
import InfoBox from "../components/InfoBox";
import { ChallengeProps } from "../types";
import { useCreateCounter } from "../hooks/useCreateCounter";
import { useValidateFlag } from "../hooks/useValidateFlag";

function Challenge({ packageId, title, description, code }: ChallengeProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const { createCounter, message } = useCreateCounter();
  const { userHasFlag, updateUserHasFlag } = useValidateFlag();

  const scrollToSth = () => {
    const element = document.getElementById("header");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (userHasFlag?.[packageId]) {
      setShowConfetti(true);
      scrollToSth();
    }
  }, [userHasFlag?.[packageId]]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#62A1F8] to-[#103870]">
      <Header showConfetti={showConfetti} />
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <ChallengeDescription title={title} text={description} />
        <div className="w-full max-w-4xl">
          <SyntaxHighlighter language="rust" style={tomorrow}>
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="mt-8 flex gap-4 mb-14">
          {title === "Counter" && (
            <PurpleButton onClick={createCounter} text="Create Counter" />
          )}
          <RedButton onClick={updateUserHasFlag} text="Submit Challenge" />
        </div>
        {message && (
          <InfoBox
            text={message}
            type={message === "Validation complete!" ? "success" : "error"}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Challenge;
