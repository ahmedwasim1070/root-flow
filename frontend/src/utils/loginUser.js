import cookie from "js-cookie";

export async function loginUser(url, formData, setIsLogin) {
  try {
    const jsonWebToken = cookie.get(secret_key);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cookies: jsonWebToken,
    });

    if (response.ok) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error : ", error);
    setIsLogin(false);
    throw error;
  }
}
