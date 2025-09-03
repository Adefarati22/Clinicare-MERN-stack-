import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/component/LazyLoader";
import { PublicRoutes, PrivateRoutes, VerifiedRoutes } from "./ProtectedRoutes";
import { useAuth } from "@/contextStore/Index";
import ErrorBoundary from "@/component/ErrorBoundary";

// render pages
const RootLayout = lazy(() => import("@/layout/RootLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const ContactUs = lazy(() => import("@/pages/contactUs/ContactUs"));
const AuthLayout = lazy(() => import("@/layout/AuthLayout"));
const Login = lazy(() => import("@/pages/login/Login"));
const Register = lazy(() => import("@/pages/register/Register"));
const ForgotPassword = lazy(() =>
  import("@/pages/forgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("@/pages/resetPassword/RestPassword"));
const OnbordingLayout = lazy(() => import("@/layout/OnbordingLayout"));
const PatientOnboarding = lazy(() =>
  import("@/pages/patientOnboarding/PatientOnboarding")
);
const VerifyAccount = lazy(() => import("@/pages/verifyAccount/VerifyAccount"));
const DashboardLayout = lazy(() => import("@/layout/DashboardLayout"));
const Dashboard = lazy(() =>
  import("@/pages/sidebarPages/dashboard/Dashboard")
);
const Appointments = lazy(() =>
  import("@/pages/sidebarPages/appointment/Appointments")
);
const PatientAppointments = lazy(() =>
  import("@/pages/sidebarPages/appointment/PatientAppointments")
);
const Rooms = lazy(() => import("@/pages/sidebarPages/room/Rooms"));
const Payments = lazy(() => import("@/pages/sidebarPages/payment/Payments"));
const PatientPayments = lazy(() =>
  import("@/pages/sidebarPages/payment/PatientPayments")
);
const Doctors = lazy(() => import("@/pages/sidebarPages/doctor/Doctors"));
const Patients = lazy(() => import("@/pages/sidebarPages/patient/Patients"));
const Inpatients = lazy(() =>
  import("@/pages/sidebarPages/inpatient/Inpatients")
);
const Users = lazy(() => import("@/pages/sidebarPages/user/Users"));
const Settings = lazy(() => import("@/pages/sidebarPages/settingsss/Settings"));
const Account = lazy(() =>
  import("@/pages/sidebarPages/settingsss/account/Account")
);
const Password = lazy(() =>
  import("@/pages/sidebarPages/settingsss/password/Password")
);
const HealthRecords = lazy(() =>
  import("@/pages/sidebarPages/settingsss/healthRecords/HealthRecord")
);

// variables names here are capital letter because they going to be our component

export default function AppRoutes() {
  const { accessToken, user } = useAuth();
  const routes = [
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <RootLayout />
          </PublicRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/Contact_Us",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ContactUs />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/account",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "signin",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "signup",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: "reset-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ResetPassword />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <VerifiedRoutes accessToken={accessToken} user={user}>
            <OnbordingLayout />
          </VerifiedRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "/patient-onboard",
          element: (
            <Suspense>
              <PatientOnboarding />
            </Suspense>
          ),
        },
        {
          path: "/Verify-account",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <VerifyAccount />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <DashboardLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Appointments />
            </Suspense>
          ),
        },
        {
          path: "patient-appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientAppointments />
            </Suspense>
          ),
        },
        {
          path: "rooms",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Rooms />
            </Suspense>
          ),
        },
        {
          path: "payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Payments />
            </Suspense>
          ),
        },
        {
          path: "patient-payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientPayments />
            </Suspense>
          ),
        },

        {
          path: "doctors",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Doctors />
            </Suspense>
          ),
        },
        {
          path: "patients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Patients />
            </Suspense>
          ),
        },
        {
          path: "inpatients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Inpatients />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Users />
            </Suspense>
          ),
        },
        {
          path: "settings",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Settings />
            </Suspense>
          ),
          children: [
            {
              path: "account",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Account />
                </Suspense>
              ),
            },
            {
              path: "password",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Password />
                </Suspense>
              ),
            },
            {
              path: "health",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <HealthRecords />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
