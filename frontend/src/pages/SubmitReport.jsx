import { useState } from "react";

function SubmitReport() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    urgency: "Medium",
    locationType: "manual",
    manualLocation: "",
    petition: true,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.description) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Report Submitted:", formData);
    alert("Report submitted successfully.");
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Submit a Civic Issue
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow space-y-6"
      >

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={100}
            placeholder="Short summary of the issue"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder="Provide detailed information"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Photo (Optional)
          </label>

          <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition text-gray-500">
            {formData.photo ? formData.photo.name : "Click to upload image"}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Location *
          </label>

          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="locationType"
                value="manual"
                checked={formData.locationType === "manual"}
                onChange={handleChange}
              />
              Enter manually
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="locationType"
                value="map"
                checked={formData.locationType === "map"}
                onChange={handleChange}
              />
              Select on map
            </label>
          </div>

          {formData.locationType === "manual" && (
            <input
              type="text"
              name="manualLocation"
              value={formData.manualLocation}
              onChange={handleChange}
              required
              placeholder="Enter address or landmark"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {formData.locationType === "map" && (
            <div className="border rounded-lg p-4 text-sm text-gray-500">
              Map integration will appear here.
            </div>
          )}
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Urgency Level
          </label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Petition Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm">
            Allow nearby citizens to view this issue
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="petition"
              checked={formData.petition}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Submit Report
        </button>

      </form>
    </div>
  );
}

export default SubmitReport;