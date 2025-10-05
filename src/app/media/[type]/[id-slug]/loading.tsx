import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-16 border-b" />
      <main className="flex-1">
        <div className="relative h-[30vh] w-full bg-muted sm:h-[40vh] md:h-[50vh]">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="container mx-auto max-w-5xl -mt-16 px-4 pb-8 sm:px-6 lg:-mt-24 lg:px-8">
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end">
            <div className="w-full max-w-[150px] shrink-0 md:max-w-[200px]">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="flex flex-col gap-2 py-4">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
