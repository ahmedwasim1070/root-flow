export const logoutUser = async (url, setIsLoggedIn, setAuthUser) => {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error from API : ", data.message);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
};
