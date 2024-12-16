import Image from "next/image";

import LOGO from "../../../public/img2.png";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0000FF] text-white">
      {/* Background decorative elements */}
      <div className="flex h-full justify-end">
        <div className="h-full">
          <Image
            src="/img2.png"
            alt="Decorative blood vessels"
            width={LOGO.width}
            height={LOGO.height}
            className="object-cover opacity-80"
          />
        </div>
      </div>

      <main className="absolute z-10 px-6 pt-16 top-1/2 bg-transparent -translate-y-1/2">
        <div className="max-w-4xl">
          {/* Blood test records indicator */}
          <div className="mb-8 flex items-center gap-2">
            <div className="h-6 w-6 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 12h-4l-3 9L9 3l-3 9H2"
                />
              </svg>
            </div>
            <span className="text-sm">Blood test records</span>
          </div>

          {/* Main heading */}
          <h1
            className="mb-8 text-6xl font-bold leading-tight tracking-wider"
            style={{
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            HEALTH CHAIN
            <br />
            SMART CLOUD
          </h1>

          {/* Subtitle */}
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-white"></div>
            <p className="text-xl">On-chain Management of Value Data</p>
          </div>
        </div>
      </main>
    </div>
  );
}
