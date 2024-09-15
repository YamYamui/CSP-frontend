import React from "react";

type ScheduleData = {
  [key: string]: string[];
};

interface ScheduleTableProps {
  scheduleData: ScheduleData;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ scheduleData }) => {
  const days = Object.keys(scheduleData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const people = Array.from(new Set(Object.values(scheduleData).flat())).sort();

  const getPersonDuty = (person: string, day: string): string => {
    if (scheduleData[day].includes(person)) {
      return scheduleData[day][0] === person ? "P1" : "P2";
    }
    return "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b border-r"></th>
            {days.map((day) => (
              <th key={day} className="px-4 py-2 border-b border-r">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person}>
              <td className="px-4 py-2 border-b border-r font-bold">
                {person}
              </td>
              {days.map((day) => (
                <td
                  key={`${person}-${day}`}
                  className="px-4 py-2 border-b border-r text-center"
                >
                  {getPersonDuty(person, day)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
