const knex = require('../database/dbConfig');

async function dashboard() {
  const totalFarms = await knex('users').where('roleId', 2).count('* as count');
  const totalSalesMan = await knex('users')
    .where('roleId', 3)
    .count('* as count');
  const totalCustomers = await knex('users')
    .where('roleId', 4)
    .count('* as count');
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

  const statusColor = {
    pending: '#FFCE56', // Slightly lighter amber
    accepted: '#A8E5A3', // Slightly lighter green
    declined: '#FF6384', // Slightly lighter red
    completed: '#36A2EB', // Slightly lighter blue
    in_progress: '#D8A8F0', // Slightly lighter purple
    approved: '#7ED957', // Distinct green for approved
    delivered: '#4DBDFE', // Distinct lighter blue for delivered
  };

  let orderGroupStatus = await knex('orders')
    .select('status', knex.raw('COUNT(*) as count'))
    .groupBy('status');

  orderGroupStatus = orderGroupStatus.map((item) =>
    Object.assign(item, { fill: statusColor[item.status] })
  );

  let salesGroupStatus = await knex('sales')
    .select('status', knex.raw('COUNT(*) as count'))
    .groupBy('status');

  salesGroupStatus = salesGroupStatus.map((item) =>
    Object.assign(item, { fill: statusColor[item.status] })
  );

  let replacementGroupStatus = await knex('replacements')
    .select('status', knex.raw('COUNT(*) as count'))
    .groupBy('status');

  replacementGroupStatus = replacementGroupStatus.map((item) =>
    Object.assign(item, { fill: statusColor[item.status] })
  );

  const topSalesman = await knex('sales')
    .leftJoin('users', 'sales.salesmanId', 'users.id')
    .where('sales.status', 'completed')
    .select(
      'users.*',
      knex.raw('COUNT(*) as count'),
      knex.raw(
        'SUM(CAST(actualPrice AS DECIMAL) * CAST(actualQuantity AS DECIMAL))as totalRevenue'
      )
    )
    .limit(5)
    .groupBy('sales.salesmanId')
    .orderBy('totalRevenue', 'desc');

  const topCustomer = await knex('sales')
    .leftJoin('users', 'sales.customerId', 'users.id')
    .where('sales.status', 'completed')
    .select(
      'users.*',
      knex.raw('COUNT(*) as count'),
      knex.raw(
        'SUM(CAST(actualPrice AS DECIMAL) * CAST(actualQuantity AS DECIMAL))as totalRevenue'
      )
    )
    .limit(5)
    .groupBy('users.username')
    .orderBy('totalRevenue', 'desc');

  // const totalEggOrder = await knex('orders')
  //   .select('farmerId')
  //   .count('id as totalOrders') // Total number of orders
  //   .raw('SUM(IF(status = "pending", quantity, 0)) AS pendingOrders')
  //   .raw('SUM(IF(status = "accepted", quantity, 0)) AS acceptedOrders')
  //   .raw('SUM(IF(status = "declined", quantity, 0)) AS declinedOrders')
  //   .raw('SUM(IF(status = "completed", quantity, 0)) AS completedOrders')
  //   .groupBy('farmerId');

  const currentMonth = knex.raw('DATE_FORMAT(NOW(), "%Y-%m-01")'); // First day of the current month
  const previousMonth = knex.raw(
    'DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), "%Y-%m-01")'
  ); // First day of the previous month

  // Get total orders for current and previous months
  const results = await knex('orders').select(
    knex.raw(
      'SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS currentMonthOrders',
      [currentMonth]
    ),
    knex.raw(
      'SUM(CASE WHEN created_at >= ? AND created_at < ? THEN 1 ELSE 0 END) AS previousMonthOrders',
      [previousMonth, currentMonth]
    )
  );

  const { currentMonthOrders, previousMonthOrders } = results[0];

  // Calculate percentage change
  let percentageChange = 0;
  if (previousMonthOrders > 0) {
    percentageChange =
      ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;
  } else {
    percentageChange = currentMonthOrders > 0 ? 100 : 0; // If no previous orders, handle edge case
  }

  const changes = `${percentageChange.toFixed(2)}%`;

  return {
    // totalFarms: totalFarms[0].count,
    // totalSalesMan: totalSalesMan[0].count,
    // totalCustomers: totalCustomers[0].count,
    // currentStock,
    // salesToday: sales.length,
    // totalOrders: totalOrders[0].count,
    // salesOverview,
    // orders,
    // orderGroupStatus,
    // salesGroupStatus,
    // replacementGroupStatus,
    // topSalesman,
    // topCustomer,
    // totalEggOrder,
    changes,
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

  return dashboardData;
  // salesPipelineReports,
  // orderStatusReports,
  // stockLevelsReports,
  // topSalespeopleReports,
  // replacementReasonsReports,
  // topCustomerpeopleReports
};
