import React, { useEffect, useState } from "react";
import TourList from "../components/TourList";

const backend_url = `http://127.0.0.1:3000/api/v1`;

const Home = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${backend_url}/tours`);
        if (!res.ok) throw new Error("Failed to fetch tours");

        const data = await res.json();
        setTours(data.data?.docs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <p>Loading tours...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="main">
      <TourList tours={tours} />
    </main>
  );
};

export default Home;
