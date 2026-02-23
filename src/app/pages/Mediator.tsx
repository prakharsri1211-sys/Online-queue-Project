import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Phone, Bell, ArrowDown, Crown, Ticket, ChevronRight } from "lucide-react";

interface Patient {
  tokenNumber: number;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  tier: "premium" | "free";
  status: "waiting" | "called" | "in-consultation";
  isLate: boolean;
  isDiabetic?: boolean;
}

export default function Mediator() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([
    {
      tokenNumber: 38,
      name: "Ramesh Gupta",
      age: 72,
      gender: "male",
      appointmentTime: "10:00 AM",
      tier: "premium",
      status: "in-consultation",
      isLate: false,
    },
    {
      tokenNumber: 12,
      name: "Priya Sharma",
      age: 35,
      gender: "female",
      appointmentTime: "10:30 AM",
      tier: "premium",
      status: "waiting",
      isLate: false,
      isDiabetic: true,
    },
    {
      tokenNumber: 15,
      name: "Sunita Devi",
      age: 68,
      gender: "female",
      appointmentTime: "11:00 AM",
      tier: "premium",
      status: "waiting",
      isLate: true,
    },
    {
      tokenNumber: 42,
      name: "Amit Patel",
      age: 45,
      gender: "male",
      appointmentTime: "Token Queue",
      tier: "free",
      status: "waiting",
      isLate: false,
    },
    {
      tokenNumber: 43,
      name: "Rahul Verma",
      age: 28,
      gender: "male",
      appointmentTime: "Token Queue",
      tier: "free",
      status: "waiting",
      isLate: false,
    },
  ]);

  const [currentServing, setCurrentServing] = useState(38);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  const handleMoveDown = (tokenNumber: number) => {
    setPatients((prev) => {
      const patient = prev.find((p) => p.tokenNumber === tokenNumber);
      if (!patient || !patient.isLate) return prev;

      // Remove patient
      const filtered = prev.filter((p) => p.tokenNumber !== tokenNumber);
      
      // Add to end of queue
      return [...filtered, { ...patient, isLate: false }];
    });
  };

  const handleCallPatient = (tokenNumber: number) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.tokenNumber === tokenNumber ? { ...p, status: "called" as const } : p
      )
    );
    setCurrentServing(tokenNumber);
  };

  const handleEmergencyBell = () => {
    setShowEmergencyAlert(true);
    localStorage.setItem("emergencyAlert", JSON.stringify({
      time: new Date().toISOString(),
      message: "Outside Cabin Emergency"
    }));
    setTimeout(() => setShowEmergencyAlert(false), 3000);
  };

  const getMedicalIcons = (patient: Patient) => {
    const icons = [];
    if (patient.age >= 60 && patient.gender === "male") {
      icons.push(<span key="old-male" className="text-lg">👴</span>);
    } else if (patient.age >= 60 && patient.gender === "female") {
      icons.push(<span key="old-female" className="text-lg">👵</span>);
    }
    if (patient.gender === "female" && patient.age < 60) {
      icons.push(<span key="female" className="text-lg">👵</span>);
    }
    if (patient.isDiabetic) {
      icons.push(<span key="diabetic" className="text-lg">💉</span>);
    }
    return icons;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-consultation":
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--success-light)", color: "var(--success-green)" }}
          >
            In Session
          </span>
        );
      case "called":
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--slate-bg)", color: "var(--slate-gray)" }}
          >
            Called
          </span>
        );
      default:
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--slate-bg)", color: "var(--text-secondary)" }}
          >
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div 
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl text-white mb-1">Queue Manager</h1>
              <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
                Mediator Dashboard
              </p>
            </div>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Emergency Bell */}
          <button
            onClick={handleEmergencyBell}
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--error-red)" }}
          >
            <Bell className="w-5 h-5" />
            Outside Cabin Alert
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto">
          {/* Emergency Alert */}
          {showEmergencyAlert && (
            <div 
              className="rounded-xl p-4 mb-4 animate-pulse"
              style={{ backgroundColor: "var(--error-light)", border: "1px solid var(--error-red)" }}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" style={{ color: "var(--error-red)" }} />
                <div>
                  <p className="font-semibold" style={{ color: "var(--error-red)" }}>
                    Emergency Alert Sent
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Doctor has been notified
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Serving */}
          <div 
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  Currently Serving
                </p>
                <p className="text-4xl font-bold" style={{ color: "var(--navy-blue)" }}>
                  #{currentServing}
                </p>
              </div>
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--success-green)" }}
              ></div>
            </div>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div 
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--clean-white)", border: "1px solid var(--border-color)" }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Waiting</p>
              <p className="text-2xl font-bold" style={{ color: "var(--navy-blue)" }}>
                {patients.filter((p) => p.status === "waiting").length}
              </p>
            </div>
            <div 
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--premium-light)", border: "1px solid var(--premium-gold)" }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--premium-gold)" }}>Premium</p>
              <p className="text-2xl font-bold" style={{ color: "var(--premium-gold)" }}>
                {patients.filter((p) => p.tier === "premium").length}
              </p>
            </div>
            <div 
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--error-light)", border: "1px solid var(--error-red)" }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--error-red)" }}>Late</p>
              <p className="text-2xl font-bold" style={{ color: "var(--error-red)" }}>
                {patients.filter((p) => p.isLate).length}
              </p>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Users className="w-5 h-5" />
              Patient Queue
            </h3>

            {patients.map((patient) => (
              <div
                key={patient.tokenNumber}
                className="bg-white rounded-xl p-4"
                style={{
                  border: "1px solid",
                  borderColor: patient.isLate ? "var(--error-red)" : patient.status === "in-consultation" ? "var(--success-green)" : "var(--border-color)",
                }}
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{
                        backgroundColor: patient.tier === "premium" ? "var(--premium-gold)" : "var(--navy-blue)",
                      }}
                    >
                      #{patient.tokenNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                          {patient.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {getMedicalIcons(patient)}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {patient.appointmentTime} • {patient.age} yrs
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>

                {/* Late Warning */}
                {patient.isLate && (
                  <div 
                    className="rounded-lg p-2 mb-3 flex items-center gap-2"
                    style={{ backgroundColor: "var(--error-light)" }}
                  >
                    <span className="text-xs font-medium" style={{ color: "var(--error-red)" }}>
                      ⚠️ Patient is late - Missed slot
                    </span>
                  </div>
                )}

                <div className="divider mb-3"></div>

                {/* Actions */}
                {patient.status !== "in-consultation" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCallPatient(patient.tokenNumber)}
                      disabled={patient.status === "called"}
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: "var(--navy-blue)" }}
                    >
                      <Phone className="w-4 h-4" />
                      {patient.status === "called" ? "Called" : "Call"}
                    </button>
                    
                    {patient.isLate && (
                      <button
                        onClick={() => handleMoveDown(patient.tokenNumber)}
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        style={{ backgroundColor: "var(--error-red)", color: "white" }}
                      >
                        <ArrowDown className="w-4 h-4" />
                        MOVE DOWN
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-6 space-y-3">
            <div className="divider"></div>
            <button
              onClick={() => navigate("/doctor")}
              className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--navy-blue)" }}
            >
              Switch to Doctor View
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--clean-white)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
            >
              Patient View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
