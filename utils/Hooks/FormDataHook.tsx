'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { getGradesbyMedium, getMediums, getSubjects } from "../fetchFormInfo";
import { gradeType, mediumType, subjectType } from "../Type";

// Helper hook to compare arrays
function useDeepCompareMemoize(value: any) {
  const ref = useRef<any>([]);
  if (JSON.stringify(value) !== JSON.stringify(ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

export const useMedium = () => {
    const [mediums, setMediums] = useState<[] | mediumType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();


     useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchData() {
            setLoading(true);
            setError(null);
            setMediums([]);
            // Loading set to false immediately after setting to true? logic error in original code.
            // Fixed logic:

            if (session && idToken) {
                try {
                     const data = await getMediums(idToken);
                     setMediums(data);
                } catch(err) {
                    console.log('Error connecting to server:', err);
                    setError('Failed to fetch mediums');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }    
        if(idToken){
            fetchData();
        }  

    }, [session]);

   

   return { mediums, loading, error };
};

export const useGradesByMedium = ({medium_id}: {medium_id: string[]}) => {
    const [grades, setGrades] = useState<[] | gradeType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();

    // Stable dependency for array
    const stableMediumId = useDeepCompareMemoize(medium_id);

     useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchGrades() {
            setLoading(true);
            setError(null);
            setGrades([]);
            if (session && idToken) {
                 try {
                    const data = await getGradesbyMedium(idToken, {medium_id: stableMediumId});
                    setGrades(data);
                 } catch (err) {
                    console.log('Error connecting to server:', err);
                    setError('Failed to fetch grades');
                 } finally {
                    setLoading(false);
                 }
            }
        }
        if(stableMediumId && stableMediumId.length > 0 && session) {
            fetchGrades();
        }

    }, [stableMediumId, session]); // Included session in dep array properly
    return { grades, loading, error };
};


export const useSubjects = ({grade_id}: {grade_id: string[]}) => {
    const [subjects, setSubjects] = useState<[] | subjectType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();

    // Stable dependency for array
    const stableGradeId = useDeepCompareMemoize(grade_id);

     useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchSubjects() { // Renamed from fetchGrades to fetchSubjects
            setLoading(true);
            setError(null);
            setSubjects([]);
            if (session && idToken) {
                try {
                    const data = await getSubjects(idToken, {grade_id: stableGradeId});
                    setSubjects(data);
                } catch(err: any) {
                    console.log('Error connecting to server:', err);
                    setError(err.message || 'Failed to fetch subjects');
                } finally {
                    setLoading(false);
                }
            }
        }
        if(stableGradeId && stableGradeId.length > 0 && idToken) {
            fetchSubjects();
        }

    }, [stableGradeId, session]); // Included session in dep array properly
    return { subjects, loading, error };
};
