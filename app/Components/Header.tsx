"use client";
import Image from "next/image";
import { FaUserShield, FaBars, FaTimes } from "react-icons/fa";
import SignUpModel from "./SignUpModel";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-5 bg-primary1 text-secondary2">
        <div className="z-20">
          <Link href="/">
             <Image src="/logo.svg" alt="Logo" width={65} height={24} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex space-x-8">
            <Link href="/tutions">
              <li className="font-DMSans font-normal text-sm text-quaternary4 hover:text-secondary2 hover:font-bold hover:border-b-2 hover:border-tertiary3 transition-colors duration-300 cursor-pointer">
                TUITIONS
              </li>
            </Link>
            <Link href="/tutors">
              <li className="font-DMSans font-normal text-sm text-quaternary4 hover:text-secondary2 hover:font-bold hover:border-b-2 hover:border-tertiary3 transition-colors duration-300 cursor-pointer">
                TUTORS
              </li>
            </Link>
            <li className="font-DMSans font-normal text-sm text-quaternary4 hover:text-secondary2 hover:font-bold hover:border-b-2 hover:border-tertiary3 transition-colors duration-300 cursor-pointer">
              COURSES
            </li>
          </ul>
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => {
              const modal = document.getElementById(
                "gooogle_signup_modal_1"
              ) as HTMLDialogElement | null;
              if (modal) modal.showModal();
            }}
          >
            <FaUserShield
              className="text-quaternary4 hover:text-secondary2 transition-colors duration-300 cursor-pointer"
              size={25}
            />
          </button>
          <SessionProvider>
            <SignUpModel />
          </SessionProvider>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-20 flex items-center space-x-4">
           <button
            onClick={() => {
              const modal = document.getElementById(
                "gooogle_signup_modal_1"
              ) as HTMLDialogElement | null;
              if (modal) modal.showModal();
            }}
          >
            <FaUserShield
              className="text-quaternary4 hover:text-secondary2 transition-colors duration-300 cursor-pointer"
              size={20}
            />
          </button>
          <button onClick={toggleMenu} className="text-quaternary4 hover:text-secondary2">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-primary1 text-secondary2 z-10 p-5 pt-20 flex flex-col items-center space-y-6 md:hidden shadow-lg animate-fade-in-down">
          <ul className="flex flex-col items-center space-y-6 w-full">
            <Link href="/tutions" className="w-full text-center" onClick={toggleMenu}>
              <li className="font-DMSans font-normal text-lg text-quaternary4 hover:text-secondary2 hover:font-bold transition-colors duration-300 cursor-pointer py-2 border-b border-gray-700 w-full">
                TUITIONS
              </li>
            </Link>
            <Link href="/tutors" className="w-full text-center" onClick={toggleMenu}>
              <li className="font-DMSans font-normal text-lg text-quaternary4 hover:text-secondary2 hover:font-bold transition-colors duration-300 cursor-pointer py-2 border-b border-gray-700 w-full">
                TUTORS
              </li>
            </Link>
            <li className="font-DMSans font-normal text-lg text-quaternary4 hover:text-secondary2 hover:font-bold transition-colors duration-300 cursor-pointer py-2 border-b border-gray-700 w-full text-center">
              COURSES
            </li>
          </ul>
           {/* Mobile SignUp Model needs to be present if button clicked */}
             <SessionProvider>
            <SignUpModel />
          </SessionProvider>
        </div>
      )}
    </div>
  );
};

export default Header;
