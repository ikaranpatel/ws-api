const dataService = require('../services/ws.service');
const { broadcastUpdatedData } = require('../services/ws.broadcast.service');
const { handleWebSocketError } = require('../utils/error-handler');

/**
 * Handles the incoming event and calls the relevant service
 * @param {Object} wss - The WebSocket server
 * @param {Object} ws - The WebSocket connection
 * @param {string} event - The event name
 * @param {Object} data - The data sent with the event
 */
const handleEvent = (wss, ws, event, data) => {
  switch (event) {
    case 'fetchData':
      fetchData(ws);
      break;
    case 'createData':
      if (!data || !data.value) {
        handleWebSocketError(ws, 'Invalid data payload for createData event.');
        return;
      }
      createData(wss, ws, data);
      break;
    case 'deleteData':
      if (!data || !data.id) {
        handleWebSocketError(ws, 'Invalid data payload for deleteData event.');
        return;
      }
      deleteData(wss, ws, data);
      break;
    default:
      handleWebSocketError(ws, `Unknown event type: ${event}`);
  }
};

const fetchData = (ws) => {
  const data = dataService.getAllData();
  ws.send(JSON.stringify({ event: 'updateData', data }));
};

const createData = (wss, ws, data) => {
  dataService.createData(data.value);
  const updatedData = dataService.getAllData();
  broadcastUpdatedData(wss, updatedData);
};

const deleteData = (wss, ws, data) => {
  const success = dataService.deleteData(data.id);
  if (!success) {
    handleWebSocketError(ws, `Data with ID ${data.id} not found.`);
    return;
  }
  const updatedData = dataService.getAllData();
  broadcastUpdatedData(wss, updatedData);
};

module.exports = { handleEvent, fetchData, createData, deleteData };
