import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const getIngredients = async (page = 0, keyword = '') => {
  try {
    const response = await fetchV1Authorized(`ingredient/get-ingredient?page=${page}&keyword=${keyword}`, {
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

export const addIngredient = async (data) => {
  try {
    const response = await fetchV1Authorized(`ingredient/add-ingredient`, {
      method: 'POST',
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

export const deleteIngredient = async (ingredientSlug) => {
  try {
    const response = await fetchV1Authorized(`ingredient/delete-ingredient/${ingredientSlug}`, {
      method: 'DELETE'
    });
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateIngredient = async (ingredientSlug, data) => {
  try {
    const response = await fetchV1Authorized(`ingredient/update-ingredient/${ingredientSlug}`, {
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
