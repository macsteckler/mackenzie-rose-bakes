"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "@/components/SocialLinks";
import { SERVICE_PAGES } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0"
            >
              <Image
                src="/mackenzielogotransparent.png"
                alt=""
                width={160}
                height={160}
                priority
                className="object-contain w-auto shrink-0 h-[4.5rem] sm:h-[4.75rem] md:h-[5.75rem]"
              />
              <div className="flex flex-col leading-tight text-left">
                <span
                  className="text-lg sm:text-xl md:text-2xl font-bold text-rose-600 tracking-wide"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Mackenzie Rose
                </span>
                <span className="text-[0.65rem] sm:text-xs md:text-sm text-amber-600 font-medium tracking-[0.2em] uppercase">
                  Bakes
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isServices = link.href === "/services";
                const isActive =
                  pathname === link.href ||
                  (isServices && SERVICE_PAGES.some((p) => p.href === pathname));
                const navLink = (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                      isActive
                        ? "text-rose-600"
                        : "text-stone-700 hover:text-rose-500"
                    }`}
                  >
                    {link.label}
                    {isServices && <span aria-hidden="true" className="ml-1 text-[10px]">▾</span>}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-rose-400 transition-all duration-200 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
                if (!isServices) return <div key={link.href}>{navLink}</div>;
                return (
                  <div key={link.href} className="relative group/menu">
                    {navLink}
                    {/* Dropdown — opens on hover or keyboard focus */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 invisible opacity-0 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100 transition-opacity duration-150">
                      <ul className="w-60 bg-white rounded-2xl shadow-lg border border-rose-100 p-2">
                        {SERVICE_PAGES.map((page) => (
                          <li key={page.href}>
                            <Link
                              href={page.href}
                              className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                                pathname === page.href
                                  ? "bg-rose-50 text-rose-600"
                                  : "text-stone-700 hover:bg-rose-50 hover:text-rose-500"
                              }`}
                            >
                              {page.label}
                            </Link>
                          </li>
                        ))}
                        <li className="border-t border-rose-50 mt-1 pt-1">
                          <Link
                            href="/services"
                            className="block px-4 py-2.5 rounded-xl text-sm text-rose-500 font-semibold hover:bg-rose-50"
                          >
                            All Services &amp; Pricing →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
              <SocialLinks variant="header" className="-mx-2" />
              <Link
                href="/order"
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Order Now
              </Link>
            </div>

            {/* Mobile socials + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              <div className="hidden min-[380px]:block">
                <SocialLinks variant="compact" />
              </div>
              <button
                className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`block h-0.5 bg-rose-600 transition-all duration-300 ${
                    menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                  }`}
                />
                <span
                  className={`block h-0.5 bg-rose-600 transition-all duration-300 ${
                    menuOpen ? "w-6 opacity-0" : "w-5"
                  }`}
                />
                <span
                  className={`block h-0.5 bg-rose-600 transition-all duration-300 ${
                    menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"
                  }`}
                />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-8 px-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-rose-50 text-rose-600"
                      : "text-stone-700 hover:bg-rose-50 hover:text-rose-500"
                  }`}
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-4 px-4 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Our Cakes
              </p>
              {SERVICE_PAGES.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`py-2.5 px-4 rounded-xl text-sm transition-colors ${
                    pathname === page.href
                      ? "bg-rose-50 text-rose-600"
                      : "text-stone-600 hover:bg-rose-50 hover:text-rose-500"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto">
              <Link
                href="/order"
                className="block w-full text-center py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Order Now
              </Link>
              <SocialLinks variant="menu" className="mt-5" />
              <p className="text-center text-xs text-stone-400 mt-4">
                Midtown East & UES · Delivering across NYC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
