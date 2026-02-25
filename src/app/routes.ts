import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import PatientSelector from "./pages/PatientSelector";
import Booking from "./pages/Booking";
import Tracker from "./pages/Tracker";
import CheckIn from "./pages/CheckIn";
import MedicalProfile from "./pages/MedicalProfile";
import Mediator from "./pages/Mediator";
import MediatorDashboard from "./pages/MediatorDashboard";
import Doctor from "./pages/Doctor";
import DoctorBalance from "./pages/DoctorBalance";
import DoctorProfile from "./pages/DoctorProfile";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import MediatorLogin from "./pages/MediatorLogin";
import SetupClinic from "./pages/SetupClinic";
import DoctorDashboard from "./pages/DoctorDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/patient-selector",
    Component: PatientSelector,
  },
  {
    path: "/booking",
    Component: Booking,
  },
  {
    path: "/tracker",
    Component: Tracker,
  },
  {
    path: "/check-in",
    Component: CheckIn,
  },
  {
    path: "/medical-profile",
    Component: MedicalProfile,
  },
  {
    path: "/mediator",
    Component: Mediator,
  },
  {
    path: "/mediator/dashboard",
    Component: MediatorDashboard,
  },
  {
    path: "/doctor",
    Component: DoctorDashboard,
  },
  {
    path: "/doctor-balance",
    Component: DoctorBalance,
  },
  {
    path: "/doctor-profile",
    Component: DoctorProfile,
  },
  {
    path: "/appointment/confirmation",
    Component: AppointmentConfirmation,
  },
  {
    path: "/mediator/login",
    Component: MediatorLogin,
  },
  {
    path: "/setup-clinic",
    Component: SetupClinic,
  },
  {
    path: "/doctor/dashboard",
    Component: DoctorDashboard,
  },
], { basename: "/" });