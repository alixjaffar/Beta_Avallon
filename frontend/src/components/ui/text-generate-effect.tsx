"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export const TextGenerateEffect = ({
  words,
  className = "",
}: {
  words: string;
  className?: string;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    words.slice(0, latest)
  );

  useEffect(() => {
    // Start with full text visible, then animate
    const controls = animate(count, words.length, {
      type: "tween",
      duration: 1.0, // Faster animation
      ease: "easeInOut",
    });
    return controls.stop;
  }, [words]);

  return (
    <motion.span className={className}>
      {displayText}
    </motion.span>
  );
};