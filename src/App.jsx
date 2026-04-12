import { useEffect, useMemo, useRef, useState } from 'react';

const pages = [
  {
    title: 'Happy Birthday Sayang ❤️',
    media: [
      { type: 'image', src: '/media/Pic1.jpeg', alt: 'Birthday Photo 1' },
      { type: 'image', src: '/media/Pic2.jpg', alt: 'Birthday Photo 2' },
    ],
    caption: 'Chapter 1',
    hint: 'Tap anywhere to continue',
  },
  {
    title: 'As long as you’re smiling, I’m happy. Stay happy, my love.',
    media: [
      { type: 'image', src: '/media/Pic3.jpg', alt: 'Birthday Photo 3' },
      { type: 'image', src: '/media/Pic4.jpg', alt: 'Birthday Photo 4' },
    ],
    caption: 'Chapter 2',
    hint: 'Tap anywhere to continue',
  },
  {
    title: 'You are my favorite story.',
    media: [
      { type: 'video', src: '/media/Vid1.mp4', alt: 'Birthday Video 1' },
      { type: 'video', src: '/media/Vid2.mp4', alt: 'Birthday Video 2' },
    ],
    caption: 'Chapter 3',
    hint: 'Tap anywhere for the surprise',
  },
];

function HeartIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);
  const [count, setCount] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const heartCenterX = canvas.width / 2;
      const heartCenterY = canvas.height / 2 - 80;

      ctx.fillStyle = '#ff4d97';
      for (let i = 0; i < 360; i++) {
        const k = (i * Math.PI) / 180;
        const x = 15 * Math.pow(Math.sin(k), 3) * 20 + heartCenterX;
        const y = -(12 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k)) * 20 + heartCenterY;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.fillStyle = 'rgba(255,77,151,0.18)';
      ctx.filter = 'blur(28px)';
      ctx.beginPath();
      ctx.arc(heartCenterX, heartCenterY, 250, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (count < 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="hero-screen">
      <canvas ref={canvasRef} className="heart-canvas" />
      <div className="countdown">{count >= 0 ? count : ''}</div>
      <div className="hero-text">Happy Birthday</div>
      <div className="subtext">Your surprise is on the way...</div>
    </div>
  );
}

function GiftCard({ onFinish }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const page = pages[pageIndex];

  function handleNext() {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (pageIndex === pages.length - 1) {
        onFinish();
      } else {
        setPageIndex(pageIndex + 1);
      }
      setIsAnimating(false);
    }, 450);
  }

  return (
    <div className="gift-card-screen" onClick={handleNext}>
      <div className={`gift-card ${isAnimating ? 'flipping' : ''}`}>
        <div className="card-header">{page.title}</div>
        <div className="media-grid">
          {page.media.map((item, index) => (
            <div key={index} className="media-card">
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} />
              ) : (
                <video src={item.src} autoPlay loop muted playsInline />
              )}
            </div>
          ))}
        </div>
        <div className="card-footer">
          <span>{page.caption}</span>
          <span>{page.hint}</span>
        </div>
      </div>
    </div>
  );
}

function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle(x, y, hue) {
      const speed = Math.random() * 4 + 2;
      const angle = Math.random() * Math.PI * 2;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        hue,
      };
    }

    function createFirework() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
      const hue = Math.random() * 360;
      for (let i = 0; i < 28; i += 1) {
        particles.push(createParticle(x, y, hue));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(4, 8, 26, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.alpha > 0.02);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      });
    }

    function loop() {
      if (Math.random() < 0.09) createFirework();
      draw();
      animationFrame = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fireworks-screen">
      <canvas ref={canvasRef} className="fireworks-canvas" />
      <div className="final-message">
        <h1>Happy Birthday!</h1>
        <p>The love story continues.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState('intro');

  const content = useMemo(() => {
    if (stage === 'intro') return <HeartIntro onComplete={() => setStage('card')} />;
    if (stage === 'card') return <GiftCard onFinish={() => setStage('finale')} />;
    return <Fireworks />;
  }, [stage]);

  return <div className="app-shell">{content}</div>;
}
