/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d0d1a',
        'bg-card': '#13132a',
        'bg-card-hover': '#1a1a35',
        'text-story': '#f0ead6',
        'text-primary': '#e8e8f0',
        'text-secondary': '#7777aa',
        'text-muted': '#444466',
        'accent-rcb': '#cc0000',
        'accent-gold': '#d4a017',
        'accent-green': '#22c55e',
        'tension-low': '#22c55e',
        'tension-medium': '#f59e0b',
        'tension-high': '#ef4444',
        'tension-critical': '#7c3aed',
      },
      fontFamily: {
        story: ['Lora', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
