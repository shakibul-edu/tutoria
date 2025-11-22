import { Slot } from '@/app/Components/Availability';
import { useSession } from 'next-auth/react';
import React from 'react'
import { getSlots } from '../fetchFormInfo';
import { slotArrangers } from '../slotArranger';

export default function useSlotsFetcher() {

    const {data: session} = useSession();

    const [slots, setSlots] = React.useState<Slot[]>([{ start: "16:00", end: "21:00", days: ["MO"] }]);

    React.useEffect(() => {
        const idToken = (session as any)?.id_token;
        async function fetchSlots(id: string){
                    if(idToken){
                        try {
                            const data = await getSlots(idToken);
                            if(data){
                                const slotsArr = slotArrangers(data);
        
                                setSlots(slotsArr);
                            }
                        } catch (error) {
                            console.error("Error fetching slots:", error);
                        }
                    }
                }
        if(idToken){
            fetchSlots(idToken);
        }
    }, [session]);

  return (
    {slots, setSlots}
  )
}
