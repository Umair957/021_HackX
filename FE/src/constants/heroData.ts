// @/constants/heroData.ts

export const resumeLetters = ["R", "E", "S", "U", "M", "E"];

export const heroAnimations = {
  badge: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  heading: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.1 },
  },
  subheading: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 },
  },
  cta: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.3 },
  },
  illustration: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, delay: 0.4 },
  },
};

export const floatingAnimations = {
  document: {
    animate: {
      y: [0, -10, 0],
      rotate: [-12, -10, -12],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    } as const, // <--- "as const" fixes the type error
  },
  paperPlane: {
    initial: { x: -100, y: 50, opacity: 0 },
    animate: {
      x: [null, 100, 200], // Moves across
      y: [null, -50, -100], // Moves up
      opacity: [0, 1, 0], // Fades in then out
    },
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    } as const,
  },
  analysisCard: {
    animate: {
      y: [0, 10, 0],
      rotate: [12, 14, 12],
    },
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    } as const,
  },
};