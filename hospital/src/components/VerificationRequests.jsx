import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack
} from "@mui/material";

export default function VerificationRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/hospital/verification-requests");
      setRequests(data);
    };
    fetchData();
  }, []);

  const schedule = async (id) => {
    const date = prompt("Enter appointment date (YYYY-MM-DD)");
    if (!date) return;

    await API.put(`/verification/${id}/schedule`, {
      appointmentDate: date
    });

    refresh();
  };

  const verify = async (id) => {
    await API.put(`/verification/${id}/verify`);
    refresh();
  };

  const refresh = async () => {
    const { data } = await API.get("/hospital/verification-requests");
    setRequests(data);
  };

  return (
    <Stack spacing={2}>
      {requests.map((req) => (
        <Card key={req._id}>
          <CardContent>
            <Typography>Name: {req.donor?.fullname}</Typography>
            <Typography>Email: {req.donor?.email}</Typography>
            <Typography>Status: {req.status}</Typography>

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => schedule(req._id)}
              >
                Schedule
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => verify(req._id)}
              >
                Verify
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}