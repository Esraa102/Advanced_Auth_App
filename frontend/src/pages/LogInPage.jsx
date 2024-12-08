import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components";
import { useState } from "react";
import { validateCredentails } from "../utils/validation";
import createToast from "../utils/createToast";
import axios from "axios";
import { baseUrl } from "../constants";
import useAuthStore from "../store/authStore";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateCredentails(undefined, email, password);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // send user credentails
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${baseUrl}/auth/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        setIsLoading(false);
        setUser(response.data.user);
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        createToast(error.response.data.message, "error");
      }
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
      <h1 className="text-3xl text-green-500 pt-8 pb-2 font-bold text-center mb-4">
        Welcome Back
      </h1>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-5">
        <Input
          icon={Mail}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors(validateCredentails(undefined, e.target.value, password));
          }}
          type="text"
          name="email"
          placeholder="Email Adress"
          error={errors.email}
        />
        <Input
          icon={Lock}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(validateCredentails(undefined, email, e.target.value));
          }}
          isPassword={true}
          name="password"
          placeholder="•••••••••••••"
          error={errors.password}
        />
        <Link
          to={"/forget-password"}
          className="text-green-500 font-medium hover:underline"
        >
          Forgot Password?
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className={`main-btn ${isLoading && "cursor-not-allowed opacity-50"}`}
        >
          {isLoading ? <Loader className="animate-spin mx-auto" /> : "Log In"}
        </button>
      </form>
      <div className="bg-gray-800 font-medium text-center text-gray-500 px-4 py-2">
        Don&apos;t have an account?
        <Link to={"/sign-up"} className="text-green-500 hover:underline">
          {" "}
          Sign up
        </Link>
      </div>
    </motion.div>
  );
};

export default LogInPage;
