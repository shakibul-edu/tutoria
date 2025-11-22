import { updateQualification, deleteQualification } from "@/utils/formSubmission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { qualificationType } from "@/utils/Type";
import { qualificationSchema } from "@/formSchema";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

type EducationFormValues = z.infer<typeof qualificationSchema>;
// Narrow a type for editing where certificates may be undefined
type EducationEditFormValues = Omit<EducationFormValues, 'certificates'> & { certificates?: File };
// For edit validation, derive a schema that makes certificates optional
const qualificationEditSchema = qualificationSchema.extend({
  certificates: qualificationSchema.shape.certificates.optional(),
});


// Editable qualification item component
type EditableQualificationProps = {
  qual: qualificationType;
  index: number;
  yearOptions: string[];
  onUpdate: () => void;
};


const EditableQualification = ({ qual, index, yearOptions, onUpdate }: EditableQualificationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();

  const { control, handleSubmit, register, formState: { errors, isSubmitting } } = useForm<EducationEditFormValues>({
    resolver: zodResolver(qualificationEditSchema),
    defaultValues: {
      id: qual.id?.toString(),
      teacher: qual.teacher?.toString(),
      organization: qual.organization,
      skill: qual.skill,
      year: qual.year.toString(),
      results: qual.results,
      certificates: undefined,
      validated: qual.validated,
    },
    mode: "onBlur",
  });

  // Debug: log validation errors
  console.log("Edit form errors:", errors);
  console.log("Edit form isSubmitting:", isSubmitting);

  const onFormError = (errors: any) => {
    console.log("🚫 Form validation failed:", errors);
    alert("Form validation failed. Check console for details.");
  };

  const onSubmitEdit = async (e: EducationEditFormValues) => {
    
    if (status !== "authenticated") {
      alert("User not authenticated. Please log in.");
      return;
    }
    const idToken = (session as any)?.id_token;
    if (!qual.id) {
      alert("Missing qualification id; cannot update.");
      return;
    }
    const formData = new FormData();
    formData.append("organization", e.organization);
    formData.append("skill", e.skill);
    formData.append("year", String(e.year));
    formData.append("results", e.results);
    // Only append certificates if user selected a new file; backend should keep old if omitted
    if (e.certificates instanceof File) {
      formData.append("certificates", e.certificates);
    }
    console.log("UpdateQualification -> FormData entries", Array.from(formData.entries()));
    try {
      const response = await updateQualification(idToken, qual.id, formData);
      console.log("UpdateQualification response", response);
      if (response) {
        alert("Qualification updated successfully.");
        setIsEditing(false);
        onUpdate();
      } else {
        alert("Update returned no response; check server logs.");
      }
    } catch (error: any) {
      console.error("Error updating qualification:", error?.message || error);
      alert(error?.message || "Failed to update qualification.");
    }
  };

  if (isEditing) {
    return (
      <div className="border border-quaternary4 bg-white p-4 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-DMSans font-semibold text-base">Edit Qualification</h4>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmitEdit, onFormError)} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Skill</label>
            <input
              type="text"
              placeholder="Enter skill"
              className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
              {...register("skill")}
            />
          </div>
          {errors.skill && <p className="text-red-500 text-xs ml-[10rem]">{String(errors.skill.message)}</p>}

          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Organization</label>
            <input
              type="text"
              placeholder="Enter organization"
              className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
              {...register("organization")}
            />
          </div>
          {errors.organization && <p className="text-red-500 text-xs ml-[10rem]">{String(errors.organization.message)}</p>}

          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Result</label>
            <input
              type="text"
              placeholder="Enter result"
              className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
              {...register("results")}
            />
          </div>
          {errors.results && <p className="text-red-500 text-xs ml-[10rem]">{String(errors.results.message)}</p>}

          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Year</label>
            <select className="select w-full outline-0" {...register("year")}>
              <option value="">Select year</option>
              {yearOptions.map((y) => (
                <option key={y} value={y.toString()}>{y.toString()}</option>
              ))}
            </select>
          </div>
          {errors.year && <p className="text-red-500 text-xs ml-[10rem]">{String(errors.year.message)}</p>}

          <div className="flex items-center gap-4">
            <label className="font-DMSans font-normal text-base w-40">Update Document</label>
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
          <p className="text-xs text-gray-500 ml-[10rem]">Leave empty to keep existing certificate</p>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-primary1 text-white font-DMSans font-semibold text-base px-8 py-2 rounded-md hover:bg-tertiary3 transition-colors duration-300"
            >
              Update Qualification
            </button>
          </div>
        </form>
      </div>
    );
  }else{
    
  }

  return (
    <div className="border border-quaternary4 bg-gray-50 p-4 rounded-sm relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={async () => {
            if (!qual.id) {
              alert("Missing id; cannot delete.");
              return;
            }
            if (status !== "authenticated") {
              alert("Please log in first.");
              return;
            }
            const confirmed = window.confirm("Are you sure you want to delete this qualification? This action cannot be undone.");
            if (!confirmed) return;
            const idToken = (session as any)?.id_token;
            try {
              console.log("Deleting qualification", qual.id);
              await deleteQualification(idToken, qual.id as string);
              alert("Qualification deleted.");
              onUpdate();
            } catch (err: any) {
              console.error("Delete error", err?.message || err);
              alert(err?.message || "Failed to delete qualification.");
            }
          }}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-16">
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Skill:</span>
          <p className="font-DMSans text-base">{qual.skill}</p>
        </div>
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Organization:</span>
          <p className="font-DMSans text-base">{qual.organization}</p>
        </div>
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Result:</span>
          <p className="font-DMSans text-base">{qual.results}</p>
        </div>
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Year:</span>
          <p className="font-DMSans text-base">{qual.year}</p>
        </div>
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Certificate:</span>
          {qual.certificates ? (
            <a href={qual.certificates} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
              View Certificate
            </a>
          ) : (
            <p className="text-gray-400 text-sm">No certificate</p>
          )}
        </div>
        <div>
          <span className="font-DMSans font-medium text-sm text-gray-600">Status:</span>
          <p className={`font-DMSans text-sm ${qual.validated ? 'text-green-600' : 'text-yellow-600'}`}>
            {qual.validated ? '✓ Validated' : '⏳ Pending Validation'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditableQualification;