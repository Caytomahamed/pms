'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function SalesChart({ sales }) {
  function extractDateComponents(dateString) {
    const monthAbbreviations = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = monthAbbreviations[date.getUTCMonth()];
    const day = date.getUTCDate();

    return { year, month, day };
  }

  function groupSalesByMonth(sales) {
    const groupedData = sales.reduce((acc, sale) => {
      const { month } = extractDateComponents(sale.created_at);
      const existingMonth = acc.find((item) => item.name === month);

      if (existingMonth) {
        // If the month exists, add the current sale's estimatedPrice to the total
        existingMonth.total += parseFloat(sale.estimatedPrice);
      } else {
        // Otherwise, create a new entry for the month
        acc.push({
          name: month,
          total: parseFloat(sale.estimatedPrice),
        });
      }

      return acc;
    }, []);

    return groupedData;
  }

  const data = groupSalesByMonth(sales);

  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
