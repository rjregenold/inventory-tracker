'use client';
import {useAuth} from '@/lib/contexts/auth-context';
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
  const {user, signOut} = useAuth();
  const pathname = usePathname();
  const activeNavItem = getActiveNavItem(pathname);

  return (
    <div className="navbar bg-base-100 mt-2 mb-4 flex">
      <h1 className="text-xl mr-4">Inventory System</h1>
      <div className="flex-grow">
        {user && (
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
        )}
      </div>
      {user ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar placeholder"
          >
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>R</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>{user.email}</a>
            </li>
            <li>
              <a onClick={() => signOut()}>Sign Out</a>
            </li>
          </ul>
        </div>
      ) : (
        <Link className="btn btn-ghost" href="/auth/sign-in">
          Sign In
        </Link>
      )}
    </div>
  );
}
