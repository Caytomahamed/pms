const knex = require('../database/dbConfig');

// Helper function for percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 100; // Avoid division by zero
  return (((current - previous) / previous) * 100).toFixed(1);
};

async function dashboard() {
  const totalFarms = await knex('users').where('roleId', 2).count('* as count');
  const totalOrders = await knex('orders').count('* as count');
  const orders = await knex('orders')
    .select('*')
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

// Farms Analytics
async function findFarmsAnalytics() {
  const totalFarms = await knex('users').where('roleId', 2).count('* as count');
  const farmsLastMonth = 10; // Example previous data

  const averageDailySupply = 1234; // Mocked current supply data
  const dailySupplyLastMonth = 1175; // Example previous data

  const qualityScore = 4.8; // Mocked data
  const qualityScoreLastMonth = 4.6;

  const onTimeDelivery = 94.2; // Mocked data
  const onTimeDeliveryLastMonth = 93.1;

  return {
    totalFarms: `${totalFarms[0].count} (+${
      totalFarms[0].count - farmsLastMonth
    } from last month)`,
    averageDailySupply: `${averageDailySupply} dozens (+${calculatePercentageChange(
      averageDailySupply,
      dailySupplyLastMonth
    )}% from last month)`,
    qualityScore: `${qualityScore}/5 (+${(
      qualityScore - qualityScoreLastMonth
    ).toFixed(1)} from last month)`,
    onTimeDelivery: `${onTimeDelivery}% (+${(
      onTimeDelivery - onTimeDeliveryLastMonth
    ).toFixed(1)}% from last month)`,
  };
}

// Salesmen Analytics
async function findSalesmenAnalytics() {
  const totalSalesmen = await knex('users')
    .where('roleId', 3)
    .count('* as count');
  const activeSalesmen = await knex('users')
    .where('roleId', 3)
    .andWhere('status', 'Active')
    .count('* as count');
  const completedOrders = await knex('orders')
    .where('status', 'completed')
    .count('* as count');
  const assignedOrders = await knex('orders').count('* as count');
  const avgDeliveries = (
    completedOrders[0].count / totalSalesmen[0].count
  ).toFixed(1);

  return {
    assignedOrders: assignedOrders[0].count,
    completedOrders: completedOrders[0].count,
    totalSalesmen: totalSalesmen[0].count,
    activeSalesmen: activeSalesmen[0].count,
    averageDeliveries: `${avgDeliveries}/month`,
    rating: '4.7/5', // Mocked data
  };
}

// Customers Analytics
async function findCustomersAnalytics() {
  const totalCustomers = await knex('users')
    .where('roleId', 4)
    .count('* as count');
  const totalOrders = await knex('orders').count('* as count');
  const avgOrderSize = (await knex('orders').avg('quantity as avg'))[0].avg;
  const lastOrder = await knex('orders').orderBy('created_at', 'desc').first();
  const totalSpent = await knex('sales').sum('actualPrice as total');

  return {
    totalOrders: totalOrders[0].count,
    averageOrderSize: `${avgOrderSize.toFixed(1)} items`,
    lastOrder: lastOrder
      ? lastOrder.created_at.toISOString().split('T')[0]
      : 'No Orders',
    totalSpent: `$${totalSpent[0].total || 0}`,
  };
}

// Financial Analytics
async function findFinancialAnalytics() {
  const totalRevenue = await knex('sales').sum('actualPrice as total');
  const totalExpenses = 38000; // Mocked data
  const netProfit = totalRevenue[0].total - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue[0].total) * 100).toFixed(1);

  return {
    totalRevenue: `$${totalRevenue[0].total || 0}`,
    totalExpenses: `$${totalExpenses}`,
    netProfit: `$${netProfit}`,
    profitMargin: `${profitMargin}%`,
  };
}

// Main function to fetch all analytics
exports.find = async function () {
  const farms = await findFarmsAnalytics();
  const salesmen = await findSalesmenAnalytics();
  const customers = await findCustomersAnalytics();
  const financials = await findFinancialAnalytics();
  const dashboardData = await dashboard();

  return dashboardData;
};
