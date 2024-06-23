import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const getModificationRequestRecipe = async (page) => {
  try {
    const response = await fetchV1Authorized(`modification-request/copy-recipe?page=${page}`);
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const sendModificationRequest = async (data) => {
  try {
    const response = await fetchV1Authorized(`modification-request/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getInboxModificationRequest = async (page) => {
  try {
    const response = await fetchV1Authorized(`modification-request/in?page=${page}`);
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOutboxModificationRequest = async (page) => {
  try {
    const response = await fetchV1Authorized(`modification-request/out?page=${page}`);
    return response
  } catch (error) {
    console.error(error);
    throw error;
  }
}