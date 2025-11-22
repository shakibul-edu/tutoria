"use client";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { qualificationSchema } from "../../formSchema";

import { useSession } from "next-auth/react";
import { submitQualification, deleteQualification } from "@/utils/formSubmission";
import { useQualification } from "@/utils/Hooks/InfoHook";
import EditableQualification from "./EditableQualification";


type EducationFormValues = z.infer<typeof qualificationSchema>;


const newEducation = (): EducationFormValues => ({
  id: undefined,
  teacher: undefined,
  organization: "",
  skill: "",
  year: "",
  results: "",
  certificates: undefined as unknown as File,
  validated: false,
});

const Qualification = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<EducationFormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: newEducation(),
    mode: "onBlur",
  });


  const { data: session, status } = useSession();
  const { qualification, refreshQualification } = useQualification();

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const start = current - 60; // last 60 years
    return Array.from({ length: current - start + 1 }, (_, i) => String(current - i));
  }, []);

  const handleUpdate = () => {
    // Instead of full page reload, we bump a key to trigger hook re-fetch if implemented.
    // If hook doesn't listen to refreshKey yet, fallback to location.reload for now.
    setRefreshKey(prev => prev + 1);
    refreshQualification();
    
  };



  const onSubmit = async (e: EducationFormValues) => {
    console.log("Submitting education entry:", e);
    // Single-entry FormData
    const formData = new FormData();
    formData.append("organization", e.organization);
    formData.append("skill", e.skill);
    formData.append("year", String(e.year));
    formData.append("results", e.results);
    if (e.certificates) formData.append("certificates", e.certificates);

    if (status !== "authenticated") {
      alert("User not authenticated. Please log in.");
      return;
    }
    const idToken = (session as any)?.id_token;
    console.log("FormData", Object.fromEntries(formData.entries()));
    try {
      const response = await submitQualification(idToken, formData);
      if (response) {
        alert("Qualification submitted successfully.");
         refreshQualification();
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
        <h1 className="font-DMSans font-semibold text-2xl border-b-2 border-quaternary4">Qualifications</h1>
        <h2 className="font-DMSans font-normal text-xl mt-1.5">Your professional qualifications</h2>
      </div>

      {/* Display existing qualifications */}
      {qualification && qualification.length > 0 && (
        <div className="mt-5 space-y-4">
          <h3 className="font-DMSans font-semibold text-lg">Saved Qualifications</h3>
          {qualification.map((qual, index) => (
            <EditableQualification
              key={qual.id || index}
              qual={qual}
              index={index}
              yearOptions={yearOptions}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Add new qualification form */}
      <div className="mt-8">
        <h3 className="font-DMSans font-semibold text-lg mb-3">Add New Qualification</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 border border-quaternary4 p-6 rounded-sm">
        {/* Degree */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Skill</label>
          <input
            type="text"
            placeholder="e.g., Secondary / SSC / O-level / Dakhil"
            className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
            {...register("skill")}
          />
        </div>
        {errors.skill && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.skill.message)}</p>}

        {/* Organization */}
        <div className="flex items-center gap-4">
          <label className="font-DMSans font-normal text-xl w-52">Organization</label>
          <input
            type="text"
            placeholder="Enter organization name"
            className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
            {...register("organization")}
          />
        </div>
        {errors.organization && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.organization.message)}</p>}

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
          <select className="select w-full outline-0" {...register("year") }>
            <option value="">Select year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {errors.year && <p className="text-red-500 text-xs ml-[13rem]">{String(errors.year.message)}</p>}

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

export default Qualification;
