import GlassCard from "../component/GlassCard";
import { FaReact, FaNodeJs, FaGithub, FaInstagram } from "react-icons/fa";
import { SiTailwindcss, SiJavascript, SiHtml5, SiCss3, SiOpenai } from "react-icons/si";
import { MdEmail } from "react-icons/md";

export default function Section1() {
  return (
    <GlassCard id="hero">
      {/* Title */}
      <h2 className="text-4xl font-bold mb-4">About Me</h2>

<div className="relative flex justify-center mb-6">
  <div className="relative group">
    {/* Profile Picture */}
    <img
      src="/Profile.jpg"
      alt="Andrei Cornea"
      className="w-32 h-32 rounded-full border-4 border-white transition-transform duration-300 group-hover:scale-105"
    />

    {/* Crown on top of head */}
    <div className="absolute -top-[-4.5px] right-[10px] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-yellow-400"
        fill="gold"
        viewBox="0 0 24 24"
        stroke="black"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 20l2-8 4 6 4-12 4 8 4-6 2 8H2z"
        />
      </svg>
    </div>
  </div>
</div>

      {/* Bio */}
      <p className="text-lg opacity-80 leading-relaxed mb-6">
        Hi, I’m <span className="font-semibold">Andrei Cornea</span>. I’m a frontend developer who has just graduated from high school. I enjoy creating interactive landing pages and innovative web experiences.
      </p>

      {/* Skills */}
      <div className="flex gap-4 justify-center flex-wrap mb-8">
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <FaReact className="text-cyan-400 text-xl" /> React
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <SiTailwindcss className="text-sky-400 text-xl" /> Tailwind
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <SiHtml5 className="text-orange-500 text-xl" /> HTML
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <SiCss3 className="text-blue-500 text-xl" /> CSS
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <SiJavascript className="text-yellow-400 text-xl" /> JavaScript
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <FaNodeJs className="text-green-500 text-xl" /> Node.js
        </span>
        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
          <SiOpenai className="text-purple-400 text-xl" /> AI
        </span>
      </div>

      {/* Socials */}
      <div className="flex gap-6 justify-center text-2xl">
        <a
          href="https://github.com/ANDREICai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cyan-400 transition"
        >
          <FaGithub />
        </a>
        <a
          href="https://instagram.com/andreicornea_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="mailto:andreicornea20@gmail.com"
          className="hover:text-red-400 transition"
        >
          <MdEmail />
        </a>
      </div>
    </GlassCard>
  );
}
