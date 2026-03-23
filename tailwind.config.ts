import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: 'var(--amber)',
        'amber-dim': 'var(--amber-dim)',
        'amber-deep': 'var(--amber-deep)',
        olive: 'var(--olive)',
        'olive-dim': 'var(--olive-dim)',
        concrete: 'var(--concrete)',
        'concrete-light': 'var(--concrete-light)',
        'concrete-dark': 'var(--concrete-dark)',
        'off-white': 'var(--off-white)',
        shadow: 'var(--shadow)',
        paper: 'var(--paper)',
        'red-stamp': 'var(--red-stamp)',
        ink: 'var(--ink)',
        bg: 'var(--bg)',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        display: ['"Special Elite"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
