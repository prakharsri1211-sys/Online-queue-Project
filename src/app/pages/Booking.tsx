import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Clock, Crown, Ticket, ChevronRight } from "lucide-react";

type BookingTier = "premium" | "free" | null;

export default function Booking() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<BookingTier>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
    };
  };

  const getDateString = (date: Date) => date.toISOString().split('T')[0];

  const handlePremiumBooking = () => {
    if (selectedDate && selectedTime) {
      localStorage.setItem("bookingInfo", JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        tier: "premium",
        tokenNumber: null,
      }));
      navigate("/tracker");
    }
  };

  const handleFreeBooking = () => {
    if (selectedDate) {
      const freeTokenNumber = Math.floor(Math.random() * 30) + 40; // Token #40-#70
      localStorage.setItem("bookingInfo", JSON.stringify({
        date: selectedDate,
        time: null,
        tier: "free",
        tokenNumber: freeTokenNumber,
      }));
      navigate("/tracker");
    }
  };

  const days = getNextSevenDays();

  // Tier Selection
  if (!selectedTier) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
        <div 
          className="px-6 py-6"
          style={{ backgroundColor: "var(--navy-blue)" }}
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-xl text-white mb-1">Book Appointment</h1>
            <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
              Choose booking type
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="max-w-md mx-auto space-y-4">
            {/* Premium */}
            <button
              onClick={() => setSelectedTier("premium")}
              className="w-full text-left bg-white rounded-2xl p-5"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--premium-light)" }}
                  >
                    <Crown className="w-5 h-5" style={{ color: "var(--premium-gold)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Premium</h3>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Reserve exact time</p>
                  </div>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "var(--premium-light)", color: "var(--premium-gold)" }}
                >
                  ₹100/mo
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span 
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--success-green)" }}
                  ></span>
                  <span>Book specific Date + Time</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span 
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--success-green)" }}
                  ></span>
                  <span>Shows "Reserved Time: 10:00 AM"</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: "var(--slate-gray)" }}>
                <span>Select Premium</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Free */}
            <button
              onClick={() => setSelectedTier("free")}
              className="w-full text-left bg-white rounded-2xl p-5"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--slate-bg)" }}
                  >
                    <Ticket className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Free Queue</h3>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Token-based</p>
                  </div>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "var(--success-light)", color: "var(--success-green)" }}
                >
                  FREE
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span 
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--success-green)" }}
                  ></span>
                  <span>Book any available Date</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span 
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--success-green)" }}
                  ></span>
                  <span>Shows "Reserved Token: #42"</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: "var(--slate-gray)" }}>
                <span>Select Free</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Quick Access */}
          <div className="max-w-md mx-auto mt-8">
            <div className="divider mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
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

  // Premium Flow
  if (selectedTier === "premium") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
        <div 
          className="px-6 py-6 sticky top-0 z-10"
          style={{ backgroundColor: "var(--navy-blue)" }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl text-white mb-1">Premium Booking</h1>
              <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>Select date & time</p>
            </div>
            <button
              onClick={() => setSelectedTier(null)}
              className="px-3 py-1 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
            >
              Back
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="max-w-md mx-auto space-y-4">
            {/* Date */}
            <div 
              className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Select Date</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                  const dateStr = getDateString(date);
                  const formatted = formatDate(date);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(dateStr)}
                      className="p-2 rounded-lg text-center"
                      style={{
                        backgroundColor: isSelected ? "var(--navy-blue)" : "var(--slate-bg)",
                        color: isSelected ? "white" : "var(--text-primary)",
                        border: "1px solid",
                        borderColor: isSelected ? "var(--navy-blue)" : "var(--border-color)"
                      }}
                    >
                      <div className="text-xs opacity-75">{formatted.day}</div>
                      <div className="text-lg font-semibold">{formatted.date}</div>
                      <div className="text-xs opacity-75">{formatted.month}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time */}
            {selectedDate && (
              <div 
                className="bg-white rounded-2xl p-5"
                style={{ border: "1px solid var(--border-color)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Select Time</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="px-3 py-2 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor: isSelected ? "var(--premium-light)" : "var(--slate-bg)",
                          color: isSelected ? "var(--premium-gold)" : "var(--text-primary)",
                          border: "1px solid",
                          borderColor: isSelected ? "var(--premium-gold)" : "var(--border-color)"
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm */}
            {selectedDate && selectedTime && (
              <button
                onClick={handlePremiumBooking}
                className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--premium-gold)" }}
              >
                Confirm Booking - ₹100
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Free Flow
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      <div 
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl text-white mb-1">Free Booking</h1>
            <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>Select date</p>
          </div>
          <button
            onClick={() => setSelectedTier(null)}
            className="px-3 py-1 rounded-lg text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          >
            Back
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Date */}
          <div 
            className="bg-white rounded-2xl p-5"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Select Date</h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const dateStr = getDateString(date);
                const formatted = formatDate(date);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(dateStr)}
                    className="p-2 rounded-lg text-center"
                    style={{
                      backgroundColor: isSelected ? "var(--navy-blue)" : "var(--slate-bg)",
                      color: isSelected ? "white" : "var(--text-primary)",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--navy-blue)" : "var(--border-color)"
                    }}
                  >
                    <div className="text-xs opacity-75">{formatted.day}</div>
                    <div className="text-lg font-semibold">{formatted.date}</div>
                    <div className="text-xs opacity-75">{formatted.month}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          {selectedDate && (
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--slate-bg)", border: "1px solid var(--border-color)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                You will receive a token number after confirmation. Time slot is not reserved for free bookings.
              </p>
            </div>
          )}

          {/* Confirm */}
          {selectedDate && (
            <button
              onClick={handleFreeBooking}
              className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--navy-blue)" }}
            >
              Get Token Number - FREE
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
