module.exports = {
  rootDir: process.cwd(),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['dist/'],
  testEnvironment: 'node',
  transform: {
    '.*\\.(tsx?|jsx?)$': [
      '@swc/jest',
      {
        jsc: {
          transform: {},
        },
      },
    ],
  },
};
