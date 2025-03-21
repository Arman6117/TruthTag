"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";

import {
  LucideCamera,
  HomeIcon,
  ClockIcon,
  AwardIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import SearchInput from "./search-input";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-5 w-5" />, path: "/" },

    {
      name: "History",
      icon: <ClockIcon className="h-5 w-5" />,
      path: "/history",
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="hidden md:flex items-center  py-2">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-100",
                  isActive(item.path)
                    ? "text-blue-600 border-b-2 border-blue-600 rounded-none"
                    : "text-gray-700"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="md:hidden  py-2">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700"
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
          <span className="font-medium">
            {navItems.find((item) => isActive(item.path))?.name || "Dashboard"}
          </span>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-2 space-y-2 pb-3">
            {navItems.map((item) => (
              <Link
                href={item.path}
                key={item.name}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start flex items-center gap-2 hover:bg-gray-100",
                    isActive(item.path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
            <SearchInput />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
