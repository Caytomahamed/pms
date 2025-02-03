const knex = require('../database/dbConfig');

const statusColor = {
  pending: '#FFCE56', // Slightly lighter amber
  accepted: '#A8E5A3', // Slightly lighter green
  declined: '#FF6384', // Slightly lighter red
  completed: '#36A2EB', // Slightly lighter blue
  in_progress: '#D8A8F0', // Slightly lighter purple
  approved: '#7ED957', // Distinct green for approved
  delivered: '#4DBDFE', // Distinct lighter blue for delivered
};

exports.findGroupedStatus = async (table, inputMonth, inputYear) => {
  return (
    await knex(table)
      .select('status', knex.raw('COUNT(*) as count'))
      .whereRaw('MONTH(created_at) = ?', [inputMonth])
      .whereRaw('YEAR(created_at) = ?', [inputYear])
      .groupBy('status')
  ).map((item) => ({ ...item, fill: statusColor[item.status] }));
};

exports.findIncreaseRate = async (table, inputMonth, inputYear) => {
  // Compute first day of the selected and previous month
  const currentFirstDay = new Date(inputYear, inputMonth - 1, 1); // e.g. 2024-02-01
  const nextMonthFirstDay = new Date(inputYear, inputMonth, 1); // Next month's first day
  const previousFirstDay = new Date(inputYear, inputMonth - 2, 1); // Previous month first day

  // Convert to MySQL-compatible date format
  const currentDateStr = currentFirstDay.toISOString().slice(0, 10);
  const nextMonthDateStr = nextMonthFirstDay.toISOString().slice(0, 10);
  const previousDateStr = previousFirstDay.toISOString().slice(0, 10);

  // Query database for counts
  const result = await knex(table)
    .select(
      knex.raw(
        `SUM(CASE WHEN created_at >= ? AND created_at < ? THEN 1 ELSE 0 END) AS currentMonth`,
        [currentDateStr, nextMonthDateStr]
      ),
      knex.raw(
        `SUM(CASE WHEN created_at >= ? AND created_at < ? THEN 1 ELSE 0 END) AS previousMonth`,
        [previousDateStr, currentDateStr]
      )
    )
    .first(); // Ensure we get one row

  // Extract counts with safe defaults
  const currentMonth = result?.currentMonth || 0;
  const previousMonth = result?.previousMonth || 0;

  console.log(`Current Month (${inputYear}-${inputMonth}):`, currentMonth);
  console.log(
    `Previous Month (${inputYear}-${inputMonth - 1}):`,
    previousMonth
  );

  // Function to calculate percentage increase
  const calculatePercentageChange = (current, previous) => {
    if (previous > 0) {
      return `${(((current - previous) / previous) * 100).toFixed(1)}%`;
    } else {
      return current > 0 ? '100%' : '0%';
    }
  };

  return calculatePercentageChange(currentMonth, previousMonth);
};

exports.findLatestProdution = async () => {
  return await knex('productions')
    .join('users', 'users.id', 'productions.farmerId')
    .select('productions.*', 'users.username')
    .orderBy('productions.id', 'desc')
    .limit(5);
};

exports.findSalesOverview = async (inputYear) => {
  return await knex('sales')
    .select('created_at', 'estimatedPrice')
    .whereRaw('YEAR(created_at) = ?', [inputYear]);
};

exports.findLatestOrders = async () => {
  return await knex('orders')
    .join('users', 'users.id', 'orders.farmerId')
    .select('orders.*', 'users.username')
    .orderBy('id', 'desc')
    .limit(5);
};

exports.findTopCustoemrs = async () => {
  return await knex('sales')
    .leftJoin('users', 'sales.customerId', 'users.id')
    .where('sales.status', 'completed')
    .select(
      'users.fullName',
      'users.phone',
      knex.raw('COUNT(*) as count'),
      knex.raw(
        'SUM(CAST(estimatedPrice AS DECIMAL) * CAST(quantity AS DECIMAL)) as totalRevenue'
      )
    )
    .limit(5)
    .groupBy('users.username')
    .orderBy('totalRevenue', 'desc');
};

exports.findTopSaleman = async () => {
  return await knex('sales')
    .leftJoin('users', 'sales.salesmanId', 'users.id')
    .where('sales.status', 'completed')
    .select(
      'users.fullName',
      'users.phone',
      knex.raw('COUNT(*) as count'),
      knex.raw(
        'SUM(CAST(estimatedPrice AS DECIMAL) * CAST(quantity AS DECIMAL))as totalRevenue'
      )
    )
    .limit(5)
    .groupBy('sales.salesmanId')
    .orderBy('totalRevenue', 'desc');
};

