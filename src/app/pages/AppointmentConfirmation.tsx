import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, MapPin, Stethoscope, Pill, ChevronDown, User } from "lucide-react";

interface ClinicDetails {
  doctorName: string;
  speciality: string;
  clinicAddress: string;
  pharmacy: string;
  wheelchairAccess: boolean;
  startTime: string;
  endTime: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  aadharOrAbhaId: string;
}

export default function AppointmentConfirmation() {
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [clinicDetails, setClinicDetails] = useState<ClinicDetails | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const info = localStorage.getItem("bookingInfo");
    const selectedPatient = sessionStorage.getItem("selectedPatient");
    
    if (!info) {
      navigate("/booking");
      return;
    }

    const parsed = JSON.parse(info);
    setBookingInfo(parsed);
    
    if (selectedPatient) {
      setPatient(JSON.parse(selectedPatient));
    }

    // Fetch clinic details
    const api = (import.meta as any).env.VITE_API_URL || "http://localhost:8080";
    if (parsed.doctorId) {
      fetch(`${api}/api/doctor/${parsed.doctorId}/clinic-details`)
        .then((r) => r.json())
        .then(setClinicDetails)
        .catch(() => {
          setClinicDetails({
            doctorName: "Dr. Rajesh Kumar",
            speciality: "General Medicine",
            clinicAddress: "123 Medical Plaza, City Center, New Delhi",
            pharmacy: "Yes",
            wheelchairAccess: true,
            startTime: "09:00",
            endTime: "17:00",
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    if (!bookingInfo) return;
    const eta = bookingInfo.eta_minutes || bookingInfo.etaMinutes || 30;
    setCountdown(eta * 60); // in seconds

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [bookingInfo]);

  if (loading || !bookingInfo) return <div className="text-center py-10">Loading...</div>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto">
          <h1 className="text-xl text-white mb-1">Appointment Confirmed</h1>
          <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
            Your booking is confirmed
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Countdown Timer */}
          <div
            className="bg-white rounded-2xl p-6 text-center"
            style={{
              backgroundColor: "var(--success-green)",
              border: "2px solid var(--success-green)",
            }}
          >
            <p className="text-sm text-white mb-2">Time to Arrive</p>
            <div className="text-5xl font-bold text-white mb-2">
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </div>
            <p className="text-xs text-white opacity-90">Minutes until your scheduled time</p>
          </div>

          {/* Appointment Details */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Appointment Details
            </h3>
            <div className="space-y-3">
              {patient && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 mt-0.5" style={{ color: "var(--navy-blue)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Patient Name
                    </p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {patient.name} (Age: {patient.age})
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5" style={{ color: "var(--navy-blue)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Date & Time
                  </p>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {bookingInfo.date} at {bookingInfo.time || "10:00 AM"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 mt-0.5" style={{ color: "var(--premium-gold)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Doctor / Speciality
                  </p>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {clinicDetails?.doctorName || "Loading..."} ({clinicDetails?.speciality})
                  </p>
                </div>
              </div>

              {bookingInfo.tokenNumber && (
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold" style={{ color: "var(--navy-blue)" }}>
                    #
                  </span>
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Token Number
                    </p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {bookingInfo.tokenNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clinic Details */}
          {clinicDetails && (
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Clinic Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: "var(--navy-blue)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Address
                    </p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {clinicDetails.clinicAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 mt-0.5" style={{ color: "var(--success-green)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      On-site Pharmacy
                    </p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {clinicDetails.pharmacy}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5" style={{ color: "var(--navy-blue)", fontSize: 18 }}>
                    ♿
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Wheelchair Accessibility
                    </p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {clinicDetails.wheelchairAccess ? "✓ Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={() => navigate("/tracker")}
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            Track Appointment
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "var(--clean-white)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
