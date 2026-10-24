module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      colors: {
        ink: '#0f172a',
        skybrand: '#2563eb',
        mint: '#10b981'
      }
    },
  },
  plugins: []
};
