import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const writeReview = async (recipeSlug, rating, review) => {
  try {
    const response = await fetchV1Authorized('review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeSlug, rating, comment: review })
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
