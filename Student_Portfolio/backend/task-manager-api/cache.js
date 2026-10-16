/**
 * Practical 9: In-Memory Caching and Query Optimization
 * Shared In-Memory Cache Module using node-cache
 * 
 * Configuration:
 * - stdTTL: 60 (Standard Time-To-Live of 60 seconds)
 * - checkperiod: 120 (Automatic deletion check interval in seconds)
 * 
 * Features:
 * - Exposes singleton cache instance across Express route handlers.
 * - Simple counters for tracking cache hits and misses.
 */

const NodeCache = require('node-cache');

// Configure node-cache with standard TTL of 60 seconds
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120
});

// Simple cache-hit and cache-miss counters
const stats = {
  hits: 0,
  misses: 0
};

module.exports = {
  cache,
  stats
};
