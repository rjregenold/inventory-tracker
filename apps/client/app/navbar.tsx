'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

interface NavItem {
  href: string;
  pattern: RegExp;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: '/purchase-orders',
    pattern: /\/purchase-orders/i,
    label: 'Purchase Orders',
  },
  {
    href: '/parent-items',
    pattern: /\/parent-items/i,
    label: 'Parent Items',
  },
];

function getActiveNavItem(path: string): NavItem | undefined {
  return navItems.find((item) => path.match(item.pattern));
}

export default function Navbar() {
  const pathname = usePathname();
  const activeNavItem = getActiveNavItem(pathname);

  return (
    <div className="navbar bg-base-100 mt-2 mb-4">
      <h1 className="text-xl mr-4">Inventory System</h1>
      <div>
        <ul className="menu menu-horizontal px-1">
          {navItems.map((navItem) => (
            <li key={navItem.label}>
              <Link
                href={navItem.href}
                className={`btn-ghost ${navItem === activeNavItem ? 'btn-active' : 'hover:bg-transparent'}`}
              >
                {navItem.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
