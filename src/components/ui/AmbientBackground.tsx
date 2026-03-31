import React from 'react';
import { motion } from 'motion/react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Static Orbs for Ambience (No GPU heavy animation) */}
      <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-[#dc2626]/5 rounded-full filter blur-[180px]" />
      <div className="absolute bottom-[-10%] right-[0%] w-[700px] h-[700px] bg-[#dc2626]/5 rounded-full filter blur-[180px]" />
      
      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  );
}
