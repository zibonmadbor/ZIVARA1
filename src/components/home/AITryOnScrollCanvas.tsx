import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Layers, CheckCircle2, ChevronDown } from "lucide-react";

export default function AITryOnScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const requestRef = useRef<number | null>(null);

  // Multi-extension frame preloader (.jpeg, .jpg, .png, .webp)
  useEffect(() => {
    let isMounted = true;
    const MAX_FRAMES = 250;
    const extensions = [".jpeg", ".jpg", ".png", ".webp"];

    const loadSingleFrame = (index: number): Promise<{ index: number; img: HTMLImageElement } | null> => {
      const frameNum = String(index).padStart(3, "0");
      return new Promise((resolve) => {
        let extIndex = 0;

        const attemptNext = () => {
          if (extIndex >= extensions.length) {
            resolve(null);
            return;
          }

          const img = new Image();
          const ext = extensions[extIndex];
          img.src = `/frames/tryon/ezgif-frame-${frameNum}${ext}`;

          img.onload = () => resolve({ index, img });
          img.onerror = () => {
            extIndex++;
            attemptNext();
          };
        };

        attemptNext();
      });
    };

    const loadAllFrames = async () => {
      const promises: Promise<{ index: number; img: HTMLImageElement } | null>[] = [];
      for (let i = 0; i <= MAX_FRAMES; i++) {
        promises.push(
          loadSingleFrame(i).then((res) => {
            if (res && isMounted) {
              setLoadedCount((prev) => prev + 1);
            }
            return res;
          })
        );
      }

      const results = await Promise.all(promises);
      if (!isMounted) return;

      const validFrames = results
        .filter((item): item is { index: number; img: HTMLImageElement } => item !== null)
        .sort((a, b) => a.index - b.index)
        .map((item) => item.img);

      setImages(validFrames);
      setIsLoading(false);
    };

    loadAllFrames();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalFrames = images.length || 1;

  // Render function for canvas with Navbar clearance offset
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index] || images[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Navbar clearance calculation (80px top navbar padding)
    const navbarOffset = 70;
    const usableHeight = Math.max(100, rect.height - navbarOffset);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = rect.width / usableHeight;

    let drawWidth = rect.width;
    let drawHeight = usableHeight;
    let offsetX = 0;
    let offsetY = navbarOffset;

    if (containerRatio > imgRatio) {
      drawHeight = rect.width / imgRatio;
      offsetY = navbarOffset + (usableHeight - drawHeight) / 2;
    } else {
      drawWidth = usableHeight * imgRatio;
      offsetX = (rect.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  // Handle Scroll scrubbing
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const handleScroll = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScrollableHeight = rect.height - windowHeight;

        if (totalScrollableHeight <= 0) return;

        const currentScroll = -rect.top;
        const progress = Math.min(1, Math.max(0, currentScroll / totalScrollableHeight));

        const frameIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(progress * (totalFrames - 1)))
        );

        setCurrentFrameIndex(frameIndex);
        renderFrame(frameIndex);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoading, images, totalFrames]);

  // Initial draw once loaded
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      renderFrame(0);
    }
  }, [isLoading, images]);

  // Metrics based on scroll progress
  const progressPercent = Math.round((currentFrameIndex / Math.max(1, totalFrames - 1)) * 100);
  const heroOpacity = Math.max(0, 1 - progressPercent / 12);

  const getHUDPhase = () => {
    if (progressPercent < 25) {
      return {
        step: "STEP 01",
        title: "3D Body Biometric Scanning",
        desc: "Mapping 33 skeleton keypoints and surface depth vectors",
        icon: <Cpu className="w-5 h-5 text-primary animate-pulse" />,
        stat: `${Math.min(99, Math.round((progressPercent / 25) * 99))}% MAPPED`,
      };
    } else if (progressPercent < 55) {
      return {
        step: "STEP 02",
        title: "Polygon Fabric Mesh Parsing",
        desc: "Deconstructing 12,400 digital 3D garment mesh triangles",
        icon: <Layers className="w-5 h-5 text-primary animate-pulse" />,
        stat: "12,400 MESH NODES",
      };
    } else if (progressPercent < 85) {
      return {
        step: "STEP 03",
        title: "Cloth Tension & Drape Physics",
        desc: "Calculating real-time weight, elasticity & body fold alignment",
        icon: <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />,
        stat: "TENSION: 0.98 N/m²",
      };
    } else {
      return {
        step: "STEP 04",
        title: "Neural Raytracing Complete",
        desc: "Seamless lighting, shadow & skin blending applied",
        icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
        stat: "100% PERFECT FIT",
      };
    }
  };

  const hud = getHUDPhase();

  return (
    <section
      id="ai-tryon-hero-canvas"
      ref={containerRef}
      className="relative w-full bg-black text-foreground"
      style={{ height: "380vh" }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center">
        
        {/* Loading Overlay (Clean Luxury Preloader) */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              ZIVARA 3D FIT
            </h3>
            <p className="text-sm text-muted-foreground mb-5 font-light">
              Preparing Interactive Fitting Experience...
            </p>
            <div className="w-64 bg-secondary rounded-full h-1.5 overflow-hidden border border-border">
              <div
                className="bg-primary h-full transition-all duration-150"
                style={{ width: `${Math.min(100, Math.round((loadedCount / 242) * 100))}%` }}
              />
            </div>
            <span className="text-xs font-mono text-primary font-semibold mt-3 tracking-widest">
              {Math.min(100, Math.round((loadedCount / 242) * 100))}%
            </span>
          </div>
        )}

        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Subtle Top & Bottom Gradients for seamless Navbar blend */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

        {/* --- HERO BANNER OVERLAY (Visible at top 0-15% scroll) --- */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pt-16 text-center pointer-events-none transition-opacity duration-300"
          style={{ opacity: heroOpacity }}
        >
          <div className="pointer-events-auto max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/70 border border-primary/50 rounded-full mb-6 backdrop-blur-md shadow-gold">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                LUXURY FASHION EXPERIENCE
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-tight mb-8 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
              WEAR THE <span className="text-primary font-extrabold drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">FUTURE</span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/ai-tryon"
                className="btn-ai inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-full shadow-gold hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Virtual Try-On</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold border border-primary/40 bg-black/80 hover:bg-secondary text-white rounded-full backdrop-blur-md shadow-lg transition-all"
              >
                <span>Shop Collection</span>
              </Link>
            </div>

            {/* Scroll Down Prompter */}
            <div className="mt-8 flex flex-col items-center gap-2 animate-bounce opacity-90">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                Scroll to Experience Fit
              </span>
              <ChevronDown className="w-5 h-5 text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,1)]" />
            </div>
          </div>
        </div>

        {/* --- INTERACTIVE HUD & PROGRESS (Visible when scrolling past Hero) --- */}
        {heroOpacity < 0.8 && (
          <>
            {/* Scroll Progress Bar (Right side) */}
            <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 pt-12 z-20 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-primary font-bold">{progressPercent}%</span>
              <div className="w-1.5 h-36 bg-muted/40 rounded-full overflow-hidden border border-border">
                <div
                  className="w-full bg-primary rounded-full transition-all duration-75"
                  style={{ height: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground uppercase rotate-90 mt-4 tracking-wider">
                SCROLL
              </span>
            </div>

            {/* Dynamic HUD Calculation Card (Bottom Left) */}
            <div className="absolute bottom-10 left-6 md:left-12 z-20 max-w-sm sm:max-w-md w-full">
              <motion.div
                key={hud.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-card/90 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl relative overflow-hidden"
              >
                {/* Glowing accent border */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {hud.icon}
                    <span className="text-xs font-mono font-bold text-primary tracking-wider">
                      {hud.step}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                    {hud.stat}
                  </span>
                </div>

                <h4 className="text-base font-display font-bold text-foreground mb-1">
                  {hud.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hud.desc}
                </p>
              </motion.div>
            </div>

            {/* Call to Action Button (Bottom Right) */}
            <div className="absolute bottom-10 right-6 md:right-12 z-20 hidden md:block">
              <Link
                to="/ai-tryon"
                className="btn-ai inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full shadow-gold hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Try Your Own Photo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
