import { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
  [key: string]: any;
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  animateOn = 'view',
  ...props
}: DecryptedTextProps) {
  const [renderedText, setRenderedText] = useState(
    text.split('').map(() => ({
      char: characters[Math.floor(Math.random() * characters.length)],
      isRevealed: false,
    }))
  );
  const [isHovering, setIsHovering] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shouldAnimate =
      animateOn === 'view' ? hasScrolledIntoView : isHovering;

    if (!shouldAnimate) return;

    let iterations = 0;
    const interval = setInterval(() => {
      setRenderedText((prev) =>
        prev.map((item, i) => {
          if (item.isRevealed) return item;

          if (sequential) {
            const shouldReveal = iterations > i * (maxIterations / text.length);
            if (shouldReveal) {
              return { char: text[i], isRevealed: true };
            }
          } else {
            if (iterations >= maxIterations) {
              return { char: text[i], isRevealed: true };
            }
          }

          const nextChar = useOriginalCharsOnly
            ? text[Math.floor(Math.random() * text.length)]
            : characters[Math.floor(Math.random() * characters.length)];

          return { char: nextChar, isRevealed: false };
        })
      );

      iterations++;
      if (iterations >= maxIterations + text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [
    animateOn,
    hasScrolledIntoView,
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    useOriginalCharsOnly,
    characters,
  ]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
      onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
      className={`inline-block ${parentClassName}`}
      {...props}
    >
      {renderedText.map((item, i) => (
        <span key={i} className={item.isRevealed ? className : 'opacity-70'}>
          {item.char}
        </span>
      ))}
    </span>
  );
}
