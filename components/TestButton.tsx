/*
"use client"; // Mark this as a client-side component

import { useState } from "react";

export default function TestButton() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setResponse("");

    try {
      // Send a POST request to the API route
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: "The text contrast in the footer is too low.",
        }), // Example user input
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data); // Update response
      } else {
        setResponse("An error occurred: " + data.error);
      }
    } catch (error) {
      setResponse("Failed to fetch response: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Accessibility Issue"}
      </button>
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
}
*/
