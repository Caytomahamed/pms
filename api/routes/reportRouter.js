const express = require('express');

const router = express.Router();
const puppeteer = require('puppeteer');
const moment = require('moment');
// const knex = require('../database/dbConfig');

const reportController = require('../controllers/reportController');

router.get('/status/:table', reportController.getStatus);
router.get('/prodution-status', reportController.getProductionStatus);
router.get('/comparison', reportController.getComparison);

router.get('/lastest-production', reportController.getLasetProduction);
router.get('/latest-orders', reportController.getLastesOrders);

router.get('/report', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year)
      return res.status(400).json({ error: 'Month and year are required' });

    const startDate = `${year}-${month}-01`;
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

    // 📌 Fetch Data
    const users = await knex('users')
      .count('id as total_users')
      .whereBetween('created_at', [startDate, endDate]);
    const previousUsers = await knex('users')
      .count('id as total_users')
      .whereBetween('created_at', [
        moment(startDate).subtract(1, 'month').format('YYYY-MM-DD'),
        moment(endDate).subtract(1, 'month').format('YYYY-MM-DD'),
      ]);

    const sales = await knex('sales')
      .sum('quantity as total_sold')
      .sum('estimatedPrice as estimated_revenue')
      .sum('actualPrice as actual_revenue')
      .whereBetween('created_at', [startDate, endDate]);

    const previousSales = await knex('sales')
      .sum('quantity as total_sold')
      .sum('actualPrice as previous_revenue')
      .whereBetween('created_at', [
        moment(startDate).subtract(1, 'month').format('YYYY-MM-DD'),
        moment(endDate).subtract(1, 'month').format('YYYY-MM-DD'),
      ]);

    const profit = sales[0].actual_revenue - sales[0].estimated_revenue * 0.7; // Assume 70% cost factor

    // 📌 Generate Insights
    const growthRateUsers =
      ((users[0].total_users - previousUsers[0].total_users) /
        (previousUsers[0].total_users || 1)) *
      100;
    const salesGrowth =
      ((sales[0].actual_revenue - previousSales[0].previous_revenue) /
        (previousSales[0].previous_revenue || 1)) *
      100;
    const efficiency = (sales[0].actual_revenue / sales[0].total_sold).toFixed(
      2
    );

    // 📌 Business Recommendations
    let insights = [];
    if (growthRateUsers > 10)
      insights.push(
        '🚀 Strong user growth! Consider adding referral programs.'
      );
    if (salesGrowth > 5)
      insights.push('📈 Sales are increasing! Invest in advertising.');
    if (profit < 5000)
      insights.push('⚠️ Low profit margin. Review pricing strategies.');
    if (efficiency < 2)
      insights.push('💡 Optimize product pricing for better revenue per unit.');

    // 📌 Generate PDF with Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(`
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          h2 { background: #f4f4f4; padding: 10px; }
          .section { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .chart { width: 500px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <h1>📊 Some Poultry - Monthly Report (${moment(startDate).format(
          'MMMM YYYY'
        )})</h1>

        <div class="section">
          <h2>User Report</h2>
          <p>Total Users: <strong>${
            users[0].total_users
          }</strong> (Growth: ${growthRateUsers.toFixed(2)}%)</p>
        </div>

        <div class="section">
          <h2>Sales Report</h2>
          <p>Total Sold: <strong>${sales[0].total_sold}</strong></p>
          <p>Estimated Revenue: <strong>$${sales[0].estimated_revenue.toFixed(
            2
          )}</strong></p>
          <p>Actual Revenue: <strong>$${sales[0].actual_revenue.toFixed(
            2
          )}</strong> (Growth: ${salesGrowth.toFixed(2)}%)</p>
          <p>Revenue Per Unit: <strong>$${efficiency}</strong></p>
          <p>Profit: <strong>$${profit.toFixed(2)}</strong></p>
        </div>

        <div class="section">
          <h2>Business Insights</h2>
          <ul>
            ${insights.map((i) => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report_${month}_${year}.pdf`
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/top-customers', reportController.getTopCustomers);
router.get('/top-salesman', reportController.getTopSalesman);

router.get('/sales-overview', reportController.getSalesOverview);
router.get('/', reportController.getFarmsAnalytics);

module.exports = router;
