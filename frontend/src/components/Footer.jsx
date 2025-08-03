import React from 'react';

const Footer = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="text-center">
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
          <p className="text-white/60 font-light text-sm sm:text-base">
            ©2025 Mazen Ahmad • All rights reserved
          </p>
          <p className="text-white/40 text-xs sm:text-sm mt-2 font-mono">
            Built using React, TailwindCSS and Python
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;