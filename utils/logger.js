/**
 * Simple logger utility to standardize console outputs.
 * Helps in tracking server events and debugging.
 */
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`)
};

module.exports = logger;
