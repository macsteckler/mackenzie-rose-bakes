export interface GoogleReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  profile_photo_url: string;
}

export interface ReviewsData {
  reviews: GoogleReview[];
  rating: number;
  total: number;
  placeId: string;
}

// Cached for 24 hours — revalidates in the background on the next request after expiry.
export async function getGoogleReviews(): Promise<ReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("[Reviews] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — falling back to static reviews.");
    return null;
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews%2Crating%2Cuser_ratings_total` +
      `&key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 24-hour cache
    });

    if (!res.ok) {
      console.error("[Reviews] Places API HTTP error:", res.status);
      return null;
    }

    const data = await res.json();

    if (data.status !== "OK") {
      console.error("[Reviews] Places API error status:", data.status, data.error_message);
      return null;
    }

    const result = data.result ?? {};

    return {
      reviews: (result.reviews ?? []) as GoogleReview[],
      rating: result.rating ?? 5,
      total: result.user_ratings_total ?? 0,
      placeId,
    };
  } catch (err) {
    console.error("[Reviews] Unexpected error fetching Google reviews:", err);
    return null;
  }
}
