'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MyPieChart({
  title = 'Chart Title',
  description = 'Chart Description',
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  chartConfig = {},
  footerSubtext = 'Footer Subtext',
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  rate = '',
}) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr[dataKey], 0);
  }, [data, dataKey]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: Math.abs(currentYear - 2023) + 1 },
    (_, i) => (2023 > currentYear ? 2023 - i : 2023 + i)
  );

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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">No data available</div>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total {title.split(' ')[0].slice(0, 7) || 0}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-center">
          {title.split(' ')[0]}{' '}
          <span
            className={`${
              rate.startsWith('-') ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {' '}
            {rate.startsWith('-') ? 'decreased' : 'increased'}
          </span>{' '}
          by
          <span
            className={`${
              rate.startsWith('-') ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {' '}
            {rate}
          </span>{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {footerSubtext}
        </div>
      </CardFooter>
      {/* Dropdowns for Month and Year */}
      <div className="flex gap-4 ">
        <Select
          onValueChange={(value) => setSelectedMonth(parseInt(value, 10))}
          value={selectedMonth.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
          value={selectedYear.toString()}
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
    </Card>
  );
}
