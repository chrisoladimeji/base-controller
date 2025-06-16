// jest.config.js
module.exports = {
  // Use ts-jest preset to get sensible defaults for TypeScript projects
  preset: 'ts-jest',
  testEnvironment: 'node',

  // The root of your source code, typically the project root
  rootDir: '.',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The file patterns Jest uses to detect test files
  testRegex: '.*\\.spec\\.ts$',

  // A map from regular expressions to module names or to arrays of module names
  // that allow to stub out resources with a single module.
  // THIS IS THE FIX for "Cannot find module 'src/...'" errors.
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Where to output coverage reports
  coverageDirectory: './coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.(t|j)s'],

  // Your custom Slack reporter configuration
  reporters: [
    'default',
    '<rootDir>/slack-reporter.js' // Path from the project root
  ],
};