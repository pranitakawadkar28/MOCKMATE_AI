import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { Link, useNavigate } from "react-router";
import { loginSchema } from "../validator/auth.validator";
import { resetAuthState } from "../features/auth/authSlice";
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";

const Login = ({ isModel = false, switchAuth }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (!isModel) navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    dispatch(loginUser(form));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8001/api/auth/google";
  };

  return (
    <div
      className={`
    w-full ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`
          w-full 
          ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"} bg-white shadow-2xl border border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg">MockMate_AI</h2>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          Welcome back to{" "}
          <span className="text-blue-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
            <IoSparklesSharp size={16} />
            AI Interviews
          </span>
        </h1>

        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          Sign in to continue your AI-powered mock interviews and track your
          progress.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password[0]}</p>
            )}
          </div>

          {/* API Error */}
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-full shadow-md text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          {isModel ? (
            <button
              onClick={switchAuth}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </button>
          ) : (
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
