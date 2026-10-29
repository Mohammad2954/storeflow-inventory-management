
const API_URL = "http://localhost:3002/api";

export const getData = async (path, type = "GET", content) => {
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

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.error ||
      `خطا در درخواست: ${response.status}`
    );
  }

  return result;
};
