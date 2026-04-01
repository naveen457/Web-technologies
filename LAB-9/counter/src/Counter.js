import React, { useState } from "react";

function Counter() {
  // State initialization
  const [count, setCount] = useState(0);

  // Increment function
  const increment = () => {
    setCount(count + 1);
  };

  // Decrement function
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={styles.container}>
      <h1>Counter App</h1>

      <h2>{count}</h2>

      <button onClick={increment} style={styles.button}>
        Increment
      </button>

      <button onClick={decrement} style={styles.button}>
        Decrement
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
  },
};

export default Counter;