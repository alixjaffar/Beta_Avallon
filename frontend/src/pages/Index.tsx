import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Navigate to auth page with the prompt - user needs to sign in first
    navigate("/auth", { state: { generatePrompt: prompt } });
  };

  const handleStartBuilding = () => {
    navigate("/auth");
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="font-display bg-white dark:bg-[#101022] text-slate-900 dark:text-white overflow-x-hidden antialiased min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#101022]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="text-primary">
                <span className="material-symbols-outlined text-[32px]">hexagon</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Avallon</span>
            </div>
          <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Product</a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/auth')}>Pricing</a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Docs</a>
          </nav>
          <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            <button 
              onClick={handleStartBuilding}
                className="hidden sm:flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 transition-colors px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20"
            >
              Start Building
            </button>
              <button className="md:hidden text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">menu</span>
            </button>
            </div>
          </div>
        </div>
      </header>

        {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Hero gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-primary/10 border border-blue-100 dark:border-primary/20 mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">New v2.0 AI Engine is live</span>
            </div>
            
            {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Build your website with AI <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">instantly.</span>
            </h1>
            
            {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            No code, no design skills needed. Just describe your vision, and Avallon builds it in seconds.
            </p>
            
            {/* Interactive Input Component */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#1a1d2e] rounded-2xl p-2 shadow-lg dark:shadow-2xl border border-slate-200 dark:border-white/10 relative group transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <div className="relative flex flex-col gap-2 p-2">
                <div className="flex items-start gap-3 p-2">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mt-1">auto_awesome</span>
                  <textarea 
                  className="w-full resize-none border-none bg-transparent p-0 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 min-h-[80px] focus:outline-none"
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
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3 px-2">
                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 rounded-lg transition-colors" title="Voice Input">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 rounded-lg transition-colors" title="Upload Image">
                      <span className="material-symbols-outlined text-[20px]">image</span>
                    </button>
                  </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>Generating...</span>
                        </>
                      ) : (
                        <>
                        <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
                        <span>Generate Website</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">bolt</span>
              Generates in ~30 seconds
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-black/20 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Everything you need to go live fast</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">From idea to published site in minutes, with powerful editing tools under the hood.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[28px]">speed</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Generation</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Create a fully functional, responsive website in seconds. Our AI handles layout, copy, and images automatically.
              </p>
            </div>
            <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <span className="material-symbols-outlined text-[28px]">touch_app</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visual Click-to-Edit</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Don't like a headline? Just click on any section to edit text, swap images, and adjust layout instantly.
              </p>
            </div>
            <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <span className="material-symbols-outlined text-[28px]">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gemini-Powered Editing</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Built-in Gemini helps rewrite and refine content directly inside the editor for perfect tone and SEO.
              </p>
            </div>
          </div>
          </div>
        </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-[#101022]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">Workflow</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">How Avallon works</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-white/10 -translate-y-1/2 z-0"></div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-[#1a1d2e] border-2 border-primary rounded-full flex items-center justify-center text-primary text-xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Describe your site</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Tell our AI what you need in plain English. The more specific, the better.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-[#1a1d2e] border-2 border-slate-200 dark:border-white/20 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Edit</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Visually edit text and layout directly on your website with click-to-edit tools and built-in Gemini assistance.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-[#1a1d2e] border-2 border-slate-200 dark:border-white/20 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Publish</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Publish your site instantly once you're happy with the result.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
              
      {/* Use Cases Section */}
      <section className="py-24 bg-slate-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Built for every use case</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">Whether you're a startup, creator, or small business, Avallon adapts to your needs.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1d2e] shadow-sm mb-4 aspect-[4/3] relative">
                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">Local Business</div>
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-200 dark:to-slate-800 flex flex-col p-4">
                    <div className="w-1/3 h-4 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
                    <div className="w-full h-32 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div className="h-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Modern Coffee Shop</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Includes menu, hours, and location map.</p>
            </div>
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1d2e] shadow-sm mb-4 aspect-[4/3] relative">
                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">Creator Portfolio</div>
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 dark:from-slate-700 to-white dark:to-slate-800 flex flex-col p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 h-full">
                      <div className="bg-slate-200 dark:bg-slate-600 rounded h-full"></div>
                      <div className="bg-slate-200 dark:bg-slate-600 rounded h-full"></div>
                      <div className="bg-slate-200 dark:bg-slate-600 rounded h-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Visual Designer</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Gallery grid, about section, and contact form.</p>
            </div>
            <div className="group cursor-pointer" onClick={() => navigate('/auth')}>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1d2e] shadow-sm mb-4 aspect-[4/3] relative">
                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">Startup Landing</div>
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 dark:from-indigo-900/30 to-blue-50 dark:to-blue-900/30 flex flex-col p-4 items-center justify-center text-center">
                    <div className="w-2/3 h-4 bg-indigo-200 dark:bg-indigo-600/50 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-indigo-100 dark:bg-indigo-700/50 rounded mb-4"></div>
                    <div className="w-24 h-6 bg-primary/30 rounded"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">SaaS Product</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hero section, feature list, and pricing table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-blue-50 dark:from-primary/10 to-white dark:to-[#101022] border border-blue-100 dark:border-primary/20 p-12 md:p-20 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-primary/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Launch your site today.</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">Generate your first version in minutes, then fine-tune it visually with zero code.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleStartBuilding}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
              >
                Start Building Free
              </button>
              </div>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#101022] border-t border-slate-100 dark:border-white/5 pt-16 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">hexagon</span>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Avallon</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                The fastest way to build beautiful, functional websites using the power of generative AI.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/auth')}>Templates</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/auth')}>Integrations</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/auth')}>Showcase</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/terms')}>Legal</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 dark:text-slate-500 text-sm">© 2024 Avallon Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">
                <span className="sr-only">Twitter</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">
                <span className="sr-only">GitHub</span>
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none overflow-hidden w-full flex justify-center">
          <span className="text-[12rem] md:text-[20rem] font-black text-slate-900 dark:text-white opacity-[0.03] tracking-tighter leading-none">Avallon</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
