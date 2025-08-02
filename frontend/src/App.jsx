import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChefHat, 
  Loader2,
  Target, 
  TrendingUp, 
  Utensils, 
  BookOpen, 
  Timer,
  Flame,
  ArrowDown,
  Brain,
  BarChart3,
  Gauge,
  AlertCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const frames = useRef({
    currentIndex: 0,
    maxIndex: 120
  }).current;

  const images = useRef([]);
  const imagesLoaded = useRef(0);

  const [recipeText, setRecipeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);

  const BACKEND_URL = 'https://recipe-backend-c9rc.onrender.com';

  const loadImage = (index) => {
    if (index >= 0 && index < frames.maxIndex) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = images.current[index];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingQuality = 'high';
      context.imageSmoothingEnabled = true;
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      frames.currentIndex = index;
    }
  };

  const startAnimation = () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-area",
        start: "top top",
        end: "bottom top",
        scrub: 2
      }
    }).to(frames, {
      currentIndex: frames.maxIndex - 1,
      onUpdate: () => {
        loadImage(Math.floor(frames.currentIndex));
      }
    });
  };

  const preloadImages = () => {
    for (let i = 1; i <= frames.maxIndex; i++) {
      const imageURL = `./FRAMES/frame_${i.toString().padStart(4, "0")}.jpeg`;
      const img = new Image();
      img.src = imageURL;
      img.onload = () => {
        imagesLoaded.current++;
        if (imagesLoaded.current === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimation();
        }
      };
      images.current.push(img);
    }
  };

  useEffect(() => {
    preloadImages();
    setTimeout(() => setAnimateHero(true), 1000);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        scrollTrigger: {
          trigger: ".scroll-area",
          start: "top top",
          end: "300 top",
          scrub: true,
        },
        opacity: 0,
        scale: 0.85,
        transformOrigin: "top center",
        ease: "power2.out"
      });
    }
  }, []);

  const difficultyConfig = {
    1: { 
      label: 'Noob', 
      color: 'text-emerald-300', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-400/30',
      icon: BookOpen,
      glow: 'shadow-emerald-400/20',
      description: 'Too easy and hassle free'
    },
    2: { 
      label: 'Simple', 
      color: 'text-blue-300', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-400/30',
      icon: Utensils,
      glow: 'shadow-blue-400/20',
      description: 'Should\'nt be a problem'
    },
    3: { 
      label: 'Moderate', 
      color: 'text-cyan-300', 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-400/30',
      icon: Timer,
      glow: 'shadow-cyan-400/20',
      description: 'Somewhat time consuming and complex but still manageable'
    },
    4: { 
      label: 'Challenging', 
      color: 'text-amber-300', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-400/30',
      icon: Target,
      glow: 'shadow-amber-400/20',
      description: 'Precision, skills and equipments may be required'
    },
    5: { 
      label: 'GORDON RAMSAY', 
      color: 'text-orange-300', 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-400/30',
      icon: Flame,
      glow: 'shadow-orange-400/20',
      description: 'If you smell, what the Rock, is cookin....'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeText.trim()) {
      setError('Please enter a recipe to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setShowResults(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/predict-difficulty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe_text: recipeText }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || data.error);
      }
      
      setResult(data);
      setTimeout(() => setShowResults(true), 300);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to backend server. Please ensure it\'s running.');
      } else {
        setError(`Analysis failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const exampleRecipes = [
    {
      title: "Mutton Biryani",
      category: "TRADITIONAL INDIAN",
      recipe: "Basmati rice, mutton, saffron, ghee, yogurt, garam masala, bay leaves, cardamom, cinnamon, cloves, mint leaves, fried onions, rose water, 90 minutes cooking time",
      difficulty: "4-5"
    },
    {
      title: "Paneer Butter Masala",
      category: "VEGETARIAN DELIGHT",
      recipe: "Paneer cubes, butter, tomatoes, onions, ginger-garlic paste, cashews, cream, garam masala, red chili powder, kasuri methi, salt. 40 minutes total.",
      difficulty: "3-4"
    },
    {
      title: "Butter Chicken",
      category: "CLASSIC NORTH INDIAN",
      recipe: "Chicken, butter, cream, tomato, onion, ginger, garlic, garam masala, fenugreek leaves, 45 minutes",
      difficulty: "4-5"
    },
    {
      title: "Jeera Aloo",
      category: "COMMON EVERYDAY SABZI",
      recipe: "Boiled potatoes, cumin seeds, oil, turmeric, salt, red chili powder, coriander. Cook for 10 minutes.",
      difficulty: "1-2"
    }
  ];

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen z-0 grayscale"
        id="frame"
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 z-[1]" />

      <nav
        ref={navRef}
        className="absolute top-0 left-0 right-0 z-50 p-8 transition-all duration-500 ease-in-out"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 blur-lg rounded-full" />
              <div className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-full p-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-white font-thick text-xl tracking-widest">RECIPE AI</div>
          </div>
        </div>
      </nav>

      <div className="scroll-area relative z-10">
        <div className="relative z-20">
          
          <section className="min-h-screen flex items-center justify-center px-6">
            <div className={`text-center max-w-5xl mx-auto transition-all duration-2000 ${animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              <div className="mb-16">
                <h1 className="text-8xl font-script text-white/95 mb-8 tracking-widest leading-none">
                  Culinary <span>Calculator</span>
                </h1> 
              </div>
              
              <p className="text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
                From <span className="text-emerald-300 font-medium">Noob</span> to{' '}
                <span className="text-red-300 font-medium">Gordon Ramsay</span> — 
                let AI analyze your recipe
              </p>
              
              <div className="animate-bounce mt-26">
                <div className="flex flex-col items-center space-y-1">
                  <ArrowDown className="w-6 h-6 text-white/60" />
                  <div className="text-white/40 text-sm font-light tracking-widest">ANALYZE A RECIPE</div>
                </div>
              </div>
            </div>
          </section>

          <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-3xl">
              
              <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-white/5 rounded-2xl blur-sm opacity-60" />
                
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
                  
                  <div className="space-y-8">
                    
                    <div className="text-center">
                      <h2 className="text-3xl font-light text-white mb-4">
                        Paste Your Recipe Here
                      </h2>
                      <p className="text-white/60 font-light">
                        Paste complete recipe for accurate analysis
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={recipeText}
                          onChange={(e) => setRecipeText(e.target.value)}
                          placeholder="Please provide an approximate cooking time along with the ingredients for a more accurate analysis...."
                          className="w-full h-64 px-6 py-6 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl 
                                   focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300 
                                   resize-none text-white/90 placeholder-white/40 text-base leading-relaxed
                                   outline-none shadow-inner"
                          disabled={loading}
                        />
                        
                        <div className="absolute bottom-4 right-6 flex items-center space-x-4">
                          <div className="text-white/40 text-sm font-light">
                            {recipeText.length} characters
                          </div>
                          {recipeText.length > 20 && (
                            <div className="text-emerald-400/60 text-sm font-light flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Ready for analysis
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 text-red-300 px-6 py-4 rounded-xl">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-3" />
                          <span className="font-light">{error}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !recipeText.trim()}
                      className="group relative w-full overflow-hidden bg-white/15 hover:bg-white/25 backdrop-blur-2xl text-white font-light py-6 px-8 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-700 transform hover:scale-[1.01] disabled:hover:scale-100 flex items-center justify-center text-lg border border-white/25 hover:border-white/40"
                    >
                      <div className="relative flex items-center">
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-4 animate-spin" />
                            <span>Analyzing Recipe Complexity...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform duration-500" />
                            <span>Predict Difficulty</span>
                            <Gauge className="w-6 h-6 ml-4 group-hover:scale-110 transition-transform duration-500" />
                          </>
                        )}
                      </div>
                    </button>             
                  </div>
                </div>
              </div>
            </div>
          </section>

          {result && (
            <section className="min-h-screen flex items-center justify-center px-6 py-20">
              <div className={`w-full max-w-5xl transform transition-all duration-1000 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                <div className="relative">
                  <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-white/5 rounded-2xl blur-sm opacity-60" />
                  
                  <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
                    
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-light text-white mb-8">
                        Analysis Complete
                      </h2>
                      
                      <div className={`inline-flex items-center px-8 py-6 rounded-2xl ${difficultyConfig[result.predicted_difficulty].bg} backdrop-blur-sm border ${difficultyConfig[result.predicted_difficulty].border} mb-8`}>
                        <div className="text-left">
                          <div className={`text-4xl font-light ${difficultyConfig[result.predicted_difficulty].color} mb-1`}>
                            {difficultyConfig[result.predicted_difficulty].label}
                          </div>
                          <div className="text-white/60 text-lg font-light">
                            Level {result.predicted_difficulty} of 5
                          </div>
                        </div>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-3">
                        <p className="text-white/60 leading-relaxed">
                          {difficultyConfig[result.predicted_difficulty].description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/[0.01] backdrop-blur-xl border border-white/10 rounded-2xl p-10">
                      <h3 className="font-light text-white/90 text-2xl mb-10 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-3 text-white/60" />
                        AI Confidence Analysis
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                        {Object.entries(difficultyConfig).map(([level, config]) => {
                          const confidence = result.confidence_scores?.[level] || 0;
                          const IconComponent = config.icon;
                          const isSelected = result.predicted_difficulty == level;
                          
                          return (
                            <div 
                              key={level}
                              className={`p-6 min-w-[120px] rounded-xl border transition-all duration-700 hover:scale-105 backdrop-blur-xl ${
                                isSelected 
                                  ? `${config.bg} ${config.border} shadow-lg ${config.glow}` 
                                  : 'border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/15'
                              }`}
                            >
                              <div className="text-center">
                                <div className="mb-4">
                                  <IconComponent className={`w-5 h-5 mx-auto ${isSelected ? config.color : 'text-white/40'}`} />
                                </div>
                                <div className={`font-light text-xs mb-3 ${isSelected ? config.color : 'text-white/50'}`}>
                                  Lvl {level}
                                </div>
                                <div className="text-xs font-light mb-3 text-white/60">
                                  {config.label}
                                </div>
                                <div className="mt-3">
                                  <div className="w-full bg-white/10 rounded-full h-1 mb-2 overflow-hidden backdrop-blur-sm">
                                    <div 
                                      className={`h-1 rounded-full transition-all duration-1000 ${
                                        isSelected 
                                          ? `bg-gradient-to-r ${config.color.replace('text-', 'from-').replace('-300', '-400')} to-white/60` 
                                          : 'bg-white/20'
                                      }`}
                                      style={{ width: `${confidence * 100}%` }}
                                    />
                                  </div>
                                  <div className="text-xs text-white/50 font-light">
                                    {(confidence * 100).toFixed(0)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="min-h-screen flex items-center justify-center px-8 py-20">
            <div className="w-full max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-thin text-white mb-8 tracking-widest">SAMPLE RECIPES</h2>
                <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                  Test RECIPE AI with these sample recipes
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-3xl blur-xl" />

                <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {exampleRecipes.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setRecipeText(example.recipe)}
                        disabled={loading}
                        className="text-left p-10 bg-white/[0.01] hover:bg-white/[0.04] backdrop-blur-xl rounded-2xl transition-all duration-500 border border-white/10 hover:border-white/25 transform hover:scale-105 group min-h-[420px] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-xs text-white/50 font-light tracking-widest uppercase">
                              {example.category}
                            </div>
                            <div className="text-xs text-white/40 font-light bg-white/10 px-3 py-1 rounded-full">
                              Difficulty {example.difficulty}
                            </div>
                          </div>

                          <div className="font-light text-white/90 group-hover:text-white transition-colors text-lg mb-4">
                            {example.title}
                          </div>

                          <div className="text-white/60 text-sm line-clamp-6 leading-relaxed font-light">
                            {example.recipe}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center text-white/50 text-xs font-light">
                          <ChefHat className="w-4 h-4 mr-2" />
                          Click to analyze
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="min-h-screen flex items-center justify-center px-8 py-20">
            <div className="w-full max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-thin text-white mb-8 tracking-widest">HOW IT WORKS</h2>
                <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                  A brief explanation of how RECIPE AI works
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Input Processing",
                    description: "RECIPE AI uses NLP to process the user's input and extract features from it. It then converts it to JSON format and passes it to the python backend.",
                    icon: Brain,
                    color: "from-blue-400 to-cyan-500"
                  },
                  {
                    step: "02", 
                    title: "Difficulty Classification",
                    description: "The recipe is classified on a difficulty scale of 1-5 using TF-IDF vectorization to convert into numerical format and then applies the RandomForest algo on the input to compare with the dataset.",
                    icon: Gauge,
                    color: "from-purple-400 to-pink-500"
                  },
                  {
                    step: "03",
                    title: "Confidence Mapping",
                    description: "The system provides confidence scores of the algorithm across all difficulty levels and returns the dominant one as the output. It uses a dataset of 6000 indian recipes for improved accuracy.",
                    icon: BarChart3,
                    color: "from-amber-400 to-orange-500"
                  }
                ].map((step, index) => (
                  <div key={index} className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-700 hover:scale-105">
                    
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-white/60 font-light text-sm">{step.step}</span>
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-700`} />
                    
                    <div className="relative">
                      <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                          <step.icon className="w-8 h-8 text-white/80" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-light text-white mb-6 tracking-wide">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/60 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section className="py-16 px-6">
            <div className="text-center">
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-white/60 font-light">
                  ©2025 Mazen Ahmad • All rights reserved
                </p>
                <p className="text-white/40 text-sm mt-2 font-mono">
                  Built using React, TailwindCSS and Python
                </p>
              </div>
            </div>
          </section>

        </div>

        <div style={{ height: '1000px' }} />
      </div>
    </div>
  );
};

export default App;