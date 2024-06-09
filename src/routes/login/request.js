import { fetchV1 } from "$lib/fetch";

// @ts-ignore
export async function loginUser(usernameOrEmail, password) {
  const body = {
    credential: usernameOrEmail,
    password: password
  };

  try {
    const response = await fetchV1('auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

