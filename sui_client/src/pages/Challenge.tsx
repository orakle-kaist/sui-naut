import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ChallengeDescription from "../components/ChallengeDescription";
import RedButton from "../components/RedButton";
import InfoBox from "../components/InfoBox";
import { ChallengeProps } from "../types";
import { useValidateFlag } from "../hooks/useValidateFlag";

const messages = {
  success: "You have completed the challenge!",
  error: "You have not completed the challenge yet.",
};

function Challenge({ packageId, title, description, code }: ChallengeProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");

  const { userHasFlag, updateUserHasFlag } = useValidateFlag();

  const scrollToSth = (id: "header" | "footer") => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const onClickSubmit = async () => {
    await updateUserHasFlag();

    if (userHasFlag?.[packageId]) {
      setMessage(messages.success);
      setShowConfetti(true);
      scrollToSth("header");
    } else {
      setMessage(messages.error);
      setTimeout(() => {
        scrollToSth("footer");
      }, 500);
    }
  };

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
          <RedButton onClick={onClickSubmit} text="Submit Challenge" />
        </div>
        {message && (
          <InfoBox
            text={message}
            type={message === messages.success ? "success" : "error"}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Challenge;
