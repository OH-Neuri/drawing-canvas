/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    /^bg-\[url/, // 동적 배경 이미지 클래스 허용
  ],
  theme: {
    extend: {
      backgroundImage: {
        'line-width': "url('../src/assets/images/line-width.png')",
      },
    },
  },
  plugins: [],
};
