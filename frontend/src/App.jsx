import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import BackgroundCanvas from './components/BackgroundCanvas';
import HeroSection from './components/HeroSection';
import RecipeAnalyzer from './components/RecipeAnalyzer';
import ResultsSection from './components/ResultsSection';
import SampleRecipes from './components/SampleRecipes';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const navRef = useRef(null);
  const [recipeText, setRecipeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);

  const BACKEND_URL = 'https://recipe-backend-c9rc.onrender.com';

  useEffect(() => {
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

  return (
    <div className="relative">
      <BackgroundCanvas />
      
      <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 z-[1]" />

      <Navbar navRef={navRef} />

      <div className="scroll-area relative z-10">
        <div className="relative z-20 overflow-x-hidden">
          
          <HeroSection animateHero={animateHero} />

          <RecipeAnalyzer 
            recipeText={recipeText}
            setRecipeText={setRecipeText}
            loading={loading}
            error={error}
            handleSubmit={handleSubmit}
          />

          {result && (
            <ResultsSection 
              result={result}
              showResults={showResults}
            />
          )}

          <SampleRecipes 
            setRecipeText={setRecipeText}
            loading={loading}
          />

          <HowItWorks />
          
          <Footer />

        </div>

        <div style={{ height: '1000px' }} />
      </div>
    </div>
  );
};

export default App;