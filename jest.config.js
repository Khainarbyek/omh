const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};

module.exports = createJestConfig({
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
});