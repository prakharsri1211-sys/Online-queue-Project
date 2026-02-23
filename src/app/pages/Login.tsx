import { useState } from "react";
import { useNavigate } from "react-router";
import { Phone, Shield, CreditCard, ChevronRight } from "lucide-react";

type LoginStep = "phone" | "otp" | "captcha" | "adhar";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [error, setError] = useState("");

  const captchaQuestion = "7 + 5";
  const captchaCorrectAnswer = "12";

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phoneNumber.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      return;
    }
    setStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (index === 5 && value && newOtp.every(d => d)) {
      handleOtpSubmit(newOtp);
    }
  };

  const handleOtpSubmit = (otpArray = otp) => {
    setError("");
    const otpValue = otpArray.join("");
    if (otpValue.length !== 6) {
      setError("Enter complete 6-digit OTP");
      return;
    }
    setStep("captcha");
  };

  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (captchaAnswer !== captchaCorrectAnswer) {
      setError("Incorrect answer");
      return;
    }
    setStep("adhar");
  };

  const handleAdharSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (adharNumber.length !== 12) {
      setError("Enter valid 12-digit Adhar number");
      return;
    }
    
    const hasProfile = localStorage.getItem("patientProfile");
    if (hasProfile) {
      navigate("/booking");
    } else {
      navigate("/medical-profile");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div 
        className="px-6 py-8"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-white mb-2">MedClinic</h1>
          <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
            Enterprise Healthcare Management
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["phone", "otp", "captcha", "adhar"].map((s, i) => {
              const currentIndex = ["phone", "otp", "captcha", "adhar"].indexOf(step);
              const isActive = i === currentIndex;
              const isCompleted = i < currentIndex;
              
              return (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isCompleted ? "text-white" : isActive ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: isCompleted || isActive ? "var(--navy-blue)" : "var(--slate-lighter)",
                      color: isCompleted || isActive ? "white" : "var(--slate-gray)"
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  {i < 3 && (
                    <div 
                      className="w-8 h-0.5 mx-1"
                      style={{ backgroundColor: i < currentIndex ? "var(--navy-blue)" : "var(--slate-lighter)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <h2 className="text-xl mb-1" style={{ color: "var(--text-primary)" }}>Mobile Number</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Enter your registered mobile number
              </p>

              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--slate-gray)" }} />
                    <span className="absolute left-11 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }}>+91</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full pl-24 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ 
                        borderColor: error ? "var(--error-red)" : "var(--border-color)",
                        backgroundColor: "var(--clean-white)"
                      }}
                    />
                  </div>
                  {error && <p className="text-xs mt-1" style={{ color: "var(--error-red)" }}>{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--navy-blue)" }}
                >
                  Send OTP
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <h2 className="text-xl mb-1" style={{ color: "var(--text-primary)" }}>Verify OTP</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Enter 6-digit code sent to +91 {phoneNumber}
              </p>

              <div className="mb-6">
                <div className="flex gap-2 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: "var(--border-color)" }}
                    />
                  ))}
                </div>
                {error && <p className="text-xs text-center" style={{ color: "var(--error-red)" }}>{error}</p>}
              </div>

              <button
                onClick={() => handleOtpSubmit()}
                className="w-full py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: "var(--navy-blue)" }}
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Captcha Step */}
          {step === "captcha" && (
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <h2 className="text-xl mb-1" style={{ color: "var(--text-primary)" }}>Security Check</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Solve the problem below
              </p>

              <form onSubmit={handleCaptchaSubmit}>
                <div className="mb-6">
                  <div 
                    className="p-6 rounded-lg mb-4 text-center"
                    style={{ backgroundColor: "var(--slate-bg)", border: "1px solid var(--border-color)" }}
                  >
                    <p className="text-4xl font-medium" style={{ color: "var(--text-primary)" }}>
                      {captchaQuestion} = ?
                    </p>
                  </div>

                  <input
                    type="text"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1"
                    style={{ borderColor: error ? "var(--error-red)" : "var(--border-color)" }}
                  />
                  {error && <p className="text-xs mt-1" style={{ color: "var(--error-red)" }}>{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: "var(--navy-blue)" }}
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Adhar Step */}
          {step === "adhar" && (
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <h2 className="text-xl mb-1" style={{ color: "var(--text-primary)" }}>Adhar Verification</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Enter your 12-digit Adhar number (Backup ID)
              </p>

              <form onSubmit={handleAdharSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Adhar Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--slate-gray)" }} />
                    <input
                      type="text"
                      value={adharNumber}
                      onChange={(e) => setAdharNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="xxxx xxxx xxxx"
                      className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ 
                        borderColor: error ? "var(--error-red)" : "var(--border-color)",
                        backgroundColor: "var(--clean-white)"
                      }}
                    />
                  </div>
                  {error && <p className="text-xs mt-1" style={{ color: "var(--error-red)" }}>{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--navy-blue)" }}
                >
                  Complete Login
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Quick Access */}
          <div className="mt-8">
            <p className="text-center text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
              Demo Access
            </p>
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
    </div>
  );
}
