import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/item/${id}`);
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!item) {
    return (
      <div className="bg-[#393E46] min-h-screen flex items-center justify-center text-[#DFD0B8] text-xl">
        Loading item details...
      </div>
    );
  }

  return (
    <div className="bg-[#393E46] min-h-screen pt-18 pb-12 h-full">
      <div className="container mx-auto px-6 pb-12 border border-[#DFD0B8]">
        <div className="flex flex-col gap-6 text-[#DFD0B8]">
          <div className="text-5xl text-center font-bold py-4">
            Item Details
          </div>

          <div className="bg-[#222831] border border-[#DFD0B8] rounded-lg p-6 shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img
                  src={
                    item.imagePath
                      ? `http://localhost:5050/${item.imagePath}`
                      : "/placeholder.svg?height=256&width=256"
                  }
                  alt={item.name}
                  className="rounded-md object-cover w-full h-64"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{item.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      item.type === "lost"
                        ? "bg-orange-400 text-[#393E46]"
                        : "bg-green-400 text-[#393E46]"
                    }`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </span>
                  <span className="text-sm text-[#B8B8B8]">
                    Reported: {formatDate(item.createdAt)}
                  </span>
                </div>

                <p className="mb-4 text-[#B8B8B8]">{item.description}</p>

                <div className="flex flex-col gap-3 text-sm text-[#A0A0A0] mt-4">
                  <div className="flex items-center gap-2">
                    📍{" "}
                    <span>
                      <strong>Location:</strong> {item.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    📞{" "}
                    <span>
                      <strong>Mobile:</strong>{" "}
                      {item.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    📧{" "}
                    <span>
                      <strong>Email:</strong>{" "}
                      {item.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.type === "lost" ? (
                      <span className="text-orange-400">⚠️ Still Missing</span>
                    ) : (
                      <span className="text-green-400">✅ Item Available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[#DFD0B8] text-[#393E46] rounded-md font-medium hover:bg-[#c5bca3] transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
