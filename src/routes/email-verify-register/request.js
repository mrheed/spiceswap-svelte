import { fetchV1 } from "$lib/fetch";

// @ts-ignore
export async function resendEmailVerifyRegister(credential) {
  const body = {
    credential: credential,
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

