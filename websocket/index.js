const WebSocket = require('ws');
const { handleEvent } = require('../controllers/ws.controller');
const { loadDefaultData, getAllData } = require('../services/ws.service');
const { handleWebSocketError } = require('../utils/error-handler');
const logger = require('../utils/logger');
const { PORT, WS_TIME_INTERVAL } = require('../config/server.config');

/**
 * Initialize WebSocket server and handle client connections
 */
const initializeWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: PORT });

  wss.on('connection', (ws) => {
    logger.info('New WebSocket connection established');

    // Set up heartbeat mechanism
    ws.isAlive = true;
    ws.on('pong', () => (ws.isAlive = true));

    // Send initial data
    try {
      const defaultData = getAllData();
      ws.send(JSON.stringify({ event: 'updateData', data: defaultData }));
    } catch (error) {
      handleWebSocketError(ws, `Failed to send initial data: ${error.message}`);
    }

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const { event, data } = JSON.parse(message);
        handleEvent(wss, ws, event, data);
      } catch (error) {
        handleWebSocketError(ws, `Message parsing error: ${error.message}`);
      }
    });

    // Handle disconnection
    ws.on('close', () => logger.info('WebSocket connection closed'));
  });

  // Periodically check client heartbeat
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, WS_TIME_INTERVAL);

  // Load default data into memory on server startup
  loadDefaultData();
  logger.info('WebSocket server initialized on port', PORT);
};

module.exports = { initializeWebSocketServer };
