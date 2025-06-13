// jest.config.js
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src", // Look for tests in the 'src' directory
  testRegex: ".*\\.spec\\.ts$", // Find all files ending in .spec.ts
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  // Add our custom Slack reporter
  reporters: [
    "default",
    "<rootDir>/../slack-reporter.js" // Path from 'src' to the root
  ],
};