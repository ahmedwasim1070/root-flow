export async function checkRoot(url, setIsRoot) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      setIsRoot(true);
    } else {
      setIsRoot(false);
    }

    return data;
  } catch (error) {
    console.error('API Error : ', error)
    setIsRoot(false);
    throw error;
  }
}
