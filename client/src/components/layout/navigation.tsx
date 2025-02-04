import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <img 
                  src="https://bem-business-element-manager.breakable-play.repl.co/logo.webp" 
                  alt="BEM Logo" 
                  className="h-10 w-auto" 
                  loading="eager"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.src = '/logo.webp';
                  }}
                />
              </a>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <a className="ml-8 flex-shrink-0 flex items-center px-4 text-lg font-semibold text-gray-900 hover:text-gray-700">
                  Admin
                </a>
              </Link>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              Welcome, {user?.username}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}