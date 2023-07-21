/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "meteor": "url(/public/assets/img/Meteor.svg)"
      }
    },
  },
  plugins: [],
}

