import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
        {/* Navbar is already included here */}
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>

        {/* Ensure Dark Mode Toggle is only at bottom-right */}
        <div className="fixed bottom-4 right-4 z-50">
          <DarkModeToggle />
        </div>
      </body>
    </html>
  );
}
