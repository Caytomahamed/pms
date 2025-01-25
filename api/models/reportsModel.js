const knex = require('../database/dbConfig');

async function dashboard() {
  const totalFarms = await knex('users').where('roleId', 2).count('* as count');
  const totalOrders = await knex('orders').count('* as count');
  const orders = await knex('orders')
    .join('users', 'users.id', 'orders.farmerId')
    .select('orders.*', 'users.username')
    .orderBy('id', 'desc')
    .limit(5);
  const inventory = await knex('inventory');

  const inventoryStockQuanty = await inventory.reduce(
    (acc, item) => acc + item.total,
    0
  );
  const inventroyStockDamaged = await inventory.reduce(
    (acc, item) => acc + item.damaged,
    0
  );

  const currentStock = inventoryStockQuanty - inventroyStockDamaged;

  const sales = await knex('sales').where(
    'deadline',
    '=',
    new Date().toISOString().split('T')[0]
  );

  const salesOverview = await knex('sales').select(
    'created_at',
    'estimatedPrice'
  );

  return {
    totalFarms: totalFarms[0].count,
    currentStock,
    salesToday: sales.length,
    totalOrders: totalOrders[0].count,
    salesOverview,
    orders,
  };
}

//// report
const usersReport = async (req, res) => {
  return await knex('users')
    .leftJoin('roles', 'users.roleId', 'roles.id')
    .groupBy('roles.name')
    .select('roles.name as role', knex.raw('COUNT(*) as count'));
};

const salesPipelineReport = async (req, res) => {
  return await knex('sales')
    .select(
      'sales.*',
      'salesman.username as salesman',
      'customer.username as customer'
    )
    .leftJoin('users as salesman', 'sales.salesmanId', 'salesman.id')
    .leftJoin('users as customer', 'sales.customerId', 'customer.id');
};

const orderStatusReport = async (req, res) => {
  return await knex('orders')
    .select('status', knex.raw('COUNT(*) as count'))
    .groupBy('status');
};

const ReplacementStatusReport = async (req, res) => {
  return await knex('replacements')
    .select('status', knex.raw('COUNT(*) as count'))
    .groupBy('status');
};

const stockLevelsReport = async (req, res) => {
  return await knex('inventory')
    .select(
      'inventory.*',
      knex.raw('(total - damaged) as available'),
      'orders.deadline'
    )
    .leftJoin('orders', 'inventory.orderId', 'orders.id');
};
const topSalespeopleReport = async (req, res) => {
  return await knex('sales')
    .where('sales.status', 'completed')
    .groupBy('salesmanId')
    .orderBy('totalRevenue', 'desc')
    .leftJoin('users', 'sales.salesmanId', 'users.id')
    .select(
      'users.*',
      knex.raw(`
          SUM(CAST(actualPrice AS DECIMAL) * CAST(actualQuantity AS DECIMAL)) as totalRevenue
        `)
    );
};

const topCustomerpeopleReport = async (req, res) => {
  return await knex('sales')
    .where('sales.status', 'completed')
    .groupBy('customerId')
    .orderBy('totalRevenue', 'desc')
    .leftJoin('users', 'sales.salesmanId', 'users.id')
    .select(
      'users.*',
      knex.raw(`
          SUM(CAST(actualPrice AS DECIMAL) * CAST(actualQuantity AS DECIMAL)) as totalRevenue
        `)
    );
};

// const replacementReasonsReport = async (req, res) => {
//   return await knex('replacements')
//     .select('reason', knex.raw('COUNT(*) as count'))
//     .groupBy('reason')
//     .orderBy('count', 'desc');
// };

// Main function to fetch all analytics
exports.find = async function () {
  const dashboardData = await dashboard();
  const usersReports = await usersReport();
  const salesPipelineReports = await salesPipelineReport();
  const orderStatusReports = await orderStatusReport();
  const stockLevelsReports = await stockLevelsReport();
  const topSalespeopleReports = await topSalespeopleReport();
  const replacementReasonsReports = await ReplacementStatusReport();
  const topCustomerpeopleReports = await topCustomerpeopleReport();

  return {
    usersReports,
    salesPipelineReports,
    orderStatusReports,
    stockLevelsReports,
    topSalespeopleReports,
    replacementReasonsReports,
    topCustomerpeopleReports
    // dashboardData,
  };
};
