"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Play,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Menu,
  Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const loggedOutLinks = [
  { href: "/#courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
];

export function Header() {
  const pathname = usePathname();
  const { has } = useAuth();

  const isUltra = has?.({ plan: "ultra" });
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [pathname]);

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "My Courses", icon: Database },
    // Show "Account" for Ultra users, "Upgrade" for others
    ...(isUltra
      ? [{ href: "/pricing", label: "Account", icon: Sparkles }]
      : [{ href: "/pricing", label: "Upgrade", icon: Sparkles }]),
  ];

  return (
    // <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
    <nav className="relative z-10 grid grid-cols-3 items-center h-16 px-4 lg:px-12 max-w-7xl mx-auto">
      {/* Logo - links to dashboard when logged in, home when logged out */}
      <div className="flex items-center">
        <SignedIn>
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Logo />
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/" className="flex items-center gap-3 group">
            <Logo />
          </Link>
        </SignedOut>
      </div>

      {/* Center Navigation - absolute positioning for perfect center on desktop */}
      {/* <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"> */}
      <div className="hidden md:flex justify-center items-center gap-8 text-sm text-zinc-400">
        <SignedOut>
          <div className="flex items-center gap-8 text-sm text-zinc-400">
            {loggedOutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-1">
            {loggedInLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-green-500/10 text-green-300"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                  )}>
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </SignedIn>
      </div>

      {/* Right section */}
      {/* <div className="flex items-center gap-3"> */}
      <div className="flex items-end gap-0 ml-38 md:ml-auto lg:ml-auto">
        <SignedOut>
          {/* Mobile: Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800">
              {loggedOutLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="text-zinc-300 cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SignInButton mode="modal">
            <Button
              variant="ghost"
              className="h-9 px-0 lg:px-6 text-sm cursor-pointer text-slate-400 hover:text-white hover:bg-green-500/10">
              Sign in
            </Button>
          </SignInButton>
          <Link href="/pricing" className="hidden sm:block">
            <Button className="bg-linear-to-r cursor-pointer from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400 text-white border-0 shadow-lg shadow-lime-400/25">
              Start Learning
            </Button>
          </Link>
        </SignedOut>

        <SignedIn>
          {/* Mobile: Dropdown menu next to user profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800">
              {loggedInLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(link.href));

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive ? "text-green-300" : "text-zinc-300",
                      )}>
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-green-500/20",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-lime-400 to-green-600 flex items-center justify-center shadow-lg shadow-lime-500/30 group-hover:shadow-lime-500/50 group-hover:scale-105 transition-all duration-300">
          <Cpu className="w-5 h-5 text-black" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-lime-400" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight leading-none bg-linear-to-r from-white to-zinc-400 dark:from-lime-300 dark:to-green-500 bg-clip-text text-transparent">
          EduX
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-lime-600/80 dark:text-lime-400/80 font-medium">
          Academy
        </span>
      </div>
    </>
  );
}
