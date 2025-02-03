import { Link, useLocation } from "wouter";
import { Home, Database, List, Activity, Plus, Settings, Users, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
};

const MainNav: NavItemProps[] = [
  {
    href: "/",
    icon: Home,
    label: "Dashboard",
    description: "Overview and statistics"
  },
  {
    href: "/elements",
    icon: List,
    label: "Elements",
    description: "View all business elements"
  }
];

const ElementsNav: NavItemProps[] = [
  {
    href: "/elements/new",
    icon: Plus,
    label: "New Element",
    description: "Create new business element"
  }
];

const SettingsNav: NavItemProps[] = [
  {
    href: "/settings/databases",
    icon: Database,
    label: "Databases",
    description: "Manage database connections"
  },
  {
    href: "/settings/categories",
    icon: Grid,
    label: "Categories",
    description: "Manage element categories"
  },
  {
    href: "/settings/owner-groups",
    icon: Users,
    label: "Owner Groups",
    description: "Manage owner groups"
  }
];

const NavItem = ({ href, icon: Icon, label, description }: NavItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
          "hover:bg-blue-50/50 hover:text-primary",
          isActive 
            ? "bg-blue-50 text-primary shadow-sm" 
            : "text-slate-600"
        )}
      >
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          <div>{label}</div>
          {description && (
            <p className="text-xs text-slate-500 font-normal">{description}</p>
          )}
        </div>
      </a>
    </Link>
  );
};

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Business Elements
        </h2>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Main
            </h3>
            <div className="mt-2 space-y-1">
              {MainNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Elements
            </h3>
            <div className="mt-2 space-y-1">
              {ElementsNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {SettingsNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 text-center">
          Business Element Manager v1.0
        </div>
      </div>
    </div>
  );
}