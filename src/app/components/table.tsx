"use client";

import { useState, useEffect } from "react";
import type { Advocate } from "../../db/schema";
import { dbDefaultLimit, API_BASE_URL, dbDefaultOffset } from "@/utils";
import { getAdvocates } from "../services/advocatesService";

export interface TableProps {
  initialAdvocates: Advocate[];
  initialTotalCount: number;
}

export default function Table({ initialAdvocates, initialTotalCount }: TableProps) {
  const [filteredAdvocates, setFilteredAdvocates] = useState(initialAdvocates);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  useEffect(() => {
    updateAdvocates();
  }, [currentPage]);
  
  /**
   *  currentPage & searchTerm state hooks may not update in time for query, so we pass in _currentPage & _searchTerm as an override if necessary
   * */
  const updateAdvocates = async ({_currentPage, _searchTerm}: {_currentPage?: number, _searchTerm?: string} = {}) => {
    const offset = _currentPage ? _currentPage * dbDefaultLimit : currentPage * dbDefaultLimit;
    const {data: updatedAdvocates, totalCount: updatedTotalCount} = await getAdvocates(dbDefaultLimit, offset, _searchTerm ?? searchTerm);
    setFilteredAdvocates(updatedAdvocates);
    setTotalCount(updatedTotalCount);
  }

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const searchTermElement: HTMLSpanElement | null = document.getElementById("search-term") as HTMLSpanElement;
    if (searchTermElement) {
      searchTermElement.innerHTML = inputValue;
    }
    setSearchTerm(inputValue);
  };

  const onClickSearchButton = async () => {
    setCurrentPage(0);
    await updateAdvocates({_currentPage: 0});
  };

  const onClickResetButton = async () => {
    setCurrentPage(0);
    setSearchTerm("");
    const searchTermElement: HTMLSpanElement | null = document.getElementById("search-term") as HTMLSpanElement;
    if (searchTermElement) {
      searchTermElement.innerHTML = "";
    }
    await updateAdvocates({_currentPage: 0, _searchTerm: ""});
  };

  return (
    <>
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input value={searchTerm} style={{ border: "1px solid black" }} 
          onChange={onSearchInputChange} 
          onKeyDown={(e) => e.key === 'Enter' && onClickSearchButton()}
        />
        <button className="border border-gray-400 rounded-md mx-2 px-2 active:scale-95 transition-transform duration-100" onClick={onClickResetButton}>Reset</button>
        <button className="border border-gray-400 rounded-md mx-2 px-2 active:scale-95 transition-transform duration-100" onClick={onClickSearchButton}>Search</button>
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
      <PaginationControls 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        totalCount={totalCount}
      />
    </>
  );
}

interface PaginationControlsProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
}

function PaginationControls({ currentPage, setCurrentPage, totalCount }: PaginationControlsProps){
  return(
    <div className="mt-4 flex items-center justify-between px-6">
      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 border border-gray-400 rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {totalCount > 0 ? currentPage + 1 : 0} of{' '}
        {Math.ceil(totalCount / dbDefaultLimit)}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage >= Math.ceil(totalCount / dbDefaultLimit) - 1}
        className="px-4 py-2 border border-gray-400 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}