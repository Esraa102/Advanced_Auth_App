import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input, PasswordStrengthMeter } from "../components";
import { User, Mail, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { validateCredentails } from "../utils/validation";
import createToast from "../utils/createToast";
import axios from "axios";
import { baseUrl } from "../constants";
import useAuthStore from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateCredentails(name, email, password);
    if (Object.keys(newErrors).length === 0 && strength > 2) {
      setErrors({});
      // send user credentails
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/auth/signup`,
          {
            name,
            email,
            password,
          },
          { withCredentials: true }
        );
        setIsLoading(true);
        setUser(response.data.user);
        createToast(response.data.message, "success");
        navigate("/verify-email");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        createToast(error.response.data.message, "error");
      }
    } else {
      setErrors(newErrors);
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
        Create New Account
      </h1>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        <Input
          icon={User}
          onChange={(e) => {
            setName(e.target.value);
            setErrors(validateCredentails(e.target.value, email, password));
          }}
          type="text"
          name="name"
          placeholder="Full Name"
          error={errors.name}
        />
        <Input
          icon={Mail}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors(validateCredentails(name, e.target.value, password));
          }}
          type="text"
          name="email"
          placeholder="Email Address"
          error={errors.email}
        />
        <Input
          icon={Lock}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(validateCredentails(name, email, e.target.value));
          }}
          name="password"
          placeholder="•••••••••••••"
          isPassword={true}
          error={errors.password}
        />
        <PasswordStrengthMeter password={password} setStrength={setStrength} />
        <button
          type="submit"
          disabled={isLoading}
          className={`main-btn ${isLoading && "cursor-not-allowed opacity-50"}`}
        >
          {isLoading ? <Loader className="animate-spin mx-auto" /> : "Sign Up"}
        </button>
      </form>
      <div className="bg-gray-800 font-medium text-center text-gray-500 px-4 py-2">
        Already have an account?
        <Link to={"/sign-in"} className="text-green-500 hover:underline">
          {" "}
          Log in
        </Link>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
