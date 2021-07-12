module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-typescript/base", "prettier"],
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off",
  },
  plugins: ["@typescript-eslint"],
};
