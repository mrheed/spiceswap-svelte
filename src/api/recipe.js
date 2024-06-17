import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const saveRecipe = async (recipeData) => {
  try {
    const response = await fetchV1Authorized('recipe/add-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
};

export const getAllMyRecipesPaginate = async (page = 0) => {
  try {
    const response = await fetchV1Authorized(`recipe/get-all-my-recipes?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const browseRecipesPaginate = async (page = 0, keyword = '', sortBy = 'newest') => {
  try {
    const response = await fetchV1Authorized(`browse-recipe/search?page=${page}&keyword=${keyword}&sortBy=${sortBy}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const bookmarkRecipe = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/bookmark/${recipeSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getBrowseRecipeDetail = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`browse-recipe/recipe-detail/${recipeSlug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}