import { Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="container py-24 flex flex-col items-center text-center">
      <span className="text-6xl font-bold text-primary/30 mb-4">404</span>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-md" style={{ fontFamily: 'var(--font-body)' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md text-primary-foreground transition-colors"
        style={{ background: '#975F57', fontFamily: 'var(--font-body)' }}
      >
        <Home size={16} />
        Return Home
      </Link>
    </div>
  );
}