exports.findComparison = async (inputYear) => {
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
    .select(
      'created_at',
      knex.raw('SUM(CAST(quantity AS DECIMAL) * 360) as SalesCount')
    )
    .whereRaw('YEAR(created_at) = ?', [inputYear])
    .where(
      'created_at',
      '>=',
      new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString()
    )
    .orderBy('created_at', 'asc')
    .groupBy('created_at');

  const ordersByMonth = await knex('orders')
    .select(
      'created_at',
      knex.raw('SUM(CAST(quantity AS DECIMAL) * 360) as OrderCount')
    )
    .whereRaw('YEAR(created_at) = ?', [inputYear])
    .where(
      'created_at',
      '>=',
      new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString()
    )
    .orderBy('created_at', 'asc')
    .groupBy('created_at');

  const productionByMonth = await knex('productions')
    .select(
      'created_at',
      knex.raw('SUM((cartoon * 360) + (tray * 30) + piece) as productionCount')
    )
    .whereRaw('YEAR(created_at) = ?', [inputYear])
    .where(
      'created_at',
      '>=',
      new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString()
    )
    .orderBy('created_at', 'asc')
    .groupBy('created_at');

  // update the sales by month to include the month name and if the month have no sales, set the sales to 0
  salesByMonth.forEach((item) => {
    const date = new Date(item.created_at);
    item.month = months[date.getMonth()];
  });

  // update the orders by month to include the month name
  ordersByMonth.forEach((item) => {
    const date = new Date(item.created_at);
    item.month = months[date.getMonth()];
  });

  // update the production by month to include the month name
  productionByMonth.forEach((item) => {
    const date = new Date(item.created_at);
    item.month = months[date.getMonth()];
  });

  let combinedSalesAndOrders = [
    ...salesByMonth,
    ...ordersByMonth,
    ...productionByMonth,
  ];
  // combination of sales and orders groubed by month
  combinedSalesAndOrders = combinedSalesAndOrders.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.month === item.month);
    if (existingItem) {
      existingItem.sales += item.SalesCount || 0;
      existingItem.orders += item.OrderCount || 0;
      existingItem.production += item.productionCount || 0;
    } else {
      acc.push({
        month: item.month,
        sales: item.SalesCount || 0,
        orders: item.OrderCount || 0,
        production: item.productionCount || 0,
      });
    }
    return acc;
  }, []);

  return combinedSalesAndOrders;
};

async function findGroupedStatus(table) {
  const inputMonth = new Date().getMonth();
  const inputYear = new Date().getFullYear();

  console.log('input Month', inputMonth);

  const statusColor = {
    pending: '#FFCE56', // Slightly lighter amber
    accepted: '#A8E5A3', // Slightly lighter green
    declined: '#FF6384', // Slightly lighter red
    completed: '#36A2EB', // Slightly lighter blue
    in_progress: '#D8A8F0', // Slightly lighter purple
    approved: '#7ED957', // Distinct green for approved
    delivered: '#4DBDFE', // Distinct lighter blue for delivered
  };
  return (
    await knex(table)
      .select('status', knex.raw('COUNT(*) as count'))
      .whereRaw('MONTH(created_at) = ?', [inputMonth])
      .whereRaw('YEAR(created_at) = ?', [inputYear])
      .groupBy('status')
  ).map((item) => ({ ...item, fill: statusColor[item.status] }));
}

exports.findProudctionStatus = async (inputMonth, inputYear) => {
  const production = await knex('productions')
    .join('users', 'users.id', 'productions.farmerId')
    .groupBy('productions.farmerId')
    .sum('productions.cartoon as totalCartoon')
    .sum('productions.tray as totalTray')
    .sum('productions.piece as totalPiece')
    .whereRaw('MONTH(productions.created_at) = ?', [inputMonth])
    .whereRaw('YEAR(productions.created_at) = ?', [inputYear])
    .select('users.username')
    .limit(5);

  // random color generator with light color
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // calculate the total carton = 360 and tray = 30 and piece = 1 total piece = carton * 360 + tray * 30 + piece
  production.map((data) => {
    data.status = data.username;
    data.count =
      data.totalCartoon * 360 + data.totalTray * 30 + data.totalPiece;
    data.fill = randomColor();

    delete data.username;
    delete data.totalCartoon;
    delete data.totalTray;
    delete data.totalPiece;
  });

  return production;
};

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

  // Get the status of the orders,  sales and replacements
  let orderGroupStatus = await findGroupedStatus('orders');
  let salesGroupStatus = await findGroupedStatus('sales');
  let replacementGroupStatus = await findGroupedStatus('replacements');

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
        'SUM(CAST(actualPrice AS DECIMAL) * CAST(actualQuantity AS DECIMAL)) as totalRevenue'
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

exports.generateReport = ({
  tableName,
  reportType,
  inputDate,
  inputMonth,
  inputYear,
}) => {
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

  return;
};

// Usage Example
// generateReport({
//   tableName: 'sales',
//   reportType: 'weekly',
//   inputDate: '2024-03-01',
// })
//   .then((results) => console.log('Weekly Sales Report:', results))
//   .catch((err) => console.error('Report Error:', err));
