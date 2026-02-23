import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Tracker from "./pages/Tracker";
import CheckIn from "./pages/CheckIn";
import MedicalProfile from "./pages/MedicalProfile";
import Mediator from "./pages/Mediator";
import Doctor from "./pages/Doctor";
import DoctorBalance from "./pages/DoctorBalance";
import DoctorProfile from "./pages/DoctorProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
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
    path: "/doctor",
    Component: Doctor,
  },
  {
    path: "/doctor-balance",
    Component: DoctorBalance,
  },
  {
    path: "/doctor-profile",
    Component: DoctorProfile,
  },
]);