const models = require('./index');
const db = require('../database/dbConfig');
const tableName = 'replacements';

exports.find = async (filters = {}) => {
  return await models.findAll(tableName, filters);
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

exports.findByFarmerReplacement = async (orderId) => {
  return await db('replacements as r')
    .select(
      'r.id as id',
      'r.orderId',
      'r.quantity',
      'r.reason',
      'r.status',
      'r.deadline',
      'r.created_at',
      'r.updated_at'
    )
    .join('orders as o', 'o.id', 'r.orderId') // Fixed join condition
    .join('users as u', 'u.id', 'o.farmerId') // Fixed join condition
    .where('o.id', orderId); // Filter by orderId
};

exports.updateReplacementToCompleted = async (currentTime) => {
  return await db('replacements')
    .where('deadline', '<', currentTime) // Check for past deadlines
    .andWhere('status', '!=', 'delivered') // Ensure not already completed
    .update({ status: 'delive' });
};
