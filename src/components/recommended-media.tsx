import { fetchFromAniList } from "@/lib/anilist";
import { type Media } from "@/lib/types";
import MediaCarousel from "./media-carousel";

async function RecommendedMedia({ media }: { media: Media }) {
  if (!media.genres || media.genres.length === 0) {
    return null;
  }

  // Fetch recommendations based on the first genre
  const recommendations = await fetchFromAniList({
    genre_in: [media.genres[0]],
    sort: ["SCORE_DESC"],
    perPage: 15,
    type: media.type,
  });

  // Filter out the current media from the recommendations
  const filteredRecommendations = recommendations.filter(
    (item) => item.id !== media.id
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <MediaCarousel
      title="More Like This"
      items={filteredRecommendations}
    />
  );
}

export default RecommendedMedia;
