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

  const currentMonth = knex.raw('DATE_FORMAT(NOW(), "%Y-%m-01")'); // First day of the current month
  const previousMonth = knex.raw(
    'DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), "%Y-%m-01")'
  );

  const inActiveUsers = await knex('users')
    .select('status', 'roleId')
    .where('status', 'Inactive')
    .count('* as count')
    .groupBy('roleId');

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
  const calculatePercentageChange = (current, previous) => {
    if (previous > 0) {
      const percentageChange = ((current - previous) / previous) * 100;
      return `${percentageChange.toFixed(1)}%`;
    } else {
      const percentageChange = current > 0 ? 100 : 0; // If no previous orders, handle edge case
      return `${percentageChange.toFixed(1)}%`;
    }
  };

  const ordersChanges = calculatePercentageChange(
    currentMonthOrders,
    previousMonthOrders
  );

  const salesIncreaseRate = await knex('sales').select(
    knex.raw(
      'SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS currentMonthSales',
      [currentMonth]
    ),
    knex.raw(
      'SUM(CASE WHEN created_at >= ? AND created_at < ? THEN 1 ELSE 0 END) AS previousMonthSales',
      [previousMonth, currentMonth]
    )
  );

  const { currentMonthSales, previousMonthSales } = salesIncreaseRate[0];

  const salesChanges = calculatePercentageChange(
    currentMonthSales,
    previousMonthSales
  );

  const replacementIncreaseRate = await knex('replacements').select(
    knex.raw(
      'SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS currentMonthReplacement',
      [currentMonth]
    ),
    knex.raw(
      'SUM(CASE WHEN created_at >= ? AND created_at < ? THEN 1 ELSE 0 END) AS previousReplacement',
      [previousMonth, currentMonth]
    )
  );

  const { currentMonthReplacement, previousReplacement } =
    replacementIncreaseRate[0];

  const replacementChanges = calculatePercentageChange(
    currentMonthReplacement,
    previousReplacement
  );

  // get orders and sales for the days of the week
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const salesByDay = await knex('sales')
    .select('created_at')
    .where(
      'created_at',
      '>=',
      new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
    )
    .orderBy('created_at', 'asc');

  const ordersByDay = await knex('orders')
    .select('created_at')
    .where(
      'created_at',
      '>=',
      new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
    )
    .orderBy('created_at', 'asc');

  // get the orders and sales by the months of the year
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const salesByMonth = await knex('sales')
    .select('created_at')
    .count('* as SalesCount')
    .where(
      'created_at',
      '>=',
      new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString()
    )
    .orderBy('created_at', 'asc')
    .groupBy('created_at');

  // update the sales by month to include the month name
  salesByMonth.forEach((item) => {
    const date = new Date(item.created_at);
    item.month = months[date.getMonth()];
  });

  const ordersByMonth = await knex('orders')
    .select('created_at')
    .count('* as OrderCount')
    .where(
      'created_at',
      '>=',
      new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString()
    )
    .orderBy('created_at', 'asc')
    .groupBy('created_at');

  // update the orders by month to include the month name
  ordersByMonth.forEach((item) => {
    const date = new Date(item.created_at);
    item.month = months[date.getMonth()];
  });

  let combinedSalesAndOrders = [...salesByMonth, ...ordersByMonth];
  // combination of sales and orders groubed by month
  combinedSalesAndOrders = combinedSalesAndOrders.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.month === item.month);
    if (existingItem) {
      existingItem.sales += item.SalesCount || 0;
      existingItem.orders += item.OrderCount || 0;
    } else {
      acc.push({
        month: item.month,
        sales: item.SalesCount || 0,
        orders: item.OrderCount || 0,
      });
    }
    return acc;
  }, []);

  console.log(combinedSalesAndOrders);

  return {
    totalFarms: totalFarms[0].count,
    totalSalesMan: totalSalesMan[0].count,
    totalCustomers: totalCustomers[0].count,
    currentStock,
    salesToday: sales.length,
    totalOrders: totalOrders[0].count,
    salesOverview,
    orders,
    orderGroupStatus,
    salesGroupStatus,
    replacementGroupStatus,
    topSalesman,
    topCustomer,
    inActiveUsers,
    salesChanges,
    ordersChanges,
    replacementChanges,
    ordersByDay,
    salesByDay,
    ordersByMonth,
    salesByMonth,
    combinedSalesAndOrders,
  };
}

// Main function to fetch all analytics
exports.find = async function () {
  const dashboardData = await dashboard();

  return dashboardData;
};

// const knex = require('./your-knex-config'); // Import your Knex instance

async function generateReport({
  tableName,
  reportType,
  inputDate,
  inputMonth,
  inputYear,
}) {
  // Validate required parameters
  if (!tableName || !reportType) {
    throw new Error('Missing required parameters: tableName and reportType');
  }

  const validTables = [
    'users',
    'sales',
    'roles',
    'replacements',
    'orders',
    'inventory',
  ];
  if (!validTables.includes(tableName)) {
    throw new Error('Invalid table name');
  }

  let query = knex(tableName);

  switch (reportType.toLowerCase()) {
    case 'daily':
      if (!inputDate) throw new Error('inputDate required for daily reports');
      query.whereRaw('DATE(created_at) = ?', [inputDate]);
      break;

    case 'weekly':
      if (!inputDate) throw new Error('inputDate required for weekly reports');
      query.whereRaw('YEARWEEK(created_at, 1) = YEARWEEK(?, 1)', [inputDate]);
      break;

    case 'monthly':
      if (!inputMonth || !inputYear)
        throw new Error(
          'inputMonth and inputYear required for monthly reports'
        );
      query
        .whereRaw('MONTH(created_at) = ?', [inputMonth])
        .whereRaw('YEAR(created_at) = ?', [inputYear]);
      break;

    case 'yearly':
      if (!inputYear) throw new Error('inputYear required for yearly reports');
      query.whereRaw('YEAR(created_at) = ?', [inputYear]);
      break;

    default:
      throw new Error(
        'Invalid report type. Use: daily, weekly, monthly, yearly'
      );
  }

  return query.select('*');
}

// Usage Example
// generateReport({
//   tableName: 'sales',
//   reportType: 'weekly',
//   inputDate: '2024-03-01',
// })
//   .then((results) => console.log('Weekly Sales Report:', results))
//   .catch((err) => console.error('Report Error:', err));
