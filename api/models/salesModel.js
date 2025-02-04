const models = require('./index');
const db = require('../database/dbConfig');

const tableName = 'sales';

exports.find = async (filters = {}) => {
  return await db("sales as s")
    .join('users as salesman', 's.salesmanId', 'salesman.id')
    .join('users as customer', 's.customerId', 'customer.id')
    .select(
      's.*',
      'salesman.username as salesman ',
      'customer.username as customerName'
    );
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
