import React from "react";

function StudentProfile() {
  // Student details stored in variables
  const name = "Naveen";
  const department = "Computer Science";
  const year = "3rd Year";
  const section = "A";

  return (
    <div style={styles.container}>
      <h1>Student Profile</h1>

      <div style={styles.card}>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Department:</strong> {department}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Section:</strong> {section}</p>
      </div>
    </div>
  );
}

// Simple styling (optional but makes it clean)
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  card: {
    display: "inline-block",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
  },
};

export default StudentProfile;