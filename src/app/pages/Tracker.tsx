import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, MapPin, Users, Crown, Ticket, ChevronRight } from "lucide-react";

export default function Tracker() {
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [currentServing, setCurrentServing] = useState(38);
  const [clinicTraffic] = useState(5); // minutes per patient (clinic traffic)
  const [travelTime] = useState(20); // minutes to reach clinic

  useEffect(() => {
    const info = localStorage.getItem("bookingInfo");
    if (info) {
      setBookingInfo(JSON.parse(info));
    } else {
      navigate("/booking");
      return;
    }

    // Simulate serving number updates
    const interval = setInterval(() => {
      setCurrentServing((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!bookingInfo) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const isPremium = bookingInfo.tier === "premium";

  // Calculate ETA
  let tokensAhead = 0;
  let estimatedWaitTime = 0;
  let eta = null;
  let timeToArrive = 0;

  if (!isPremium && bookingInfo.tokenNumber) {
    tokensAhead = Math.max(0, bookingInfo.tokenNumber - currentServing);
    estimatedWaitTime = tokensAhead * clinicTraffic;
    eta = new Date(Date.now() + estimatedWaitTime * 60000);
    timeToArrive = Math.max(0, estimatedWaitTime - travelTime);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div 
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto">
          <h1 className="text-xl text-white mb-1">Live Queue</h1>
          <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
            Track your appointment
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Tier Badge */}
          <div className="flex justify-center">
            {isPremium ? (
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--premium-light)" }}
              >
                <Crown className="w-4 h-4" style={{ color: "var(--premium-gold)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--premium-gold)" }}>
                  Premium
                </span>
              </div>
            ) : (
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--slate-bg)" }}
              >
                <Ticket className="w-4 h-4" style={{ color: "var(--navy-blue)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--navy-blue)" }}>
                  Free Queue
                </span>
              </div>
            )}
          </div>

          {/* My Booking Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ 
              border: "2px solid",
              borderColor: isPremium ? "var(--premium-gold)" : "var(--navy-blue)"
            }}
          >
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
              {isPremium ? "My Reserved Time" : "My Reserved Token"}
            </p>
            
            {isPremium ? (
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-8 h-8" style={{ color: "var(--premium-gold)" }} />
                <span className="text-4xl font-bold" style={{ color: "var(--premium-gold)" }}>
                  {bookingInfo.time}
                </span>
              </div>
            ) : (
              <div className="text-5xl font-bold mb-3" style={{ color: "var(--navy-blue)" }}>
                #{bookingInfo.tokenNumber}
              </div>
            )}

            <div className="divider mb-3"></div>

            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Date:</span>
              <span style={{ color: "var(--text-primary)" }}>
                {formatDate(bookingInfo.date)}
              </span>
            </div>
          </div>

          {/* Current Serving */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Currently Serving
                </span>
              </div>
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--success-green)" }}
              ></div>
            </div>
            
            <div className="text-5xl font-bold" style={{ color: "var(--navy-blue)" }}>
              #{currentServing}
            </div>

            {!isPremium && tokensAhead > 0 && (
              <>
                <div className="divider my-3"></div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="text-xl font-semibold" style={{ color: "var(--premium-gold)" }}>
                    {tokensAhead}
                  </span>{" "}
                  {tokensAhead === 1 ? "patient" : "patients"} ahead of you
                </p>
              </>
            )}
          </div>

          {/* ETA & Time to Arrive (Free Only) */}
          {!isPremium && tokensAhead > 0 && (
            <>
              <div 
                className="bg-white rounded-2xl p-6"
                style={{ border: "1px solid var(--success-green)", backgroundColor: "var(--success-light)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" style={{ color: "var(--success-green)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Estimated Arrival Time (ETA)
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--success-green)" }}>
                  {eta?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Approximately {estimatedWaitTime} minutes from now
                </p>
                <div className="divider my-3"></div>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Based on clinic traffic: ~{clinicTraffic} min/patient
                </p>
              </div>

              <div 
                className={`bg-white rounded-2xl p-6 ${timeToArrive <= 5 ? "animate-pulse" : ""}`}
                style={{ 
                  border: "1px solid",
                  borderColor: timeToArrive <= 5 ? "var(--error-red)" : "var(--border-color)",
                  backgroundColor: timeToArrive <= 5 ? "var(--error-light)" : "white"
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" style={{ color: timeToArrive <= 5 ? "var(--error-red)" : "var(--navy-blue)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Time to Arrive
                  </span>
                </div>
                {timeToArrive > 5 ? (
                  <>
                    <div className="text-3xl font-bold mb-1" style={{ color: "var(--navy-blue)" }}>
                      {timeToArrive} min
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Leave for clinic in {timeToArrive} minutes (Travel: {travelTime} min)
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium" style={{ color: "var(--error-red)" }}>
                    ⚠️ Time to leave now! Your turn is approaching.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Your Turn (Free) */}
          {!isPremium && tokensAhead <= 0 && (
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ backgroundColor: "var(--success-green)" }}
            >
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold mb-1">It's Your Turn!</h3>
                <p className="text-sm opacity-90">Please proceed to check-in counter</p>
              </div>
            </div>
          )}

          {/* Check-In Button */}
          <button
            onClick={() => navigate("/check-in")}
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            Proceed to Check-In
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Quick Actions */}
          <div className="divider"></div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => navigate("/medical-profile")}
              className="py-2 rounded-lg text-xs font-medium"
              style={{ backgroundColor: "var(--clean-white)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/mediator")}
              className="py-2 rounded-lg text-xs font-medium"
              style={{ backgroundColor: "var(--clean-white)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
            >
              Mediator
            </button>
            <button
              onClick={() => navigate("/doctor")}
              className="py-2 rounded-lg text-xs font-medium"
              style={{ backgroundColor: "var(--clean-white)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
