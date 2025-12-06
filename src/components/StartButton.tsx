import { hapticFeedback } from '@tma.js/sdk';
import './StartButton.css'; // We'll create this stylesheet next
import React from "react";

export const ButtonIos = (): JSX.Element => {
    return (
        <button className="button-ios">
            <div className="label">Start</div>
        </button>
    );
};


interface StartButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function StartButton({ onClick, disabled, children = 'Start' }: StartButtonProps) {
  const handleClick = () => {
  // 1. Trigger haptic feedback on every press
  if (hapticFeedback) {
    hapticFeedback.impactOccurred('medium');
  }
  
  // 2. Call the passed onClick function, if it exists
  if (onClick && !disabled) {
    onClick();
  }
};

  return (
    <button
      className="button-ios"
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}