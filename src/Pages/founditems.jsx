import React from 'react';
import { Link ,useNavigate} from 'react-router';
import { useState,useEffect } from 'react';
import { Navigate } from "react-router";
import ItemDetails from './ItemDetails';
const Founditems = () => {
  const navigate = useNavigate();
  const categories = ["Accessories", "Bag", "Electronics", "Clothing", "Stationery"];
  const locations = ["Library", "Cafeteria", "Lecture Hall 3", "Parking Lot", "Hostel"];
  const [items, setitems] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const getitems= async ()=>{
    let req = await fetch("http://localhost:5050/api/founditems");
    let item = await req.json();
    setitems(item);
    console.log(item);
  }
  useEffect(() => {
    getitems();
  }, [])
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });
  // const items = [
  //   {
  //     id: 1,
  //     name: "ID Card",
  //     category: "Accessories",
  //     description: "Student ID card found near library entrance.",
  //     location: "Library",
  //     date: "2025-06-14T10:30:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 2,
  //     name: "Laptop Bag",
  //     category: "Bag",
  //     description: "Black Dell laptop bag found on cafeteria table.",
  //     location: "Cafeteria",
  //     date: "2025-06-13T15:00:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 3,
  //     name: "Smartphone",
  //     category: "Electronics",
  //     description: "Samsung smartphone found in Lecture Hall 3.",
  //     location: "Lecture Hall 3",
  //     date: "2025-06-12T09:00:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 4,
  //     name: "Jacket",
  //     category: "Clothing",
  //     description: "Blue jacket with college logo found in hostel common room.",
  //     location: "Hostel",
  //     date: "2025-06-11T17:45:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 5,
  //     name: "Drawing Pad",
  //     category: "Stationery",
  //     description: "Large drawing pad found in Lecture Hall 3.",
  //     location: "Lecture Hall 3",
  //     date: "2025-06-10T08:20:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 6,
  //     name: "Power Bank",
  //     category: "Electronics",
  //     description: "Mi power bank left in library reading section.",
  //     location: "Library",
  //     date: "2025-06-09T13:15:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 7,
  //     name: "Raincoat",
  //     category: "Accessories",
  //     description: "Yellow raincoat found in parking lot corner.",
  //     location: "Parking Lot",
  //     date: "2025-06-08T11:10:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  //   {
  //     id: 8,
  //     name: "AirPods",
  //     category: "Electronics",
  //     description: "Apple AirPods found in cafeteria under table.",
  //     location: "Cafeteria",
  //     date: "2025-06-07T14:00:00",
  //     image: "https://via.placeholder.com/100",
  //   },
  // ];

  return (
    <div className="bg-[#393E46] min-h-screen text-[#DFD0B8] p-6 pt-30">
      <div className="container mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-green-400 text-4xl">✅</span>
              Found Items
            </h1>
            <p>Browse items that have been reported as found on campus</p>
          </div>
          <Link to="/reportfound">
            <button className="bg-green-400 text-[#393E46] px-4 py-2 rounded-md font-semibold">
              Report Found Item
            </button>
          </Link>
        </div>

        {/* Search & Filter UI */}
        <div className="bg-[#222831] border border-[#DFD0B8] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
              <span className="absolute left-3 top-2 text-[#DFD0B8]">🔎</span>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 rounded-md w-full text-[#b6ad9e] border border-[#DFD0B8] focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 rounded-md w-full text-[#b6ad9e] border border-[#DFD0B8] focus:outline-none"
            >
              <option value="">Filter by Category</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </select>

            <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
              className="py-2 rounded-md w-full text-[#b6ad9e] border border-[#DFD0B8] focus:outline-none"
            >
              <option value="">Filter by Location</option>
              {locations.map((location, idx) => (
                <option key={idx} value={location}>{location}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          { filteredItems &&  filteredItems.map((item) => (
            <div
              key={item._id} onClick={() => navigate(`/item/${item._id}`)}
              className="bg-[#222831] border border-[#DFD0B8] rounded-lg overflow-hidden shadow hover:bg-[#393E46] transition-colors"
            >
              <div className="flex flex-col p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="bg-green-400 text-[#393E46] px-3 py-1 text-xs rounded-full">
                    Found
                  </span>
                </div>
                <div className="flex items-center text-sm mb-2">
                  <span className="text-[#DFD0B8] mr-2">📍</span>
                  {item.location}
                </div>
                <div className="mb-3">
                  <img
                    src={`http://localhost:5050/${item.imagePath}`} 
                    alt={item.name}
                    className="h-32 w-full object-cover rounded-md border border-[#DFD0B8]"
                  />
                </div>
                <p className="text-sm">{item.description}</p>
                <div className="mt-2 text-xs text-gray-400">
                  Reported on: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Founditems;
