import React, { useEffect, useState, useRef } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import FemaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { submitAnswer, finishInterview } from "../features/interview/interviewThunks";

const Step2Interview = ({ interviewData, onFinish }) => {
  const dispatch = useDispatch();
if (!interviewData || !Array.isArray(interviewData.questions) || interviewData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading interview...</p>
      </div>
    );
  }
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const isMicOnRef = useRef(true); 
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions?.[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("male");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  // ──────────────────────────── Load Voices ───────────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("devuu") ||
          v.name.toLowerCase().includes("giyan") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("piddu") ||
          v.name.toLowerCase().includes("anjali") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Fallback
      setSelectedVoice(voices[0]);
      setVoiceGender("male");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "female" ? FemaleVideo : maleVideo;

  // ──────────────────────────────────── Speak Function ─────────────────────────────────────
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOnRef.current) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  // ───────────────────────────── Intro + Question Speaking ─────────────────────────────────
  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );
        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.`,
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOnRef.current) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  // ────────────────────────────────── Timer ───────────────────────────────────────────────
  useEffect(() => {
    if (isIntroPhase || !currentQuestion || isSubmitting || feedback) return;

    setTimeLeft(currentQuestion.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting, feedback]);

  // ─────────────────────────────── Speech Recognition Setup ──────────────────────────────────
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // ─────────────────────────────── Mic Controls ──────────────────────────────────────────────
  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    const next = !isMicOn;
    setIsMicOn(next);
    isMicOnRef.current = next;
    next ? startMic() : stopMic();
  };

  // ──────────────────────────────── Submit Answer ──────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await dispatch(
        submitAnswer({
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        }),
      ).unwrap();

      setFeedback(result.feedback);
      await speakText(result.feedback);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ───────────────────────────────── Next Question ─────────────────────────────────────
  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    setIsSubmitting(false);

    if (currentIndex + 1 >= questions.length) {
      await handleFinishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex((prev) => prev + 1);
  };

  // ──────────────────────────────── Finish Interview ─────────────────────────────────────
  const handleFinishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    isMicOnRef.current = false;
    try {
      const result = await dispatch(finishInterview({ interviewId })).unwrap();
      onFinish(result);
    } catch (error) {
      console.error("Finish failed:", error);
    }
  };

  // ──────────────────────────────── Auto-submit on timeout ──────────────────────────────────
  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      handleSubmitAnswer();
    }
  }, [timeLeft, isIntroPhase, isSubmitting, feedback]);

  // ───────────────────────────────── Cleanup ────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  // ───────────────────────────────── Render ───────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full lg:w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

        {/* ── Video Panel ── */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-blue-600">
                  AI Speaking
                </span>
              )}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                TotalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-gray-200" />

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{currentIndex + 1}</p>
                <p className="text-xs text-gray-400">Current Question</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
                <p className="text-xs text-gray-400">Total Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Answer Panel ── */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </p>
            </div>
          )}

          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500 transition text-gray-800"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg"
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-blue-50 border border-blue-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-blue-700 font-medium mb-4">{feedback}</p>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                {currentIndex + 1 >= questions.length ? "Finish Interview" : "Next Question"}
                <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;