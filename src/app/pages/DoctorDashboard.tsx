import React, { useEffect, useState } from "react";
import { Calendar, Settings, Users } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  tokenNumber?: number;
  diagnosis?: string;
  bp?: string;
  heartRate?: string;
  status?: string;
  isUrgent?: boolean;
}

interface ScheduleEntry {
  date: string;
  openTime: string;
  closeTime: string;
  totalBooked: number;
}

export default function DoctorDashboard(): JSX.Element {
  console.log('DOCTOR MODULE LOADED');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState<"queue" | "schedule" | "settings">("queue");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const colors = isDarkMode
    ? {
        bg: "#0B1120",
        cardBg: "#111827",
        text: "#E5E7EB",
        textMuted: "#9CA3AF",
        textBright: "#FFFFFF",
        accent: "#3B82F6",
        danger: "#FB7185",
        success: "#10B981",
        warning: "#F59E0B",
        border: "rgba(59,130,246,0.1)",
      }
    : {
        bg: "#F8FAFC",
        cardBg: "#FFFFFF",
        text: "#1E293B",
        textMuted: "#64748B",
        textBright: "#000000",
        accent: "#3B82F6",
        danger: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
        border: "rgba(59,130,246,0.15)",
      };

  useEffect(() => {
    document.body.style.backgroundColor = colors.bg;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isDarkMode]);

  // Fetch patient data from API on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients");
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          setPatients(getDemoPatients());
        }
      } catch (err) {
        console.warn("Failed to fetch patients, using demo data:", err);
        setPatients(getDemoPatients());
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getDemoPatients = (): Patient[] => [
    {
      id: 1,
      name: "Ramesh Gupta",
      age: 72,
      tokenNumber: 38,
      diagnosis: "Heart Disease",
      bp: "140/90",
      heartRate: "88 bpm",
      status: "in-consultation",
      isUrgent: false,
    },
    {
      id: 2,
      name: "Priya Sharma",
      age: 35,
      tokenNumber: 12,
      diagnosis: "Follow-up",
      bp: "120/80",
      heartRate: "72 bpm",
      status: "waiting",
      isUrgent: false,
    },
    {
      id: 3,
      name: "Sunita Devi",
      age: 68,
      tokenNumber: 15,
      diagnosis: "Hypertension",
      bp: "160/100",
      heartRate: "92 bpm",
      status: "waiting",
      isUrgent: true,
    },
    {
      id: 4,
      name: "Amit Patel",
      age: 45,
      tokenNumber: 42,
      diagnosis: "Checkup",
      bp: "118/76",
      heartRate: "70 bpm",
      status: "waiting",
      isUrgent: false,
    },
  ];

  const scheduleData: ScheduleEntry[] = [
    { date: "Mon, Feb 24", openTime: "09:00 AM", closeTime: "05:00 PM", totalBooked: 18 },
    { date: "Tue, Feb 25", openTime: "09:00 AM", closeTime: "05:00 PM", totalBooked: 22 },
    { date: "Wed, Feb 26", openTime: "09:00 AM", closeTime: "05:00 PM", totalBooked: 16 },
    { date: "Thu, Feb 27", openTime: "09:00 AM", closeTime: "05:00 PM", totalBooked: 20 },
    { date: "Fri, Feb 28", openTime: "09:00 AM", closeTime: "02:00 PM", totalBooked: 12 },
  ];

  const handleEmergencyAlert = () => {
    setEmergencyActive(true);
    alert("🚨 EMERGENCY ALERT TRIGGERED\n\nAll staff notified. Emergency protocols activated.");
    setTimeout(() => setEmergencyActive(false), 2000);
  };

  const renderPatientQueue = () => {
    if (loading) {
      return (
        <div style={{ padding: 16, textAlign: "center", color: colors.textMuted }}>
          Loading patients...
        </div>
      );
    }

    return (
      <div style={{ padding: "12px", paddingBottom: 100 }}>
        {/* Emergency Alert Button */}
        <button
          onClick={handleEmergencyAlert}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: 16,
            backgroundColor: emergencyActive ? "#C41E3A" : "#DC2626",
            border: "none",
            borderRadius: 10,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center",
            animation: emergencyActive ? "pulse 0.6s infinite" : "none",
            transition: "all 0.3s",
          }}
        >
          🚨 TRIGGER EMERGENCY ALERT
        </button>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
        `}</style>

        {/* Patient Queue */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.textBright }}>
            Ready Patients
          </h2>
          <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: colors.textMuted }}>
            {patients.length} patients in queue
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 10,
                padding: 14,
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${patient.isUrgent ? colors.danger : "#22D3EE"}`,
              }}
            >
              {/* Header: Name & Token - Larger Font */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.textBright,
                    }}
                  >
                    {patient.name}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 3,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.textMuted,
                    }}
                  >
                    Token #{patient.tokenNumber}
                  </p>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: patient.isUrgent ? colors.danger : colors.success,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#FFFFFF",
                  }}
                >
                  {patient.isUrgent ? "EMERGENCY" : "✓ STABLE"}
                </div>
              </div>

              {/* Age & Diagnosis */}
              <div style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 12 }}>
                <span style={{ color: colors.textMuted }}>Age: {patient.age}</span>
                <span style={{ color: colors.warning, fontWeight: 500 }}>
                  {patient.diagnosis}
                </span>
              </div>

              {/* Vitals in Monospace */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 13,
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                <div>
                  <span style={{ color: colors.textMuted }}>BP: </span>
                  <span
                    style={{
                      color: patient.isUrgent ? colors.danger : colors.success,
                    }}
                  >
                    {patient.bp}
                  </span>
                </div>
                <div>
                  <span style={{ color: colors.textMuted }}>HR: </span>
                  <span
                    style={{
                      color: patient.isUrgent ? colors.danger : colors.success,
                    }}
                  >
                    {patient.heartRate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSchedule = () => {
    return (
      <div style={{ padding: "12px", paddingBottom: 100 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.textBright }}>
            Clinic Schedule
          </h2>
          <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: colors.textMuted }}>
            This week's availability
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scheduleData.map((entry, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 10,
                padding: 14,
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${colors.accent}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.textBright }}>
                    {entry.date}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 6,
                      fontSize: 12,
                      fontGroup: "monospace",
                      color: colors.textMuted,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Open:</span> {entry.openTime} | <span style={{ fontWeight: 600 }}>Close:</span> {entry.closeTime}
                  </p>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: colors.accent,
                    borderRadius: 8,
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {entry.totalBooked}
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 500 }}>Booked</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div style={{ padding: "12px", paddingBottom: 100 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.textBright }}>
            Settings
          </h2>
          <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: colors.textMuted }}>
            Personalize your experience
          </p>
        </div>

        {/* Dark/Light Mode Toggle */}
        <div
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: 10,
            padding: 14,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: colors.textBright,
              }}
            >
              Dark/Light Mode
            </h3>
            <p style={{ margin: 0, marginTop: 4, fontSize: 11, color: colors.textMuted }}>
              {isDarkMode ? "Dark mode active" : "Light mode active"}
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              border: "none",
              backgroundColor: isDarkMode ? colors.accent : "#CBD5E1",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              paddingLeft: isDarkMode ? 24 : 4,
              paddingRight: isDarkMode ? 4 : 24,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                transition: "all 0.3s",
              }}
            />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "queue":
        return renderPatientQueue();
      case "schedule":
        return renderSchedule();
      case "settings":
        return renderSettings();
      default:
        return renderPatientQueue();
    }
  };

  const navItems = [
    { id: "queue", label: "Queue", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: colors.bg,
        color: colors.text,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        transition: isDarkMode ? "none" : "background-color 0.3s",
      }}
    >
      {/* STICKY TOP BAR - SIMPLIFIED */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: colors.cardBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.border}`,
          padding: "14px 16px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.textBright }}>
          Dr. Rajesh Mehta
        </h1>
        <p style={{ margin: 0, marginTop: 2, fontSize: 12, color: "#22D3EE" }}>
          Cardiologist
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {renderContent()}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: colors.cardBg,
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? colors.accent : colors.textMuted,
                fontSize: 11,
                fontWeight: 500,
                transition: "all 0.3s",
                borderTop: isActive ? `3px solid ${colors.accent}` : "3px solid transparent",
              }}
            >
              <Icon width={20} height={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
