import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        'xxs': '320px',
      },
    },
  },
} satisfies Config;
