"use client";
import { GiPathDistance } from "react-icons/gi";
import TutorsDetails from "./TutorsDetails";
import Image from "next/image";

const TutorsData = [
  {
    id:1,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
  {
    id:2,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
  {
     id:3,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
  {
     id:4,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
  {
     id:5,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
  {
     id:6,
    img: "/MyImg.jpg",
    name: "Shefaitur rahman Noyon",
    institute: "East Delta University",
    dep: "BSC  in CSE",
    medium: "English,Bangla",
    expertise: "02 years",
    distance: "05 km",
    icon: <GiPathDistance className="text-xl mx-auto" />,
    gendar: "Male",
    class: "6-10",
    tuitionType: "Online Tuition",
    price: "5000 BDT",
  },
];
const TutorsCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4 md:px-0">
      {TutorsData.map((tutor) => (
        <div
          key={tutor.id}
          className="card bg-base-100 shadow-xl border border-quaternary4 rounded-lg transition-transform transform hover:scale-105"
        >
          <figure className="px-10 pt-5">
            <div className="relative w-40 h-40">
                <Image
                src={tutor.img}
                alt={tutor.name}
                fill
                className="rounded-full border-2 border-dashed border-tertiary3 object-cover"
                />
            </div>
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title font-DMSans font-semibold text-lg line-clamp-1">
              {tutor.name}
            </h2>
            <p className="font-DMSans font-normal text-base text-tertiary3 line-clamp-1">
              {tutor.institute}
            </p>
            <p className="font-DMSans font-normal text-base text-tertiary3 line-clamp-1">
              {tutor.dep}
            </p>
          </div>
          <div className="flex justify-between px-5 py-2">
            <p className="font-DMSans font-normal text-sm text-primary1">
              <span className="font-semibold mr-1">Gender:</span>
              {tutor.gendar}
            </p>
            <p className="font-DMSans font-normal text-sm text-primary1">
              {" "}
              <span className="font-semibold mr-1">Class:</span>
              {tutor.class}
            </p>
          </div>

          <div className="flex justify-between px-5 mt-2 pb-2">
            <div className="flex items-center justify-center ">
              <span>{tutor.icon}</span>
              <span className="ml-2 font-DMSans font-normal text-sm text-primary1">
                {tutor.distance}
              </span>
            </div>
            <p className="font-DMSans font-normal text-sm text-primary1">
              {tutor.price}
            </p>
          </div>
          <div className="pb-5">
            <div className="card-actions justify-center my-4">
              <button
                onClick={() => {
                  const modal = document.getElementById(
                    "ViewProfileModal"
                  ) as HTMLDialogElement | null;
                  if (modal) modal.showModal();
                }}
                className="btn btn-primary1 text-secondary2 bg-primary1 font-DMSans font-semibold text-base hover:bg-opacity-90"
              >
                View Profile
              </button>
            </div>

            <TutorsDetails />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TutorsCard;
