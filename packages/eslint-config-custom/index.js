module.exports = {
  plugins: ["@typescript-eslint"],
  extends: [
    "next",
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
  },
};
