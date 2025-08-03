import React from 'react';
import { 
  BookOpen, 
  Utensils, 
  Timer,
  Target,
  Flame,
  TrendingUp
} from 'lucide-react';

const ResultsSection = ({ result, showResults }) => {
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

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className={`w-full max-w-5xl transform transition-all duration-1000 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="relative">
          <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-white/5 rounded-2xl blur-sm opacity-60" />
          
          <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12">
            
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-6 sm:mb-8">
                Analysis Complete
              </h2>
              
              <div className={`inline-flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-2xl ${difficultyConfig[result.predicted_difficulty].bg} backdrop-blur-sm border ${difficultyConfig[result.predicted_difficulty].border} mb-6 sm:mb-8`}>
                <div className="text-center sm:text-left">
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-light ${difficultyConfig[result.predicted_difficulty].color} mb-1`}>
                    {difficultyConfig[result.predicted_difficulty].label}
                  </div>
                  <div className="text-white/60 text-sm sm:text-base lg:text-lg font-light">
                    Level {result.predicted_difficulty} of 5
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-3 px-4">
                <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                  {difficultyConfig[result.predicted_difficulty].description}
                </p>
              </div>
            </div>

            <div className="bg-white/[0.01] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-10">
              <h3 className="font-light text-white/90 text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 flex items-center justify-center sm:justify-start">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white/60" />
                <span className="text-center sm:text-left">AI Confidence Analysis</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {Object.entries(difficultyConfig).map(([level, config]) => {
                  const confidence = result.confidence_scores?.[level] || 0;
                  const IconComponent = config.icon;
                  const isSelected = result.predicted_difficulty == level;
                  
                  return (
                    <div 
                      key={level}
                      className={`p-4 sm:p-6 w-full sm:min-w-[120px] rounded-xl border transition-all duration-700 hover:scale-105 backdrop-blur-xl ${
                        isSelected 
                          ? `${config.bg} ${config.border} shadow-lg ${config.glow}` 
                          : 'border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/15'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-3 sm:mb-4">
                          <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto ${isSelected ? config.color : 'text-white/40'}`} />
                        </div>
                        <div className={`font-light text-xs mb-2 sm:mb-3 ${isSelected ? config.color : 'text-white/50'}`}>
                          Lvl {level}
                        </div>
                        <div className="text-xs font-light mb-2 sm:mb-3 text-white/60">
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
  );
};

export default ResultsSection;