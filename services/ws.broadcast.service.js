const WebSocket = require('ws');
const { handleWebSocketError } = require('../utils/error-handler');

/**
 * Broadcasts updated data to all connected WebSocket clients
 * @param {Object} wss - The WebSocket server instance
 * @param {Array} updatedData - The updated data to send to clients
 */
const broadcastUpdatedData = (wss, updatedData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({ event: 'updateData', data: updatedData }));
      } catch (error) {
        handleWebSocketError(client, `Broadcast error: ${error.message}`);
      }
    }
  });
};

module.exports = { broadcastUpdatedData };
