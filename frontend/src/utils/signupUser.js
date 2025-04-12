export async function signupUser(url, formData) {
  try {
    const { confirmPassword, ...dataToSend } = formData;
    const rootData = {
      ...dataToSend,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rootData),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error from API : ", data.message);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
