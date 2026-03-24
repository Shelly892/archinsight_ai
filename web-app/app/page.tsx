import Link from "next/link";

export default function Home() {
  return (
    <main className="relative w-full min-h-[calc(100vh-73px)] flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-gray-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>

      <div className="z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mb-8 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          AI-Powered Architecture Assistant
        </div> */}

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-black mb-6 leading-[1.1]">
          Design <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
            Intelligently.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl font-light leading-relaxed">
          ArchInsight AI assists you in discovering, analyzing, and
          interactively chatting about architectural projects and case studies
          worldwide.
        </p>

        <div className="flex flex-row items-center gap-4">
          <Link
            href="/all-projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2 text-lg">
              Explore Architecture World
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
          </Link>
          <Link
            href="/project"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2 text-lg">
              AI Search
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none mask-image-radial-gradient"></div>
    </main>
  );
}
