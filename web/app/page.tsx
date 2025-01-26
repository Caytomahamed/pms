'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, Egg } from 'lucide-react';
import { SalesChart } from './components/charts/SalesChart';
import { RecentOrders } from './components/RecentOrders';

import { groupStatus, useUsersStore } from '@/store/usersStore';
import { useEffect } from 'react';
import MyPieChart from './components/charts/MyPieChart';
import ProStockSales from './components/charts/ProStockSales';
import TopUser from './components/TopUser';

export default function Home() {
  const {
    reports,
    fetchReport,
  }: {
    reports: { replacementGroupStatus: groupStatus[]; [key: string]: any };
    fetchReport: () => void;
  } = useUsersStore();

  useEffect(() => {
    fetchReport();
  }, []);

  const addCommas = (num: number) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const noSales = [
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '100',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '200',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '300',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '400',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '500',
    },
  ];

  const chartConfig = {
    pending: { label: 'pending', color: '#FFCE56' }, // Amber
    accepted: { label: 'accepted', color: '#A8E5A3' }, // Green
    declined: { label: 'declined', color: '#FF6384' }, // Red
    completed: { label: 'completed', color: '#36A2EB' }, // Blue
    in_progress: { label: 'in progress', color: '#D8A8F0' }, // purple
    approved: { label: 'approved', color: '#7ED957' }, // purple
    delivered: { label: 'delivered', color: '#4DBDFE' }, // purple
  };

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

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className=" font-medium">Inventory Status</CardTitle>
            <Package className="h-6 w-6 text-muted-foreground" color="blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addCommas(reports.currentStock) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current eggs in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className=" font-medium">Active Farms</CardTitle>
            <Egg className="h-6 w-6 text-muted-foreground" color="red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addCommas(reports.totalFarms) || addCommas(100)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className=" font-medium">Total Customer</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" color="purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {' '}
              {addCommas(reports.totalCustomers) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">2 pending approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className=" font-medium">Total SalesMan</CardTitle>
            <ShoppingCart
              className="h-6 w-6 text-muted-foreground"
              color="green"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {' '}
              {addCommas(reports.totalSalesMan) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales scheduled today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-10">
        <MyPieChart
          title="Order Status"
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          data={reports.orderGroupStatus}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          footerContent="Trending up by 3.8% this month"
          footerSubtext="Data for the last  months"
        />
        <MyPieChart
          title="Sales Status"
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          data={reports.salesGroupStatus}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          footerContent="Trending up by 3.8% this month"
          footerSubtext="Data for the last  months"
        />
        <MyPieChart
          title="Replacements"
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          data={reports.replacementGroupStatus}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          footerContent="Trending up by 3.8% this month"
          footerSubtext="Data for the last months"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 my-10 ">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart sales={reports.salesOverview || noSales} />
          </CardContent>
        </Card>
        <Card className="col-span-4 ">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={reports.orders} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 my-10 ">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TopUser users={reports.topCustomer} />
          </CardContent>
        </Card>
        <Card className="col-span-3 ">
          <CardHeader>
            <CardTitle>Top SalesMan</CardTitle>
          </CardHeader>
          <CardContent>
            <TopUser users={reports.topSalesman} />
          </CardContent>
        </Card>
      </div>

      <div>
        <ProStockSales />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 my-10 ">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Production</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TopUser users={reports.topCustomer} />
          </CardContent>
        </Card>
        <Card className="col-span-3 ">
          <CardHeader>
            <CardTitle>Production Piachart</CardTitle>
          </CardHeader>
          <CardContent>
            <TopUser users={reports.topSalesman} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
