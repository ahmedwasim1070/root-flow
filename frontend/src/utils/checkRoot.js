export async function checkRoot(url, setIsRoot) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      setIsRoot(false);
      console.error("Error From API :", data.message);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("API Error : ", error);
    throw error;
  }
}
