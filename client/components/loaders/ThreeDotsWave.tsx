import { motion } from "framer-motion";

export default function ThreeDotsWave() {
  const dot = {
    initial: { y: 0, opacity: 0.7 },
    animate: (i: number) => ({
      y: [0, -6, 0],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
    }),
  } as const;

  return (
    <div className="flex items-center gap-2">
      {["bg-blue-500", "bg-green-500", "bg-yellow-400"].map((c, i) => (
        <motion.span
          key={i}
          className={`inline-block h-2.5 w-2.5 rounded-full ${c}`}
          variants={dot}
          custom={i}
          initial="initial"
          animate="animate"
          aria-hidden
        />
      ))}
    </div>
  );
}
