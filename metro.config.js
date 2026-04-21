const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch directories
config.watchFolders = ['src', 'app'];

// Configure Metro server to use fewer file watchers
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => middleware,
};

// Add custom cache version to force rebuild
config.cacheVersion = '1.0.0';

module.exports = config;
