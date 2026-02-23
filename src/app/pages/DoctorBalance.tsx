import { useState } from "react";
import { useNavigate } from "react-router";
import { DollarSign, TrendingUp, Clock, ChevronLeft, Calendar } from "lucide-react";

interface PendingCredit {
  patientName: string;
  amount: number;
  daysRemaining: number;
  originalDate: string;
}

export default function DoctorBalance() {
  const navigate = useNavigate();

  const [revenue] = useState({
    collectedToday: 8500,
    missedAppointments: 100,
    totalPatients: 18,
    completedSessions: 17,
  });

  const [pendingCredits] = useState<PendingCredit[]>([
    {
      patientName: "Amit Kumar",
      amount: 100,
      daysRemaining: 5,
      originalDate: "Feb 17, 2026",
    },
    {
      patientName: "Sunita Verma",
      amount: 100,
      daysRemaining: 2,
      originalDate: "Feb 20, 2026",
    },
  ]);

  const totalPendingCredits = pendingCredits.reduce((sum, credit) => sum + credit.amount, 0);
  const totalRevenue = revenue.collectedToday + revenue.missedAppointments + totalPendingCredits;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div 
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/doctor")}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl text-white mb-1">Revenue Balance</h1>
              <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
                Financial Overview
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Total Revenue Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ backgroundColor: "var(--success-green)" }}
          >
            <div className="flex items-center gap-2 mb-4 text-white">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Total Revenue Today</h2>
            </div>

            <div className="text-5xl font-bold text-white mb-4">
              ₹{totalRevenue}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                className="rounded-lg p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <p className="text-xs text-white opacity-90 mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {revenue.completedSessions}/{revenue.totalPatients}
                </p>
              </div>
              <div 
                className="rounded-lg p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <p className="text-xs text-white opacity-90 mb-1">Avg/Session</p>
                <p className="text-2xl font-bold text-white">
                  ₹{Math.round(revenue.collectedToday / revenue.completedSessions)}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <TrendingUp className="w-5 h-5" />
              Revenue Breakdown
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Collected Revenue
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    From completed consultations
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: "var(--success-green)" }}>
                  ₹{revenue.collectedToday}
                </p>
              </div>

              <div className="divider"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Missed Appointments
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    ₹100 deducted per missed
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: "var(--premium-gold)" }}>
                  ₹{revenue.missedAppointments}
                </p>
              </div>

              <div className="divider"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Pending Credits
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Awaiting 7-day window
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: "var(--slate-gray)" }}>
                  ₹{totalPendingCredits}
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Credit Logic Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Clock className="w-5 h-5" />
              Fee Logic
            </h3>
            <div 
              className="rounded-lg p-4 space-y-2"
              style={{ backgroundColor: "var(--slate-bg)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total Fee:</span> ₹500 per consultation
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Missed Appointment:</span> ₹100 deducted immediately
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Re-booking within 7 days:</span> Fee becomes ₹400 (₹100 credit applied)
              </p>
            </div>
          </div>

          {/* Pending Credits Section */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <h3 className="font-semibold mb-4 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Pending Credits
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--slate-bg)", color: "var(--text-secondary)" }}
              >
                {pendingCredits.length}
              </span>
            </h3>

            {pendingCredits.length > 0 ? (
              <div className="space-y-3">
                {pendingCredits.map((credit, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-4"
                    style={{ 
                      backgroundColor: credit.daysRemaining <= 2 ? "var(--error-light)" : "var(--slate-bg)",
                      border: "1px solid",
                      borderColor: credit.daysRemaining <= 2 ? "var(--error-red)" : "var(--border-color)"
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                          {credit.patientName}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          Missed on {credit.originalDate}
                        </p>
                      </div>
                      <p className="text-lg font-bold" style={{ color: "var(--premium-gold)" }}>
                        ₹{credit.amount}
                      </p>
                    </div>

                    <div className="divider my-2"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: credit.daysRemaining <= 2 ? "var(--error-red)" : "var(--slate-gray)" }} />
                        <span 
                          className="text-xs font-medium"
                          style={{ color: credit.daysRemaining <= 2 ? "var(--error-red)" : "var(--text-secondary)" }}
                        >
                          {credit.daysRemaining} days remaining
                        </span>
                      </div>
                      {credit.daysRemaining <= 2 && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "var(--error-red)", color: "white" }}
                        >
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No pending credits at this time
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/doctor")}
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
