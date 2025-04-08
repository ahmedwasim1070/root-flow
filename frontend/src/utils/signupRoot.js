export async function signupRoot(url, formData,setIsRoot) {
  const response = await fetch(url, { method: "POST", body: formData });
  const data = await response.json();

  if(response.ok){

  }
}
