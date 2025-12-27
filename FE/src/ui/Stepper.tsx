import React, { useState, Children, useRef, useLayoutEffect, useEffect, useCallback, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Changed to framer-motion or motion/react based on your setup

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  // ✅ IMPORTANT: This prop is required for validation
  onBeforeNext?: (currentStep: number) => boolean; 
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  onBeforeNext, // ✅ Destructure this
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  className,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  
  const isLastStep = currentStep === totalSteps;
  const isCompleted = currentStep > totalSteps; 

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  // ✅ FIX: BLOCK NAVIGATION IF VALIDATION FAILS
  const handleNext = () => {
    // 1. Run Validation Logic
    if (onBeforeNext) {
      const canProceed = onBeforeNext(currentStep);
      // 2. If validation returns false, STOP HERE. Do not update step.
      if (canProceed === false) {
        return; 
      }
    }

    // 3. If valid, proceed
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  // ✅ FIX: BLOCK COMPLETION IF VALIDATION FAILS
  const handleComplete = () => {
    if (onBeforeNext) {
      const canProceed = onBeforeNext(currentStep);
      if (canProceed === false) {
        return;
      }
    }
    onFinalStepCompleted();
  };

  // ✅ FIX: BLOCK CLICKING TOP BAR DOTS IF CURRENT STEP INVALID
  const handleStepIndicatorClick = (clickedStep: number) => {
    if (clickedStep === currentStep) return;

    // If trying to move forward (e.g. clicking Step 3 while on Step 1)
    if (clickedStep > currentStep) {
      if (onBeforeNext) {
        // Validate the CURRENT step before allowing the jump
        const canProceed = onBeforeNext(currentStep);
        if (canProceed === false) return;
      }
    }

    setDirection(clickedStep > currentStep ? 1 : -1);
    updateStep(clickedStep);
  };

  return (
    <div className={cn("flex flex-col", className)} {...rest}>
      <div className={cn("flex flex-col", stepCircleContainerClassName)}>
        <div className={cn("flex items-center", stepContainerClassName)}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: handleStepIndicatorClick // Use our safe handler
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={handleStepIndicatorClick} // Use our safe handler
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={contentClassName}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={cn("w-full", footerClassName)}>
            <div className={cn("flex items-center", currentStep !== 1 ? 'justify-between' : 'justify-end')}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={cn(
                    "transition-colors",
                    currentStep === 1 ? 'pointer-events-none opacity-50' : ''
                  )}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                // ✅ Connect the button to our fixed handler
                onClick={isLastStep ? handleComplete : handleNext}
                className="transition-transform active:scale-95"
                {...nextButtonProps}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ... (Sub-components: StepContentWrapper, etc. remain the same as previous) ...
// Ensure you have StepContentWrapper, SlideTransition, Step, StepIndicator, etc. below this line.
// If you need them reposted, let me know, but the critical fix is in `handleNext` above.

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className = '' }: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);
  const handleHeightChange = useCallback((height: number) => setParentHeight(height), []);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
      className="w-full"
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition 
            key={currentStep} 
            direction={direction} 
            onHeightReady={handleHeightChange}
            className={className}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
  className?: string;
}

function SlideTransition({ children, direction, onHeightReady, className }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) onHeightReady(entry.target.offsetHeight);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%' }}
      className={className} 
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? '50%' : '-50%', opacity: 0 })
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };
  return (
    <div onClick={handleClick} className="relative z-10 cursor-pointer outline-none">
      <motion.div
        animate={status}
        variants={{
          inactive: { backgroundColor: '#e2e8f0', color: '#94a3b8' },
          active: { backgroundColor: '#2563eb', color: '#ffffff' },
          complete: { backgroundColor: '#2563eb', color: '#ffffff' }
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm"
      >
        {status === 'complete' ? <CheckIcon className="h-4 w-4" /> : step}
      </motion.div>
    </div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
      <motion.div
        className="absolute left-0 top-0 h-full bg-blue-600"
        initial={{ width: 0 }}
        animate={{ width: isComplete ? '100%' : 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}