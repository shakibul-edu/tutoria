'use client';

import { useState, useEffect } from "react";
import { Slot } from "./Availability";
import Availability from "./Availability";
import MultiSelect from "./MultiSelect";
import Loading from "./Loading";
import { useMedium, useGradesByMedium, useSubjects } from "@/utils/Hooks/FormDataHook";
import TagForm from "./TagForm";

export interface FilterParams {
  medium_id: string[];
  grade_id: string[];
  subject_id: string[];
  min_salary: number;
  max_salary: number;
  distance: number;
  gender: string[];
  tuition_type: string[];
  slots: Slot[];
  search_id: string;
}

interface SidbarProps {
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
}

const Sidbar = ({ filters, setFilters }: SidbarProps) => {
  const { mediums, loading: mediumsLoading, error: mediumsError } = useMedium();
  const { grades, loading: gradesLoading, error: gradesError } = useGradesByMedium({ medium_id: filters.medium_id });
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects({ grade_id: filters.grade_id });

  const handleArrayChange = (key: keyof FilterParams, value: string) => {
    const currentArray = filters[key] as string[];
    let newArray: string[];
    if (currentArray.includes(value)) {
      newArray = currentArray.filter((item) => item !== value);
    } else {
      newArray = [...currentArray, value];
    }
    setFilters({ ...filters, [key]: newArray });
  };

  const updateSlots = (newSlots: Slot[]) => {
    setFilters({ ...filters, slots: newSlots });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h1 className="font-DMSans font-bold text-primary1 text-2xl mb-8 border-b pb-2">
        Advance Filter
      </h1>

      {/* Search Post ID */}
      <div className="mb-8">
        <h3 className="font-DMSans font-semibold text-base mb-2">Search Post ID</h3>
        <input
          type="text"
          placeholder="Enter post id"
          value={filters.search_id}
          onChange={(e) => setFilters({ ...filters, search_id: e.target.value })}
          className="w-full p-2 border border-quaternary4 rounded-md outline-none focus:border-tertiary3 transition"
        />
      </div>

      {/* Medium */}
      <div className="mb-8">
        <label className="font-DMSans font-semibold text-base mb-2 block">Medium</label>
        {mediumsLoading ? (
          <Loading />
        ) : mediumsError ? (
          <p className="text-red-500 text-xs">Error loading mediums</p>
        ) : mediums && mediums.length > 0 && (
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex flex-wrap dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {mediums.map((medium) => (
              <TagForm
                style="special"
                key={medium.id}
                name={medium.name}
                value={filters.medium_id.includes(medium.id.toString())}
                handleChange={() => handleArrayChange("medium_id", medium.id.toString())}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Grade / Classes */}
      <div className="mb-8">
        <label className="font-DMSans font-semibold text-base mb-2 block">Classes (Grades)</label>
        {gradesLoading ? (
          <Loading />
        ) : grades && grades.length > 0 ? (
          <MultiSelect
            options={grades.map((grade) => ({
              value: grade.id.toString(),
              label: grade.name,
            }))}
            values={grades
              .filter((grade) => filters.grade_id.includes(grade.id.toString()))
              .map((grade) => ({
                value: grade.id.toString(),
                label: grade.name,
              }))}
            handleChange={(selectedOptions: any) => {
              const values = selectedOptions
                ? selectedOptions.map((opt: any) => opt.value)
                : [];
              setFilters({ ...filters, grade_id: values });
            }}
          />
        ) : (
             <p className="text-sm text-gray-400 italic">Select a medium first</p>
        )}
      </div>

      {/* Subjects */}
      <div className="mb-8">
        <label className="font-DMSans font-semibold text-base mb-2 block">Subjects</label>
        {subjectsLoading ? (
          <Loading />
        ) : subjectsError ? (
          <p className="text-red-500 text-xs">{subjectsError}</p>
        ) : subjects && subjects.length > 0 ? (
          // @ts-ignore
          <MultiSelect
            options={subjects.map((subject) => ({
              value: subject.id.toString(),
              label: subject.name,
            }))}
            values={subjects
              .filter((subject) => filters.subject_id.includes(subject.id.toString()))
              .map((subject) => ({
                value: subject.id.toString(),
                label: subject.name,
              }))}
            handleChange={(selectedOptions: any) => {
              const values = selectedOptions
                ? selectedOptions.map((opt: any) => opt.value)
                : [];
              setFilters({ ...filters, subject_id: values });
            }}
          />
        ) : (
            <p className="text-sm text-gray-400 italic">Select a grade first</p>
        )}
      </div>

      {/* Schedule */}
      <div className="mb-8">
        <h3 className="font-DMSans font-semibold text-base mb-2">
          Search By Schedule
        </h3>
        <div className="p-2 border border-quaternary4 rounded-md bg-gray-50">
          <Availability slots={filters.slots} setSlots={updateSlots} />
        </div>
      </div>

      {/* Fee Range */}
      <div className="mb-8">
        <h3 className="font-DMSans font-semibold text-base mb-5 border-b border-quaternary4 pb-1">Fee Range (Min Salary)</h3>
        <div className="relative mb-6">
          <input
            type="range"
            min={500}
            max={25000}
            step={100}
            value={filters.min_salary}
            onChange={(e) => setFilters({ ...filters, min_salary: parseInt(e.target.value) })}
            className="range range-neutral w-full"
          />
           <div className="flex justify-between text-xs mt-2 font-medium text-gray-600">
             <span>500 Tk</span>
             <span className="text-primary1 font-bold">{filters.min_salary} Tk</span>
             <span>25,000 Tk</span>
           </div>
        </div>
      </div>

      {/* Tutor Preference (Gender) */}
      <div className="mb-8">
        <fieldset className="fieldset bg-base-100 border border-gray-200 rounded-box p-4">
          <legend className="fieldset-legend font-DMSans font-semibold text-base px-2">
            Tutor Preference
          </legend>
          {['male', 'female'].map((g) => (
            <label key={g} className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={filters.gender.includes(g)}
                onChange={() => handleArrayChange('gender', g)}
              />
              <span className="label-text capitalize">{g}</span>
            </label>
          ))}
        </fieldset>
      </div>

      {/* Tuition Type */}
      <div className="mb-8">
        <fieldset className="fieldset bg-base-100 border border-gray-200 rounded-box p-4">
          <legend className="fieldset-legend font-DMSans font-semibold text-base px-2">
            Tuition Type
          </legend>
           {[
               { val: 'online', label: 'Online Tuition' },
               { val: 'offline', label: 'Home Tuition' },
               { val: 'both', label: 'Both' }
           ].map((type) => (
             <label key={type.val} className="label cursor-pointer justify-start gap-4">
               <input
                 type="checkbox"
                 className="checkbox checkbox-primary checkbox-sm"
                 checked={filters.tuition_type.includes(type.val)}
                 onChange={() => handleArrayChange('tuition_type', type.val)}
               />
               <span className="label-text">{type.label}</span>
             </label>
           ))}
        </fieldset>
      </div>

      {/* Nearby (Distance) */}
      <div className="mb-8">
        <h3 className="font-DMSans font-semibold text-base mb-5 border-b border-quaternary4 pb-1">Preferred Distance</h3>
        <div className="relative mb-6">
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.5}
            value={filters.distance}
            onChange={(e) => setFilters({ ...filters, distance: parseFloat(e.target.value) })}
            className="range range-neutral w-full"
          />
           <div className="flex justify-between text-xs mt-2 font-medium text-gray-600">
             <span>0.5 km</span>
             <span className="text-primary1 font-bold">{filters.distance} km</span>
             <span>15 km</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidbar;
