
const API_URL = "http://localhost:3002/api";

export const getData = async (path, type = "GET", content) => {
  try {
    const isFormData = content instanceof FormData;

    const response = await fetch(`${API_URL}/${path}`, {
      method: type,
      headers: content && !isFormData
        ? { "Content-Type": "application/json" }
        : undefined,
      body: content
        ? isFormData
          ? content
          : JSON.stringify(content)
        : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Request failed: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
