"use client";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#1F2937] text-[#9CA3AF] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand & Description */}
        <div>
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-[#2563EB] cursor-pointer"
          >
            BidMaster
          </h1>
          <p className="mt-3 text-sm">
            The ultimate platform to bid, win, and explore exciting auctions.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Navigation</h2>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer" onClick={() => router.push("/")}>
              Home
            </li>
            <li className="hover:text-white cursor-pointer" onClick={() => router.push("/auctions")}>
              Auctions
            </li>
            <li className="hover:text-white cursor-pointer" onClick={() => router.push("/bids")}>
              My Bids
            </li>
            <li className="hover:text-white cursor-pointer" onClick={() => router.push("/contact")}>
              Contact
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">Help & Support</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Follow Us</h2>
          <div className="flex space-x-4">
            <FaFacebook className="w-6 h-6 cursor-pointer hover:text-[#2563EB]" />
            <FaInstagram className="w-6 h-6 cursor-pointer hover:text-[#F43F5E]" />
            <FaTwitter className="w-6 h-6 cursor-pointer hover:text-[#1DA1F2]" />
            <FaLinkedin className="w-6 h-6 cursor-pointer hover:text-[#0A66C2]" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#374151] text-center py-4 text-sm text-[#9CA3AF]">
        © {new Date().getFullYear()} BidMaster. All rights reserved.
      </div>
    </footer>
  );
}
