import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const NUM_PARTICLES = 80;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      radius: number;
      life?: number;
      maxLife?: number;

      constructor(x?: number, y?: number, splatter = false) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        if (splatter) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2 + 1;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.alpha = 255;
          this.radius = Math.random() * 2 + 1;
          this.maxLife = Math.random() * 100 + 50;
          this.life = this.maxLife;
        } else {
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.alpha = Math.random() * 150 + 50;
          this.radius = Math.random() * 1.5 + 0.5;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.life !== undefined) {
           this.life -= 1;
           this.alpha = (this.life / this.maxLife!) * 255;
        } else {
           if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
           if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const rgb = document.documentElement.classList.contains('dark') ? '255, 255, 255' : '10, 10, 10';
        ctx.fillStyle = `rgba(${rgb}, ${this.alpha / 255})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
    }

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
       mouseX = e.clientX;
       mouseY = e.clientY;
       isMoving = true;
       clearTimeout(moveTimeout);
       moveTimeout = setTimeout(() => { isMoving = false; }, 100);

       if (Math.random() > 0.6) {
           particles.push(new Particle(mouseX, mouseY, true));
       }
    };

    const handleClick = (e: MouseEvent) => {
      const numSplatter = Math.floor(Math.random() * 8) + 5;
      for (let i = 0; i < numSplatter; i++) {
        particles.push(new Particle(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        
        // Remove dead particles
        if (p.life !== undefined && p.life <= 0) {
           particles.splice(i, 1);
           continue;
        }
        
        // Connections
        if (p.life === undefined) {
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                if (p2.life !== undefined) continue;

                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = dx * dx + dy * dy;
                
                if (dist < 10000) { // 100^2
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = (1 - Math.sqrt(dist) / 100) * 0.3;
                    const rgb = document.documentElement.classList.contains('dark') ? '255, 255, 255' : '10, 10, 10';
                    ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:mix-blend-screen mix-blend-multiply"
    />
  );
}
