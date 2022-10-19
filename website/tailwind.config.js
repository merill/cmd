module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [
      require("@tailwindcss/forms")({
      }),
    ],
    corePlugins: { preflight: false },
    darkMode: ['class', '[data-theme="dark"]'],
  };