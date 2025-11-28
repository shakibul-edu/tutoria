"use client";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { academicProfileSchema } from "../../formSchema";

import { useSession } from "next-auth/react";
import { submitAcademicProfiles } from "@/utils/formSubmission";
import { useAcademicProfile } from "@/utils/Hooks/InfoHook";
import EditableAcademic from "./EditableAcademic";

type EducationFormValues = z.infer<typeof academicProfileSchema>;

const newEducation = (): EducationFormValues => ({
  id: undefined,
  teacher: undefined,
  institution: "",
  degree: "",
  graduation_year: "",
  results: "",
  certificates: undefined as unknown as File,
  validated: false,
});

const EducationInfo = () => {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<EducationFormValues>({
    resolver: zodResolver(academicProfileSchema),
    defaultValues: newEducation(),
    mode: "onBlur",
  });


  const { data: session, status } = useSession();
  const {academicProfile, refreshAcademicProfile } = useAcademicProfile();

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const start = current - 60; // last 60 years
    return Array.from({ length: current - start + 1 }, (_, i) => String(current - i));
  }, []);



  const onSubmit = async (e: EducationFormValues) => {
    console.log("Submitting education entry:", e);
    // Single-entry FormData
    const formData = new FormData();
    formData.append("institution", e.institution);
    formData.append("degree", e.degree);
    formData.append("graduation_year", String(e.graduation_year));
    formData.append("results", e.results);
    if (e.certificates) formData.append("certificates", e.certificates);

    if (status !== "authenticated") {
      alert("User not authenticated. Please log in.");
      return;
    }
    const idToken = (session as any)?.id_token;
    console.log("FormData", Object.fromEntries(formData.entries()));
    try {
      const response = await submitAcademicProfiles(idToken, formData);
      if (response) {
        alert("Academic profile submitted successfully.");
      }
      // reset for next entry
      reset(newEducation());
    } catch (error) {
      
      console.error("Error submitting academic profiles:", error);
    }
  };

  return (
    <div className="mt-8">
      <div className="w-full max-w-2xl">
        <h1 className="font-DMSans font-semibold text-2xl border-b-2 border-quaternary4">Educational Info</h1>
        <h2 className="font-DMSans font-normal text-xl mt-1.5">Your academic profiles</h2>
      </div>

      {/* Display existing academic profiles (editable) */}
      {academicProfile && academicProfile.length > 0 && (
        <div className="mt-5 space-y-4">
          <h3 className="font-DMSans font-semibold text-lg">Saved Academic Profiles</h3>
          {academicProfile.map((profile, index) => (
            <EditableAcademic
              key={profile.id || index}
              profile={profile}
              index={index}
              yearOptions={yearOptions}
              onUpdate={() => refreshAcademicProfile()}
            />
          ))}
        </div>
      )}

      {/* Add new academic profile form */}
      <div className="mt-8">
        <h3 className="font-DMSans font-semibold text-lg mb-3">Add New Academic Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 border border-quaternary4 p-6 rounded-sm">
        {/* Degree */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Degree</label>
          <input
            type="text"
            placeholder="e.g., Secondary / SSC / O-level / Dakhil"
            className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
            {...register("degree")}
          />
        </div>
        {errors.degree && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.degree.message)}</p>}

        {/* Institution */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Institution</label>
          <input
            type="text"
            placeholder="Enter institution name"
            className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
            {...register("institution")}
          />
        </div>
        {errors.institution && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.institution.message)}</p>}

        {/* Results */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Result</label>
          <input
            type="text"
            placeholder="Enter result"
            className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
            {...register("results")}
          />
        </div>
        {errors.results && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.results.message)}</p>}

        {/* Graduation Year */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Passing Year</label>
          <select className="select w-full outline-0" {...register("graduation_year") }>
            <option value="">Select year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {errors.graduation_year && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.graduation_year.message)}</p>}

        {/* Certificates (File) */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Add Document</label>
          <Controller
            name="certificates"
            control={control}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                className="file-input file-input-neutral w-full border-quaternary4 rounded-sm outline-0"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file);
                }}
              />
            )}
          />
        </div>
        {errors.certificates && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.certificates.message)}</p>}

        
        <div className="text-center">
          <button
            type="submit"
            className="bg-primary1 text-white font-DMSans font-semibold text-lg px-10 py-2 rounded-md hover:bg-tertiary3 transition-colors duration-300"
          >
            Save & Add Another
          </button>
        </div>
      </div>
        </form>
      </div>
    </div>
  );
};

export default EducationInfo;
