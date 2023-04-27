export default {
  clearMocks: true,
  coverageProvider: "babel",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    "@functions/(.*)": "<rootDir>/src/functions/$1",
    "@libs/(.*)": "<rootDir>/src/libs/$1",
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
