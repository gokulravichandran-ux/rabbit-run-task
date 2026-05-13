import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Checkbox,
  Popper,
  ClickAwayListener,
  Divider,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { PieChart } from "@mui/x-charts/PieChart";

import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { PickersLayout } from "@mui/x-date-pickers/PickersLayout";

import dayjs from "dayjs";

// Data Constants
const FILTER_GROUPS = [
  {
    id: "rabbit-usa",
    label: "Rabbit USA",
    children: [
      { id: "rabbit-run-usa-one", label: "Rabbit Run USA One" },
      { id: "rabbit-run-usa-two", label: "Rabbit Run USA Two" },
    ],
  },
  {
    id: "rabbit-south",
    label: "Rabbit South",
    children: [
      { id: "rabbit-one-south-one", label: "Rabbit One South One" },
      { id: "rabbit-one-south-two", label: "Rabbit One South Two" },
      { id: "rabbit-one-south-three", label: "Rabbit One South Three" },
    ],
  },
  {
    id: "cm-dpg",
    label: "CM DPG",
    children: [
      { id: "nikko-america", label: "Nikko America" },
      { id: "manub银行", label: "Manubank" },
      { id: "leasing-finance", label: "Leasing Finance" },
    ],
  },
];

const buildInitialChecked = () => {
  const state = {};
  FILTER_GROUPS.forEach((g) => {
    state[g.id] = true;
    g.children.forEach((c) => {
      state[c.id] = true;
    });
  });
  return state;
};

//Sub-Components

/**
 * Rabbit Filter Dropdown
 */
function RabbitFilterDropdown() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [checked, setChecked] = useState(buildInitialChecked);
  const filterAnchorRef = useRef(null);

  const getGroupState = (group) => {
    const childStates = group.children.map((c) => checked[c.id]);
    const allChecked = childStates.every(Boolean);
    const someChecked = childStates.some(Boolean);
    return { allChecked, indeterminate: someChecked && !allChecked };
  };

  const handleGroupToggle = (group) => {
    const { allChecked } = getGroupState(group);
    setChecked((prev) => {
      const next = { ...prev, [group.id]: !allChecked };
      group.children.forEach((c) => {
        next[c.id] = !allChecked;
      });
      return next;
    });
  };

  const handleChildToggle = (group, childId) => {
    setChecked((prev) => {
      const next = { ...prev, [childId]: !prev[childId] };
      const allChildChecked = group.children.every((c) => next[c.id]);
      next[group.id] = allChildChecked;
      return next;
    });
  };

  const totalLeafIds = FILTER_GROUPS.flatMap((g) => g.children.map((c) => c.id));
  const checkedLeafs = totalLeafIds.filter((id) => checked[id]);
  const buttonLabel =
    checkedLeafs.length === totalLeafIds.length
      ? "All Rabbits"
      : `${checkedLeafs.length} Selected`;

  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setFilterOpen(false)}>
      <Box sx={{ position: "relative" }}>
        <Box
          ref={filterAnchorRef}
          onClick={() => {
            setFilterOpen((o) => !o);
            setHasInteracted(true);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1c2a46",
            border: "1px solid #3e4859",
            borderRadius: "50px",
            padding: "0 12px 0 24px",
            height: "54px",
            minWidth: hasInteracted ? "190px" : "160px",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.3s ease",
            "&:hover": { borderColor: "#5c6b82" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {!hasInteracted ? (
              <Typography
                sx={{
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                Rabbit Filter
              </Typography>
            ) : (
              <>
                <Typography
                  sx={{
                    color: "#8b949e",
                    fontSize: "0.7rem",
                    fontWeight: "medium",
                    textTransform: "capitalize",
                    alignSelf: "flex-start",
                    lineHeight: 1,
                  }}
                >
                  Rabbit Filter
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.rem",
                    fontWeight: 500,
                    mt: 0.4,
                    lineHeight: 1,
                  }}
                >
                  {buttonLabel}
                </Typography>
              </>
            )}
          </Box>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "1px solid #3e4859",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 1.5,
              flexShrink: 0,
            }}
          >
            {filterOpen ? (
              <KeyboardArrowUpIcon sx={{ color: "white", fontSize: 20 }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: "white", fontSize: 20 }} />
            )}
          </Box>
        </Box>
        <Popper
          open={filterOpen}
          anchorEl={filterAnchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 8px 32px rgba(0,0,0,0.18)",
              minWidth: "260px",
              overflow: "hidden",
              py: 1,
              mt: 1,
            }}
          >
            {FILTER_GROUPS.map((group, gi) => {
              const { allChecked, indeterminate } = getGroupState(group);
              return (
                <Box key={group.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 0.5,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f7fa" },
                    }}
                    onClick={() => handleGroupToggle(group)}
                  >
                    <Checkbox
                      checked={allChecked}
                      indeterminate={indeterminate}
                      sx={{
                        color: "#335c6b",
                        "&.Mui-checked": { color: "#335c6b" },
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#1a2436",
                        ml: 0.5,
                      }}
                    >
                      {group.label}
                    </Typography>
                  </Box>
                  {group.children.map((child) => (
                    <Box
                      key={child.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 0.25,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f7fa" },
                      }}
                      onClick={() => handleChildToggle(group, child.id)}
                    >
                      <Checkbox
                        checked={!!checked[child.id]}
                        sx={{
                          color: "#335c6b",
                          "&.Mui-checked": { color: "#335c6b" },
                        }}
                      />
                      <Typography
                        sx={{ fontSize: "0.875rem", color: "#1a2436", ml: 0.5 }}
                      >
                        {child.label}
                      </Typography>
                    </Box>
                  ))}
                  {gi < FILTER_GROUPS.length - 1 && (
                    <Divider sx={{ my: 1, borderColor: "#e8eaed" }} />
                  )}
                </Box>
              );
            })}
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

