const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch directories to reduce file watcher load
config.watchFolders = ['src', 'app'];

// Disable watchman to avoid EMFILE errors on macOS
config.watchman = false;

module.exports = config;
