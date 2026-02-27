import { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import RequestForm from "../components/RequestForm";
import RequestHistory from "../components/RequestHistory";
import VerificationRequests from "../components/VerificationRequests";

const drawerWidth = 220;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    navigate("/");
  };

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case "raise":
        return <RequestForm />;

      case "history":
        return <RequestHistory />;

      case "verification":
        return <VerificationRequests />;

      default:
        return (
          <Typography variant="h4">
            Welcome to Hospital Dashboard
          </Typography>
        );
    }
  }, [activeSection]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            Hospital Panel – Emergency Blood System
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        <Box>
          <List>
            <ListItemButton onClick={() => setActiveSection("overview")}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton onClick={() => setActiveSection("raise")}>
              <ListItemText primary="Raise Request" />
            </ListItemButton>

            <ListItemButton onClick={() => setActiveSection("history")}>
              <ListItemText primary="Request History" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={() => setActiveSection("verification")}>
              <ListItemText primary="Donor Verifications" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8
        }}
      >
        {sectionContent}
      </Box>
    </Box>
  );
}