import { fetchV1, fetchV1Authorized } from "@spiceswap/utils/fetch";

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

export const deleteReview = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`review/delete?recipeSlug=${recipeSlug}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const browseReviews = async (recipeSlug, page) => {
  try {
    const response = await fetchV1(`browse-recipe/review-list?recipeSlug=${recipeSlug}&page=${page}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const browseReviewAuthenticated = async (recipeSlug, page) => {
  try {
    const response = await fetchV1Authorized(`review/list?recipeSlug=${recipeSlug}&page=${page}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyReview = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`review?recipeSlug=${recipeSlug}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}