import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    console.log(`Theme switched to: ${newTheme ? 'dark' : 'light'}`);
  };

  const navItems = [
    { path: "/", label: "Campañas", testId: "nav-campaigns" },
    { path: "/grupos", label: "Grupos de anuncios", testId: "nav-ad-groups" },
    { path: "/anuncios", label: "Anuncios", testId: "nav-ads" },
    { path: "/programas", label: "Programas", testId: "nav-programs" },
    { path: "/completo", label: "Completo", testId: "nav-complete" },
    { path: "/buscar", label: "Buscar", testId: "nav-search" },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-foreground">
            Campaign Manager
          </h1>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location === item.path ? "secondary" : "ghost"}
                size="sm"
                asChild
                data-testid={item.testId}
                className="hover-elevate"
              >
                <Link href={item.path}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="hover-elevate"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </nav>
  );
}