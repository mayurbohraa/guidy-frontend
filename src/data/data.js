// Sidebar imports

import {
  UilEstate,
  UilSchedule,
  UilCalender,
  UilMap,
  UilFileCheckAlt,
  UilChartLine,
  UilLayerGroup,
  UilFilePlusAlt,
  UilUserCircle,
  UilNotebooks,
  UilSignout,
} from "@iconscout/react-unicons";

// User dashboard Sidebar data
export const SidebarData = [
  {
    icon: UilEstate,
    name: "Dashboard",
    to: "/userdashboard/",
  },
  {
    icon: UilSchedule,
    name: "My Schedules",
    to: "/userdashboard/myschedule",
  },
  {
    icon: UilCalender,
    name: "Calender",
    to: "/userdashboard/calender",
  },
  {
    icon: UilMap,
    name: "My Roadmap",
    to: "/userdashboard/myroadmap",
  },
  {
    icon: UilFileCheckAlt,
    name: "My Tasks",
    to: "/userdashboard/mytasks",
  },
  {
    icon: UilChartLine,
    name: "My Grades",
    to: "/userdashboard/mygrades",
  },
  {
    icon: UilLayerGroup,
    name: "Resources",
    to: "/userdashboard/resources",
  },
  {
    icon: UilNotebooks,
    name: "Notebook",
    to: "/userdashboard/notebook",
  },
];


// contributor dashboard Sidebar data
export const SidebarData2 = [
  {
    icon: UilEstate,
    name: "Dashboard",
    to: "/contributordashboard/",
  },
  {
    icon: UilFilePlusAlt,
    name: "Add Resources",
    to: "/contributordashboard/addresources",
  },
];

// Admin dashboard Sidebar data
export const SidebarData3 = [
  {
    icon: UilEstate,
    name: "Dashboard",
    to: "/admindashboard/",
  },
  {
    icon: UilCalender,
    name: "Calender",
    to: "/admindashboard/calender",
  },
  {
    icon: UilFileCheckAlt,
    name: "My Tasks",
    to: "/admindashboard/mytasks",
  },
  {
    icon: UilLayerGroup,
    name: "Requests",
    to: "/admindashboard/requests",
  },
];



// Navbar profile drop down
export const ProfileDD = [
  {
    icon: UilUserCircle,
    name: "View Profile",
    to: "/viewprofile",
  },
  {
    icon: UilSignout,
    name: "Log Out",
    to: "/logout",
  },
];
