export const featureAnimations = {
  badge: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 }
  },
  heading: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay: 0.1 }
  },
  centerPaper: {
    initial: { scale: 0.8, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 }
  },
  scanningBeam: {
    animate: { top: ["-20%", "120%"] },
    transition: { duration: 2, repeat: Infinity, ease: "linear" as const }
  }
} as const;

export const svgPaths = [
  {
    id: "path1",
    d: "M 150 200 L 340 200",
    delay: 0
  },
  {
    id: "path2",
    d: "M 460 200 C 520 200, 520 100, 620 100",
    delay: 0.2
  },
  {
    id: "path3",
    d: "M 460 200 L 620 200",
    delay: 0.4
  },
  {
    id: "path4",
    d: "M 460 200 C 520 200, 520 300, 620 300",
    delay: 0.6
  }
] as const;

export interface FeatureNode {
  position: string;
  animation: {
    initial: { x: number; opacity: number };
    whileInView: { x: number; opacity: number };
    transition: { delay: number };
  };
  data: {
    color: "emerald" | "blue" | "purple";
    title: string;
    value: string;
  };
}

export const featureNodes: FeatureNode[] = [
  {
    position: "right-[5%] md:right-[10%] top-[15%] md:top-[20%]",
    animation: {
      initial: { x: 20, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { delay: 0.4 }
    },
    data: {
      color: "emerald",
      title: "ATS Score",
      value: "98/100"
    }
  },
  {
    position: "right-[5%] md:right-[10%] top-1/2 -translate-y-1/2",
    animation: {
      initial: { x: 20, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { delay: 0.5 }
    },
    data: {
      color: "blue",
      title: "Keywords",
      value: "Optimized"
    }
  },
  {
    position: "right-[5%] md:right-[10%] bottom-[15%] md:bottom-[20%]",
    animation: {
      initial: { x: 20, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { delay: 0.6 }
    },
    data: {
      color: "purple",
      title: "Grammar",
      value: "No Errors"
    }
  }
] as const;
