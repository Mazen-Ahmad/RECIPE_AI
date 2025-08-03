import React from 'react';
import { ChefHat } from 'lucide-react';

const SampleRecipes = ({ setRecipeText, loading }) => {
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
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin text-white mb-4 sm:mb-6 lg:mb-8 tracking-widest">SAMPLE RECIPES</h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed px-4">
            Test RECIPE AI with these sample recipes
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-3xl blur-xl" />

          <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {exampleRecipes.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setRecipeText(example.recipe)}
                  disabled={loading}
                  className="text-left p-4 sm:p-6 lg:p-8 xl:p-10 bg-white/[0.01] hover:bg-white/[0.04] backdrop-blur-xl rounded-2xl transition-all duration-500 border border-white/10 hover:border-white/25 transform hover:scale-105 group min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                      <div className="text-xs text-white/50 font-light tracking-widest uppercase">
                        {example.category}
                      </div>
                      <div className="text-xs text-white/40 font-light bg-white/10 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                        Difficulty {example.difficulty}
                      </div>
                    </div>

                    <div className="font-light text-white/90 group-hover:text-white transition-colors text-base sm:text-lg mb-3 sm:mb-4">
                      {example.title}
                    </div>

                    <div className="text-white/60 text-xs sm:text-sm line-clamp-4 sm:line-clamp-6 leading-relaxed font-light">
                      {example.recipe}
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 flex items-center text-white/50 text-xs font-light">
                    <ChefHat className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Click to analyze
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleRecipes;