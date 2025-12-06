'use client';
import { useState, useEffect, useCallback } from "react";
import Sidbar, { FilterParams } from "@/app/Components/Sidbar";
import TutorsCard, { Tutor } from "@/app/Components/TutorsCard";
import { useSession } from "next-auth/react";
import { FetchApi } from "@/utils/FetchApi";

const Page = () => {
    const { data: session } = useSession();
    const [filters, setFilters] = useState<FilterParams>({
        medium_id: [],
        grade_id: [],
        subject_id: [],
        min_salary: 500,
        max_salary: 25000,
        distance: 5,
        gender: [],
        tuition_type: [],
        slots: [],
        search_id: "",
    });

    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to serialize filters for API
    const serializeFilters = (f: FilterParams) => {
        const params: Record<string, string | number> = {};

        if (f.medium_id.length) params.medium_id = f.medium_id.join(',');
        if (f.grade_id.length) params.grade_id = f.grade_id.join(',');
        if (f.subject_id.length) params.subject_id = f.subject_id.join(',');
        if (f.gender.length) params.gender = f.gender.join(',');
        if (f.tuition_type.length) params.tuition_type = f.tuition_type.join(',');

        // Ranges
        if (f.min_salary > 500) params.min_salary = f.min_salary;
        // params.max_salary = f.max_salary; // Optional depending on backend
        if (f.distance) params.preferred_distance = f.distance;
        if (f.search_id) params.search_id = f.search_id;

        // Slots needs special handling depending on backend expectation.
        // Assuming backend takes simplified schedule or we skip it for now if complex object isn't supported in GET query.
        // Or we send it as a JSON string?
        // Given existing CreateTeacher sends slots to /availability/, filtering might be different.
        // I will serialize it as JSON string if `slots` param is supported, or maybe day/time keys.
        // For now, I'll attempt to send it as a JSON string if it's not empty.
        if (f.slots.length > 0) {
            params.availability = JSON.stringify(f.slots);
        }

        return params;
    };

    const fetchTutors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = serializeFilters(filters);
            // Assuming /filter-teacher is the endpoint.
            // If it requires auth, we pass the token.
            const token = (session as any)?.id_token;
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            // Note: If endpoint is public but token is optional, this works.
            // If endpoint doesn't exist yet (as grep showed), this will fail (404).
            // But I must implement as per requirement.

            const data = await FetchApi.get('/filter-teacher/', params, headers);
            // Assuming data is an array of tutors
            if (Array.isArray(data)) {
                setTutors(data);
            } else if (data && Array.isArray(data.results)) {
                 // specific DRF pagination response structure handling
                 setTutors(data.results);
            } else {
                setTutors([]);
                // console.warn("Unexpected API response structure:", data);
            }

        } catch (err: any) {
            console.error("Error fetching tutors:", err);
            setError("Failed to load tutors.");
        } finally {
            setLoading(false);
        }
    }, [filters, session]);

    // Debounce the fetch to avoid too many calls while sliding/typing
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTutors();
        }, 800);

        return () => clearTimeout(timer);
    }, [fetchTutors]);

  return (
    <div className="container mx-auto p-5 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
                <Sidbar filters={filters} setFilters={setFilters}/>
            </div>
            <div className="w-full md:w-3/4">
                <TutorsCard tutors={tutors} loading={loading} error={error}/>
            </div>
        </div>
    </div>
  )
}

export default Page;
