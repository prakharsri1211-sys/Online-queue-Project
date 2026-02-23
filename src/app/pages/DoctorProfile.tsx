import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Stethoscope, MapPin, Phone, Accessibility, Store, ChevronLeft, Save } from "lucide-react";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Dr. Rajesh Mehta",
    speciality: "General Physician",
    qualification: "MBBS, MD",
    phone: "9876543210",
    clinicAddress: "Shop No. 12, Green Plaza, Mumbai - 400001",
    wheelchairAccess: true,
    pharmacyAttached: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("doctorProfile", JSON.stringify(formData));
    navigate("/doctor");
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div 
        className="px-6 py-6 sticky top-0 z-10"
        style={{ backgroundColor: "var(--navy-blue)" }}
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor")}
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl text-white mb-1">Doctor Setup</h1>
            <p className="text-sm" style={{ color: "var(--slate-lighter)" }}>
              Professional details
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Basic Information */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Basic Information
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: "var(--border-color)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Qualification *
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                  placeholder="e.g., MBBS, MD"
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: "var(--border-color)" }}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Professional Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Speciality *
                </label>
                <select
                  value={formData.speciality}
                  onChange={(e) => handleChange("speciality", e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <option value="">Select Speciality</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Neurologist">Neurologist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--slate-gray)" }} />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-secondary)" }}>+91</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    required
                    className="w-full pl-20 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: "var(--border-color)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Clinic Information
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Clinic Address *
              </label>
              <textarea
                value={formData.clinicAddress}
                onChange={(e) => handleChange("clinicAddress", e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                style={{ borderColor: "var(--border-color)" }}
              />
            </div>
          </div>

          {/* Facilities */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Accessibility className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Facilities Available
              </h3>
            </div>

            <div className="space-y-3">
              <label 
                className="flex items-center justify-between p-4 rounded-lg cursor-pointer"
                style={{ backgroundColor: "var(--slate-bg)" }}
              >
                <div className="flex items-center gap-3">
                  <Accessibility className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Wheelchair Access
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Clinic is wheelchair accessible
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.wheelchairAccess}
                    onChange={(e) => handleChange("wheelchairAccess", e.target.checked)}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: "var(--navy-blue)" }}
                  />
                </div>
              </label>

              <label 
                className="flex items-center justify-between p-4 rounded-lg cursor-pointer"
                style={{ backgroundColor: "var(--slate-bg)" }}
              >
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5" style={{ color: "var(--navy-blue)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Pharmacy Attached
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      On-site pharmacy available
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.pharmacyAttached}
                    onChange={(e) => handleChange("pharmacyAttached", e.target.checked)}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: "var(--navy-blue)" }}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>

          <button
            type="button"
            onClick={() => navigate("/doctor")}
            className="w-full py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--clean-white)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
