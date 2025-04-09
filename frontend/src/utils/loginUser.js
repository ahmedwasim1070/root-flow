export async function loginUser(url, formData, setAuthUser, setIsLoggedIn) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (!response.ok) {
      setAuthUser({});

      setIsLoggedIn(false);
    } else {
      setAuthUser(data.user);

      setIsLoggedIn(true);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
