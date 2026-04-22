import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import InterviewPage from "../pages/InterviewPage";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyOtp = lazy(() => import("../pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/resetPassword"));
const Home = lazy(() => import("../pages/Home"))

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/home" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />}/>
        <Route path="/interview" element={<InterviewPage />}/>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;