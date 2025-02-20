
import { ThemeSelector } from '@/components/ThemeSelector';
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function Navbar() {
  return (
    <nav className="fixed top-0 right-0 p-4">
      <ThemeSelector />
      <ThemeToggle />
    </nav>
  );
} 