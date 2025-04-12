"use client";

import { useState, useEffect } from "react";
import type { Advocate } from "../../db/schema";

export interface TableProps { }

export default function Table(props: TableProps) {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClickSearchButton = () => {
    setFilteredAdvocates(advocates);
  };

  const onClickResetButton = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <>
      <div>
      <p>Search</p>
      <p>
        Searching for: <span id="search-term"></span>
      </p>
      <input style={{ border: "1px solid black" }} onChange={onSearchInputChange} />
      <button className="border border-gray-400 rounded-md mx-2 px-2" onClick={onClickResetButton}>Reset</button>
      <button className="border border-gray-400 rounded-md mx-2 px-2" onClick={onClickSearchButton}>Search</button>
    </div>
    <br />
    <br />
    <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b px-6 py-3 text-left">First Name</th>
            <th className="border-b px-6 py-3 text-left">Last Name</th>
            <th className="border-b px-6 py-3 text-left">City</th>
            <th className="border-b px-6 py-3 text-left">Degree</th>
            <th className="border-b px-6 py-3 text-left">Specialties</th>
            <th className="border-b px-6 py-3 text-left">Years of Experience</th>
            <th className="border-b px-6 py-3 text-left">Phone Number</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdvocates.map((advocate: Advocate, index: number) => {
              return (
                <tr key={`${advocate.id}-${index}`}>
                  <td className="px-6 py-4">{advocate.firstName}</td>
                  <td className="px-6 py-4">{advocate.lastName}</td>
                  <td className="px-6 py-4">{advocate.city}</td>
                  <td className="px-6 py-4">{advocate.degree}</td>
                  <td className="px-6 py-4">
                    {advocate.specialties.map((s, index) => (
                      <div key={`${advocate.id}-${s}-${index}`}>{s}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4">{advocate.phoneNumber}</td>
                </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}