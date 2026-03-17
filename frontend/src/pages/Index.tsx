import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, MousePointer, Sparkles, Home, Layers, FileText, Rocket } from "lucide-react";
import { GradientDots } from "@/components/ui/gradient-dots";
import { NavBar } from "@/components/ui/tubelight-navbar";

// Avallon color palette - Gray & Black
const colors = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#a1a1aa",
  300: "#71717a",
  400: "#52525b",
  500: "#3f3f46",
  600: "#27272a",
  700: "#18181b",
  800: "#0f0f10",
  900: "#09090b",
};

const Index = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const gradientRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'Features', icon: Layers, onClick: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Docs', icon: FileText, onClick: () => window.open('https://docs.avallon.ca', '_blank') },
    { name: 'Start', icon: Rocket, onClick: () => navigate('/auth') },
  ];

  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });

    // Mouse gradient
    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + "px";
        gradient.style.top = e.clientY - 192 + "px";
        gradient.style.opacity = "1";
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = "0";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(161, 161, 170, 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });

    // Click ripple effect
    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      ripple.style.width = "4px";
      ripple.style.height = "4px";
      ripple.style.background = "rgba(161, 161, 170, 0.6)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "pulse-glow 1s ease-out forwards";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    navigate("/auth", { state: { generatePrompt: prompt } });
  };

  const handleStartBuilding = () => {
    navigate("/auth");
  };

  return (
    <div className="font-display bg-[#09090b] text-[#f4f4f5] overflow-x-hidden antialiased min-h-screen relative">
      {/* Gradient Dots Background */}
      <GradientDots 
        duration={25} 
        colorCycleDuration={8}
        dotSize={6}
        spacing={12}
        backgroundColor="#09090b"
        className="fixed inset-0 z-0 opacity-40"
      />

      {/* Tubelight Navigation */}
      <NavBar 
        items={navItems} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden z-10">
        {/* Top tagline */}
        <div className="text-center mb-12">
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] opacity-80"
            style={{ color: colors[200] }}
          >
            <span className="word" data-delay="0">Welcome</span>{" "}
            <span className="word" data-delay="150">to</span>{" "}
            <span className="word font-bold" data-delay="300">Avallon</span>{" "}
            <span className="word" data-delay="450">—</span>{" "}
            <span className="word" data-delay="600">New</span>{" "}
            <span className="word" data-delay="750">v2.0</span>{" "}
            <span className="word" data-delay="900">AI</span>{" "}
            <span className="word" data-delay="1050">Engine</span>{" "}
            <span className="word" data-delay="1200">is</span>{" "}
            <span className="word" data-delay="1350">live</span>
          </h2>
          <div
            className="mt-4 w-16 h-px mx-auto opacity-30"
            style={{ background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)` }}
          ></div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight tracking-tight mb-6" style={{ color: colors[50] }}>
            <span className="word" data-delay="1500">Build</span>{" "}
            <span className="word" data-delay="1650">your</span>{" "}
            <span className="word" data-delay="1800">website</span>{" "}
            <span className="word" data-delay="1950">with</span>{" "}
            <span className="word" data-delay="2100">AI</span>
            <br className="hidden md:block" />
            <span className="word font-medium" data-delay="2250" style={{ color: colors[100] }}>instantly.</span>
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto" style={{ color: colors[300] }}>
            <span className="word" data-delay="2400">No</span>{" "}
            <span className="word" data-delay="2500">code,</span>{" "}
            <span className="word" data-delay="2600">no</span>{" "}
            <span className="word" data-delay="2700">design</span>{" "}
            <span className="word" data-delay="2800">skills</span>{" "}
            <span className="word" data-delay="2900">needed.</span>{" "}
            <span className="word" data-delay="3000">Just</span>{" "}
            <span className="word" data-delay="3100">describe</span>{" "}
            <span className="word" data-delay="3200">your</span>{" "}
            <span className="word" data-delay="3300">vision,</span>{" "}
            <span className="word" data-delay="3400">and</span>{" "}
            <span className="word" data-delay="3500">Avallon</span>{" "}
            <span className="word" data-delay="3600">builds</span>{" "}
            <span className="word" data-delay="3700">it</span>{" "}
            <span className="word" data-delay="3800">in</span>{" "}
            <span className="word" data-delay="3900">seconds.</span>
          </p>
        </div>

        {/* Interactive Input Component */}
        <div 
          className="w-full max-w-2xl p-1 rounded-lg opacity-0 relative z-20"
          style={{ 
            background: `${colors[800]}90`,
            border: `1px solid ${colors[400]}30`,
            animation: "word-appear 1s ease-out forwards",
            animationDelay: "4s",
          }}
        >
          <div className="relative flex flex-col gap-2 p-3">
            <div className="flex items-start gap-3 p-2">
              <Sparkles className="w-5 h-5 mt-1 opacity-50" style={{ color: colors[200] }} />
              <textarea 
                className="w-full resize-none border-none bg-transparent p-0 text-base placeholder:opacity-50 focus:ring-0 min-h-[80px] focus:outline-none"
                style={{ color: colors[50] }}
                placeholder="Describe the website you want to build… (e.g., A minimalist portfolio for a landscape photographer in Portland)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between border-t pt-3 px-2" style={{ borderColor: `${colors[400]}20` }}>
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  className="p-2 rounded-lg transition-colors opacity-50 hover:opacity-100"
                  style={{ color: colors[200] }}
                  title="Voice Input"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button 
                  className="p-2 rounded-lg transition-colors opacity-50 hover:opacity-100"
                  style={{ color: colors[200] }}
                  title="Upload Image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  style={{ 
                    color: colors[900],
                    background: colors[100],
                  }}
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Website</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div 
          className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-mono uppercase tracking-wider opacity-0"
          style={{ 
            color: colors[300],
            animation: "word-appear 1s ease-out forwards",
            animationDelay: "4.3s",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Generates in ~30 seconds
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-y relative z-10" style={{ borderColor: `${colors[400]}15`, background: `${colors[900]}cc` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-px mx-auto mb-8 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)` }}></div>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4" style={{ color: colors[50] }}>
              Everything you need to go live fast
            </h2>
            <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: colors[300] }}>
              From idea to published site in minutes, with powerful editing tools under the hood.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="avallon-card p-8 rounded-lg group cursor-pointer">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                style={{ background: `${colors[400]}20` }}
              >
                <Zap className="w-6 h-6" style={{ color: colors[200] }} />
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: colors[50] }}>Instant Generation</h3>
              <p className="font-light leading-relaxed" style={{ color: colors[300] }}>
                Create a fully functional, responsive website in seconds. Our AI handles layout, copy, and images automatically.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="avallon-card p-8 rounded-lg group cursor-pointer">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                style={{ background: `${colors[400]}20` }}
              >
                <MousePointer className="w-6 h-6" style={{ color: colors[200] }} />
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: colors[50] }}>Visual Click-to-Edit</h3>
              <p className="font-light leading-relaxed" style={{ color: colors[300] }}>
                Don't like a headline? Just click on any section to edit text, swap images, and adjust layout instantly.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="avallon-card p-8 rounded-lg group cursor-pointer">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                style={{ background: `${colors[400]}20` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: colors[200] }} />
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: colors[50] }}>Gemini-Powered Editing</h3>
              <p className="font-light leading-relaxed" style={{ color: colors[300] }}>
                Built-in Gemini helps rewrite and refine content directly inside the editor for perfect tone and SEO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] mb-4 block" style={{ color: colors[200] }}>Workflow</span>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight" style={{ color: colors[50] }}>How Avallon works</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 z-0" style={{ background: `${colors[400]}20` }}></div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-light mb-6"
                  style={{ 
                    background: colors[800],
                    border: `2px solid ${colors[200]}`,
                    color: colors[200]
                  }}
                >
                  1
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors[50] }}>Describe your site</h3>
                <p className="text-sm max-w-xs font-light" style={{ color: colors[300] }}>
                  Tell our AI what you need in plain English. The more specific, the better.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-light mb-6"
                  style={{ 
                    background: colors[800],
                    border: `2px solid ${colors[400]}`,
                    color: colors[300]
                  }}
                >
                  2
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors[50] }}>Edit</h3>
                <p className="text-sm max-w-xs font-light" style={{ color: colors[300] }}>
                  Visually edit text and layout directly on your website with click-to-edit tools and built-in Gemini assistance.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-light mb-6"
                  style={{ 
                    background: colors[800],
                    border: `2px solid ${colors[400]}`,
                    color: colors[300]
                  }}
                >
                  3
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors[50] }}>Publish</h3>
                <p className="text-sm max-w-xs font-light" style={{ color: colors[300] }}>
                  Publish your site instantly once you're happy with the result.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 relative z-10" style={{ background: `${colors[900]}cc` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4" style={{ color: colors[50] }}>
                Built for every use case
              </h2>
              <p className="text-lg max-w-xl font-light" style={{ color: colors[300] }}>
                Whether you're a startup, creator, or small business, Avallon adapts to your needs.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3] relative avallon-card">
                <div 
                  className="absolute top-3 left-3 z-10 text-xs font-mono uppercase tracking-wider px-2 py-1 rounded"
                  style={{ background: `${colors[800]}cc`, color: colors[200] }}
                >
                  Local Business
                </div>
                <div 
                  className="h-full w-full flex flex-col p-4 group-hover:scale-105 transition-transform duration-500"
                  style={{ background: `linear-gradient(135deg, ${colors[800]}, ${colors[700]})` }}
                >
                  <div className="w-1/3 h-4 rounded mb-4" style={{ background: `${colors[400]}40` }}></div>
                  <div className="w-full h-32 rounded mb-4" style={{ background: `${colors[400]}30` }}></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 rounded" style={{ background: `${colors[400]}30` }}></div>
                    <div className="h-16 rounded" style={{ background: `${colors[400]}30` }}></div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium" style={{ color: colors[50] }}>Modern Coffee Shop</h3>
              <p className="text-sm font-light" style={{ color: colors[300] }}>Includes menu, hours, and location map.</p>
            </div>
            {/* Use Case 2 */}
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3] relative avallon-card">
                <div 
                  className="absolute top-3 left-3 z-10 text-xs font-mono uppercase tracking-wider px-2 py-1 rounded"
                  style={{ background: `${colors[800]}cc`, color: colors[200] }}
                >
                  Creator Portfolio
                </div>
                <div 
                  className="h-full w-full flex flex-col p-4 group-hover:scale-105 transition-transform duration-500"
                  style={{ background: `linear-gradient(135deg, ${colors[700]}, ${colors[800]})` }}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full" style={{ background: `${colors[400]}40` }}></div>
                    <div className="flex-1">
                      <div className="w-1/2 h-3 rounded mb-2" style={{ background: `${colors[400]}40` }}></div>
                      <div className="w-3/4 h-2 rounded" style={{ background: `${colors[400]}30` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <div className="rounded h-full" style={{ background: `${colors[400]}30` }}></div>
                    <div className="rounded h-full" style={{ background: `${colors[400]}30` }}></div>
                    <div className="rounded h-full" style={{ background: `${colors[400]}30` }}></div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium" style={{ color: colors[50] }}>Visual Designer</h3>
              <p className="text-sm font-light" style={{ color: colors[300] }}>Gallery grid, about section, and contact form.</p>
            </div>
            {/* Use Case 3 */}
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3] relative avallon-card">
                <div 
                  className="absolute top-3 left-3 z-10 text-xs font-mono uppercase tracking-wider px-2 py-1 rounded"
                  style={{ background: `${colors[800]}cc`, color: colors[200] }}
                >
                  Startup Landing
                </div>
                <div 
                  className="h-full w-full flex flex-col p-4 items-center justify-center text-center group-hover:scale-105 transition-transform duration-500"
                  style={{ background: `linear-gradient(135deg, ${colors[800]}, ${colors[700]})` }}
                >
                  <div className="w-2/3 h-4 rounded mb-2" style={{ background: `${colors[400]}40` }}></div>
                  <div className="w-1/2 h-2 rounded mb-4" style={{ background: `${colors[400]}30` }}></div>
                  <div className="w-24 h-6 rounded" style={{ background: `${colors[400]}40` }}></div>
                </div>
              </div>
              <h3 className="font-medium" style={{ color: colors[50] }}>SaaS Product</h3>
              <p className="text-sm font-light" style={{ color: colors[300] }}>Hero section, feature list, and pricing table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative z-10">
        <div 
          className="max-w-4xl mx-auto rounded-lg p-12 md:p-20 text-center relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${colors[800]}, ${colors[700]})`,
            border: `1px solid ${colors[400]}20`
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"
            style={{ background: colors[200] }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-6" style={{ color: colors[50] }}>
              Launch your site today.
            </h2>
            <p className="text-xl font-light mb-10 max-w-xl mx-auto" style={{ color: colors[300] }}>
              Generate your first version in minutes, then fine-tune it visually with zero code.
            </p>
            <button 
              onClick={handleStartBuilding}
              className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300 hover:tracking-[0.2em] rounded"
              style={{ 
                color: colors[900],
                background: colors[100],
              }}
            >
              Start Building Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-16 pb-12 relative z-10" style={{ borderColor: `${colors[400]}15` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold tracking-tight" style={{ color: colors[50] }}>Avallon</span>
              </div>
              <p className="text-sm max-w-xs font-light" style={{ color: colors[300] }}>
                The fastest way to build beautiful, functional websites using the power of generative AI.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4" style={{ color: colors[50] }}>Product</h4>
              <ul className="space-y-3 text-sm font-light" style={{ color: colors[300] }}>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer" onClick={() => navigate('/auth')}>Templates</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer" onClick={() => navigate('/auth')}>Integrations</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer" onClick={() => navigate('/auth')}>Showcase</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4" style={{ color: colors[50] }}>Resources</h4>
              <ul className="space-y-3 text-sm font-light" style={{ color: colors[300] }}>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Documentation</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Blog</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Community</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4" style={{ color: colors[50] }}>Company</h4>
              <ul className="space-y-3 text-sm font-light" style={{ color: colors[300] }}>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">About</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Careers</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer" onClick={() => navigate('/terms')}>Legal</a></li>
                <li><a className="hover:opacity-100 opacity-70 transition-opacity" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: `${colors[400]}15` }}>
            <p className="text-sm font-light" style={{ color: colors[400] }}>© 2026 Powered by Avallon. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="opacity-50 hover:opacity-100 transition-opacity" href="#" style={{ color: colors[200] }}>
                <span className="sr-only">Twitter</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a className="opacity-50 hover:opacity-100 transition-opacity" href="#" style={{ color: colors[200] }}>
                <span className="sr-only">GitHub</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Background text */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none overflow-hidden w-full flex justify-center">
          <span className="text-[12rem] md:text-[20rem] font-black tracking-tighter leading-none" style={{ color: colors[50], opacity: 0.02 }}>Avallon</span>
        </div>
      </footer>

      {/* Mouse gradient effect */}
      <div
        ref={gradientRef}
        className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl transition-all duration-500 ease-out opacity-0 z-0"
        style={{
          background: `radial-gradient(circle, ${colors[400]}20 0%, transparent 100%)`,
        }}
      ></div>
    </div>
  );
};

export default Index;
