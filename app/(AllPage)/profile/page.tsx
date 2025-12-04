"use client";
import { useState } from "react";
import SidbarProfile from "@/app/Components/SidbarProfile";
import HeadProfile from "@/app/Components/HeadProfile";
import EducationInfo from "@/app/Components/EducationInfo";
import PersonalInfo from "@/app/Components/PersonalInfo";
import CreateTeacher from "@/app/Components/CreateTeacher";
import EditTeacher from "@/app/Components/EditTeacher";
import Qualification from "@/app/Components/Qualification";

// Capitalized component name to follow React rules
const Profile = () => {
  const [activeSection, setActiveSection] = useState("education");
  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between">
        <div className="w-1/4">
          <SidbarProfile />
        </div>

        <div className="w-3/4">
        
          <HeadProfile
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          {activeSection === "education" && <EducationInfo />}
          {activeSection === "qualification" && <Qualification />}
          {activeSection === "personal" && <PersonalInfo />}
          {activeSection === "register" && <CreateTeacher />}
          {activeSection === "edit" && <EditTeacher />}

        </div>
      </div>
    </div>
  );
};

export default Profile;
