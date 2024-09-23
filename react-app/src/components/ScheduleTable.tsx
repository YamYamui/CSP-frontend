// import React from "react";

// type ScheduleData = {
//   [key: string]: string[];
// };

// interface CoverData {
//   name: string;
//   start: number;
//   end: number;
// }

// interface ScheduleTableProps {
//   scheduleData: ScheduleData;
//   covers?: CoverData[];
// }

// const ScheduleTable: React.FC<ScheduleTableProps> = ({
//   scheduleData,
//   covers = [],
// }) => {
//   const days = Object.keys(scheduleData).sort(
//     (a, b) => parseInt(a) - parseInt(b)
//   );
//   const people = Array.from(new Set(Object.values(scheduleData).flat())).sort();

//   const getPersonDuty = (person: string, day: string): string => {
//     if (scheduleData[day].includes(person)) {
//       return scheduleData[day][0] === person ? "P1" : "P2";
//     }
//     return "";
//   };

//   const getPersonCover = (person: string, day: string): string => {
//     const date = parseInt(day); // Convert day string to number

//     // Check each cover
//     for (const cover of covers) {
//       // Check if the person is covered on that day
//       if (
//         scheduleData[cover.name][0] === person &&
//         date >= cover.start &&
//         date <= cover.end
//       ) {
//         return cover.name;
//       }
//     }
//     return "";
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="px-4 py-2 border-b border-r">Names\Dates</th>
//             {days.map((day) => (
//               <th key={day} className="px-4 py-2 border-b border-r">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {people.map((person) => (
//             <tr key={person}>
//               <td className="px-4 py-2 border-b border-r font-bold">
//                 {person}
//               </td>
//               {days.map((day) => (
//                 <td
//                   key={`${person}-${day}`}
//                   className="px-4 py-2 border-b border-r text-center"
//                 >
//                   {getPersonDuty(person, day) || getPersonCover(person, day)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ScheduleTable;

// round 2
// import React from "react";

// type ScheduleData = {
//   [key: string]: string[];
// };

// interface CoverData {
//   name: string;
//   start: number;
//   end: number;
// }

// interface ScheduleTableProps {
//   scheduleData: ScheduleData;
//   covers: CoverData[];
// }

// const ScheduleTable: React.FC<ScheduleTableProps> = ({
//   scheduleData,
//   covers,
// }) => {
//   const days = Object.keys(scheduleData).sort(
//     (a, b) => parseInt(a) - parseInt(b)
//   );
//   const people = Array.from(new Set(Object.values(scheduleData).flat())).sort();

//   const getPersonAssignments = (person: string, day: string): string[] => {
//     const assignments: string[] = [];
//     const date = parseInt(day);

//     // Check for P1 or P2 duty
//     if (scheduleData[day]?.includes(person)) {
//       assignments.push(scheduleData[day][0] === person ? "P1" : "P2");
//     }

//     // Check for covers
//     covers.forEach((cover) => {
//       if (
//         date >= cover.start &&
//         date <= cover.end &&
//         scheduleData[cover.name]?.includes(person)
//       ) {
//         assignments.push(cover.name);
//       }
//     });

//     return assignments;
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="px-4 py-2 border-b border-r">Names\Dates</th>
//             {days.map((day) => (
//               <th key={day} className="px-4 py-2 border-b border-r">
//                 {day}
//               </th>
//             ))}
//             {covers.map((cover) => (
//               <th key={cover.name} className="px-4 py-2 border-b border-r">
//                 {cover.name}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {people.map((person) => (
//             <tr key={person}>
//               <td className="px-4 py-2 border-b border-r font-bold">
//                 {person}
//               </td>
//               {days.map((day) => {
//                 const assignments = getPersonAssignments(person, day);
//                 return (
//                   <td
//                     key={`${person}-${day}`}
//                     className="px-4 py-2 border-b border-r text-center"
//                   >
//                     {assignments.join(", ")}
//                   </td>
//                 );
//               })}
//               {covers.map((cover) => (
//                 <td
//                   key={`${person}-${cover.name}`}
//                   className="px-4 py-2 border-b border-r text-center"
//                 >
//                   {scheduleData[cover.name]?.includes(person) ? "✓" : ""}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ScheduleTable;

import React from "react";

type ScheduleData = {
  [key: string]: string[];
};

interface CoverData {
  name: string;
  start: number;
  end: number;
}

interface ScheduleTableProps {
  scheduleData: ScheduleData;
  covers: CoverData[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  scheduleData,
  covers,
}) => {
  const days = Object.keys(scheduleData)
    .filter((key) => !isNaN(parseInt(key)))
    .sort((a, b) => parseInt(a) - parseInt(b));
  const people = Array.from(new Set(Object.values(scheduleData).flat())).sort();

  const getPersonAssignments = (person: string, day: string): string[] => {
    const assignments: string[] = [];
    const date = parseInt(day);

    // Check for P1 or P2 duty
    if (scheduleData[day]?.includes(person)) {
      assignments.push(scheduleData[day][0] === person ? "P1" : "P2");
    }

    // Check for covers
    covers.forEach((cover) => {
      if (
        date >= cover.start &&
        date <= cover.end &&
        scheduleData[cover.name]?.includes(person)
      ) {
        assignments.push(cover.name.toUpperCase());
      }
    });

    return assignments;
  };

  return (
    <table className="min-w-max bg-white border border-gray-300 overflow-x-auto">
      <thead>
        <tr className="bg-gray-100">
          <th className=" left-0 z-10 bg-gray-100 px-4 py-2 border-b border-r">
            Names\Dates
          </th>
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
            <td className=" left-0 z-10 bg-white px-4 py-2 border-b border-r font-bold">
              {person}
            </td>
            {days.map((day) => {
              const assignments = getPersonAssignments(person, day);
              return (
                <td
                  key={`${person}-${day}`}
                  className="px-4 py-2 border-b border-r text-center whitespace-nowrap"
                >
                  {assignments.join(", ")}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;
