export const queryUser = async (url, authUser) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
};
