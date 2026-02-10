"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  LayoutDashboard,
  Code2,
  Menu,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogOutButton from "./AdminLogOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/modules", label: "Modules", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: PlayCircle },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

function AdminHeader() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-semibold lg:mr-8"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg text-white hidden sm:inline">Admin</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/studio"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Open Studio
          </Link>
          <AdminLogOutButton />
        </div>

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-zinc-900 border-zinc-800"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      active
                        ? "text-violet-300 bg-violet-500/10"
                        : "text-zinc-300",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem asChild>
              <Link
                href="/studio"
                className="flex items-center gap-2 cursor-pointer text-zinc-300"
              >
                <ExternalLink className="h-4 w-4" />
                Open Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <div className="p-2">
              <AdminLogOutButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
