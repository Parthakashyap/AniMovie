import MovieCard from './movie-card';
import { type Movie } from '@/lib/types';

interface MovieGridProps {
  title: string;
  items: Movie[];
}

export default function MovieGrid({ title, items }: MovieGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
