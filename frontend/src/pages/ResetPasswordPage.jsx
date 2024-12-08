import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "../components";
import { Loader, Lock, LockKeyhole } from "lucide-react";
import { validateResetPassword } from "../utils/validation";
import createToast from "../utils/createToast";
import axios from "axios";
import { baseUrl } from "../constants";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showResed, setShowResed] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateResetPassword(password, confirm);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // send new password
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/auth/reset-password/${token}`,
          { newPass: password }
        );
        setIsLoading(false);
        createToast(response.data.message, "success");
        navigate("/sign-in");
      } catch (error) {
        setIsLoading(false);
        createToast(error.response.data.message, "error");
        if (error.response.status === 400) {
          setShowResed(true);
        }
        console.log(error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      {!showResed ? (
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Reset Password
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              icon={Lock}
              isPassword={true}
              name="password"
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(validateResetPassword(e.target.value, confirm));
              }}
              placeholder="Enter your new password"
            />
            <Input
              icon={LockKeyhole}
              isPassword={true}
              name="confirm"
              error={errors.confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors(validateResetPassword(password, e.target.value));
              }}
              placeholder="Enter password again"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`main-btn ${
                isLoading && "cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? <Loader className="mx-auto" /> : "Reset Password"}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 py-8">
          <h1 className="text-2xl pt-4 capitalize font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Reset link is invalid or expired
          </h1>
          <Link
            className="main-btn w-full block text-center"
            to={"/forget-password"}
          >
            Send link again
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ResetPasswordPage;
