import React from "react";
import StudentCard from "./StudentCard";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Student Cards</h1>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        
        <StudentCard 
          name="Naveen"
          department="Computer Science"
          marks="85"
        />

        <StudentCard 
          name="Rahul"
          department="Mechanical"
          marks="78"
        />

        <StudentCard 
          name="Anjali"
          department="Electronics"
          marks="92"
        />

      </div>
    </div>
  );
}

export default App;