export const checkAuth = async (url, setIsLoggedIn, setAuthUser) => {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      setIsLoggedIn(false);
      setAuthUser({});
    } else {
      setIsLoggedIn(true);
      setAuthUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
};
