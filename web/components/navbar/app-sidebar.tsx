'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  User2Icon,
  Egg,
  Truck,
  Package,
  BarChartIcon as ChartBar,
  BadgeDollarSign,
  Tractor,
  UserRound,
  Warehouse,
  Replace,
  DollarSign,
  LayoutDashboard,
  Factory,
  Loader2,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import { NavMain } from './nav-main';
// import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    id: 46,
    username: 'sales4',
    fullName: 'Farmer User',
    phone: '9876543210',
    address: '456 Farmer Lane',
    created_at: '2025-01-13T11:42:34.000Z',
    updated_at: '2025-01-13T11:42:34.000Z',
    roleId: 3,
    status: 'Active',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      color: 'text-pink-500',
    },
    {
      title: 'Users',
      url: '#',
      icon: UserRound,
      color: 'text-orange-500',
      isActive: true,
      items: [
        {
          title: 'Customers',
          url: '/users/customers',
          icon: User2Icon,
          color: 'text-red-600',
        },
        {
          title: 'Farmers',
          url: '/users/farmers',
          icon: Tractor,
          color: 'text-green-500',
        },
        {
          title: 'Salesmen',
          url: '/users/salesmen',
          icon: BadgeDollarSign,
          color: 'text-orange-400',
        },
      ],
    },
    {
      title: 'Orders',
      url: '/orders',
      icon: Egg,
      color: 'text-sky-500',
    },

    {
      title: 'Warehouse',
      icon: Warehouse,
      url: '#',
      color: 'text-orange-500',
      isActive: true,
      items: [
        {
          title: 'Inventories',
          url: '/warehouse/inventory',
          icon: Package,
          color: 'text-orange-700',
        },
        {
          title: 'Production',
          url: '/warehouse/production',
          icon: Factory,
          color: 'text-blue-700',
        },
        {
          title: 'Replacements',
          url: '/warehouse/replacements',
          icon: Replace,
          color: 'text-red-600',
        },
      ],
    },
    {
      title: 'Sales',
      url: '/sales',
      icon: ChartBar,
      color: 'text-pink-500',
    },
  ],
  farmer: [
    {
      title: 'Farmer',
      icon: Truck,
      url: '#',
      color: 'text-green-500',
      isActive: true,
      items: [
        {
          title: 'Orders',
          url: '/farmer/orders',
          icon: Egg,
          color: 'text-sky-500',
        },
        {
          title: 'Replacements',
          url: '/farmer/replacements',
          icon: Replace,
          color: 'text-red-600',
        },
        {
          title: 'Production',
          url: '/farmer/production',
          icon: Factory,
          color: 'text-blue-700',
        },
      ],
    },
  ],
  saleman: [
    {
      title: 'SalesMan',
      url: '/salesman',
      icon: DollarSign,
      color: 'text-cyan-500',
    },
  ],
};

interface User {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  roleId?: number;
  role?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();

  React.useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Add 1-second delay before redirect
        setTimeout(() => {
          if (parsedUser.roleId === 2 && window.location.pathname === '/') {
            router.push('/farmer/orders');
          }
          if (parsedUser.roleId === 3 && window.location.pathname === '/') {
            router.push('/salesman');
          }
          setIsLoading(false); // Clear loading state
        }, 1000);
      } else {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      checkUser();
    }
  }, [router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {user && user.roleId === 1 && <NavMain items={data.admin} />}
        {user && user.roleId === 2 && <NavMain items={data.farmer} />}
        {user && user.roleId === 3 && <NavMain items={data.saleman} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
