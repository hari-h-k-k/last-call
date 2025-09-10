"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListingForm from "../../components/ListingForm";
import api from "../../lib/axios";

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  // Fetch categories
  useEffect(() => {
    api
      .get("/categories", { headers: getAuthHeaders() })
      .then((res) => {
        setCategories(Array.isArray(res.data?.info?.[0]) ? res.data.info[0] : []);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fetch existing auction if editing
  useEffect(() => {
    if (!auctionId) return;
    api
      .get(`/items/${auctionId}`, { headers: getAuthHeaders() })
      .then((res) => {
        const item = res.data?.info?.item || {};
        setInitialData({
          title: item.title,
          description: item.description,
          startingPrice: item.startingPrice,
          category: item.category,
          tags: item.tags,
          registrationClosingDate: item.registrationClosingDate
              ? new Date(item.registrationClosingDate).toISOString().slice(0, 16)
              : "",
          auctionDate: item.auctionStartDate
              ? new Date(item.auctionStartDate).toISOString().slice(0, 16)
              : "",
        });
      })
      .catch(() => alert("Failed to fetch auction details."));
  }, [auctionId]);

  const formatDate = (date) => new Date(date).toISOString();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo?.id || !userInfo?.token)
        return alert("Please login first."), setLoading(false);

      const payload = {
        sellerId: userInfo.id,
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()),
        registrationClosingDate: formatDate(formData.registrationClosingDate),
        auctionStartDate: formatDate(formData.auctionDate),
        location: formData.location,
        id: auctionId || null,
      };

      const res = await api.post("/place-item", payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });

      if (res.status === 200 || res.status === 201) {
        alert(auctionId ? "Auction updated!" : "Auction created!");
        router.replace("/profile");
      }
    } catch {
      alert("Error saving auction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/remove-item/${auctionId}`, {
        headers: getAuthHeaders(),
      });
      alert("Auction deleted!");
      router.replace("/profile");
    } catch {
      alert("Failed to delete auction.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <Navbar />
      <div className="pt-28 pb-12 px-6 max-w-3xl mx-auto flex-1 w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          {auctionId ? "✏️ Edit Listing" : "📝 Create New Listing"}
        </h1>

        <ListingForm
            initialData={initialData}
            categories={categories}
            onSubmit={handleSubmit}
            onDelete={auctionId ? handleDelete : undefined}
            loading={loading}
        />
      </div>
      <Footer />
    </div>
  );
}
