'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utlis';

import {
  Egg,
  Truck,
  Package,
  BarChartIcon as ChartBar,
  Settings,
} from 'lucide-react';

const routes = [
  {
    label: 'Orders',
    icon: Egg,
    href: '/orders',
    color: 'text-sky-500',
  },
  {
    label: 'Farm',
    icon: Truck,
    href: '/farm',
    color: 'text-green-500',
  },
  {
    label: 'Warehouse',
    icon: Package,
    href: '/warehouse',
    color: 'text-orange-500',
  },
  {
    label: 'Sales',
    icon: ChartBar,
    href: '/sales',
    color: 'text-pink-500',
  },
  {
    label: 'Reports',
    icon: Settings,
    href: '/reports',
    color: 'text-violet-500',
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-700">Poultry Management</h1>
      </div>
      <div className="flex items-center gap-x-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
              pathname === route.href
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground'
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
