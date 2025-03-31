"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 navbar-override",
        isHomePage && !scrolled 
          ? "bg-transparent" 
          : "bg-white shadow-sm border-b"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className={cn(
                "text-xl font-bold transition-colors",
                isHomePage && !scrolled ? "text-white" : "text-purple-600"
              )}>
                🐙 Mocktopus
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {[{ name: "Home", path: "/" },
                { name: "Create", path: "/tool" },
                { name: "Library", path: "/library" },
                { name: "Analytics", path: "/analytics" },
                { name: "Settings", path: "/settings" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.path
                      ? isHomePage && !scrolled
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-700"
                      : isHomePage && !scrolled
                        ? "text-white hover:bg-white/10"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className={cn(
                    "text-sm font-medium", 
                    isHomePage && !scrolled ? "text-white" : "text-gray-700"
                  )}>
                    {session.user.name}
                  </span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isHomePage && !scrolled 
                      ? "bg-white/20 text-white hover:bg-white/30" 
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signIn("google")}
                className={cn(
                  "ml-4 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isHomePage && !scrolled
                    ? "bg-white text-purple-600 hover:bg-gray-100"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                )}
              >
                Sign In with Google
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md focus:outline-none",
                isHomePage && !scrolled ? "text-white" : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              )}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden absolute top-16 left-0 right-0 border-b shadow-lg",
          isHomePage && !scrolled 
            ? "bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700" 
            : "bg-white"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[{ name: "Home", path: "/" },
              { name: "Create", path: "/tool" },
              { name: "Library", path: "/library" },
              { name: "Analytics", path: "/analytics" },
              { name: "Settings", path: "/settings" },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === item.path
                    ? isHomePage && !scrolled
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-700"
                    : isHomePage && !scrolled
                      ? "text-white hover:bg-white/10"
                      : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gray-200">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse my-4 mx-3"></div>
              ) : session ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 mb-3">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className={cn(
                      "text-sm font-medium", 
                      isHomePage && !scrolled ? "text-white" : "text-gray-700"
                    )}>
                      {session.user.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className={cn(
                      "w-full px-4 py-2 rounded-md text-sm font-medium transition-colors text-center",
                      isHomePage && !scrolled 
                        ? "bg-white/20 text-white hover:bg-white/30" 
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    )}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <button 
                    onClick={() => signIn("google")}
                    className={cn(
                      "w-full px-4 py-2 rounded-md text-sm font-medium transition-colors text-center",
                      isHomePage && !scrolled
                        ? "bg-white text-purple-600 hover:bg-gray-100"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    )}
                  >
                    Sign In with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
