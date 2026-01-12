import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Butler</div>
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
              href="https://github.com/MonishGosar/Butler/releases/latest"
              className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:bg-gray-100 transition-transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Windows
            </a>
            <span className="text-sm text-gray-500">v1.0.1 • Free & Open Source</span>
          </div>
        </div>

        {/* Preview Image */}
        <div className="mt-20 max-w-5xl mx-auto rounded-xl border border-white/10 shadow-2xl shadow-blue-500/10 overflow-hidden bg-[#111]">
          <div className="aspect-[16/6] min-w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative">
            {/* Abstract representation of launcher if no image */}
            <div className="w-[600px] h-[56px] rounded-lg bg-[#202020] border border-white/5 shadow-2xl flex items-center px-4 gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500/50"></div>
              <div className="h-4 w-32 bg-white/10 rounded"></div>
            </div>
            {/* <Image src="/screenshot.png" width={1200} height={600} alt="Butler Interface" /> */}
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
