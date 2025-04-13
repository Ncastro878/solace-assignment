"use client";

import { useState, useEffect } from "react";
import type { Advocate } from "../../db/schema";

export interface TableProps { }

export default function Table(props: TableProps) {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    async function fetchAdvocates() {
      const advocatesResponse = await fetch("/api/advocates")
      const advocatesJson = await advocatesResponse.json()
      setAdvocates(advocatesJson.data);
      setFilteredAdvocates(advocatesJson.data);
    }
    fetchAdvocates();
  }, []);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const searchTermElement: HTMLSpanElement | null = document.getElementById("search-term") as HTMLSpanElement;
    if (searchTermElement) {
      searchTermElement.innerHTML = searchTerm;
    }
    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        advocate.yearsOfExperience.toString().toLowerCase().includes(searchTerm.toLowerCase())
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