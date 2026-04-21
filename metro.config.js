const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch directories
config.watchFolders = ['src', 'app'];

// Disable watchman
config.watchman = false;

// Configure resolver to reduce watched files
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

module.exports = config;