/**
 * Custom DatePicker Field with Smooth Floating Label
 */
function DatePickerField(props) {
  const { date, isOpen, onOpen, anchorRef } = props;
  const isFloating = isOpen || !!date;

  return (
    <Box
      ref={anchorRef}
      onClick={onOpen}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1c2a46",
        border: "1px solid",
        borderColor: isFloating ? "#5c6b82" : "#3e4859",
        borderRadius: "50px",
        padding: "0px 24px",
        minWidth: "210px",
        height: "54px", // Fixed height pill
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": { borderColor: "#5c6b82" },
      }}
    >
      {/* Icon: Always perfectly centered vertically by the parent flex */}
      <CalendarTodayOutlinedIcon
        sx={{
          color: "white",
          mr: 1.5,
          fontSize: "20px",
        }}
      />

      {/* Text Container: This block is centered vertically as one unit */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Label */}
        <Typography
          sx={{
            color: isFloating ? "#8b949e" : "white",
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "left center",
            // Scale down when floating, and add a tiny bit of bottom margin to clear the date
            transform: isFloating ? "scale(0.75)" : "scale(1)",
            mb: isFloating ? "2px" : "0px",
          }}
        >
          Datepicker
        </Typography>

        {/* Date: Only takes up space and shows when isFloating is true */}
        <Typography
          sx={{
            color: "white",
            fontSize: "0.8rem",
            fontWeight: 500,
            lineHeight: 1,
            whiteSpace: "nowrap",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            // Use height and opacity to slide it in without "snapping"
            height: isFloating ? "auto" : "0px",
            opacity: isFloating ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          {date ? date.format("DD-MMM-YYYY") : dayjs().format("DD-MMM-YYYY")}
        </Typography>
      </Box>
    </Box>
  );
}

