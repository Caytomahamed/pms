const models = require('./index');
const db = require('../database/dbConfig');

const tableName = 'inventory';

exports.find = async (filters = {}) => {
  return await db(tableName)
    .where(filters)
    .join('orders', 'inventory.orderId', 'orders.id')
    .join('users', 'orders.farmerId', 'users.id')
    .select('inventory.*', 'users.username');
};

exports.create = async (data) => {
  return await models.create(tableName, data);
};

exports.findByIdandUpdate = async (id, data) => {
  return await models.update(tableName, { id }, data);
};

exports.findByIdandDelete = async (id) => {
  return await models.delete(tableName, { id });
};
