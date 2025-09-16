'use client'; // This is a client component because it uses the usePathname hook

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Wallet, BarChart3 } from 'lucide-react';

// Define the navigation items in an array for easier mapping
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/cashflow', label: 'Cashflow', icon: Wallet },
  // { href: '/net-worth', label: 'Net Worth', icon: BarChart3 },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white w-full py-4 px-6 md:px-8 border-b border-gray-200">
      <div className="mx-auto flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center">
          {/* Placeholder for the logo from the image */}
          <div className="w-9 h-9 bg-gray-800 rounded-full border-2 border-gray-300 transform -rotate-45">
            <div className="w-full h-full bg-gray-200 rounded-full" style={{clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'}}></div>
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 transition-colors duration-200 hover:text-gray-900 ${
                      isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: User Profile */}
        <div className="flex items-center">
          <button className="h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
            {/* Replace with your user's avatar image */}
            {/* <Image
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d" // Using a placeholder image
              alt="User profile avatar"
              width={40}
              height={40}
              className="object-cover"
            /> */}
          </button>
        </div>
        
      </div>
    </header>
  );
}

