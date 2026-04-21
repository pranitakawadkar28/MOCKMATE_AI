import React from "react";
import { BsRobot } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-[#f3f3f3] flex justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-md border border-gray-200 px-6 py-10 text-center">

        {/* Logo Section */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-black to-gray-700 text-white p-3 rounded-xl shadow">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg tracking-wide">
            MockMate-AI
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
          AI-powered interview preparation platform designed to improve 
          communication skills, technical depth, and professional confidence.
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200 my-6"></div>

        {/* Links */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-4">
          <button className="hover:text-black transition">About</button>
          <button className="hover:text-black transition">Privacy</button>
          <button className="hover:text-black transition">Terms</button>
          <button className="hover:text-black transition">Contact</button>
        </div>

        {/* Bottom Text */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} MockMate-AI. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Footer;