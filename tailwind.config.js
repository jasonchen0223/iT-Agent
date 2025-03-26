/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space': {
          darker: '#070719',
          dark: '#0B0B2C',
          DEFAULT: '#1B1B4B',
          light: '#2D2D6D',
          lighter: '#3F3F8F',
        },
        foreground: 'hsl(var(--foreground))',
        background: 'hsl(var(--background))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        indigo: {
          '50': '#eef2ff',
          '100': '#e0e7ff',
          '200': '#c7d2fe',
          '300': '#a5b4fc',
          '400': '#818cf8',
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
          '800': '#3730a3',
          '900': '#312e81',
          '950': '#1e1b4b'
        },
        violet: {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#c4b5fd',
          '400': '#a78bfa',
          '500': '#8b5cf6',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95',
          '950': '#2e1065'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      backgroundImage: {
        'stars': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 1px, transparent 2px), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.1) 1px, transparent 2px), radial-gradient(circle at 90% 60%, rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
        'nebula': 'radial-gradient(ellipse at center, rgba(109, 77, 255, 0.3) 0%, rgba(76, 0, 255, 0.1) 40%, rgba(0, 0, 0, 0) 80%), radial-gradient(ellipse at 30% 40%, rgba(163, 72, 255, 0.3) 0%, rgba(166, 66, 255, 0.1) 40%, rgba(0, 0, 0, 0) 70%)',
        'space-dots': 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        'space-dust': 'linear-gradient(135deg, rgba(109, 77, 255, 0.2) 0%, rgba(163, 72, 255, 0.2) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'aurora': 'aurora 10s linear infinite',
        'shooting-star-1': 'shooting-star-1 6s linear infinite',
        'shooting-star-2': 'shooting-star-2 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-light': 'pulse-light 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-light': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'shooting-star-1': {
          '0%': { transform: 'translateX(-100px) translateY(0) rotate(-30deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '20%, 100%': { transform: 'translateX(300px) translateY(100px) rotate(-30deg)', opacity: '0' },
        },
        'shooting-star-2': {
          '0%': { transform: 'translateX(-200px) translateY(0) rotate(-20deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '20%, 100%': { transform: 'translateX(400px) translateY(150px) rotate(-20deg)', opacity: '0' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(109, 77, 255, 0.5)',
        'glow-sm': '0 0 8px rgba(109, 77, 255, 0.4)',
        'glow-lg': '0 0 25px rgba(109, 77, 255, 0.6)',
        'glow-purple': '0 0 15px rgba(163, 72, 255, 0.5)',
        'glow-blue': '0 0 15px rgba(77, 109, 255, 0.5)',
        'glow-inner': 'inset 0 0 10px rgba(109, 77, 255, 0.3)',
      },
      backdropBlur: {
        xs: '2px'
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '100': '25rem',
        '120': '30rem'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require("tailwindcss-animate"),
    function({ addComponents }) {
      addComponents({
        '.space-card': {
          backgroundColor: 'rgba(15, 14, 45, 0.7)',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(109, 77, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(109, 77, 255, 0.2)',
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(109, 77, 255, 0.3)',
            border: '1px solid rgba(109, 77, 255, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(109, 77, 255, 0.2), transparent)',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::before': {
            opacity: '1',
          },
        },
        '.space-button': {
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(109, 77, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(109, 77, 255, 0.3)',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            backgroundColor: 'rgba(109, 77, 255, 0.3)',
            color: 'rgba(255, 255, 255, 1)',
            boxShadow: '0 0 15px rgba(109, 77, 255, 0.3)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '0',
            opacity: '0',
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::after': {
            opacity: '1',
          },
        },
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(15, 14, 45, 0.1)',
            borderRadius: '100px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(109, 77, 255, 0.3)',
            borderRadius: '100px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(109, 77, 255, 0.5)',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(109, 77, 255, 0.3) rgba(15, 14, 45, 0.1)',
        },
      });
    },
  ],
}; 