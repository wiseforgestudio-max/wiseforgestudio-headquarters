"use client";

import * as React from "react";
import { Paperclip, Sparkles } from "lucide-react";

const Hero1 = () => {
  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient blobs */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg] opacity-50">
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center gap-2">
          <img src="/logo-wfs.png" width={30} height={30} alt="WiseForge Studio" className="rounded-md" />
          <div className="font-bold text-md">WiseForge Studio</div>
        </div>
        <a href="#contacto">
          <button className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold transition-colors">
            Contactar
          </button>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Announcement pill */}
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2 w-fit mx-4">
              <span className="text-xs flex items-center gap-2">
                <span className="bg-black p-1 rounded-full">⚡</span>
                AssetMaster y GanaMaxcol — en producción
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold leading-tight">
            Software que opera tu empresa
            <br />
            <span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              de verdad.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-md text-gray-400">
            Diseñamos productos SaaS, plataformas internas y automatización para empresas que necesitan control, trazabilidad y sistemas operativos serios.
          </p>

          {/* Input bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-[#1c1528] rounded-full p-3 flex items-center">
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </button>
              <input
                type="text"
                placeholder="¿Qué parte de tu operación necesita una capa digital?"
                className="bg-transparent flex-1 outline-none text-gray-300 pl-4 text-sm"
              />
              <a href="#contacto">
                <button className="bg-white text-black rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors mr-1">
                  Hablar →
                </button>
              </a>
            </div>
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 max-w-2xl mx-auto">
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors">
              ERP documental con AssetMaster
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors">
              Software ganadero con GanaMaxcol
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors">
              Automatización operativa
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors">
              Plataforma interna a medida
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm transition-colors">
              Discovery y consultoría
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
