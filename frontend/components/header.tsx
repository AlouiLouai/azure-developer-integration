"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            ></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-800">Connect</h2>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
          <Link className="transition-colors hover:text-primary-600" href="#">
            Product
          </Link>
          <Link className="transition-colors hover:text-primary-600" href="#">
            Solutions
          </Link>
          <Link className="transition-colors hover:text-primary-600" href="#">
            Resources
          </Link>
          <Link className="transition-colors hover:text-primary-600" href="#">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 sm:flex">
            <span className="truncate">Talk to sales</span>
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="truncate">Sign In</span>
          </button>
          <button
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold shadow-sm transition-colors"
            style={{ backgroundColor: "#2563eb", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            <span className="truncate">Try for free</span>
          </button>
        </div>
      </div>
    </header>
  )
}
