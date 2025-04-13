export async function updateUser(url, targetId, targetStatus) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetId, targetStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error in API :", data.message);
      throw new error(data.message);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
