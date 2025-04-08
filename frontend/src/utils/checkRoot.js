export async function checkRoot(url) {
  try {
    const response = await fetch(url);

    return await response.json();
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
