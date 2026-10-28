
import { useEffect, useState } from "react";
import { getData } from "../feature/Getdata/getData";

const useFetch = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getData(path);

        if (!ignore) {
          setData(result);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [path]);

  return { data, loading, error };
};

export default useFetch;
