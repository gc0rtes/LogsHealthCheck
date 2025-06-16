/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: ["/node_modules/(?!(@babel|@jest)/)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = config;
