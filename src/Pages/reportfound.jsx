import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const ReportFound = () => {
  const navigate = useNavigate();

  const categories = [
    "Accessories",
    "Bag",
    "Electronics",
    "Clothing",
    "Stationery",
  ];
  const campusLocations = [
    "Library",
    "Cafeteria",
    "Lecture Hall 3",
    "Parking Lot",
    "Hostel",
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", formData.image);
    uploadFormData.append("name", formData.name);
    uploadFormData.append("description", formData.description);
    uploadFormData.append("email", formData.contactEmail);
    uploadFormData.append("mobile", formData.contactPhone);
    uploadFormData.append("category", formData.category);
    uploadFormData.append("location", formData.location);
    uploadFormData.append("type", "found");
  
    const token = localStorage.getItem("token"); // 🔒 Fetch saved token
  
    try {
      await axios.post("http://localhost:5050/api/uploadFormData", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
      });
    } catch (err) {
      console.error(err);
      alert("You must be logged in to submit a report.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Item name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.contactName) newErrors.contactName = "Your name is required.";
    if (!formData.contactEmail) newErrors.contactEmail = "Email is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      await handleFormSubmit();
      navigate("/founditems");
    }
  };

  return (
    <div className="bg-[#393E46] min-h-screen text-[#DFD0B8] p-6 pt-20">
      <div className="max-w-3xl mx-auto bg-[#222831] border border-[#DFD0B8] rounded-lg p-8">
        <div className="flex items-center mb-6">
          <span className="text-yellow-400 text-2xl mr-2">📦</span>
          <h1 className="text-2xl font-bold text-[#DFD0B8]">
            Report a Found Item
          </h1>
        </div>

        <p className="mb-6 text-sm text-[#DFD0B8]">
          Fill out this form to report an item you’ve found on campus.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-[#DFD0B8]">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Umbrella"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 text-[#DFD0B8] placeholder-[#bcb4a3] placeholder-opacity-60 bg-[#393E46] border border-[#DFD0B8] rounded-md"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 text-[#DFD0B8]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide details about the item"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 text-[#DFD0B8] placeholder-[#bcb4a3] placeholder-opacity-60 bg-[#393E46] border border-[#DFD0B8] rounded-md"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[#DFD0B8]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 text-[#DFD0B8] bg-[#393E46] border border-[#DFD0B8] rounded-md"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-[#DFD0B8]">
                Found Location <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 text-[#DFD0B8] bg-[#393E46] border border-[#DFD0B8] rounded-md"
              >
                <option value="">Select location</option>
                {campusLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2 text-[#DFD0B8]">
              Contact Information
            </h3>
            <p className="text-sm text-[#bdbdbd] mb-4">
              Provide your contact information so the rightful owner can reach
              you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-[#DFD0B8]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="Your full name"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full p-2 text-[#DFD0B8] placeholder-[#bcb4a3] placeholder-opacity-60 bg-[#393E46] border border-[#DFD0B8] rounded-md"
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">{errors.contactName}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-[#DFD0B8]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="your.email@university.edu"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full p-2 text-[#DFD0B8] placeholder-[#bcb4a3] placeholder-opacity-60 bg-[#393E46] border border-[#DFD0B8] rounded-md"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-[#DFD0B8]">
                  Phone Number{" "}
                  <span className="text-sm text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  placeholder="555-123-4567"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full p-2 text-[#DFD0B8] placeholder-[#bcb4a3] placeholder-opacity-60 bg-[#393E46] border border-[#DFD0B8] rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[#DFD0B8]">
              Upload Picture{" "}
              <span className="text-sm text-gray-400">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full p-2 bg-[#393E46] border border-[#DFD0B8] rounded-md text-[#DFD0B8]"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-[#DFD0B8] rounded-md text-[#DFD0B8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-400 text-[#393E46] px-6 py-2 rounded-md font-semibold"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
