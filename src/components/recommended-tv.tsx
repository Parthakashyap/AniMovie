import { fetchFromTMDB } from "@/lib/tmdb";
import { type TVShow } from "@/lib/types";
import TvCarousel from "./tv-carousel";

async function RecommendedTv({ show }: { show: TVShow }) {
  if (!show.genres || show.genres.length === 0) {
    return null;
  }

  const recommendations = await fetchFromTMDB('/discover/tv', {
    with_genres: show.genres[0].id.toString(),
    sort_by: 'popularity.desc',
  });

  const filteredRecommendations = recommendations.filter(
    (item) => item.id !== show.id
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <TvCarousel
      title="More Like This"
      items={filteredRecommendations}
    />
  );
}

export default RecommendedTv;
