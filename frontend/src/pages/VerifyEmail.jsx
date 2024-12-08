import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import createToast from "../utils/createToast";
import axios from "axios";
import { baseUrl } from "../constants";
import useAuthStore from "../store/authStore";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const inputRefs = useRef([]);
  const { setUser, user } = useAuthStore();
  const navigate = useNavigate();
  console.log(user);
  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
    if (newCode.join("").length < 6 || Number.isNaN(Number(newCode.join("")))) {
      setError("Invalid Verification Code");
    } else {
      setError("");
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlSubmit = async (e) => {
    e.preventDefault();
    const verifyCode = code.join("");
    if (verifyCode.length < 6 || Number.isNaN(Number(verifyCode))) {
      setError("Invalid Verification Code");
    } else {
      setError("");
      // send verification code
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/auth/verify-email`, {
          code: verifyCode,
        });
        setIsLoading(false);
        setUser(response.data.user);
        createToast(response.data.message, "success");
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        if (error.response.status === 400) {
          setShowResend(true);
        }
        createToast(error.response.data.message, "error");
      }
    }
  };
  const resendCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/resend-code`, {
        email: user?.email,
      });
      setIsLoading(false);
      createToast(response.data.message, "success");
      setCode(["", "", "", "", "", ""]);
      setShowResend(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      createToast(error.response.data.message, "error");
    }
  };
  return (
    <motion.div
      className="max-w-md my-4 w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
  overflow-hidden"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 1,
        ease: "linear",
      }}
    >
      {!showResend ? (
        <div>
          <h1 className="text-3xl text-green-500 pt-8 pb-2 font-bold text-center mb-4">
            Verify Your Email
          </h1>
          <p className="text-center p-4 font-medium text-lg text-gray-300 ">
            Enter the 6-digit code sent to your email address.
          </p>
          <form onSubmit={handlSubmit} className="p-4">
            <div className="input-container justify-center gap-4">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  maxLength={"6"}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="text-center text-2xl font-semibold border-gray-500 focus:border-2 bg-gray-900/60 border  focus:border-green-500 outline-none rounded-md py-3 w-[12%]"
                  type="text"
                />
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className={`main-btn mt-6 ${
                isLoading && "cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-3xl text-green-500 py-2 font-bold text-center mb-4">
            Invalid or expired code
          </h1>
          <p className="my-4 font-semibold text-center text-gray-200 text-lg">
            We will send an another verification code to{" "}
            <span className="text-green-400">{user?.email}</span>
          </p>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => resendCode()}
            className={`main-btn ${
              isLoading && "cursor-not-allowed opacity-50"
            }`}
          >
            {isLoading ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              "Send Code Again"
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default VerifyEmail;
