const models = require('./index');
const db = require('../database/dbConfig');

const tableName = 'productions';

// cartoon = 360
// tray = 30
exports.find = async (filters = {}) => {
  return await db(tableName)
    .join('users', 'users.id', 'productions.farmerId')
    .select('productions.*', 'users.username');
};

exports.findStatus = async () => {
  const production = await db(tableName)
    .join('users', 'users.id', 'productions.farmerId')
    .groupBy('productions.farmerId')
    .sum('productions.cartoon as totalCartoon')
    .sum('productions.tray as totalTray')
    .sum('productions.piece as totalPiece')
    .select('users.username')
    .limit(5);

  // random color generator with light color
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // calculate the total carton = 360 and tray = 30 and piece = 1 total piece = carton * 360 + tray * 30 + piece
  production.forEach((data) => {
    data.total =
      data.totalCartoon * 360 + data.totalTray * 30 + data.totalPiece;
    data.fill = randomColor();
  });

  return production;
};

exports.findTopByFarmerId = async (farmerId) => {
  return await db(tableName)
    .join('users', 'users.id', 'productions.farmerId')
    .select('productions.*', 'users.username')
    .where('farmerId', farmerId)
    .orderBy('productions.id', 'desc');
};

exports.findLatestProdution = async () => {
  return await db(tableName)
    .join('users', 'users.id', 'productions.farmerId')
    .select('productions.*', 'users.username')
    .orderBy('productions.id', 'desc')
    .limit(5);
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
