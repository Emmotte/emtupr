import { useState, useEffect, useRef } from 'react';

interface TextTypeProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export default function TextType({
  text,
  speed = 40,
  delay = 500,
  className = '',
  cursor = true,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || index >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[index]);
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed, isStarted]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && (
        <span className={`inline-block w-[1ch] h-[1.2em] bg-current align-middle ml-1 ${index >= text.length ? 'animate-pulse' : ''}`} />
      )}
    </span>
  );
}
