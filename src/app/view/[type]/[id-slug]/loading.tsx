import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="outline" size="icon" disabled>
          <ArrowLeft />
        </Button>
        <Skeleton className="h-8 w-1/2" />
      </header>
      <main className="flex flex-1 flex-col">
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container mx-auto flex items-center justify-between p-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </main>
    </div>
  );
}
