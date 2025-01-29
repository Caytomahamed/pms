const models = require('./index');
const db = require('../database/dbConfig');

const tableName = 'orders';

exports.find = async (filters = {}) => {
  return await db('orders')
    .join('users', 'users.id', 'orders.farmerId')
    .select('orders.*', 'users.fullName');
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

exports.updateOrdersToCompleted = async (currentTime) => {
  return await db('orders')
    .where('deadline', '<', currentTime) // Check for past deadlines
    .andWhere('status', '!=', 'completed') // Ensure not already completed
    .update({ status: 'completed' });
};
