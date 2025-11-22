import { Slot } from "@/app/Components/Availability";

export function slotArrangers(slotsData:any): Slot[] {

    // Group backend slots (one row per day) into Availability Slot[] and sort by start time
                                const grouped: Record<string, Slot & { days: string[] }> = (slotsData as any[]).reduce((acc, item) => {
                                    const rawStart: string = item.start_time ?? "";
                                    const rawEnd: string = item.end_time ?? "";
                                    const start = rawStart.length >= 5 ? rawStart.slice(0, 5) : rawStart;
                                    const end = rawEnd.length >= 5 ? rawEnd.slice(0, 5) : rawEnd;
        
                                    const key = `${start}-${end}`;
                                    if (!acc[key]) acc[key] = { start, end, days: [] };
        
                                    const days = typeof item.days_of_week === "string"
                                        ? item.days_of_week.split(",").map((d: string) => d.trim()).filter(Boolean)
                                        : [];
        
                                    days.forEach((d: string) => {
                                        if (!acc[key].days.includes(d)) acc[key].days.push(d);
                                    });
        
                                    return acc;
                                }, {});
        
                                // canonical week order for consistent day ordering
                                const weekOrder = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
                                const toMinutes = (t: string) => {
                                    const [hh = "0", mm = "0"] = t.split(":");
                                    return parseInt(hh, 10) * 60 + parseInt(mm, 10);
                                };
        
                                const slotsArr: Slot[] = Object.values(grouped)
                                    .map(s => ({
                                        start: s.start,
                                        end: s.end,
                                        days: s.days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b)),
                                    }))
                                    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    return slotsArr;

}