import React from "react";
import { useState } from "react";
// import { useNavigate } from 'react-router-dom';

function FAQs() {
  const [selectedIndex, setSelectedIndex] = useState();
  const questions = [
    "1. Find the given faculty’s research fields.",
    "2. Find all faculty working in a given field.",
    "3. What are research strengths of the department?",
    "4. What are research weakness of the department? (We can hire more people in those fields).",
    "5. Research faculty working in field X and Y (X or Y), faculty working in multiple areas.",
  ];
  // const navigate = useNavigate();


  const handleQuestionSelect = (index: number) => {
    console.log("Selected question: ", index + 1);
    const queNo = index+1;
    // navigate(`/graph/${queNo}`);
  };

  return (
    <>
      <h1>FAQs</h1>
      <ul className="list-group">
        {questions.map((question, index) => (
          <li
            key={question}
            className={`list-group-item ${
              selectedIndex === index ? "active" : ""
            }`}
            onClick={() => handleQuestionSelect(index)}
          >
            {question}
          </li>
        ))}
      </ul>
    </>
  );
};
export default FAQs;
