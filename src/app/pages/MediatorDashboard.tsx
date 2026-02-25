import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Activity, Bell, ArrowDown, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";

interface Patient {
  tokenNumber: number;
  name: string;
  age: number;
  tier: "premium" | "free";
  status: "waiting" | "called" | "in-consultation";
  isLate: boolean;
}

export default function MediatorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([
    { tokenNumber: 38, name: "Ramesh Gupta", age: 72, tier: "premium", status: "in-consultation", isLate: false },
    { tokenNumber: 12, name: "Priya Sharma", age: 35, tier: "premium", status: "waiting", isLate: false },
    { tokenNumber: 15, name: "Sunita Devi", age: 68, tier: "premium", status: "waiting", isLate: true },
    { tokenNumber: 42, name: "Amit Patel", age: 45, tier: "free", status: "waiting", isLate: false },
  ]);

  const [currentServing, setCurrentServing] = useState(38);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [deductionProcessing, setDeductionProcessing] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#EEF2FF";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleMoveDown = async (tokenNumber: number) => {
    setDeductionProcessing(true);
    try {
      const response = await fetch(`/api/mediator/triggerLateArrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: tokenNumber }),
      });

      if (response.ok) {
        setPatients((prev) => {
          const patient = prev.find((p) => p.tokenNumber === tokenNumber);
          if (!patient) return prev;
          const filtered = prev.filter((p) => p.tokenNumber !== tokenNumber);
          return [...filtered, { ...patient, isLate: false }];
        });
      }
    } catch (err) {
      console.error("Move Down failed:", err);
    } finally {
      setDeductionProcessing(false);
    }
  };

  const handleEmergencyBell = () => {
    setShowEmergencyAlert(true);
    setTimeout(() => setShowEmergencyAlert(false), 3000);
  };

  const handleCallNext = () => {
    const nextWaiting = patients.find((p) => p.status === "waiting");
    if (nextWaiting) {
      alert(`Called: ${nextWaiting.name} (Token #${nextWaiting.tokenNumber})`);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2FF]" style={{ paddingBottom: "80px" }}>
      {/* Sticky Mobile Header with Glassmorphism */}
      <div
        className="sticky top-0 z-20 px-4 py-4 backdrop-blur-sm transition-all"
        style={{
          backgroundColor: "rgba(79, 70, 229, 0.95)",
          borderBottom: "1px solid rgba(79, 70, 229, 0.3)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white bg-opacity-20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Dispatch Queue</h1>
              <p className="text-xs text-indigo-200">Medical Center Ops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      {showEmergencyAlert && (
        <div className="mx-3 mt-3 p-3 rounded-lg animate-pulse" style={{ backgroundColor: "#FEE2E2" }}>
          <p className="text-sm font-semibold" style={{ color: "#DC2626" }}>🚨 Emergency Alert Sent</p>
        </div>
      )}

      <div className="px-3 py-3 max-w-2xl mx-auto">
        {/* Emergency Bell Button */}
        <button
          onClick={handleEmergencyBell}
          className="w-full min-h-[48px] px-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 mb-4 transition"
          style={{ backgroundColor: "#DC2626" }}
        >
          <Bell className="w-5 h-5" />
          Outside Cabin Alert
        </button>

        {/* Quick Stats */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <div
            className="flex-shrink-0 rounded-lg p-3 text-center w-24"
            style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
          >
            <p className="text-sm font-bold" style={{ color: "#10B981" }}>#{currentServing}</p>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Serving</p>
          </div>
          <div
            className="flex-shrink-0 rounded-lg p-3 text-center w-24"
            style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
          >
            <p className="text-sm font-bold" style={{ color: "#F59E0B" }}>{patients.filter((p) => p.status === "waiting").length}</p>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Waiting</p>
          </div>
          <div
            className="flex-shrink-0 rounded-lg p-3 text-center w-24"
            style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
          >
            <p className="text-sm font-bold" style={{ color: "#DC2626" }}>{patients.filter((p) => p.isLate).length}</p>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Late</p>
          </div>
        </div>

        {/* Patient Queue List - Mobile List Items */}
        <div className="space-y-2">
          {patients.map((patient) => (
            <div key={patient.tokenNumber} className="w-full bg-white rounded-xl p-4 mb-2 flex items-center justify-between border-b-4 border-indigo-100" style={{ border: patient.status === "in-consultation" ? "2px solid #38BDF8" : "1px solid #E2E8F0" }}>
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#0F172A]">{patient.name}</h3>
                  <p className="text-xs mt-1 text-[#94A3B8]">Token #{patient.tokenNumber} • Age {patient.age}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="flex-1 min-h-[48px] text-white text-xs rounded-lg transition font-semibold flex items-center justify-center" onClick={() => handleCallNext()} style={{ backgroundColor: "#4F46E5" }}>
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                  {patient.isLate && (
                    <Button size="sm" className="flex-1 min-h-[48px] text-white text-xs rounded-lg transition font-semibold flex items-center justify-center" onClick={() => handleMoveDown(patient.tokenNumber)} disabled={deductionProcessing} style={{ backgroundColor: "#DC2626" }}>
                      <ArrowDown className="w-3 h-3 mr-1" /> Move
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Pill Badge - Large & Touch-Friendly */}
              <div className="flex flex-col items-center justify-center pl-3">
                <div className={`rounded-full px-3 py-2 font-bold text-xs w-16 text-center ${patient.isLate ? 'animate-pulse' : ''}`} style={{ backgroundColor: patient.isLate ? '#EF4444' : patient.status === 'in-consultation' ? '#10B981' : '#F59E0B', color: 'white' }}>
                  {patient.isLate ? '🔴 Late' : patient.status === 'in-consultation' ? '✓ Going' : '⏳ Wait'}
                </div>
                {patient.tier === "premium" && <p className="text-xs mt-2 font-semibold" style={{ color: "#D97706" }}>⭐ Premium</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (FAB) - Call Next */}
      <button
        onClick={handleCallNext}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 h-24 w-24 rounded-full bg-[#4F46E5] animate-pulse flex items-center justify-center text-white font-bold text-2xl shadow-lg"
        style={{
          boxShadow: "0 10px 30px rgba(79,70,229,0.35)",
        }}
      >
        <Phone className="w-10 h-10" />
      </button>
    </div>
  );
}
