const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch directories to reduce file watcher load
config.watchFolders = ['src', 'app'];

// Use fsevents directly instead of watchman on macOS
config.server = {
  ...config.server,
  enhanceMiddleware: true,
};

// Disable watchman and use native file watching
config.cacheVersion = '1.0.0';

module.exports = config;
