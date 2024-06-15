import { fetchV1, fetchV1Authorized } from "@spiceswap/utils/fetch";

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

export async function logoutUser() {
  try {
    const response = await fetchV1Authorized('auth/logout', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

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

export async function resendEmailVerifyRegister(token) {
  const body = {
    token: token,
  };

  try {
    const response = await fetchV1('auth/resend-email-verify-register', {
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

// @ts-ignore
export async function emailVerifyRegister(token) {
  const urlParams = `?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetchV1(`auth/email-verify-register${urlParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

