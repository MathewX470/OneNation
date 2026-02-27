import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Button,
  Divider
} from "@mui/material";

import RequestForm from "../components/RequestForm";
import RequestHistory from "../components/RequestHistory";

const drawerWidth = 220;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Hospital Panel – Emergency Blood System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => setActiveSection("overview")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setActiveSection("raise")}>
              <ListItemText primary="Raise Request" />
            </ListItem>
            <ListItem button onClick={() => setActiveSection("history")}>
              <ListItemText primary="Request History" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8
        }}
      >
        {activeSection === "overview" && (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Active Requests</Typography>
                    <Typography variant="h3" color="error">
                      3
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Fulfilled Today</Typography>
                    <Typography variant="h3" color="success.main">
                      5
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Pending Responses</Typography>
                    <Typography variant="h3" color="warning.main">
                      8
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeSection === "raise" && (
          <>
            <Typography variant="h4" gutterBottom>
              Raise Blood Request
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <RequestForm />
          </>
        )}

        {activeSection === "history" && (
          <>
            <Typography variant="h4" gutterBottom>
              Request History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <RequestHistory />
          </>
        )}
      </Box>
    </Box>
  );
}