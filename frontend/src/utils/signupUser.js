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

    return await response.json();
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
