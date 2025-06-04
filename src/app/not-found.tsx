import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 bg-background">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-2">
        <FaExclamationTriangle className="text-destructive text-5xl" />
      </div>
      <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or perhaps you mistyped the URL.
      </p>
      
      <Link
        href="/"
        className="mt-4 inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}