"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destination" },
  { label: "Add-Destinations", href: "/add-destination" },
  { label: "My Bookings", href: "#bookings" },

];

const authLinks = [
  { label: "Profile", href: "#profile", icon: true },
  { label: "Login", href: "#login" },
  { label: "Sign Up", href: "/signup" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <nav className="mx-auto grid h-20 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 lg:px-10">
        <ul className="hidden items-center gap-8 justify-self-start lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors hover:text-brand ${
                    isActive ? "text-brand" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="-ml-2 flex size-10 items-center justify-center justify-self-start text-slate-700 transition-colors hover:text-brand lg:hidden"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <Link href="/" className="justify-self-center" aria-label="Wanderlast home">
          <Image
            src="/image/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-5 w-auto sm:h-[21px]"
          />
        </Link>

        <div className="hidden items-center gap-7 justify-self-end lg:flex">
          {authLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 text-[15px] font-medium text-slate-600 transition-colors hover:text-brand"
            >
              {link.icon && <User className="size-4" strokeWidth={1.75} />}
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="#profile"
          aria-label="Profile"
          className="flex size-10 items-center justify-center justify-self-end text-slate-700 transition-colors hover:text-brand lg:hidden"
        >
          <User className="size-5" strokeWidth={1.75} />
        </Link>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-100 bg-white px-5 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => {
              const isActive = link.href === pathname;

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block border-b border-slate-100 py-3 text-base font-medium transition-colors hover:text-brand ${
                      isActive ? "text-brand" : "text-slate-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center gap-3">
            <Link
              href="#login"
              onClick={() => setIsOpen(false)}
              className="flex h-10 flex-1 items-center justify-center rounded-sm border border-slate-300 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
            >
              Login
            </Link>
            <Link
              href="#signup"
              onClick={() => setIsOpen(false)}
              className="flex h-10 flex-1 items-center justify-center rounded-sm bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
