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

export const unbookmarkRecipe = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/bookmark/${recipeSlug}`, {
      method: 'DELETE',
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

export const getMyRecipeDetail = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/get-my-recipe-detail/${recipeSlug}`, {
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

export const copyRecipe = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/copy-recipe/${recipeSlug}`, {
      method: 'POST',
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

export const getUpdateRecipeData = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/update-recipe/${recipeSlug}`, {
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

export const getSettingsRecipeData = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`recipe/set-recipe/${recipeSlug}`, {
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

export const updateSettingsRecipeData = async (recipeSlug, data) => {
  try {
    const response = await fetchV1Authorized(`recipe/set-recipe/${recipeSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateDetailRecipeData = async (recipeSlug, data) => {
  try {
    const response = await fetchV1Authorized(`recipe/update-recipe/${recipeSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getManageRecipes = async (page = 0, keyword = '') => {
  try {
    const response = await fetchV1Authorized(`manage-recipe?page=${page}&keyword=${keyword}`, {
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

export const updateStatusRecipe = async (recipeSlug) => {
  try {
    const response = await fetchV1Authorized(`manage-recipe/status/${recipeSlug}`, {
      method: 'PUT',
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

export const getAllBookmarkedRecipesPaginate = async (page = 0) => {
  try {
    const response = await fetchV1Authorized(`recipe/get-all-bookmarked-recipes?page=${page}`, {
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

export const getPopularRecipes = async () => {
  try {
    const response = await fetchV1Authorized('browse-recipe', {
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

export const getRecipeHistory = async (recipeSlug, page) => {
  try {
    const response = await fetchV1Authorized(`browse-recipe/get-all-recipe-history/${recipeSlug}?page=${page}`, {
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

export const getRecipeHistoryDetail = async (historySlug) => {
  try {
    const response = await fetchV1Authorized(`browse-recipe/get-recipe-history-detail/${historySlug}`, {
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