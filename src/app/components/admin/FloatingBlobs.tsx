import { motion } from "motion/react";

export function FloatingBlobs() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#BDE0FE]/20 rounded-full blur-3xl pointer-events-none"
      />
    </>
  );
}
