export const queryUser = async (url) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error in API : ", data.message);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
};
