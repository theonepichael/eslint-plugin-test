# ESLint Plugin No-Truthy-Collections Test Project 🚨

This is a comprehensive Node.js codebase designed to test the `eslint-plugin-no-truthy-collections` plugin.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run ESLint:
   ```bash
   npm run lint
   ```

3. Expected: ~250-300 collection truthy check errors!

## 🐛 What Should Be Detected

Your plugin should catch bugs like:

```javascript
// ❌ Arrays are always truthy, even when empty
if (items) {  
  console.log('Processing items...');
}

// ✅ Should be:
if (items.length > 0) {
  console.log('Processing items...');
}
```

See individual files for hundreds more examples!

## 📁 Files with Bugs

- `src/services/dataProcessor.js` - ~25 bugs
- `src/api/userController.js` - ~30 bugs  
- `src/services/configService.ts` - ~20 TypeScript bugs
- `src/api/productController.ts` - ~25 TypeScript bugs
- `src/utils/validators.js` - ~20 bugs
- `src/utils/formatters.ts` - ~15 TypeScript bugs
- `tests/api.test.js` - ~15 test bugs
- `scripts/migrate.js` - ~20 bugs

Run `npm run lint` to see them all!
