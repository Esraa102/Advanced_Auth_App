import toast from "react-hot-toast";

const createToast = (message, type) => {
  return type === "error" ? toast.error(message) : toast.success(message);
};

export default createToast;
