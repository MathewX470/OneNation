import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Card,
  CardContent,
  Typography,
  Stack
} from "@mui/material";

export default function AvailableDonors() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      const { data } = await API.get("/donors/available");
      setDonors(data);
    };
    fetchDonors();
  }, []);

  return (
    <Stack spacing={2}>
      {donors.map((d) => (
        <Card key={d._id}>
          <CardContent>
            <Typography variant="h6">
              {d.donor?.fullname}
            </Typography>

            <Typography>Blood Group: {d.bloodGroup}</Typography>
            <Typography>Email: {d.donor?.email}</Typography>
            <Typography>Phone: {d.donor?.phoneNo}</Typography>
            <Typography>
              Location: {d.state}, {d.district}
            </Typography>
            <Typography>Pincode: {d.donor?.pincode}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}