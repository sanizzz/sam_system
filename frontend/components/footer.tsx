export function Footer() {
  return (
    <footer className="bg-neutral-800 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Runway Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-neutral-800 font-bold text-lg">R</span>
          </div>
          <span className="text-white text-xl font-medium">Runway</span>
        </div>

        {/* Curated By */}
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm">curated by</span>
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M4 12C4 12 7 8 12 8C17 8 20 12 20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 16C4 16 7 12 12 12C17 12 20 16 20 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white text-lg font-semibold">Mobbin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
