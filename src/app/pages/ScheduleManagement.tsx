import React, { useState, useEffect } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

interface Availability {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
}

export default function ScheduleManagement(): JSX.Element {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const colors = {
    bg: "#0B1120",
    cardBg: "#111827",
    text: "#E5E7EB",
    textMuted: "#9CA3AF",\n    textBright: "#FFFFFF",
    accent: "#3B82F6",
    danger: "#FB7185",
    success: "#10B981",
    warning: "#F59E0B",
    border: "rgba(59,130,246,0.1)",
  };

  useEffect(() => {
    document.body.style.backgroundColor = colors.bg;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [colors.bg]);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth]);

  const fetchAvailability = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // In a real app, you'd fetch for the specific month/doctor
      // For this prototype, we'll simulate fetching and use local storage
      const storedAvailability = localStorage.getItem("doctorAvailability");
      if (storedAvailability) {
        setAvailability(JSON.parse(storedAvailability));
      } else {
        // Simulate initial data: all days open for the current month
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const initialAvailability = eachDayOfInterval({ start, end }).map((day) => ({
          date: format(day, "yyyy-MM-dd"),
          isOpen: true,
        }));
        setAvailability(initialAvailability);
        localStorage.setItem("doctorAvailability", JSON.stringify(initialAvailability));
      }
      setMessage("Availability loaded.");
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setMessage("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // In a real app, you'd send this to the backend
      localStorage.setItem("doctorAvailability", JSON.stringify(availability));
      setMessage("Availability saved successfully!");
    } catch (error) {
      console.error("Failed to save availability:", error);
      setMessage("Failed to save availability.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleDayAvailability = (date: Date) => {
    setAvailability((prev) => {
      const dateString = format(date, "yyyy-MM-dd");
      const existingEntry = prev.find((entry) => entry.date === dateString);

      if (existingEntry) {
        return prev.map((entry) =>
          entry.date === dateString ? { ...entry, isOpen: !entry.isOpen } : entry
        );
      } else {
        return [...prev, { date: dateString, isOpen: false }];
      }
    });
  };

  const getDayAvailability = (date: Date): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return availability.find((entry) => entry.date === dateString)?.isOpen ?? false;
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        minHeight: "100vh",
        color: colors.text,
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Sticky Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: colors.cardBg,
          backdropFilter: "blur(10px)",
          padding: "15px 20px",
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/doctor/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: colors.textBright,
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LucideCalendar size={20} />
          <span style={{ fontWeight: 600 }}>Schedule Management</span>
        </button>
        <button
          onClick={saveAvailability}
          disabled={saving || loading}
          style={{
            backgroundColor: colors.accent,
            color: colors.textBright,
            padding: "8px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            opacity: saving || loading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto", paddingBottom: "100px" }}>
        {message && (
          <div style={{ backgroundColor: colors.accent, color: colors.textBright, padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
            {message}
          </div>
        )}

        {/* Calendar Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "10px 0",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <button onClick={handlePreviousMonth} style={{ background: "none", border: "none", color: colors.textBright, cursor: "pointer", fontSize: "24px" }}>
            <
          </button>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button onClick={handleNextMonth} style={{ background: "none", border: "none", color: colors.textBright, cursor: "pointer", fontSize: "24px" }}>
            >
          </button>
        </div>

        {/* Weekday Headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", marginBottom: "10px", textAlign: "center", fontWeight: 600, color: colors.textMuted }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 0", color: colors.textMuted }}>Loading calendar...</div>
          ) : (
            daysInMonth.map((day, index) => {
              const dayString = format(day, "d");
              const isDayOpen = getDayAvailability(day);
              const isDayToday = isToday(day);

              return (
                <button
                  key={index}
                  onClick={() => toggleDayAvailability(day)}
                  style={{
                    backgroundColor: isDayOpen ? colors.success : colors.cardBg,
                    color: isDayOpen ? colors.textBright : colors.text,
                    borderRadius: "8px",
                    padding: "15px 0",
                    aspectRatio: "1 / 1",
                    border: `1px solid ${isDayToday ? colors.accent : colors.border}`,
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s, border-color 0.2s",
                    opacity: isSameDay(day, new Date()) ? 1 : 0.8,
                  }}
                >
                  {dayString}
                  <span style={{ fontSize: "10px", fontWeight: 500, marginTop: "5px" }}>
                    {isDayOpen ? "Open" : "Closed"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
