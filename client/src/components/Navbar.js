"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { info, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-[#2563EB] cursor-pointer"
        >
          BidMaster
        </h1>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-8 text-[#9CA3AF] font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-white transition"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/auctions")}
            className="hover:text-white transition"
          >
            Auctions
          </button>
          <button
            onClick={() => router.push("/bids")}
            className="hover:text-white transition"
          >
            My Bids
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="hover:text-white transition"
          >
            Contact
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="relative" ref={dropdownRef}>
          {!info.token ? (
            <button
              onClick={handleLogin}
              className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
            >
              Login
            </button>
          ) : (
            <div>
              {/* Profile Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
              >
                {info.username || "Profile"}
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-[#1F2937] shadow-lg rounded-lg py-2 border border-[#2D3748]">
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#2563EB] transition"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#F43F5E] transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
