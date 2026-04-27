import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyOtp = lazy(() => import("../pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/resetPassword"));
const Home = lazy(() => import("../pages/Home"));
const InterviewPage = lazy(() => import("../pages/InterviewPage"));
const InterviewHistory = lazy(() => import("../pages/InterviewHistory"));
const InterviewReport = lazy(() => import("../pages/InterviewReport"));
const Pricing = lazy(() => import("../pages/Pricing"));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/history" element={<InterviewHistory />} />
          <Route path="/report" element={<InterviewReport />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
