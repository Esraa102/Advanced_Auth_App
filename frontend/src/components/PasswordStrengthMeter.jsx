import { Check, X } from "lucide-react";

const PasswordValidation = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  return (
    <div>
      {criteria.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-1 ${
            item.met ? "text-green-500" : "text-gray-500"
          } font-medium`}
        >
          {item.met ? <Check size={20} /> : <X size={18} />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
const PasswordStrengthMeter = ({ password, setStrength }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    setStrength(strength);
    return strength;
  };
  const strength = getStrength(password);
  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };
  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">
          Password Strength
        </span>
        <span className={`text-sm text-gray-500 font-medium`}>
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="w-full mt-2 flex items-center gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={`flex-1 h-1 rounded-md  ${
              index < strength ? getColor(strength) : "bg-gray-500"
            }`}
          />
        ))}
      </div>
      <div className="mt-3">
        <PasswordValidation password={password} />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
