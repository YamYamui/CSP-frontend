import { useState } from "react";
import axios from "axios";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Home from "./components/Home";
import ScheduleTable from "./components/ScheduleTable";
import ScoreTable from "./components/ScoreTable";

interface CoverData {
  name: string;
  start: number;
  end: number;
}
interface FormData {
  pax: number;
  month: string;
  personData: number[][];
  consecutive: boolean;
  covers: CoverData[];
}

type ScheduleData = {
  [key: string]: string[];
};

function App() {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState(true);
  const [data, setData] = useState<FormData | null>(null);

  const processFormData = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setData(data);
    const formattedData = {
      year: new Date(data.month).getFullYear(), // Extract year from the month input
      month: new Date(data.month).getMonth() + 1, // Extract month (1-based index) from the month input
      pax: data.pax,
      favor_consecutive: data.consecutive ? 1 : 0, // Convert boolean to 0 or 1
      constraints: Object.fromEntries(
        data.personData.map((dates: Array<number>, index: number) => [
          `M${index + 1}`, // Key in the format M1, M2, etc.
          {
            cannot_work_on: dates, // The blocked out dates for the person
          },
        ])
      ),
      covers: data.covers.map((cover: any) => ({
        name: cover.name,
        start: cover.start,
        end: cover.end,
      })),
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
      if (response.data == null) {
        setSolution(false);
      } else {
        setSolution(true);
      }
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
    <div className="flex h-screen bg-gray-100">
      {/* Right Sidebar */}
      <div className="w-80 bg-white shadow-md">
        <div className="p-4 px-2">
          <h1 className="text-center text-4xl font-bold mb-2">
            Duty Scheduler
          </h1>
          <p className="text-center mt-2 text-lg leading-8 text-gray-600">
            AI powered duty roster generator
          </p>
          <Home onFormSubmit={processFormData} />
        </div>
      </div>

      {/* Right main content */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-4xl font-bold mb-2">Generated Schedule:</h2>
        {loading && <p>Generating schedule...</p>}
        {error && (
          <div className="alert alert-warning alert-dismissible fade show">
            {error}
          </div>
        )}
        {!solution && (
          <div className="alert alert-warning alert-dismissible fade show">
            No solution found
          </div>
        )}
        {schedule && (
          <>
            <ScheduleTable scheduleData={schedule} covers={data.covers} />
            <ScoreTable scheduleData={schedule} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
