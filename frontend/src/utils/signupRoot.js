export async function signupRoot(url, formData, setIsRoot) {
  try {
    const { confirmPassword, ...dataToSend } = formData;
    const rootData = {
      ...dataToSend,
      role: "root",
      status: "active",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rootData),
    });

    if (response.ok) {
      setIsRoot(true);
    } else {
      setIsRoot(false);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error : ", error);
    setIsRoot(false);
    throw error;
  }
}
