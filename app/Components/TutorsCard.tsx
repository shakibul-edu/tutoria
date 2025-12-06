"use client";
import { GiPathDistance } from "react-icons/gi";
import TutorsDetails from "./TutorsDetails";
import Image from "next/image";
import { useState } from "react";

// Define the shape of a Tutor object based on API response expectations
// Mapping potentially different backend keys to UI fields if needed.
// For now, I'll assume the API returns keys similar to what I need or I'll map them in the parent.
// Let's use a flexible interface.
export interface Tutor {
    id: number | string;
    profile_image?: string; // API might return 'profile_image' or 'img'
    name: string;
    institute_name?: string; // 'institute'
    department?: string; // 'dep'
    medium?: string; // might be array
    experience_years?: number;
    preferred_distance?: number;
    gender?: string;
    // We'll map these fields from the API response in the parent or handle differences here.
    // Let's assume the parent cleans the data to match this or similar.
    // Actually, to be safe, I'll accept any structure and map it in the render.
    [key: string]: any;
}

interface TutorsCardProps {
    tutors: Tutor[];
    loading?: boolean;
    error?: string | null;
}

const TutorsCard = ({ tutors, loading, error }: TutorsCardProps) => {
    // To handle the modal issue: only one modal in DOM, or pass ID.
    // The current TutorsDetails uses id="ViewProfileModal".
    // I will keep one modal and pass the selected tutor to it.
    // But TutorsDetails component doesn't seem to accept props yet.
    // For this task, I will primarily focus on the list.
    // I will try to support the modal if possible.

    // WORKAROUND: For now, I'll just render the list.
    // If the original code had the modal inside the loop (which was buggy),
    // I'll move it out if I can modify TutorsDetails.
    // Since I'm not supposed to scope creep too much, I'll leave the modal logic
    // as "View Profile" button simply opening the modal.
    // Note: Since `TutorsDetails` hardcodes content (ViewSidebarProfile, ViewTutorProfile),
    // it likely fetches its own data or is also hardcoded.
    // I won't touch TutorsDetails unless I have to.

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4 md:px-0">
            {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card bg-base-100 shadow-xl h-96 animate-pulse">
                    <div className="bg-gray-200 h-40 w-full rounded-t-xl"></div>
                    <div className="p-4 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            ))}
        </div>
    );
  }

  if (error) {
      return (
          <div className="text-center mt-10 text-red-500">
              <p>{error}</p>
          </div>
      )
  }

  if (!tutors || tutors.length === 0) {
      return (
          <div className="text-center mt-10 text-gray-500">
              <p className="text-xl">No tutors found matching your criteria.</p>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4 md:px-0">
      {tutors.map((tutor) => (
        <div
          key={tutor.id}
          className="card bg-white shadow-xl border border-gray-100 rounded-xl transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden group"
        >
          <figure className="px-10 pt-8 relative">
            <div className="relative w-32 h-32 mx-auto">
                <Image
                src={tutor.profile_image || "/MyImg.jpg"} // Fallback image
                alt={tutor.name || "Tutor"}
                fill
                className="rounded-full border-4 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
             <div className="absolute top-4 right-4 badge badge-primary badge-outline text-xs font-semibold">
                {tutor.gender || "N/A"}
             </div>
          </figure>
          <div className="card-body items-center text-center p-6 pt-2">
            <h2 className="card-title font-DMSans font-bold text-xl text-gray-800 line-clamp-1">
              {tutor.name}
            </h2>
            <p className="font-DMSans font-medium text-sm text-tertiary3 line-clamp-1 uppercase tracking-wide">
              {tutor.institute_name || tutor.institute || "N/A"}
            </p>
            <p className="font-DMSans text-sm text-gray-500 line-clamp-1">
              {tutor.department || tutor.dep || ""}
            </p>

            <div className="w-full border-t border-gray-100 my-3"></div>

            <div className="flex justify-between w-full text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                    <GiPathDistance className="text-lg text-primary1" />
                    {tutor.preferred_distance || tutor.distance} km
                </span>
                <span className="font-semibold text-primary1">
                    {tutor.expected_salary || tutor.price || "Negotiable"}
                </span>
            </div>

             <div className="flex flex-wrap justify-center gap-1 mb-4">
                 {/* Display mediums or subjects as tags if available */}
                 {/* Assuming medium is a string, split it if comma separated, or array */}
                 {(Array.isArray(tutor.medium_list) ? tutor.medium_list : (tutor.medium || "").split(',')).slice(0, 2).map((m: string, i: number) => (
                     m && <span key={i} className="badge badge-ghost badge-sm text-xs text-gray-500">{m}</span>
                 ))}
                 {(Array.isArray(tutor.subject_list) ? tutor.subject_list : (tutor.subjects || "").split(',')).slice(0, 2).map((s: string, i: number) => (
                     s && <span key={i} className="badge badge-ghost badge-sm text-xs text-gray-500">{s}</span>
                 ))}
             </div>

            <div className="card-actions justify-center w-full">
              <button
                onClick={() => {
                  const modal = document.getElementById(
                    "ViewProfileModal"
                  ) as HTMLDialogElement | null;
                  if (modal) modal.showModal();
                }}
                className="btn btn-primary w-full bg-primary1 border-none text-white font-DMSans font-semibold text-base hover:bg-opacity-90 shadow-md rounded-lg"
              >
                View Profile
              </button>
            </div>
          </div>
          {/* Note: Ideally TutorsDetails should be outside the loop or handle data injection.
              Keeping it inside implies duplicated modals, but that was the original logic.
              I'll remove it from here and let the parent handle the modal or just have one modal at the bottom of the page.
          */}
        </div>
      ))}
      <TutorsDetails />
    </div>
  );
};

export default TutorsCard;
