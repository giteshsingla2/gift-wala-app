// The server/ folder is a separate Next.js project; keep Metro from crawling it.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [...[].concat(config.resolver.blockList ?? []), /\/server\/.*/];

module.exports = config;
