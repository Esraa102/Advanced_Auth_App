import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`rounded-full absolute 
    ${color} ${size} opacity-20 blur-xl`}
      style={{
        top,
        left,
      }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        delay,
        repeat: Infinity,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
