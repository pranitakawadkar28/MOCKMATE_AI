import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../features/auth/authThunks";
import { verifyOtpSchema } from "../validator/auth.validator";
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});

  const [params] = useSearchParams();
  const email = params.get("email");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = verifyOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    dispatch(verifyOtp({ email, otp }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg">MockMate_AI</h2>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug text-blue-600 px-3 py-1 mb-2">
          Verify Email
        </h1>

        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-2">
          We sent a 6-digit OTP to
        </p>
        <p className="text-center text-sm font-semibold text-gray-800 mb-8">
          {email}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.otp && (
              <p className="text-red-500 text-xs">{errors.otp[0]}</p>
            )}
          </div>

          {/* API Error */}
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-full shadow-md text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;