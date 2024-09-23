"use client";

import { ChangeEvent, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Field, Label, Switch } from "@headlessui/react";

interface homeProps {
  onFormSubmit: (data: FormData) => void;
}

interface FormData {
  pax: number;
  month: string;
  personData: number[][];
  consecutive: boolean;
  covers: CoverData[];
}

interface CoverData {
  name: string;
  start: number;
  end: number;
}

function Home({ onFormSubmit }: homeProps) {
  // State hooks
  const [consecutive, setconsecutive] = useState(false);
  const [pax, setPax] = useState(0);
  const [month, setMonth] = useState("");
  const [personData, setPersonData] = useState<number[][]>([]);
  const [covers, setCovers] = useState<CoverData[]>([]);

  // Add a new cover
  const addCover = () => {
    setCovers([...covers, { name: "", start: 0, end: 0 }]);
  };

  // Remove a cover
  const removeCover = (index: number) => {
    setCovers(covers.filter((_, i) => i !== index));
  };

  // Handle cover input change
  const handleCoverChange = (
    index: number,
    field: keyof CoverData,
    value: string | number
  ) => {
    const updatedCovers = [...covers];
    updatedCovers[index] = { ...updatedCovers[index], [field]: value };
    setCovers(updatedCovers);
  };

  // Event handlers
  const handlePaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10) || 0;
    if (value < 0) {
      value = 0;
    }
    setPax(value);
    setPersonData(Array(value).fill([]));
  };

  const handlePersonChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const numbers = value
      .split(",")
      .map((str) => str.trim())
      .filter((str) => !isNaN(Number(str)))
      .map((num) => Number(num));

    const updatedPersonData = [...personData];
    updatedPersonData[index] = numbers;
    setPersonData(updatedPersonData);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for the parent component
    const formData = {
      pax,
      month,
      personData,
      consecutive,
      covers,
    };
    console.log(formData);
    // Call the onFormSubmit function passed as a prop
    onFormSubmit(formData);
  };

  return (
    <div className="isolate bg-white px-6 py-1 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>
      <form
        onSubmit={handleFormSubmit}
        action="#"
        method="POST"
        className="mx-auto mt-4 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Month
            </label>
            <div className="mt-2.5">
              <input
                id="month"
                name="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Pax
            </label>
            <div className="mt-2.5">
              <input
                id="pax"
                name="pax"
                type="number"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => handlePaxChange(e)}
                value={pax}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            {Array(pax)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="mt-2">
                  <label
                    htmlFor={`input-${index}`}
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Person {index + 1}
                  </label>
                  <input
                    id={`input-${index}`}
                    name={`input-${index}`}
                    type="text"
                    placeholder={`Enter block out dates for person ${
                      index + 1
                    }`}
                    value={personData[index].join(", ")}
                    onChange={(e) => handlePersonChange(index, e)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              ))}
          </div>

          {/* Add cover button */}
          <div className="sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={addCover}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Cover
            </button>
          </div>

          {/* Cover input fields */}
          {covers.map((cover, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-x-4 sm:col-span-2 mt-2"
            >
              <input
                type="text"
                placeholder="Cover Name"
                value={cover.name}
                onChange={(e) =>
                  handleCoverChange(index, "name", e.target.value)
                }
                className="rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
              <input
                type="number"
                placeholder="Start Day"
                value={cover.start}
                onChange={(e) =>
                  handleCoverChange(index, "start", Number(e.target.value))
                }
                className="rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
              <input
                type="number"
                placeholder="End Day"
                value={cover.end}
                onChange={(e) =>
                  handleCoverChange(index, "end", Number(e.target.value))
                }
                className="rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
              <div className="grid grid-cols-subgrid gap-x-4 col-span-3">
                <div className="col-start-3">
                  <button
                    type="button"
                    onClick={() => removeCover(index)}
                    className="bg-red-500 text-white rounded px-3.5 mt-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Generate
          </button>
        </div>

        <Field className="flex gap-x-4 sm:col-span-2">
          <div className="flex h-6 items-center">
            <Switch
              checked={consecutive}
              onChange={setconsecutive}
              className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
            >
              <span className="sr-only">Agree to policies</span>
              <span
                aria-hidden="true"
                className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
              />
            </Switch>
          </div>
          <Label className="text-sm leading-6 text-gray-600">
            Consecutive duties bias
          </Label>
        </Field>
      </form>
    </div>
  );
}

export default Home;
