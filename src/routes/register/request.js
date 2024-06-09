import { fetchV1 } from "$lib/fetch";

// @ts-ignore
export async function registerUser(username, name, email, password) {
  const body = {
    username: username,
    name: name,
    email: email,
    password: password
  };

  try {
    const response = await fetchV1('auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

