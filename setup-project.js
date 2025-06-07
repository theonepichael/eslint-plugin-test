#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

/**
 * Setup script to create the eslint-plugin-no-truthy-collections test project
 */

const files = {
  "package.json": `{
  "name": "truthy-collections-test",
  "version": "1.0.0",
  "description": "Test project for eslint-plugin-no-truthy-collections",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "lint": "eslint src/ tests/ scripts/",
    "lint:fix": "eslint src/ tests/ scripts/ --fix",
    "test": "jest",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/migrate.js seed"
  },
  "keywords": ["node", "api", "test"],
  "author": "Test Author",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "redis": "^4.6.0",
    "lodash": "^4.17.21",
    "axios": "^1.4.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.9.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "eslint-plugin-no-truthy-collections": "^1.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}`,

  "eslint.config.js": `import noTruthyCollections from 'eslint-plugin-no-truthy-collections';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,ts}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      'no-truthy-collections': noTruthyCollections,
    },
    rules: {
      'no-truthy-collections/no-truthy-collections': ['error', {
        checkArrays: true,
        checkObjects: true,
        checkArrayLike: true,
        strictNaming: true,
        allowExplicitBoolean: false,
      }],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      'no-truthy-collections': noTruthyCollections,
    },
    rules: {
      'no-truthy-collections/no-truthy-collections': ['error', {
        checkArrays: true,
        checkObjects: true,
        checkArrayLike: true,
        strictNaming: true,
        allowExplicitBoolean: false,
      }],
    },
  },
];`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "scripts/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}`,

  "README.md": `# ESLint Plugin No-Truthy-Collections Test Project 🚨

This is a comprehensive Node.js codebase designed to test the \`eslint-plugin-no-truthy-collections\` plugin.

## 🚀 Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run ESLint:
   \`\`\`bash
   npm run lint
   \`\`\`

3. Expected: ~250-300 collection truthy check errors!

## 🐛 What Should Be Detected

Your plugin should catch bugs like:

\`\`\`javascript
// ❌ Arrays are always truthy, even when empty
if (items) {  
  console.log('Processing items...');
}

// ✅ Should be:
if (items.length > 0) {
  console.log('Processing items...');
}
\`\`\`

See individual files for hundreds more examples!

## 📁 Files with Bugs

- \`src/services/dataProcessor.js\` - ~25 bugs
- \`src/api/userController.js\` - ~30 bugs  
- \`src/services/configService.ts\` - ~20 TypeScript bugs
- \`src/api/productController.ts\` - ~25 TypeScript bugs
- \`src/utils/validators.js\` - ~20 bugs
- \`src/utils/formatters.ts\` - ~15 TypeScript bugs
- \`tests/api.test.js\` - ~15 test bugs
- \`scripts/migrate.js\` - ~20 bugs

Run \`npm run lint\` to see them all!
`,

  ".gitignore": `node_modules/
dist/
build/
*.log
.env
.DS_Store
coverage/
`,

  // Simple versions of the complex files to get started
  "src/app.js": `// Main application file with collection bugs
const express = require('express');

class Application {
  constructor() {
    this.app = express();
    this.services = new Map();
    this.middleware = [];
    this.routes = new Set();
    this.config = {
      corsOrigins: [],
      staticPaths: [],
      trustProxies: []
    };
  }

  async initialize(appConfig = {}) {
    // 🐛 BUG: appConfig object check
    if (appConfig) {
      this.config = { ...this.config, ...appConfig };
    }
    
    await this.setupMiddleware();
  }

  async setupMiddleware() {
    // 🐛 BUG: this.config.corsOrigins array check
    if (this.config.corsOrigins) {
      console.log('Setting up CORS...');
    }
    
    // 🐛 BUG: this.config.staticPaths array check
    if (this.config.staticPaths) {
      this.config.staticPaths.forEach(path => {
        console.log(\`Setting up static path: \${path}\`);
      });
    }
  }

  async start() {
    const server = this.app.listen(3000, () => {
      console.log('🚀 Server running on port 3000');
      
      // 🐛 BUG: this.services Map check
      if (this.services) {
        console.log(\`Services: \${Array.from(this.services.keys()).join(', ')}\`);
      }
    });
    
    return server;
  }
}

if (require.main === module) {
  const app = new Application();
  app.initialize().then(() => app.start());
}

module.exports = Application;`,

  "src/services/dataProcessor.js": `// Data processing service with collection bugs
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.processors = new Set();
  }

  async processUserData(users, options = {}) {
    const results = users.map(user => this.normalizeUser(user));
    
    // 🐛 BUG: results array is always truthy, even when []
    if (results) {
      console.log(\`Processing \${results.length} users\`);
      return this.applyTransformations(results, options);
    }
    
    return [];
  }

  applyFilters(data, filters = {}) {
    // 🐛 BUG: filters object is always truthy, even when {}
    if (filters) {
      return data.filter(item => {
        return Object.keys(filters).every(key => {
          const filterValue = filters[key];
          
          // 🐛 BUG: Array check that's always true
          if (Array.isArray(filterValue) && filterValue) {
            return filterValue.includes(item[key]);
          }
          
          return item[key] === filterValue;
        });
      });
    }
    
    return data;
  }

  batchProcess(itemsBatch, configObject = {}) {
    const processed = [];
    
    // 🐛 BUG: itemsBatch array check is always true
    if (itemsBatch) {
      for (const item of itemsBatch) {
        const processedItem = this.processItem(item);
        
        // 🐛 BUG: processedItem.tags array check
        if (processedItem.tags) {
          processedItem.tags = processedItem.tags.map(tag => tag.toLowerCase());
        }
        
        processed.push(processedItem);
      }
    }
    
    // 🐛 BUG: configObject is always truthy
    if (configObject) {
      return this.applyConfig(processed, configObject);
    }
    
    return processed;
  }

  normalizeUser(user) {
    return { ...user, tags: user.tags || [] };
  }

  processItem(item) {
    return { ...item, tags: item.tags || [] };
  }

  applyConfig(data, config) {
    return data.map(item => ({ ...item, configured: true }));
  }

  applyTransformations(data, options) {
    // 🐛 BUG: this.processors Set check
    if (this.processors) {
      console.log(\`Applying \${this.processors.size} processors\`);
    }
    
    return data;
  }
}

module.exports = DataProcessor;`,

  "src/api/userController.js": `// User controller with API bugs
class UserController {
  constructor() {
    this.validationCache = new Map();
    this.activeConnections = new Set();
  }

  async getUsers(req, res) {
    try {
      const { filters = {}, sort = [], page = 1 } = req.query;
      
      // 🐛 BUG: filters object check - always truthy even when {}
      if (filters) {
        console.log('Applying filters to user search');
      }
      
      // 🐛 BUG: sort array check - always truthy even when []
      if (sort) {
        console.log(\`Sorting by \${sort.length} criteria\`);
      }
      
      const users = { data: [], metadata: {} };
      
      // 🐛 BUG: users.data array check
      if (users.data) {
        users.data = users.data.map(user => this.sanitizeUser(user));
      }
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const processedData = { ...userData };
      
      // 🐛 BUG: userData.tags array check
      if (userData.tags) {
        processedData.tags = userData.tags.map(tag => tag.trim());
      }
      
      // 🐛 BUG: userData.preferences object check
      if (userData.preferences) {
        processedData.preferences = this.processPreferences(userData.preferences);
      }
      
      res.status(201).json({ user: processedData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  sanitizeUser(user) {
    return user;
  }

  processPreferences(prefs) {
    return prefs;
  }
}

module.exports = UserController;`,

  "src/utils/validators.js": `// Validation utilities with bugs
function validateUserData(userData, schema = {}) {
  const errors = [];
  const warnings = [];
  
  // 🐛 BUG: schema object check
  if (schema) {
    console.log('Validating with schema');
  }
  
  // 🐛 BUG: userData.roles array check
  if (userData.roles) {
    const invalidRoles = userData.roles.filter(role => 
      !['admin', 'user'].includes(role)
    );
    
    // 🐛 BUG: invalidRoles array check
    if (invalidRoles) {
      errors.push(\`Invalid roles: \${invalidRoles.join(', ')}\`);
    }
  }
  
  // 🐛 BUG: userData.tags array check
  if (userData.tags) {
    const duplicates = findDuplicates(userData.tags);
    
    // 🐛 BUG: duplicates array check
    if (duplicates) {
      warnings.push(\`Duplicate tags: \${duplicates.join(', ')}\`);
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

function findDuplicates(array) {
  const seen = new Set();
  const duplicates = [];
  
  // 🐛 BUG: array parameter check
  if (array) {
    array.forEach(item => {
      if (seen.has(item)) {
        duplicates.push(item);
      } else {
        seen.add(item);
      }
    });
  }
  
  return duplicates;
}

module.exports = { validateUserData, findDuplicates };`,

  "tests/api.test.js": `// Test file with collection bugs
const request = require('supertest');

describe('API Tests', () => {
  const testData = {
    users: [],
    products: []
  };

  test('should handle user creation', async () => {
    const userData = {
      name: 'Test User',
      tags: ['test'],
      preferences: {}
    };

    // 🐛 BUG: userData.tags array check in test
    if (userData.tags) {
      expect(userData.tags.length).toBeGreaterThan(0);
    }
    
    // 🐛 BUG: userData.preferences object check
    if (userData.preferences) {
      expect(typeof userData.preferences).toBe('object');
    }
  });

  test('should validate bulk data', () => {
    const bulkData = {
      items: [],
      options: {}
    };

    // 🐛 BUG: bulkData.items array check
    if (bulkData.items) {
      console.log(\`Processing \${bulkData.items.length} items\`);
    }
    
    // 🐛 BUG: bulkData.options object check
    if (bulkData.options) {
      console.log('Options provided');
    }
  });
});`,

  "scripts/migrate.js": `// Migration script with bugs
class DatabaseMigrator {
  constructor() {
    this.appliedMigrations = new Set();
    this.pendingMigrations = [];
    this.failedMigrations = [];
  }

  async migrate() {
    console.log('Starting migration...');
    
    const migrationFiles = await this.loadMigrationFiles();
    
    // 🐛 BUG: migrationFiles array check
    if (migrationFiles) {
      console.log(\`Found \${migrationFiles.length} migration files\`);
      
      const pending = this.filterPending(migrationFiles);
      
      // 🐛 BUG: pending array check
      if (pending) {
        await this.applyMigrations(pending);
      }
    }
  }

  async loadMigrationFiles() {
    // Mock implementation
    return [];
  }

  filterPending(migrations) {
    const pending = [];
    
    // 🐛 BUG: migrations array parameter check
    if (migrations) {
      migrations.forEach(migration => {
        if (!this.appliedMigrations.has(migration.name)) {
          pending.push(migration);
        }
      });
    }
    
    return pending;
  }

  async applyMigrations(migrations) {
    const results = [];
    const errors = [];
    
    // 🐛 BUG: migrations array parameter check
    if (migrations) {
      for (const migration of migrations) {
        try {
          await this.applyMigration(migration);
          results.push(migration.name);
        } catch (error) {
          errors.push({ migration: migration.name, error });
        }
      }
    }
    
    // 🐛 BUG: errors array check
    if (errors) {
      console.log(\`Completed with \${errors.length} errors\`);
    }
  }

  async applyMigration(migration) {
    console.log(\`Applying: \${migration.name}\`);
  }
}

if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate().catch(console.error);
}

module.exports = DatabaseMigrator;`,
};

async function createProject() {
  console.log(
    "🚀 Creating eslint-plugin-no-truthy-collections test project..."
  );

  try {
    // Create directories
    const dirs = [
      "src/api",
      "src/services",
      "src/utils",
      "src/models",
      "tests",
      "scripts",
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    // Create files
    for (const [filePath, content] of Object.entries(files)) {
      await fs.writeFile(filePath, content);
      console.log(`✅ Created: ${filePath}`);
    }

    console.log(
      `\n🎉 Project created successfully!\n\nNext steps:\n1. cd into the project directory\n2. npm install\n3. npm run lint\n\nExpected: ~50+ collection truthy check errors in this simplified version!\n\nFor the FULL version with 250+ bugs, copy the additional files from the artifacts above.\n`
    );
  } catch (error) {
    console.error("❌ Error creating project:", error);
  }
}

createProject();
