
const API_URL = "http://localhost:3002/api";

export const getData = async (path) => {
  try {
    const response = await fetch(`${API_URL}/${path}`);

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
