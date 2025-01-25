"use client";
import axios from "axios";
import TestButton from "@/components/TestButton";

export default function Home() {
  /* const test = axios.get('http://localhost:1337/api/assessments')
      .then(response => {
        console.log(response.data); // JSON data is automatically parsed
      })
      .catch(error => {
        console.error(error); // Handles both network and HTTP errors
      });

  console.log(test);*/

  /**/

  return (
    <div>
      <h1>
        <TestButton />
      </h1>
    </div>
  );
}
