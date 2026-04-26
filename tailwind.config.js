/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0B1629',
                    80: '#1a2a45',
                    60: '#2d4a7a',
                },
                brand: {
                    blue: '#1D4ED8',
                    'blue-light': '#3B82F6',
                    'blue-dim': '#EFF6FF',
                    teal: '#0D9488',
                    'teal-dim': '#F0FDFA',
                    amber: '#B45309',
                    'amber-dim': '#FFFBEB',
                },
                surface: {
                    bg: '#F8FAFC',
                    card: '#FFFFFF',
                    border: '#E2E8F0',
                    'border-2': '#CBD5E1',
                },
            },
            fontFamily: {
                sans: ['DM Sans', 'system-ui', 'sans-serif'],
                mono: ['DM Mono', 'ui-monospace', 'monospace'],
            },
            borderRadius: {
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-400px 0' },
                    '100%': { backgroundPosition: '400px 0' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.4s ease-in-out infinite',
                fadeUp: 'fadeUp 0.3s ease forwards',
            },
        },
    },
    plugins: [],
}
