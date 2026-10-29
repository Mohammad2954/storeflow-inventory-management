
import { useState } from "react";
import { getData } from "../feature/Getdata/getData.js";

const useMutation = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (type, content) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getData(path, type, content);

      setData(result);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
};

export default useMutation;
