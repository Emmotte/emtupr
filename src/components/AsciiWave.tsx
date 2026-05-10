import React, { useRef, useEffect } from "react";

interface AsciiWaveProps {
    className?: string;
    color?: string; // Hex or generic color
    speed?: number;
}

const AsciiWave: React.FC<AsciiWaveProps> = ({
    className,
    color = "#444444",  // Neutral minimal dark grey/white color
    speed = 1
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            if (!container || !canvas) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            ctx.scale(dpr, dpr);
        };

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();

        // ASCII Characters sorted by density (light to dark)
        const chars = " .:+x*#".split("");
        const fontSize = 12;
        const columnWidth = 10;

        const draw = () => {
            // Clean clear for crisp pixels.
            const width = container.clientWidth;
            const height = container.clientHeight;

            ctx.clearRect(0, 0, width, height);

            ctx.font = `${fontSize}px "Recursive Variable", monospace`;
            ctx.fillStyle = color;

            const columns = Math.ceil(width / columnWidth);
            const rows = Math.ceil(height / fontSize);

            // "Fire" Logic: Pure Vertical Ascent
            for (let x = 0; x < columns; x++) {
                for (let y = 0; y < rows; y++) {
                    const flowShiftX = time * 0.001 * speed;
                    const flowShiftY = time * 0.0015 * speed;

                    // Organic 2D wave pattern
                    const waveX = Math.sin((x * 0.1) + flowShiftX) * 0.5;
                    const waveY = Math.cos((y * 0.1) - flowShiftY) * 0.5;
                    const breath = Math.sin(time * 0.002 * speed) * 0.2;
                    
                    const charNoise = waveX + waveY + breath;

                    // Compute distance from center to add some vignette/focus
                    const centerX = columns / 2;
                    const centerY = rows / 2;
                    const distFromCenter = Math.sqrt(Math.pow((x - centerX) / columns, 2) + Math.pow((y - centerY) / rows, 2));

                    // Normalize noise roughly to 0-1
                    let normalizedNoise = (charNoise + 1) / 2;

                    // Fade out slightly towards edges
                    const fade = Math.max(0.1, 1 - (distFromCenter * 1.5));

                    // Only draw chars where noise is somewhat high, generating a wave map
                    if (normalizedNoise < 0.3) continue;

                    const charIndex = Math.floor(normalizedNoise * chars.length);
                    const char = chars[Math.min(charIndex, chars.length - 1)];

                    const posX = x * columnWidth;
                    const posY = y * fontSize;

                    if (Math.random() > 0.98) continue; // slight glitch

                    ctx.globalAlpha = fade * ((normalizedNoise - 0.3) / 0.7);
                    ctx.fillText(char, posX, posY);
                }
            }

            ctx.globalAlpha = 1.0;
            time += 16;
            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationId);
        };
    }, [color, speed]);

    return (
        <div ref={containerRef} className={`w-full h-full overflow-hidden ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default AsciiWave;
