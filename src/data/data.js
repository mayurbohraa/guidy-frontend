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
    name: "My schedule",
    to: "/userdashboard/myschedule",
  },
  {
    icon: UilCalender,
    name: "Calendar",
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
  {
    icon: UilFilePlusAlt,
    name: "My submissions",
    to: "/contributordashboard/submissions",
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
    name: "Calendar",
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

SidebarData3.push({
  icon: UilUserCircle,
  name: "Users",
  to: "/admindashboard/users",
});
SidebarData3.push({
  icon: UilUserCircle,
  name: "Account recovery",
  to: "/admindashboard/account-recovery",
});

// Navbar profile drop down
export const ProfileDD = [
  {
    icon: UilUserCircle,
    name: "My Profile",
    to: "/viewprofile",
  },
  {
    icon: UilSignout,
    name: "Log Out",
    to: "/logout",
  },
];
