import React from "react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MdLocationOn, MdAccessTime } from "react-icons/md";

const Home = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const getItems = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/allitems");
      const data = await res.json();

      // Sort by urgencyScore descending
      const sorted = data.sort((a, b) => b.urgencyScore - a.urgencyScore);
      setItems(sorted);
      console.log(sorted);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const formatDistanceToNow = (date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getUrgencyColor = (score) => {
    if (score >= 8) return "bg-red-500 text-white"; // High urgency
    if (score >= 5) return "bg-yellow-400 text-black"; // Medium urgency
    return "bg-green-400 text-black"; // Low urgency
  };

  return (
    <div className="bg-[#393E46] min-h-screen pt-18 pb-12 h-full">
      <div className="container mx-auto px-6 pb-12 border border-[#DFD0B8] ">
        <div className="mx-auto text-center flex flex-col">
          <div className="text-5xl text-[#DFD0B8] py-3 font-bold">
            Campus Lost&Found
          </div>
          <div className="text-[#DFD0B8]">
            A digital portal to help you find your lost items or report found ones.
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center mt-6">
            <div className="flex flex-row items-center gap-4">
              <button className="px-4 py-2 bg-green-400 rounded-sm flex items-center justify-center text-center gap-2 hover:shadow-md transition">
                <lord-icon
                  src="https://cdn.lordicon.com/rxgzsafd.json"
                  trigger="hover"
                  colors="primary:#545454"
                  style={{ width: "20px", height: "20px" }}
                ></lord-icon>
                <Link className="hover:text-[#e8e8e8] text-[#393E46]" to="/reportfound">
                  I Found Something
                </Link>
              </button>

              <button className="px-4 py-2 bg-orange-400 rounded-sm flex items-center justify-center text-center gap-2 hover:shadow-md transition">
                <lord-icon
                  src="https://cdn.lordicon.com/juujmrhr.json"
                  trigger="hover"
                  colors="primary:#545454"
                  style={{ width: "20px", height: "20px" }}
                ></lord-icon>
                <Link className="hover:text-[#e8e8e8] text-[#393E46]" to="/reportlost">
                  I Lost Something
                </Link>
              </button>
            </div>
          </div>

          {/* List Section */}
          <div className="flex flex-col mt-10">
            <h2 className="text-[#DFD0B8] text-left text-3xl font-bold">Recently Reported Items</h2>
            <p className="text-[#DFD0B8] text-left text-sm mb-4">
              The latest items reported on campus (sorted by urgency)
            </p>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="cursor-pointer flex items-start gap-4 p-4 rounded-lg border border-[#DFD0B8] bg-[#222831] hover:bg-[#393E46] hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-[#393E46]">
                    <img
                      src={item.imagePath ? item.imagePath : `/placeholder.svg?height=64&width=64`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-[#DFD0B8] text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg truncate">{item.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === "lost"
                            ? "bg-orange-400 text-[#393E46]"
                            : "bg-green-400 text-[#393E46]"
                        }`}
                      >
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                      {/* Urgency badge */}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(item.urgencyScore)}`}>
                        ⚡ Urgency: {item.urgencyScore}
                      </span>
                    </div>

                    <p className="text-sm text-[#B8B8B8] mt-2 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#A0A0A0]">
                      <div className="flex items-center gap-1">
                        <MdLocationOn /> {item.location}
                      </div>
                      <div className="flex items-center gap-1" title={new Date(item.createdAt).toLocaleString()}>
                        <MdAccessTime /> {formatDistanceToNow(new Date(item.createdAt))}
                      </div>
                      <div className={item.type === "lost" ? "text-orange-400" : "text-green-400"}>
                        {item.type === "lost" ? "⚠️ Missing" : "✅ Available"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-[#B8B8B8] mt-6 text-center">No items reported yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
