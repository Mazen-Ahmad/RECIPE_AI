import React from 'react';
import { Brain, Gauge, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
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
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-20">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin text-white mb-8 tracking-widest">HOW IT WORKS</h2>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            A brief explanation of how RECIPE AI works
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
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
  );
};

export default HowItWorks;



