import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const ReportLost = () => {
  const navigate = useNavigate();
  const BACKEND_URL = "https://intern-project-1-fose.onrender.com"; // Render backend

  const categories = ["Accessories", "Bag", "Electronics", "Clothing", "Stationery"];
  const campusLocations = ["Library", "Cafeteria", "Lecture Hall 3", "Parking Lot", "Hostel"];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a report.");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", formData.image);
    uploadFormData.append("name", formData.name);
    uploadFormData.append("description", formData.description);
    uploadFormData.append("email", formData.contactEmail);
    uploadFormData.append("mobile", formData.contactPhone);
    uploadFormData.append("category", formData.category);
    uploadFormData.append("location", formData.location);
    uploadFormData.append("type", "lost");

    try {
      await axios.post(`${BACKEND_URL}/api/uploadLostReport`, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting report. Make sure you are logged in.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Item name is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.contactName) newErrors.contactName = "Your name is required.";
    if (!formData.contactEmail) newErrors.contactEmail = "Email is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      await handleFormSubmit();
      navigate("/lostitems");
    }
  };

  return (
    <div className="bg-[#393E46] min-h-screen text-[#DFD0B8] p-6 pt-20">
      <div className="max-w-3xl mx-auto bg-[#222831] border border-[#DFD0B8] rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#DFD0B8]">Report a Lost Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label>Description *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label>Lost Location *</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
              >
                <option value="">Select location</option>
                {campusLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && <p className="text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label>Your Name *</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
            />
            {errors.contactName && <p className="text-red-500">{errors.contactName}</p>}
          </div>

          <div>
            <label>Email *</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
            />
            {errors.contactEmail && <p className="text-red-500">{errors.contactEmail}</p>}
          </div>

          <div>
            <label>Upload Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full p-2 rounded-md bg-[#393E46] border border-[#DFD0B8]"
            />
          </div>

          <div className="flex justify-between mt-4">
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

export default ReportLost;
