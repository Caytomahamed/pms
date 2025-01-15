const db = require('../database/dbConfig');

/**
 * Find all records in a table with optional filters.
 * @param {string} tableName - The name of the table.
 * @param {Object} [filters={}] - Optional filters for the query.
 * @returns {Promise<Array>} - List of records.
 */
exports.findAll = async (tableName, filters = {}) => {
  return await db(tableName).where(filters);
};
/**
 * Find one record in a table with filters.
 * @param {string} tableName - The name of the table.
 * @param {Object} filters - Filters for the query.
 * @returns {Promise<Object|null>} - The record or null if not found.
 */
exports.findOne = async (tableName, filters) => {
  const record = await db(tableName).where(filters).first();
  return record || null;
};

// create
/**
 * Create a new record in a table.
 * @param {string} tableName - The name of the table.
 * @param {Object} data - The data to insert.
 * @returns  {Promise<Object|null>} - The record or null if not found.
 */
exports.create = async (tableName, data) => {
  const [id] = await db(tableName).insert(data);
  return this.findOne(tableName, { id });
};

/**
 * Update records in a table based on filters.
 * @param {string} tableName - The name of the table.
 * @param {Object} filters - Filters to identify records to update.
 * @param {Object} data - The data to update.
 * @returns {Promise<number>} - The number of rows affected.
 */
exports.update = async (tableName, filters, data) => {
  const updatedRows = await db(tableName).where(filters).update(data);
  return this.findOne(tableName, filters);
};
/**
 * Delete records from a table based on filters.
 * @param {string} tableName - The name of the table.
 * @param {Object} filters - Filters to identify records to delete.
 * @returns {Promise<number>} - The number of rows deleted.
 */
exports.delete = async (tableName, filters) => {
  const deletedRows = await db(tableName).where(filters).del();
  return deletedRows;
};
