import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { cn } from '../../utlis';
import { usePathname } from 'next/navigation';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    color?: string;

    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      color?: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? ( // Use collapsible for nested items
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <Link
                      key={item.url}
                      href={item.url}
                      className={cn(
                        'text-sm group flex py-2 pl-1 pr-2 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                        pathname === item.url
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground'
                      )}
                    >
                      <div className="flex items-center flex-1">
                        {item.icon && (
                          <item.icon
                            className={cn('h-5 w-5 mr-3', item.color)}
                          />
                        )}
                        {item.title}
                      </div>
                    </Link>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            key={subItem.url}
                            href={subItem.url}
                            className={cn(
                              'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                              pathname === subItem.url
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground'
                            )}
                          >
                            <div className="flex items-center flex-1">
                              {subItem.icon && (
                                <subItem.icon
                                  className={cn('h-5 w-5 mr-3', subItem.color)}
                                />
                              )}
                              {subItem.title}
                            </div>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Use normal menu item for single-level items
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                    pathname === item.url
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
                  )}
                >
                  <div className="flex items-center flex-1">
                    {item.icon && (
                      <item.icon className={cn('h-5 w-5 mr-3', item.color)} />
                    )}
                    {item.title}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
