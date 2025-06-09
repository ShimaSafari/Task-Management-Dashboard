import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Dashboard"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                VT
              </span>
            </div>
            <span className="font-semibold text-lg tracking-tight hover:text-primary transition-colors">
              Vesta Task Manager
            </span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
export default Header;
