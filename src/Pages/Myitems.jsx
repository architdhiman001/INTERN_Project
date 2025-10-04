import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocationOn, MdAccessTime } from "react-icons/md";

const MyItems = () => {
  const [myItems, setMyItems] = useState([]);
  const token = localStorage.getItem("token"); // JWT from login

  const fetchMyItems = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/myitems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5050/api/item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const formatDistanceToNow = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  return (
    <div className="p-6 bg-[#393E46] min-h-screen text-[#DFD0B8] pt-20">
      <h2 className="text-2xl font-bold mb-6">My Posted Items</h2>
      {myItems.length === 0 && <p>No items posted yet.</p>}
      <div className="space-y-4">
        {myItems.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-lg bg-[#222831] border border-[#DFD0B8] flex justify-between items-center gap-4"
          >
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-[#393E46]">
              {item.imagePath ? (
                <img
                  src={`http://localhost:5050/${item.imagePath}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#B8B8B8] text-xs">
                  No Image
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.type === "lost"
                      ? "bg-orange-400 text-[#393E46]"
                      : "bg-green-400 text-[#393E46]"
                  }`}
                >
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
              </div>
              <p className="text-sm text-[#B8B8B8] mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#A0A0A0]">
                <div className="flex items-center gap-1">
                  <MdLocationOn /> {item.location}
                </div>
                <div className="flex items-center gap-1" title={new Date(item.createdAt).toLocaleString()}>
                  <MdAccessTime /> {formatDistanceToNow(item.createdAt)}
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteItem(item._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyItems;
