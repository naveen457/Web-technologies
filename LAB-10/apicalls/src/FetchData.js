import React, { useState, useEffect } from "react";

function FetchData() {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect for API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // runs only once

  return (
    <div style={styles.container}>
      <h2>User List</h2>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p style={styles.error}>Error: {error}</p>}

      {/* Data */}
      {!loading && !error && (
        <ul>
          {data.map((user) => (
            <li key={user.id} style={styles.item}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px"
  },
  item: {
    margin: "10px"
  },
  error: {
    color: "red"
  }
};

export default FetchData;