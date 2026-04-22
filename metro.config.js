const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Use absolute paths for watch folders
config.watchFolders = [
  path.resolve(__dirname, 'app'),
];

module.exports = config;
