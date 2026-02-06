import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="relative flex bg-background">
      {/* Close button */}
      <div className="absolute left-4 top-4 z-50">
        {/* <Link
          className="inline-flex outline-none items-center justify-center whitespace-nowrap transition-all rounded-lg shadow-sm text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 w-9"
          href="/"
        >
          <X />
        </Link> */}
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}