function CustomPickerLayout(props) {
  // We take value from props (provided by MUI) 
  // or selectedDate (passed manually via slotProps)
  const { value, selectedDate } = props;

  // Use whichever one is available and valid
  const displayDate = selectedDate || value;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 320,
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #ebedf0",
        overflow: "hidden",
        boxShadow: "0px 12px 36px rgba(0,0,0,0.12)",
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography
          sx={{
            color: "#6e7781",
            fontSize: "0.75rem",
            fontWeight: 400,
            mb: 0.5,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          {displayDate ? "Selected Date" : "Please Select"}
        </Typography>
        <Typography
          sx={{
            color: "#335c6b",
            fontSize: "1.3rem",
            fontWeight: 800,
            lineHeight: 1.2
          }}
        >
          {/* Format the date if it exists, otherwise show placeholder */}
          {displayDate && dayjs(displayDate).isValid()
            ? dayjs(displayDate).format("ddd, MMM D")
            : dayjs().format("ddd, MMM D")}
        </Typography>
      </Box>

      {/* This renders the calendar itself */}
      <PickersLayout {...props} />
    </Box>
  );
}

//Main App Component

function App() {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const tableData = [
    { name: "Rabbit Row One", h2: 47, h3: 1, h4: 7, h5: 25, val: "$900,000" },
    { name: "Rabbit Row Two", h2: 77, h3: 4, h4: 9, h5: 74, val: "$17,200" },
    { name: "Rabbit Row Three", h2: 28, h3: 6, h4: 11, h5: 44, val: "$47,200" },
    { name: "Rabbit Row Four", h2: 47, h3: 1, h4: 7, h5: 25, val: "$749,123" },
    { name: "Rabbit Row Five", h2: 47, h3: 1, h4: 7, h5: 25, val: "$900,000" },
  ];

  const chartData = [
    { id: 0, value: 35, label: "Legend A", color: "#b39671" },
    { id: 1, value: 20, label: "Legend B", color: "#e6c281" },
    { id: 2, value: 15, label: "Legend C", color: "#829e8d" },
    { id: 3, value: 10, label: "Legend D", color: "#337a91" },
    { id: 4, value: 8, label: "Legend E", color: "#ddd9ce" },
    { id: 5, value: 5, label: "Legend F", color: "#8e8e8e" },
    { id: 6, value: 4, label: "Legend G", color: "#645070" },
    { id: 7, value: 3, label: "Legend H", color: "#c9b78e" },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Top Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#071633",
          borderBottom: "2px solid #7ED321",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 24px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{
                letterSpacing: "4px",
                fontWeight: 300,
                color: "white",
                fontFamily: "Times New Roman, serif",
              }}
            >
              RABBIT RUN
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Button sx={{ color: "white", textTransform: "uppercase" }}>Dashboard</Button>
            <Button sx={{ color: "white", textTransform: "uppercase" }}>Summary</Button>
            <Button sx={{ color: "white", textTransform: "uppercase" }}>Support</Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton sx={{ color: "white" }}><BuildOutlinedIcon /></IconButton>
            <IconButton sx={{ color: "white" }}><NotificationsNoneOutlinedIcon /></IconButton>
            <IconButton sx={{ color: "white" }}><AccountCircleOutlinedIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sub-Header with Filters */}
      <Box
        sx={{
          backgroundColor: "#111d35",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              value={date}
              onChange={(newValue) => setDate(newValue)}
              format="DD-MMM-YYYY"
              slots={{
                field: DatePickerField,
                layout: CustomPickerLayout,
              }}
              slotProps={{
                field: {
                  date: date,
                  isOpen: open,
                  onOpen: () => setOpen(true),
                  anchorRef: anchorRef,
                },
                layout: {
                  selectedDate: date,
                },
                day: {
                  sx: {
                    "&.Mui-selected": {
                      backgroundColor: "#335c6b !important",
                      color: "#ffffff !important",
                      "&:hover": {
                        backgroundColor: "#1c2a46 !important",
                      },
                    },
                    "&.MuiPickersDay-today": {
                      borderColor: "#335c6b",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(51, 92, 107, 0.1)",
                    }
                  },
                },

                popper: {
                  anchorEl: () => anchorRef.current,
                  placement: "bottom-start",
                  sx: {
                    "& .MuiPaper-root": {
                      borderRadius: "12px",
                      background: "transparent",
                      boxShadow: "none",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <RabbitFilterDropdown />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              background: "linear-gradient(135deg, #024FBD 0%, #2C88F3 100%) !important",
              borderRadius: "30px",
              padding: "10px 28px",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Actions
          </Button>
          <IconButton sx={{ color: "white" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 160px)" }}>
        <Grid container spacing={3}>
          {/* Table Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "#335c6b", fontWeight: "bold", fontSize: "1.1rem" }}>
                  Rabbit Card One
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton size="small">
                    <OpenInFullIcon sx={{ fontSize: 18, color: "#335c6b" }} />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVertIcon sx={{ fontSize: 18, color: "#335c6b" }} />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ pt: 0 }}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                          Rabbit Header One
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#555" }}>
                          Header Two
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#555" }}>
                          H Three
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#555" }}>
                          H Four
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#555" }}>
                          H Five
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#555" }}>
                          H Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell sx={{ color: "#333", py: 1.5 }}>{row.name}</TableCell>
                          <TableCell align="right">{row.h2}</TableCell>
                          <TableCell align="right">{row.h3}</TableCell>
                          <TableCell align="right">{row.h4}</TableCell>
                          <TableCell align="right">{row.h5}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {row.val}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Chart Card */}
          <Grid item sx={{ width: "48%" }}>
            <Card sx={{ borderRadius: "8px", boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", height: "100%" }}>
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#335c6b", fontWeight: "bold", fontSize: "1.1rem" }}>Rabbit Card Two</Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton size="small"><OpenInFullIcon sx={{ fontSize: 18, color: "#335c6b" }} /></IconButton>
                  <IconButton size="small"><MoreVertIcon sx={{ fontSize: 18, color: "#335c6b" }} /></IconButton>
                </Box>
              </Box>
              <CardContent sx={{ height: "320px", display: "flex", justifyContent: "center", alignItems: "center", pt: 0 }}>
                <PieChart series={[{ data: chartData, innerRadius: 70, outerRadius: 100, paddingAngle: 2, cx: 180 }]} width={380} height={300} margin={{ right: 80 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;