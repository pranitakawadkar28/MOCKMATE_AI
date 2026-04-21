import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsBarChart,
  BsClock,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import Auth from "../components/Auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 text-gray-600 text-xl px-4 py-2 rounded-full flex items-center gap-2">
              Al Powered Smart Interview Platform
            </div>
          </div>

          <div className="text-center mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
            >
              Practice Interview with
              <span className="relative inline-block">
                <span className="text-blue-600 px-5 py-1 rounded-full">
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role-based mock interview with smart follow-ups, adaptive
              difficulty and real-time performance evaluation.
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => {
                  if (!user) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05 }}
                className="bg-black text-white px-10 py-3 rounded-full hover:bg-gray-800 transition shadow-md"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!user) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05 }}
                className="border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-200 transition"
              >
                View History
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },

              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },

              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`relative bg-white rounded-3xl border-2 border-blue-100 hover:border-blue-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300
              ${index === 0 ? "rotate-[-4deg]" : ""}
              ${index === 1 ? "rotate-[3deg] md:-mt6 shadow-xl" : ""}
              ${index === 2 ? "rotate-[-3deg]" : ""}
              `}
              >
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white
             border-2 border-blue-500 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  {item.icon}
                </div>

                <div className="pt-10 text-center">
                  <div className="text-xs text-blue-600 font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Advanced AI <span className="text-blue-600">Capabilities</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-10 items-stretch">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on uploaded resume.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl transition-all h-full flex"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full p-6">
                    {/* Image */}
                    <div className="w-full md:w-1/2 flex justify-center items-center h-64">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
                      <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>

                      <h3 className="font-semibold mb-3 text-xl">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECOND SECTION */}

          <div className="mb-10">
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Multiple Interview <span className="text-blue-600">Modes</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-10 items-stretch">
              {[
                {
                  img: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation.",
                },
                {
                  img: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role.",
                },
                {
                  img: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },
                {
                  img: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily.",
                },
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all h-full flex"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                    {/* Text */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h3 className="font-semibold text-xl mb-3">
                        {mode.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-1/2 flex justify-center items-center h-40">
                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="max-h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}

      <Footer />
    </div>
  );
};

export default Home;
