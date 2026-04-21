const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch directories to reduce file watcher load
config.watchFolders = ['src', 'app'];

module.exports = config;
