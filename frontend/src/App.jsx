import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  ForgetPasswordPage,
  Home,
  LogInPage,
  ResetPasswordPage,
  SignUpPage,
  VerifyEmail,
} from "./pages";
import { FloatingShape } from "./components";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="h-screen z-[1] overflow-hidden relative bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center text-white">
        <FloatingShape
          color="bg-green-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen z-[1] overflow-hidden relative bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center text-white">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to={"/sign-in"} />}
        />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<LogInPage />} />
        <Route
          path="/verify-email"
          element={user ? <VerifyEmail /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/forget-password"
          element={user ? <ForgetPasswordPage /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/reset-password/:token"
          element={user ? <ResetPasswordPage /> : <Navigate to={"/sign-in"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
