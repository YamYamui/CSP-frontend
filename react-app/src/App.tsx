import { useState } from "react";
import axios from "axios";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Home from "./components/Home";
import ScheduleTable from "./components/ScheduleTable";
import ScoreTable from "./components/ScoreTable";

interface FormData {
  pax: number;
  month: string;
  personData: number[][];
  agreed: boolean;
}

type ScheduleData = {
  [key: string]: string[];
};

function App() {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFormData = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const formattedData = {
      year: new Date(data.month).getFullYear(), // Extract year from the month input
      month: new Date(data.month).getMonth() + 1, // Extract month (1-based index) from the month input
      pax: data.pax,
      favor_consecutive: data.agreed ? 1 : 0, // Convert boolean to 0 or 1
      constraints: Object.fromEntries(
        data.personData.map((dates: Array<number>, index: number) => [
          `M${index + 1}`, // Key in the format M1, M2, etc.
          {
            cannot_work_on: dates, // The blocked out dates for the person
          },
        ])
      ),
    };

    // Convert formattedData to JSON Blob
    const jsonBlob = new Blob([JSON.stringify(formattedData)], {
      type: "application/json",
    });

    // Create FormData and append the JSON Blob
    const formData = new FormData();
    formData.append("file", jsonBlob, "data.json");

    try {
      // Send the formatted data to your Flask API
      const response = await axios.post(
        "https://csp-scheduler.onrender.com/api/solve",
        formattedData
      );
      console.log("API Response:", response.data);
      setSchedule(response.data);
    } catch (error) {
      console.error("Error sending data to the API:", error);
      setError(
        "An error occurred while generating the schedule. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-1">
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-1">
          <Home onFormSubmit={processFormData} />
          {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        </div>
        <div className="col-span-4">
          <h2 className="text-2xl font-bold mt-32">Generated Schedule:</h2>
          {loading ? (
            <p className="mt-8">Generating schedule...</p>
          ) : (
            <p className="mt-8">To generate, press generate</p>
          )}
          {schedule && (
            <div className="mt-8 ">
              <ScheduleTable scheduleData={schedule} />
              <ScoreTable scheduleData={schedule} />

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
