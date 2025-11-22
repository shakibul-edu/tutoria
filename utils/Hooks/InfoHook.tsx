import React from 'react'
import { academicProfileType, qualificationType } from '../Type';
import { useSession } from 'next-auth/react';
import { getAcademicProfile, getQualification } from '../fetchFormInfo';

export function useAcademicProfile() {

    const [academicProfile, setAcademicProfile] = React.useState<[] | academicProfileType[]>([]);
    const {data:session} = useSession();

    React.useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchData(idToken: string){
            try{
                const response = await getAcademicProfile(idToken);
            if(response){
                setAcademicProfile(response);
            }else{
                alert("Something went wrong to get profile data")
            }
            }catch(error: any){
                alert(error.message)
            }
            
        }
        if(idToken){
            fetchData(idToken);
        }
    },[session])
  return (
    {academicProfile: academicProfile}
)
}

export function useQualification(){
    const [qualification, setQualification] = React.useState<qualificationType[] | []>([]);

    const {data:session} = useSession();

    const refreshQualification = React.useCallback(async () => {
        const idToken = (session as any)?.id_token;
        if (idToken) {
            try {
                const response = await getQualification(idToken);
                if (response) {
                    setQualification(response);
                } else {
                    alert("Something went wrong to get qualification data");
                }
            } catch (error: any) {
                alert(error.message);
            }
        }
    }, [session]);

    

    React.useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchData(idToken: string){
            try{
                const response = await getQualification(idToken);
            if(response){
                setQualification(response);
            }else{
                alert("Something went wrong to get qualification data")
            }
            }catch(error: any){
                alert(error.message)
            }
            
        }
        if(idToken){
            fetchData(idToken);
        }
    },[session])
  return (
    {qualification: qualification,
    refreshQualification: refreshQualification
    }
)
}
