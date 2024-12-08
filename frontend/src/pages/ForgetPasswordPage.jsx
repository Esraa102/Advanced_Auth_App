import { motion } from "framer-motion";
import { Input } from "../components";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { validateCredentails } from "../utils/validation";
import createToast from "../utils/createToast";
import axios from "axios";
import { baseUrl } from "../constants";
import { Link } from "react-router-dom";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitLink = async (e) => {
    e.preventDefault();
    const emailErr = validateCredentails(undefined, email, undefined);
    if (Object.keys(emailErr).length > 0) {
      setError(emailErr);
    } else {
      setError({});
      // send reset link
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/auth/forgot-password`, {
          email,
        });
        setIsLoading(false);
        createToast(response.data.message, "success");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        createToast(error.response.data.message, "error");
      }
      setIsSubmitted(true);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-4">
        <h1 className="text-3xl text-green-500 pt-8 font-bold text-center mb-4">
          Forgot Password
        </h1>
        {!isSubmitted ? (
          <form onSubmit={submitLink}>
            <p className="text-gray-400 text-lg font-medium mb-6 text-center">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <Input
              icon={Mail}
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(
                  validateCredentails(undefined, e.target.value, undefined)
                );
              }}
              error={error.email}
              placeholder="Email Address"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`main-btn mt-6 ${
                isLoading && "cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin mx-auto" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-gray-400 mb-6">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          to={"/login"}
          className="text-green-400 font-medium text-lg hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2 " /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgetPasswordPage;
