'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, Egg } from 'lucide-react';
import { SalesChart } from './components/charts/SalesChart';
import { RecentOrders } from './components/RecentOrders';

import { useUsersStore } from '@/store/usersStore';
import { useProductionStore } from '@/store/productionStore';
import { useEffect, useState } from 'react';
import MyPieChart from './components/charts/MyPieChart';
import ProStockSales from './components/charts/ProStockSales';

import LastestProduction from './components/LastestProductions';

export const addCommas = (num: number) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

import { useReportStore } from '@/store/useReports';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TopUser from './components/TopUser';

export default function Home() {
  const { reports, fetchReport } = useUsersStore();

  const { fetchStatus, statusProduction, fetchLastest, latestProductions } =
    useProductionStore();

  useEffect(() => {
    fetchReport();
    fetchStatus();
    fetchLastest();
  }, []);

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

  // Active and InActive
  const [InActiveUserTypeFarmer] =
    (reports.inActiveUsers &&
      reports?.inActiveUsers.filter((type) => type.roleId === 2)) ||
    [];
  const [InActiveUserTypeSalesMan] =
    (reports.inActiveUsers &&
      reports?.inActiveUsers.filter((type) => type.roleId === 3)) ||
    [];
  const [InActiveUserTypeCustomers] =
    (reports.inActiveUsers &&
      reports?.inActiveUsers.filter((type) => type.roleId === 4)) ||
    [];

  const [selectedMonthOrders, setSelectedMonthOrders] = useState(
    new Date().getMonth()
  );
  const [selectedYearOrders, setSelectedYearOrders] = useState(
    new Date().getFullYear()
  );

  const [selectedMonthSales, setSelectedMonthSales] = useState(
    new Date().getMonth()
  );
  const [selectedYearSales, setSelectedYearSales] = useState(
    new Date().getFullYear()
  );

  const [selectedMonthReplacement, setSelectedMonthReplacement] = useState(
    new Date().getMonth()
  );
  const [selectedYearReplacement, setSelectedYearReplacement] = useState(
    new Date().getFullYear()
  );

  const [selectedMonthProduction, setSelectedMonthProduction] = useState(
    new Date().getMonth()
  );
  const [selectedYearProduction, setSelectedYearProduction] = useState(
    new Date().getFullYear()
  );

  const [selectedYearComparison, setSelectedYearComparison] = useState(
    new Date().getFullYear()
  );

  const [selectedYearSalesOverview, setSelectedYearSalesOverview] = useState(
    new Date().getFullYear()
  );

  /// fetch status
  const {
    fetchOrdersStatus,
    fetchReplacementStatus,
    fetchSalesStatus,
    sales,
    orders,
    replacements,
    fetchProductionStatus,
    production,
    fetchComperison,
    comperison,
    salesOverview,
    fetchSaleOveriew,
    fetchLatesOrder,
    latestOrders,
    topCustomers,
    topSalesMan,
    latestProdutions,
    fetchTopCustomers,
    fetchTopSalesMan,
    fetchLatestProdutions,
  } = useReportStore();

  useEffect(() => {
    fetchOrdersStatus(selectedMonthOrders + 1, selectedYearOrders, 'orders');
    fetchReplacementStatus(
      selectedMonthReplacement + 1,
      selectedYearReplacement,
      'replacements'
    );
    fetchSalesStatus(selectedMonthSales + 1, selectedYearSales, 'sales');
    fetchProductionStatus(selectedMonthProduction + 1, selectedYearProduction);
    fetchComperison(selectedYearComparison);
    fetchSaleOveriew(selectedYearSalesOverview);
    fetchLatesOrder();
    fetchTopCustomers();
    fetchTopSalesMan();
    fetchLatestProdutions();
  }, [
    fetchOrdersStatus,
    fetchReplacementStatus,
    fetchSalesStatus,
    selectedMonthOrders,
    selectedMonthReplacement,
    selectedMonthSales,
    selectedYearOrders,
    selectedYearReplacement,
    selectedYearSales,
    fetchProductionStatus,
    selectedMonthProduction,
    selectedYearProduction,
    fetchComperison,
    selectedYearComparison,
    fetchSaleOveriew,
    selectedYearSalesOverview,
    fetchLatesOrder,
    fetchTopCustomers,
    fetchTopSalesMan,
    fetchLatestProdutions,
  ]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: Math.abs(currentYear - 2023) + 1 },
    (_, i) => (2023 > currentYear ? 2023 - i : 2023 + i)
  );

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
              {/* +20.1% from last month */}
              <span className="text-green-500">
                {InActiveUserTypeFarmer?.count || 0}{' '}
              </span>
              inActive farmers
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
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">
                {InActiveUserTypeCustomers?.count || 0}{' '}
              </span>
              inActive Customers
            </p>
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
              <span className="text-green-500">
                {InActiveUserTypeSalesMan?.count || 0}{' '}
              </span>
              inActive SalesMan
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
          data={orders.data || []}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          footerContent={''}
          rate={orders.rate}
          selectedMonth={selectedMonthOrders}
          setSelectedMonth={setSelectedMonthOrders}
          selectedYear={selectedYearOrders}
          setSelectedYear={setSelectedYearOrders}
        />
        <MyPieChart
          title="Sales Status"
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          data={sales.data || []}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          rate={sales.rate}
          footerSubtext="Data for the last  months"
          selectedMonth={selectedMonthSales}
          setSelectedMonth={setSelectedMonthSales}
          selectedYear={selectedYearSales}
          setSelectedYear={setSelectedYearSales}
        />
        <MyPieChart
          title="Replacements"
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          data={replacements.data || []}
          rate={replacements.rate}
          dataKey="count"
          nameKey="status"
          chartConfig={chartConfig}
          footerSubtext="Data for the last months"
          selectedMonth={selectedMonthReplacement}
          setSelectedMonth={setSelectedMonthReplacement}
          selectedYear={selectedYearReplacement}
          setSelectedYear={setSelectedYearReplacement}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 my-10 ">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TopUser users={topCustomers || []} />
          </CardContent>
        </Card>
        <Card className="col-span-4 ">
          <CardHeader>
            <CardTitle>Top SalesMan</CardTitle>
          </CardHeader>
          <CardContent>
            <TopUser users={topSalesMan || []} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 my-10 ">
        <Card className="col-span-4">
          <CardHeader>
            {/* Dropdowns for Month and Year */}
            <div className="flex gap-4  justify-between items-center">
              <CardTitle>Sales Overview</CardTitle>
              <div className="flex gap-4  w-32 justify-end">
                <Select
                  onValueChange={(value) =>
                    setSelectedYearSalesOverview(parseInt(value, 10))
                  }
                  value={selectedYearSalesOverview.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart sales={salesOverview || noSales} />
          </CardContent>
        </Card>
        <Card className="col-span-4 ">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={latestOrders || []} />
          </CardContent>
        </Card>
      </div>

      <div>
        <ProStockSales
          data={comperison || []}
          description={` ${months[new Date().getMonth()]} - ${
            months[new Date().getMonth() + 1]
          }  ${new Date().getFullYear().toString()}`}
          sales={reports.salesChanges || '39%'}
          orders={reports.ordersChanges || '39%'}
          selectedYear={selectedYearComparison}
          setSelectedYear={setSelectedYearComparison}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 my-10 ">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lastest Production</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LastestProduction productions={latestProdutions || []} />
          </CardContent>
        </Card>
        <div className="col-span-3 ">
          <MyPieChart
            title="Production status"
            description={` ${months[new Date().getMonth()]} - ${
              months[new Date().getMonth() + 1]
            }  ${new Date().getFullYear().toString()}`}
            data={production.data || []}
            rate={production.rate}
            dataKey="count"
            nameKey="status"
            chartConfig={chartConfig}
            footerSubtext=""
            selectedMonth={selectedMonthProduction}
            setSelectedMonth={setSelectedMonthProduction}
            selectedYear={selectedYearProduction}
            setSelectedYear={setSelectedYearProduction}
          />
        </div>
      </div>
    </>
  );
}
