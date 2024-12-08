import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import formatDate from "../utils/formateDate";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../constants";
import createToast from "../utils/createToast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/auth/logout`, {
        withCredentials: true,
      });
      setIsLoading(false);
      setUser(null);
      createToast(response.data.message, "success");
      navigate("/sign-in");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      createToast(error.response.data.message, "error");
    }
  };
  return (
    <motion.div
      className="max-w-md my-4 w-full bg-gray-900  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
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
      <div className="p-8">
        <h1 className="text-3xl text-green-500 pt-2 pb-2 font-bold text-center mb-4">
          Dashboard
        </h1>
        <div className="bg-gray-800 px-4 py-6 border border-gray-500 rounded-md">
          <h2 className="text-2xl mb-4 font-bold text-green-500">
            Profile Information
          </h2>
          <p className="text-lg  text-gray-400 font-medium">
            Name: {user.name}
          </p>
          <p className="text-lg  text-gray-400 font-medium">
            Email: {user.email}
          </p>
        </div>
        <div className="bg-gray-800 my-6 px-4 py-6 border border-gray-500 rounded-md">
          <h2 className="text-2xl mb-4 font-bold text-green-500">
            Account activity
          </h2>
          <p className=" text-[16px] font-medium text-gray-500">
            Joined:{" "}
            <span className="text-green-400">{formatDate(user.createdAt)}</span>
          </p>
          <p className="text-[16px] font-medium text-gray-500">
            Last Login:{" "}
            <span className="text-green-400">{formatDate(user.lastLogin)}</span>
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => logout()}
          className={`main-btn ${isLoading && "cursor-not-allowed opacity-50"}`}
        >
          {isLoading ? <Loader className="mx-auto" /> : "Log Out"}
        </button>
      </div>
    </motion.div>
  );
};

export default Home;
