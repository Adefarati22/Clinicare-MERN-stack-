import {
  RiBankCardLine,
  RiCalendarLine,
  RiDashboardLine,
  RiGroup3Line,
  RiGroupLine,
  RiHotelBedLine,
  RiSettingsLine,
  RiStethoscopeLine,
  RiUserLine,
} from "@remixicon/react";
import dayjs from "dayjs";

export const bloodGroup = {
  "A+": "A-positive",
  "A-": "A-negative",
  "B+": "B-positive",
  "B-": "B-negative",
  "AB+": "AB-positive",
  "AB-": "AB-negative",
  "O+": "O-positive",
  "O-": "O-negative",
};

export const navSections = [
  {
    title: "Menu",
    links: [
      { icon: RiDashboardLine, path: "/dashboard", name: "Dashboard", id: 1 },
      {
        icon: RiCalendarLine,
        path: "appointments",
        name: "Appointments",
        id: 2,
      },
      { icon: RiHotelBedLine, path: "rooms", name: "Rooms", id: 3 },
      { icon: RiBankCardLine, path: "payments", name: "Payments", id: 4 },
    ],
  },
  {
    title: "Manage",
    links: [
      { icon: RiStethoscopeLine, path: "doctors", name: "Doctors", id: 1 },
      { icon: RiGroupLine, path: "patients", name: "Patients", id: 2 },
      { icon: RiGroup3Line, path: "inpatients", name: "Inpatients", id: 3 },
    ],
  },
  {
    title: "Settings",
    links: [
      { icon: RiUserLine, path: "users", name: "Users", id: 1 },
      { icon: RiSettingsLine, path: "settings", name: "Settings", id: 2 },
    ],
  },
];

export const headers = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const formatDate = (item, format = "display") => {
  if (format === "input") {
  return dayjs(item).format("YYYY-MM-DD");
}
return dayjs(item).format("DD/MM/YYYY");
}

