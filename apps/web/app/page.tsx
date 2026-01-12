import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo_2.png" alt="Butler Logo" width={40} height={40} className="rounded-lg bg-white p-1" />
            <span className="font-bold text-xl tracking-tight">Butler</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#shortcuts" className="hover:text-white transition-colors">Shortcuts</Link>
            <Link href="https://github.com/MonishGosar/Butler" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo centered */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-white/20 ring-4 ring-white/20">
              <Image src="/logo_2.png" alt="Butler" width={100} height={100} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0.1 is now available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
            Control your Windows <br /> with speed.
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop digging through menus. Butler gives you instant access to your apps,
            files, and clipboard history with a simple keystroke.
            Clean, fast, and native.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/MonishGosar/Butler/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:bg-gray-100 transition-transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Windows
            </a>
            <span className="text-sm text-gray-500">v1.0.1 • Free & Open Source</span>
          </div>

          <p className="mt-4 text-xs text-gray-600">
            Click Download → Go to Releases → Download <code className="bg-white/10 px-1 rounded">Butler.exe</code>
          </p>
        </div>

        {/* Preview Image - Abstract representation */}
        <div className="mt-20 max-w-4xl mx-auto rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10 overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[550px] rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
              {/* Search bar mockup */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-400 text-sm">Type to search...</span>
              </div>
              {/* Results mockup */}
              <div className="divide-y divide-white/5">
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/10">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold">N</div>
                  <div>
                    <div className="text-sm font-medium">Notepad</div>
                    <div className="text-xs text-gray-500">Application</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold">C</div>
                  <div>
                    <div className="text-sm font-medium text-gray-300">Calculator</div>
                    <div className="text-xs text-gray-500">Application</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-xs font-bold">P</div>
                  <div>
                    <div className="text-sm font-medium text-gray-300">PowerShell</div>
                    <div className="text-xs text-gray-500">Application</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">Engineered for focus.</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SearchIcon />}
              title="Instant Search"
              desc="Launch apps and find files instantly. Smart ranking learns what you use most."
            />
            <FeatureCard
              icon={<ClipboardIcon />}
              title="Clipboard History"
              desc="Never lose a copied link again. Formatting-free pasting and unlimited history."
            />
            <FeatureCard
              icon={<BoltIcon />}
              title="Native Performance"
              desc="Built with Electron and optimized for startup speed. Uses < 1% CPU in background."
            />
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section id="shortcuts" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Master the keyboard.</h2>

          <div className="grid gap-px bg-white/10 rounded-lg overflow-hidden md:grid-cols-2">
            <ShortcutItem keys={["Alt", "Space"]} action="Open Launcher" />
            <ShortcutItem keys={["Alt", "V"]} action="Clipboard History" />
            <ShortcutItem keys={["Esc"]} action="Close Window" />
            <ShortcutItem keys={["↑", "↓"]} action="Navigate Results" />
            <ShortcutItem keys={["Enter"]} action="Open Selection" />
            <ShortcutItem keys={["F1"]} action="Alternative Launcher" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 Butler. Open Source software.</p>
        <p className="mt-2">Designed by Monish Gosar</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ShortcutItem({ keys, action }: { keys: string[], action: string }) {
  return (
    <div className="bg-[#0a0a0a] p-4 flex items-center justify-between">
      <span className="text-gray-300 font-medium">{action}</span>
      <div className="flex gap-1">
        {keys.map(k => (
          <kbd key={k} className="px-2 py-1 rounded bg-white/10 border border-white/10 text-xs font-mono text-gray-400 min-w-[24px] text-center">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

// Icons
const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ClipboardIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)
