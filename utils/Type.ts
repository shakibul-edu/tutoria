export type gradeType = {
  id: number;
  name: string;
  sequence: number;
  medium: string[];
};

export type mediumType = {
  id: number;
  name: string;
};

export type subjectType = {
  id: number;
  name: string;
  description: string;
  subject_code: string;
  grade: string;
};

export type availabilityType = {
  start: string;
  end: string;
  days: string[];
};

export type academicProfileType = {
  id: string  | undefined;
  teacher: string | undefined;
  institution: string;
  degree: string;
  graduation_year: string;
  results: string;
  certificates: string;
  validated: boolean;
}

export type qualificationType = {
  id: string  | undefined;
  teacher: string | undefined;
  organization: string;
  skill: string;
  year: string;
  results: string;
  certificates: string;
  validated: boolean;
}