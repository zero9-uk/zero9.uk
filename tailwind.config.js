module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
		founders: ['"Founders Grotesk"', 'sans-serif'],
	  },
      colors: {
        zero9: {
          brand: "#000000",
          background: "#FFFFFF",
          text: "#000000",
        },
      },
    },
  },
  plugins: [],
};
