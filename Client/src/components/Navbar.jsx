import React, { useState } from "react";
import { motion } from "motion/react";
import { BsCoin, BsRobot } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../features/auth/authSlice";
import Auth from "../components/Auth";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [showCreditPopUp, setShowCreditPopUp] = useState(false);
  const [showUserPopUp, setShowUserPopUp] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h1 className="">MockMate_AI</h1>
        </div>

        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopUp(!showCreditPopUp);
                setShowUserPopUp(false);
              }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition"
            >
              <BsCoin size={20} />
              {user?.credits || 0}
            </button>

            {showCreditPopUp && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50">
                <p className="text-sm text-gray-600 mb-4">
                  Need more credits to continue interviews?
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm"
                >
                  Buy more credits
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopUp(!showUserPopUp);
                setShowCreditPopUp(false);
              }}
              className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold"
            >
              {user ? (
                user?.username.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>

            {showUserPopUp && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50">
                <p className="text-md text-blue-500 font-medium mb-1">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 mb-3">{user?.email}</p>
                <button
                  onClick={() => navigate("/history")}
                  className="w-full text-left text-sm py-2 hover:text-black text-gray-600"
                >
                  Interview History
                </button>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                  className="w-full text-left text-sm py-2 flex items-center gap-2 text-red-500"
                >
                  <HiOutlineLogout size={16} />
                  logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
