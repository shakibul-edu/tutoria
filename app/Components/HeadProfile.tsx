"use client"
import { FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";
type HeadProfileProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};
const sections = [
  { key: "education", icon: <FaGraduationCap className="text-5xl mx-auto" />, label: "Educational info" },
  { key: "qualification", icon: <GiTeacher className="text-5xl mx-auto" />, label: "Qualification info" },
  { key: "personal", icon: <BsFillPersonVcardFill className="text-5xl mx-auto" />, label: "Personal-info" },
  { key: "register", icon: <FaWpforms className="text-5xl mx-auto" />, label: "Register as a teacher" },
  { key: "edit", icon: <FaWpforms className="text-5xl mx-auto" />, label: "Edit as a teacher" },
];
const HeadProfile = ({ activeSection, onSectionChange }: HeadProfileProps) => {
  return (
        <div>
      <div className="grid grid-cols-3 gap-4">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => onSectionChange(section.key)}
            className={`border border-primary1 py-2.5 px-20 rounded-lg shadow-md transition-colors duration-200
              ${activeSection === section.key ? "bg-primary1 text-white" : "bg-quaternary4"}
            `}
          >
            {section.icon}
            <p className="font-DMSans font-medium text-base text-center mt-1.5">
              {section.label}
            </p>
          </button>
        ))}
      </div>
    </div>


  )
}

export default HeadProfile