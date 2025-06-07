import noTruthyCollections from "eslint-plugin-no-truthy-collections";
import tsParser from "@typescript-eslint/parser";

// Shared rule configuration
const sharedRules = {
  "no-truthy-collections/no-truthy-collections": [
    "error",
    {
      checkArrays: true,
      checkObjects: true,
      checkArrayLike: true,
      strictNaming: true,
      allowExplicitBoolean: false,
    },
  ],
};

export default [
  // Configuration for JavaScript files
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "no-truthy-collections": noTruthyCollections,
    },
    rules: sharedRules,
  },

  // Configuration for TypeScript files (with enhanced type checking)
  {
    files: ["**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
    },
    plugins: {
      "no-truthy-collections": noTruthyCollections,
    },
    rules: {
      ...sharedRules,
      // Override with TypeScript-specific options if your plugin supports them
      "no-truthy-collections/no-truthy-collections": [
        "error",
        {
          checkArrays: true,
          checkObjects: true,
          checkArrayLike: true,
          strictNaming: true,
          allowExplicitBoolean: false,
          // Enable enhanced TypeScript detection
          useTypeInformation: true,
        },
      ],
    },
  },
];
