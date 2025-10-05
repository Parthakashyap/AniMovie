import { fetchFromTMDB } from "@/lib/tmdb";
import { type Movie } from "@/lib/types";
import MovieCarousel from "./movie-carousel";

async function RecommendedMovies({ movie }: { movie: Movie }) {
  if (!movie.genres || movie.genres.length === 0) {
    return null;
  }

  const recommendations = await fetchFromTMDB('/discover/movie', {
    with_genres: movie.genres[0].id.toString(),
    sort_by: 'popularity.desc',
  });

  const filteredRecommendations = recommendations.filter(
    (item) => item.id !== movie.id
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <MovieCarousel
      title="More Like This"
      items={filteredRecommendations}
    />
  );
}

export default RecommendedMovies;
