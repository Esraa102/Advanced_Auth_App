import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ icon: Icon, isPassword, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <div className="relative">
        <Icon
          className="absolute top-1/2 -translate-y-1/2 left-2"
          size={28}
          color={props.error ? "#f00" : "#22c55e"}
        />
        <input
          type={isPassword && (isVisible ? "text" : "password")}
          className={`input-field ${
            props.error ? "border-[#f00]" : "border-gray-600"
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-1/2 -translate-y-1/2 right-2"
          >
            {isVisible ? <Eye color={"#22c55e"} /> : <EyeOff color="#4b5563" />}
          </button>
        )}
      </div>
      {props.error && <p className="error-message">{props.error}</p>}
    </div>
  );
};

export default Input;
