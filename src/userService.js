/**
 * User Service - Realistic business logic with collection truthy check bugs
 * This file contains 30+ bugs that eslint-plugin-no-truthy-collections should catch
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.cache = new Map();
    this.activeUsers = new Set();
    this.searchIndexes = [];
    this.validationRules = {};
    this.userPreferences = new Map();
  }

  /**
   * Create a new user account
   * Expected bugs: 4-5 collection checks
   */
  async createUser(userData, options = {}) {
    const errors = [];
    const warnings = [];

    // 🐛 BUG #1: options object check - always truthy even when {}
    if (options) {
      console.log("Processing user creation with options");
    }

    // Validate required fields
    // 🐛 BUG #2: userData.roles array check - always truthy even when []
    if (userData.roles) {
      const validRoles = ["admin", "user", "moderator"];
      const invalidRoles = userData.roles.filter(
        (role) => !validRoles.includes(role)
      );

      // 🐛 BUG #3: invalidRoles array check - always truthy even when []
      if (invalidRoles) {
        errors.push(`Invalid roles: ${invalidRoles.join(", ")}`);
      }
    }

    // Process user tags
    // 🐛 BUG #4: userData.tags array check
    if (userData.tags) {
      userData.tags = userData.tags.map((tag) => tag.toLowerCase().trim());

      const duplicateTags = this.findDuplicates(userData.tags);
      // 🐛 BUG #5: duplicateTags array check
      if (duplicateTags) {
        warnings.push(`Duplicate tags removed: ${duplicateTags.join(", ")}`);
      }
    }

    // 🐛 BUG #6: errors array check - always truthy even when []
    if (errors) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = {
      ...userData,
      password: hashedPassword,
      id: this.generateUserId(),
      createdAt: new Date(),
      preferences: userData.preferences || {},
    };

    // Add to cache and active users
    this.cache.set(user.id, user);
    this.activeUsers.add(user.id);

    return user;
  }

  /**
   * Search users with filters and pagination
   * Expected bugs: 6-8 collection checks
   */
  async searchUsers(query, filters = {}, options = {}) {
    let results = await this.getAllUsers();

    // Apply text search
    if (query) {
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    // 🐛 BUG #7: filters object check - always truthy even when {}
    if (filters) {
      // Filter by roles
      // 🐛 BUG #8: filters.roles array check
      if (filters.roles) {
        results = results.filter(
          (user) =>
            user.roles &&
            user.roles.some((role) => filters.roles.includes(role))
        );
      }

      // Filter by tags
      // 🐛 BUG #9: filters.tags array check
      if (filters.tags) {
        results = results.filter((user) => {
          // 🐛 BUG #10: user.tags array check
          if (user.tags) {
            return filters.tags.some((tag) => user.tags.includes(tag));
          }
          return false;
        });
      }

      // Filter by creation date range
      // 🐛 BUG #11: filters.dateRange object check
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        results = results.filter((user) => {
          const userDate = new Date(user.createdAt);
          return userDate >= new Date(start) && userDate <= new Date(end);
        });
      }
    }

    // Apply sorting
    // 🐛 BUG #12: options.sort array check
    if (options.sort) {
      results.sort((a, b) => {
        for (const sortRule of options.sort) {
          const { field, direction } = sortRule;
          const aVal = a[field];
          const bVal = b[field];

          if (aVal !== bVal) {
            return direction === "desc"
              ? bVal > aVal
                ? 1
                : -1
              : aVal > bVal
              ? 1
              : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return {
      users: paginatedResults,
      total: results.length,
      page,
      limit,
      hasMore: startIndex + limit < results.length,
    };
  }

  /**
   * Update user preferences with validation
   * Expected bugs: 5-7 collection checks
   */
  async updateUserPreferences(userId, preferences = {}) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedPreferences = { ...user.preferences };

    // 🐛 BUG #13: preferences object check - always truthy even when {}
    if (preferences) {
      // Update notification preferences
      // 🐛 BUG #14: preferences.notifications object check
      if (preferences.notifications) {
        updatedPreferences.notifications = {
          ...updatedPreferences.notifications,
          ...preferences.notifications,
        };

        // Validate notification categories
        // 🐛 BUG #15: preferences.notifications.categories array check
        if (preferences.notifications.categories) {
          const validCategories = ["email", "sms", "push", "system"];
          const invalidCategories = preferences.notifications.categories.filter(
            (cat) => !validCategories.includes(cat)
          );

          // 🐛 BUG #16: invalidCategories array check
          if (invalidCategories) {
            throw new Error(
              `Invalid notification categories: ${invalidCategories.join(", ")}`
            );
          }
        }
      }

      // Update privacy settings
      // 🐛 BUG #17: preferences.privacy object check
      if (preferences.privacy) {
        updatedPreferences.privacy = {
          ...updatedPreferences.privacy,
          ...preferences.privacy,
        };

        // Validate blocked users
        // 🐛 BUG #18: preferences.privacy.blockedUsers array check
        if (preferences.privacy.blockedUsers) {
          const existingUsers = await this.validateUserIds(
            preferences.privacy.blockedUsers
          );
          updatedPreferences.privacy.blockedUsers = existingUsers;
        }
      }

      // Update dashboard widgets
      // 🐛 BUG #19: preferences.dashboard object check
      if (preferences.dashboard) {
        // 🐛 BUG #20: preferences.dashboard.widgets array check
        if (preferences.dashboard.widgets) {
          const validatedWidgets = preferences.dashboard.widgets.filter(
            (widget) => widget.type && widget.position
          );
          updatedPreferences.dashboard = {
            ...updatedPreferences.dashboard,
            widgets: validatedWidgets,
          };
        }
      }
    }

    // Update user and cache
    user.preferences = updatedPreferences;
    this.cache.set(userId, user);
    this.userPreferences.set(userId, updatedPreferences);

    return updatedPreferences;
  }

  /**
   * Process user analytics and metrics
   * Expected bugs: 8-10 collection checks
   */
  async generateUserAnalytics(userId, timeRange = {}) {
    const user = await this.getUserById(userId);
    const analytics = {
      userId,
      period: timeRange,
      metrics: {},
      activities: [],
      summary: {},
    };

    // Get user activities
    const activities = await this.getUserActivities(userId, timeRange);
    // 🐛 BUG #21: activities array check
    if (activities) {
      analytics.activities = activities;
      analytics.summary.totalActivities = activities.length;

      // Group activities by type
      const activityGroups = {};
      activities.forEach((activity) => {
        if (!activityGroups[activity.type]) {
          activityGroups[activity.type] = [];
        }
        activityGroups[activity.type].push(activity);
      });

      analytics.metrics.activityTypes = Object.keys(activityGroups).map(
        (type) => ({
          type,
          count: activityGroups[type].length,
          // 🐛 BUG #22: activityGroups[type] array check (always truthy)
          latestActivity: activityGroups[type] ? activityGroups[type][0] : null,
        })
      );
    }

    // Analyze user connections
    const connections = await this.getUserConnections(userId);
    // 🐛 BUG #23: connections array check
    if (connections) {
      analytics.summary.totalConnections = connections.length;

      const connectionsByType = this.groupBy(connections, "type");
      // 🐛 BUG #24: Object.keys() result check (always truthy)
      const connectionTypes = Object.keys(connectionsByType);
      if (connectionTypes) {
        analytics.metrics.connectionBreakdown = connectionTypes.map((type) => ({
          type,
          count: connectionsByType[type].length,
        }));
      }
    }

    // Process user-generated content
    const userContent = await this.getUserContent(userId);
    // 🐛 BUG #25: userContent object check
    if (userContent) {
      // 🐛 BUG #26: userContent.posts array check
      if (userContent.posts) {
        analytics.summary.totalPosts = userContent.posts.length;

        const recentPosts = userContent.posts.slice(0, 5);
        // 🐛 BUG #27: recentPosts array check (always truthy after slice)
        if (recentPosts) {
          analytics.metrics.recentPosts = recentPosts.map((post) => ({
            id: post.id,
            title: post.title,
            createdAt: post.createdAt,
            // 🐛 BUG #28: post.tags array check
            tags: post.tags ? post.tags.length : 0,
          }));
        }
      }

      // 🐛 BUG #29: userContent.comments array check
      if (userContent.comments) {
        analytics.summary.totalComments = userContent.comments.length;
      }
    }

    return analytics;
  }

  /**
   * Bulk operations with batch processing
   * Expected bugs: 4-5 collection checks
   */
  async bulkUpdateUsers(userIds = [], updates = {}) {
    const results = [];
    const failures = [];

    // 🐛 BUG #30: userIds array check - always truthy even when []
    if (userIds) {
      for (const userId of userIds) {
        try {
          const user = await this.getUserById(userId);
          if (user) {
            // Apply updates
            const updatedUser = { ...user, ...updates };

            // 🐛 BUG #31: updates.tags array check
            if (updates.tags) {
              updatedUser.tags = [...(user.tags || []), ...updates.tags];
            }

            await this.updateUser(userId, updatedUser);
            results.push({ userId, status: "success" });
          } else {
            failures.push({ userId, error: "User not found" });
          }
        } catch (error) {
          failures.push({ userId, error: error.message });
        }
      }
    }

    // 🐛 BUG #32: failures array check - always truthy even when []
    if (failures) {
      console.warn(`Bulk update completed with ${failures.length} failures`);
    }

    return {
      successful: results.length,
      failed: failures.length,
      results,
      failures,
    };
  }

  /**
   * Cache and performance optimization methods
   * Expected bugs: 3-4 collection checks
   */
  optimizePerformance() {
    // Clean up inactive users from cache
    const inactiveUsers = [];

    // 🐛 BUG #33: this.activeUsers Set check - always truthy
    if (this.activeUsers) {
      this.cache.forEach((user, userId) => {
        if (!this.activeUsers.has(userId)) {
          inactiveUsers.push(userId);
        }
      });
    }

    // 🐛 BUG #34: inactiveUsers array check
    if (inactiveUsers) {
      inactiveUsers.forEach((userId) => {
        this.cache.delete(userId);
        this.userPreferences.delete(userId);
      });
      console.log(
        `Cleaned up ${inactiveUsers.length} inactive users from cache`
      );
    }

    // Rebuild search indexes
    // 🐛 BUG #35: this.searchIndexes array check - always truthy
    if (this.searchIndexes) {
      this.searchIndexes.length = 0; // Clear existing indexes
      this.buildSearchIndexes();
    }
  }

  // Helper methods (some with additional bugs)

  findDuplicates(array) {
    const seen = new Set();
    const duplicates = [];

    // 🐛 BUG #36: array parameter check
    if (array) {
      array.forEach((item) => {
        if (seen.has(item)) {
          duplicates.push(item);
        } else {
          seen.add(item);
        }
      });
    }

    return duplicates;
  }

  groupBy(array, key) {
    const groups = {};

    // 🐛 BUG #37: array parameter check
    if (array) {
      array.forEach((item) => {
        const groupKey = item[key];
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
      });
    }

    return groups;
  }

  // Mock methods for demonstration
  async getAllUsers() {
    return [];
  }
  async getUserById(id) {
    return null;
  }
  async updateUser(id, user) {
    return user;
  }
  async getUserActivities(id, range) {
    return [];
  }
  async getUserConnections(id) {
    return [];
  }
  async getUserContent(id) {
    return { posts: [], comments: [] };
  }
  async validateUserIds(ids) {
    return ids;
  }
  generateUserId() {
    return "user_" + Date.now();
  }
  buildSearchIndexes() {
    /* rebuild indexes */
  }
}

module.exports = UserService;

/*
EXPECTED BUGS SUMMARY (37 total):
=====================================

Basic Collection Checks:
- Arrays: userIds, roles, tags, activities, connections, etc. (20+ bugs)
- Objects: options, filters, preferences, userContent, etc. (10+ bugs) 
- Sets: activeUsers (2 bugs)
- Maps: cache, userPreferences (1 bug)

Nested Collection Checks:
- preferences.notifications.categories
- preferences.privacy.blockedUsers  
- preferences.dashboard.widgets
- userContent.posts, userContent.comments
- Multiple levels of nesting

Function Parameter Collections:
- Arrays passed as parameters
- Objects passed as options
- Default empty collections

Your plugin should detect ALL of these! 🚨
*/
