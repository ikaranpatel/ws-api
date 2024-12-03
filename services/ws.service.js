const crypto = require('crypto');

let dataStore = []; // In-memory data store
const uniqueId = crypto.randomUUID();

/**
 * Loads initial default data into the in-memory data store
 */
const loadDefaultData = () => {
  dataStore = [
    { id: `${uniqueId}-1`, value: 'Default Data 1' },
    { id: `${uniqueId}-2`, value: 'Default Data 2' },
  ];
};

/**
 * Gets all stored data
 * @returns {Array} - The array of all stored data
 */
const getAllData = () => dataStore;

/**
 * Creates a new data entry
 * @param {string} value - The value of the new data
 * @returns {Object} - The newly created data object
 */
const createData = (value) => {
  const newData = { id: `${uniqueId}-${dataStore.length + 1}`, value };
  dataStore.push(newData);
  return newData;
};

/**
 * Deletes a data entry by its ID
 * @param {string} id - The ID of the data to delete
 * @returns {boolean} - Whether the deletion was successful
 */
const deleteData = (id) => {
  const index = dataStore.findIndex((data) => data.id === id);
  if (index === -1) return false;
  dataStore.splice(index, 1);
  return true;
};

module.exports = { createData, deleteData, getAllData, loadDefaultData };
