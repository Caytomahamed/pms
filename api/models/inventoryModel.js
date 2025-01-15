const models = require('./index');

const tableName = 'inventory';

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
