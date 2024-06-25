import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const getUsers = async (page, username='') => {
  try {
    const response = await fetchV1Authorized(`manage-user?page=${page}${username ? `&username=${username}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (username) => {
  try {
    const response = await fetchV1Authorized(`manage-user?username=${username}&page=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getUserInfo = async () => {
  try {
    const response = await fetchV1Authorized('manage-user/info', {
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

export const updateUserToAdmin = async (username) => {
  try {
    const response = await fetchV1Authorized(`manage-user/status/${username}`, {
      method: 'PUT',
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