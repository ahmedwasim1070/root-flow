export const checkAuth = async (url, setIsLoggedIn) => {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
};
