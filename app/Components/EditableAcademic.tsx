"use client";
import { updateAcademicProfile, deleteAcademicProfile } from "@/utils/formSubmission";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { academicProfileType } from "@/utils/Type";
import { academicProfileSchema } from "@/formSchema";
import { Controller, useForm } from "react-hook-form";

type EducationFormValues = z.infer<typeof academicProfileSchema>;
type EducationEditFormValues = Omit<EducationFormValues, 'certificates'> & { certificates?: File };

type EditableAcademicProps = {
  profile: academicProfileType;
  index: number;
  yearOptions: string[];
  onUpdate: () => void;
};

const EditableAcademic = ({ profile, index, yearOptions, onUpdate }: EditableAcademicProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();

  const editSchema = academicProfileSchema.extend({ certificates: academicProfileSchema.shape.certificates.optional() });
  const { control, handleSubmit, register, formState: { errors, isSubmitting } } = useForm<EducationEditFormValues>({
    resolver: zodResolver(editSchema as any),
    defaultValues: {
      id: profile.id?.toString(),
      teacher: profile.teacher?.toString(),
      institution: profile.institution,
      degree: profile.degree,
      graduation_year: profile.graduation_year.toString(),
      results: profile.results,
      certificates: undefined,
      validated: profile.validated,
    },
    mode: "onBlur",
  });

  const onFormError = (errors: any) => {
    console.log("Academic edit validation failed", errors);
    alert("Validation failed; check console.");
  };

  const onSubmitEdit = async (e: EducationEditFormValues) => {
    if (status !== "authenticated") {
      alert("User not authenticated. Please log in.");
      return;
    }
    const idToken = (session as any)?.id_token;
    if (!profile.id) {
      alert("Missing profile id; cannot update.");
      return;
    }
    const formData = new FormData();
    formData.append("institution", e.institution);
    formData.append("degree", e.degree);
    formData.append("graduation_year", String(e.graduation_year));
    formData.append("results", e.results);
    if (e.certificates instanceof File) formData.append("certificates", e.certificates);

    try {
      const resp = await updateAcademicProfile(idToken, profile.id, formData);
      console.log("update academic resp", resp);
      alert("Academic profile updated.");
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      console.error(err?.message || err);
      alert(err?.message || "Failed to update academic profile.");
    }
  };

  if (isEditing) {
    return (
      <div className="border border-quaternary4 bg-white p-4 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-DMSans font-semibold text-base">Edit Academic Profile</h4>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-gray-600 hover:text-gray-800">Cancel</button>
        </div>
        <form onSubmit={handleSubmit(onSubmitEdit, onFormError)} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Degree</label>
            <input type="text" className="border rounded-sm w-full p-1.5" {...register('degree')} />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Institution</label>
            <input type="text" className="border rounded-sm w-full p-1.5" {...register('institution')} />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Result</label>
            <input type="text" className="border rounded-sm w-full p-1.5" {...register('results')} />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Graduation Year</label>
            <select className="select w-full" {...register('graduation_year')}>
              <option value="">Select year</option>
              {yearOptions.map((y) => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Update Document</label>
            <Controller name="certificates" control={control} render={({ field: { onChange } }) => (
              <input type="file" onChange={(ev) => onChange(ev.target.files?.[0])} className="file-input w-full" />
            )} />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-primary1 text-white px-6 py-2 rounded">Update</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border border-quaternary4 bg-gray-50 p-4 rounded-sm relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
        <button onClick={async () => {
          if (!profile.id) { alert('Missing id'); return; }
          if (status !== 'authenticated') { alert('Log in first'); return; }
          const confirmed = window.confirm('Delete this academic profile?');
          if (!confirmed) return;
          const idToken = (session as any)?.id_token;
          try { await deleteAcademicProfile(idToken, profile.id); alert('Deleted'); onUpdate(); } catch (err:any) { console.error(err); alert(err?.message || 'Failed'); }
        }} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-16">
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Degree:</span><p className="font-DMSans text-base">{profile.degree}</p></div>
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Institution:</span><p className="font-DMSans text-base">{profile.institution}</p></div>
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Result:</span><p className="font-DMSans text-base">{profile.results}</p></div>
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Year:</span><p className="font-DMSans text-base">{profile.graduation_year}</p></div>
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Certificate:</span>{profile.certificates ? (<a href={profile.certificates} target="_blank" rel="noopener noreferrer" className="text-blue-600">View</a>) : (<p className="text-gray-400">No certificate</p>)}</div>
        <div><span className="font-DMSans font-medium text-sm text-gray-600">Status:</span><p className={`font-DMSans text-sm ${profile.validated ? 'text-green-600' : 'text-yellow-600'}`}>{profile.validated ? '✓ Validated' : '⏳ Pending Validation'}</p></div>
      </div>
    </div>
  );
};

export default EditableAcademic;
