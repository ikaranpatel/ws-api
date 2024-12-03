const logger = require('./logger');

/**
 * Handles WebSocket errors by logging them and sending an error message to the client
 * @param {Object} ws - The WebSocket connection
 * @param {string} errorMessage - The error message to log and send
 */
const handleWebSocketError = (ws, errorMessage) => {
  logger.error(errorMessage);
  ws.send(JSON.stringify({ event: 'error', message: errorMessage }));
};

module.exports = { handleWebSocketError };
