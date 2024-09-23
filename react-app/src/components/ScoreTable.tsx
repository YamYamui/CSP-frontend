import React from "react";

type ScheduleData = {
  [key: string]: string[];
};

interface ScoreTablePropsProps {
  scheduleData: ScheduleData;
}

const ScoreTableProps: React.FC<ScoreTablePropsProps> = ({ scheduleData }) => {
  const days = Object.keys(scheduleData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const people = Array.from(new Set(Object.values(scheduleData).flat())).sort();

  // Function to calculate duty points for a person
  const calculateDutyPoints = (person: string): number => {
    return days.reduce((points, day) => {
      if (scheduleData[day].includes(person)) {
        return points + (scheduleData[day][0] === person ? 1 : 1); // 2 points for P1, 1 point for P2
      }
      return points;
    }, 0);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-1/10 mx-auto bg-white border border-gray-300 text-sm ">
        {" "}
        {/* Reduced width and font size */}
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border-b border-r">Person</th>{" "}
            {/* Reduced padding */}
            <th className="px-2 py-1 border-b border-r">Duty Points</th>{" "}
            {/* Reduced padding */}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person}>
              <td className="px-2 py-1 border-b border-r font-bold">
                {person}
              </td>{" "}
              {/* Reduced padding */}
              <td className="px-2 py-1 border-b border-r text-center">
                {calculateDutyPoints(person)} {/* Display total duty points */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTableProps;
