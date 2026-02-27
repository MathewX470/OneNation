import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress
} from "@mui/material";

export default function HospitalProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    state: "",
    district: "",
    lat: "",
    lng: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/hospital/profile");

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          state: data.state || "",
          district: data.district || "",
          lat: data.location?.coordinates?.[1] || "",
          lng: data.location?.coordinates?.[0] || "",
          password: ""
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle normal input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Get Device Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      },
      (error) => {
        alert("Unable to retrieve location");
        console.error(error);
      }
    );
  };

  // ✅ Update Profile
  const updateProfile = async () => {
    try {
      setLoading(true);

      await API.put("/hospital/profile", {
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng)
      });

      alert("Profile Updated Successfully");
      setForm((prev) => ({ ...prev, password: "" }));

    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Hospital Profile
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Hospital Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
          />

          <TextField
            label="District"
            name="district"
            value={form.district}
            onChange={handleChange}
          />

          {/* Location Section */}
          <Typography variant="subtitle1">
            Location Coordinates
          </Typography>

          <TextField
            label="Latitude"
            name="lat"
            value={form.lat}
            disabled
          />

          <TextField
            label="Longitude"
            name="lng"
            value={form.lng}
            disabled
          />

          <Button
            variant="outlined"
            onClick={getCurrentLocation}
          >
            Use Current Location
          </Button>

          <TextField
            label="New Password (optional)"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}