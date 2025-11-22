"use client";
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, Controller } from "react-hook-form";

export type EducationEntryProps = {
  index: number;
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  yearOptions: string[];
  onRemove: () => void;
  canRemove: boolean;
};

export default function EducationEntry({
  index,
  register,
  control,
  setValue,
  errors,
  yearOptions,
  onRemove,
  canRemove,
}: EducationEntryProps) {
  const base = `educations.${index}`;
  // Safely access nested errors for this index
  const educationsErrors = (errors as any)?.educations as any[] | undefined;
  const err = educationsErrors?.[index];

  return (
    <div className="space-y-4">
      {/* Degree */}
      <div className="flex items-center gap-4">
        <label className="font-DMSans font-normal text-xl w-52">Degree</label>
        <input
          type="text"
          placeholder="e.g., Secondary / SSC / O-level / Dakhil"
          className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
          {...register(`${base}.degree`)}
        />
      </div>
      {err?.degree && (
        <p className="text-red-500 text-xs ml-[13rem]">{err.degree.message as string}</p>
      )}

      {/* Institution */}
      <div className="flex items-center gap-4">
        <label className="font-DMSans font-normal text-xl w-52">Institution</label>
        <input
          type="text"
          placeholder="Enter institution name"
          className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
          {...register(`${base}.institution`)}
        />
      </div>
      {err?.institution && (
        <p className="text-red-500 text-xs ml-[13rem]">{err.institution.message as string}</p>
      )}

      {/* Results */}
      <div className="flex items-center gap-4">
        <label className="font-DMSans font-normal text-xl w-52">Result</label>
        <input
          type="text"
          placeholder="Enter result"
          className="border border-quaternary4 rounded-sm outline-0 w-full p-1.5"
          {...register(`${base}.results`)}
        />
      </div>
      {err?.results && (
        <p className="text-red-500 text-xs ml-[13rem]">{err.results.message as string}</p>
      )}

      {/* Graduation Year */}
      <div className="flex items-center gap-4">
        <label className="font-DMSans font-normal text-xl w-52">Passing Year</label>
        <select className="select w-full outline-0" {...register(`${base}.graduation_year`)}>
          <option value="">Select year</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {err?.graduation_year && (
        <p className="text-red-500 text-xs ml-[13rem]">{err.graduation_year.message as string}</p>
      )}

      {/* Certificates (File) */}
      <div className="flex items-center gap-4">
        <label className="font-DMSans font-normal text-xl w-52">Add Document</label>
        <Controller
          name={`${base}.certificates`}
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
      {err?.certificates && (
        <p className="text-red-500 text-xs ml-[13rem]">{err.certificates.message as string}</p>
      )}

     

      {/* Remove button */}
      {canRemove && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
