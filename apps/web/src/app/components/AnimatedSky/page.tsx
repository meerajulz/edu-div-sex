'use client';

import React from 'react';

const AnimatedSky: React.FC = () => {

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-0 w-full h-screen bg-gradient-to-b from-cyan-200 to-cyan-100">
      
      {/* 3D Cylinder Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-transparent to-white/10 z-5 blur-2xl"></div>

      {/* Cloud Container Limited to 50% Height */}
        <div className="absolute top-0 w-full h-[50vh]"/>
  
    </div>
  );
};

export default AnimatedSky;