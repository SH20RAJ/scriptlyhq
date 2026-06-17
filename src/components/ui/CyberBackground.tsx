"use client";

import { motion } from "framer-motion";

export const CyberBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Dynamic Mesh Lights */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.08, 0.03],
          x: ['-50%', '-45%', '-50%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-200px] left-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[150px] rounded-full" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[600px] left-[-300px] w-[700px] h-[700px] bg-emerald-500/10 blur-[160px] rounded-full" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.02, 0.05, 0.02],
          x: [0, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[1200px] right-[-300px] w-[800px] h-[800px] bg-blue-500/10 blur-[180px] rounded-full" 
      />

      {/* Grid Pattern with Fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      {/* Cyberpunk Scanlines effect (optional/subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};
