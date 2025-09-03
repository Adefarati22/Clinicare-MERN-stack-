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
      { id: 1, icon: RiDashboardLine, path: "/dashboard", name: "Dashboard" },
      {
        id: 2,

        icon: RiCalendarLine,
        path: "/dashboard/appointments",
        name: "Appointments",
      },
      {
        id: 10,
        name: "Appointments",
        path: "/dashboard/patient-appointments",
        icon: RiCalendarLine,
      },
      {
        id: 11,
        name: "Payments",
        path: "/dashboard/patient-payments",
        icon: RiBankCardLine,
      },
      { icon: RiHotelBedLine, path: "/dashboard/rooms", name: "Rooms", id: 3 },
      {
        icon: RiBankCardLine,
        path: "/dashboard/payments",
        name: "Payments",
        id: 4,
      },
    ],
  },
  {
    title: "Management",
    links: [
      { icon: RiStethoscopeLine, path: "/dashboard/doctors", name: "Doctors", id: 1 },
      {
        icon: RiGroupLine,
        path: "/dashboard/patients",
        name: "Patients",
        id: 2,
      },
      {
        icon: RiGroup3Line,
        path: "/dashboard/inpatients",
        name: "Inpatients",
        id: 3,
      },
    ],
  },
  {
    title: "Settings",
    links: [
      { icon: RiUserLine, path: "/dashboard/users", name: "Users", id: 1 },
      {
        icon: RiSettingsLine,
        path: "/dashboard/settings",
        name: "Settings",
        id: 2,
      },
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
};

export const settingsLink = [
  {
    id: "account",
    href: "/dashboard/settings/account",
    name: "Account",
  },
  {
    id: "password",
    href: "/dashboard/settings/password",
    name: "Password",
  },
  {
    id: "health",
    href: "/dashboard/settings/health",
    name: "Health Record",
  },
];

export const dummyData = [
  {
    id: 1,
    avatar:
      "https://images.unsplash.com/photo-1754811344841-cc66b5a26eb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    fullname: "Joy Wisdom",
    email: "joy22@gmail.com",
    role: "Patient",
    phone: "08021345678",
    joined: "2024/4/12",
  },
  {
    id: 2,
    avatar:
      "https://images.unsplash.com/photo-1594026724063-fcf520d86e23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D",
    fullname: "Peace Wisdom",
    email: "peace22@gmail.com",
    role: "Patient",
    phone: "08021355670",
    joined: "2022/5/12",
  },
  {
    id: 3,
    avatar:
      "https://images.unsplash.com/photo-1755380549803-c6ab36193884?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0N3x8fGVufDB8fHx8fA%3D%3D",
    fullname: "Chloe honest",
    email: "chloe2@gmail.com",
    role: "Patient",
    phone: "08021355449",
    joined: "2021/3/12",
  },
  {
    id: 4,
    avatar:
      "https://images.unsplash.com/photo-1755371033904-21dd8a9d002b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D",
    fullname: "Rooney Sean",
    email: "bellaBow@gmail.com",
    role: "Patient",
    phone: "08021357650",
    joined: "2012/5/1",
  },
  {
    id: 5,
    avatar:
      "https://images.unsplash.com/photo-1755396884135-de0d28d460dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1Mnx8fGVufDB8fHx8fA%3D%3D",
    fullname: "Earnest Goods",
    email: "Earnestgoods@gmail.com",
    role: "Patient",
    phone: "08031255670",
    joined: "2002/5/2",
  },
];

export const usersRoleColors = {
  admin: "bg-blue-200 text-blue-700",
  doctor: "bg-green-200 text-green-700",
  nurse: "bg-yellow-200 text-yellow-700",
  staff: "bg-teal-200 text-teal-700",
  patient: "bg-red-200 text-red-700",
};

export const roleBasedPathPermissions = {
  admin: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/payments",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/users",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  doctor: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  patient: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/patient-appointments",
      "/dashboard/patient-payments",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
      "/dashboard/settings/health",
    ],
  },
  nurse: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  staff: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
};

export const patientsTableColumns = [
  { name: "NAME", uid: "fullname" },
  { name: "GENDER", uid: "gender" },
  { name: "DATE OF BIRTH", uid: "dateOfBirth" },
  { name: "ADDRESS", uid: "address" },
  { name: "BLOOD GROUP", uid: "bloodGroup" },
  { name: "PHONE", uid: "phone" },
  { name: "ACTION", uid: "action" },
];

export const roomsTableColumns = [
  { name: "ROOM NUMBER", uid: "roomNumber" },
  { name: "ROOM TYPE", uid: "roomType" },
  { name: "ROOM CAPACITY", uid: "roomCapacity" },
  { name: "ROOM PRICE", uid: "roomPrice" },
  { name: "ROOM STATUS", uid: "roomStatus" },
  { name: "IS FILLED", uid: "isFilled" },
  { name: "ACTION", uid: "action" },
];

export const roomsStatusColors = {
  available: "bg-green-200 text-green-700",
  occupied: "bg-yellow-200 text-yellow-700",
  maintenance: "bg-red-200 text-red-700",
};

export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(amount);
};

export const doctorsTableColumns = [
  { name: "DOCTOR NAME", uid: "fullname" },
  { name: "PHONE", uid: "phone" },
  { name: "SPECIALIZATION", uid: "specialization" },
  { name: "STATUS", uid: "availability" },
  { name: "ACTION", uid: "action" },
];

export const doctorsStatusColors = {
  available: "bg-green-200 text-green-700",
  unavailable: "bg-blue-200 text-blue-700",
  onLeave: "bg-yellow-200 text-yellow-700",
  sick: "bg-red-200 text-red-700",
};

export const patientsAppointmentsTableColumns = [
  { name: "APPOINTMENT ID", uid: "appointmentId" },
  { name: "DATE", uid: "appointmentDate" },
  { name: "DOCTOR", uid: "doctor" },
  { name: "TIME", uid: "appointmentTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const appointmentsStatusColors = {
  scheduled: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  cancelled: "bg-red-200 text-red-700",
};

export const appointmentsTableColumns = [
  { name: "APPOINTMENT ID", uid: "appointmentId" },
  { name: "PATIENT", uid: "patientName" },
  { name: "DOCTOR", uid: "doctor" },
  { name: "DATE", uid: "appointmentDate" },
  { name: "TIME", uid: "appointmentTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const paymentsTableColumns = [
  { name: "PATIENT", uid: "patientName" },
  { name: "PAYMENT ID", uid: "paymentId" },
  { name: "PAYMENT TYPE", uid: "paymentType" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
  { name: "PAID AT", uid: "paidAt" },
  { name: "ACTION", uid: "action" },
];

export const paymentStatusColors = {
  pending: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  cancelled: "bg-red-200 text-red-700",
};

export const inpatientsTableColumns = [
  { name: "PATIENT", uid: "patientName" },
  { name: "DOCTOR", uid: "doctorName" },
  { name: "ROOM", uid: "room" },
  { name: "ADMISSION DATE", uid: "admissionDate" },
  { name: "DISCHARGE DATE", uid: "dischargeDate" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const inpatientStatusColors = {
  admitted: "bg-green-200 text-green-700",
  discharged: "bg-red-200 text-red-700",
  transferred: "bg-yellow-200 text-yellow-700",
};