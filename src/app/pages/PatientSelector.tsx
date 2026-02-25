import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Plus, Users } from "lucide-react";

interface PatientForm {
  name: string;
  age: string;
  aadharOrAbhaId: string;
  identityType: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  aadharOrAbhaId: string;
}

interface Account {
  id: number;
  phoneNumber: string;
  patients: Patient[];
}

export default function PatientSelector() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | string>("");
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState<PatientForm>({
    name: "",
    age: "",
    aadharOrAbhaId: "",
    identityType: "AADHAR",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load account and existing patients on mount
  useEffect(() => {
    const accountData = sessionStorage.getItem("accountData");
    if (!accountData) {
      navigate("/");
      return;
    }

    const parsedAccount: Account = JSON.parse(accountData);
    setAccount(parsedAccount);
    setLoading(false);

    // Auto-select first patient if available
    if (parsedAccount.patients && parsedAccount.patients.length > 0) {
      setSelectedPatientId(parsedAccount.patients[0].id);
    }
  }, [navigate]);

  useEffect(() => {
    // force a soft wellness linear gradient on the body
    document.body.style.background = 'linear-gradient(to bottom, #F0FDFA, #E0F2F1)';
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // Validate Aadhar: 12 digits only
  const validateAadhar = (aadhar: string): boolean => {
    return /^\d{12}$/.test(aadhar.replace(/\s/g, ""));
  };

  // Handle new patient form submission
  const handleAddPatient = async () => {
    if (!newPatientForm.name || !newPatientForm.age || !newPatientForm.aadharOrAbhaId) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validateAadhar(newPatientForm.aadharOrAbhaId)) {
      setError("Aadhar must be exactly 12 digits");
      return;
    }

    if (!account) return;

    try {
      const newPatient = {
        name: newPatientForm.name,
        age: parseInt(newPatientForm.age),
        aadharOrAbhaId: newPatientForm.aadharOrAbhaId,
        identityType: newPatientForm.identityType,
      };

      // Call backend API to add patient to account
      const response = await fetch(`/api/accounts/${account.id}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      const addedPatient = await response.json();

      // Update account with new patient
      const updatedAccount = {
        ...account,
        patients: [...(account.patients || []), addedPatient],
      };
      setAccount(updatedAccount);
      sessionStorage.setItem("accountData", JSON.stringify(updatedAccount));

      // Select the new patient and hide form
      setSelectedPatientId(addedPatient.id);
      setShowNewPatientForm(false);
      setNewPatientForm({ name: "", age: "", aadharOrAbhaId: "", identityType: "AADHAR" });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding patient");
    }
  };

  // Handle proceed button
  const handleProceed = async () => {
    if (!selectedPatientId) {
      setError("Please select or add a patient");
      return;
    }

    const selectedPatient = account?.patients?.find(
      (p) => p.id === parseInt(selectedPatientId as string)
    );

    if (!selectedPatient) {
      setError("Selected patient not found");
      return;
    }

    // Store selected patient in session
    sessionStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));

    // Navigate to booking page
    navigate("/booking");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Loading patients...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Account information not found. Please log in again.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 patient-container" style={{ backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(13,148,136,0.08), transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.9), transparent 25%)' }}>
      <div className="max-w-md mx-auto pt-8">
        <div className="patient-card shadow-lg ring-4 ring-[#0D9488]/30" style={{ boxShadow: "0 20px 50px rgba(13,148,136,0.2)" }}>
          <div className="px-6 py-4" style={{ background: "linear-gradient(to right, #0D9488, #14B8A6)" }}>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Select Patient</h2>
            </div>
            <p className="text-sm text-emerald-100 mt-2">Account: {account.phoneNumber}</p>
          </div>
          <div className="px-6 py-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Section A: Book for Saved Patient */}
            {account.patients && account.patients.length > 0 && (
              <div className="mb-6">
                <Label className="text-lg font-semibold mb-3 block" style={{ color: "#0D9488" }}>
                  A: Book for Saved Patient
                </Label>
                <RadioGroup value={selectedPatientId.toString()} onValueChange={setSelectedPatientId}>
                  {account.patients.map((patient) => (
                    <div key={patient.id} className="flex items-center space-x-3 p-3 border rounded-lg mb-2 hover:bg-teal-50 cursor-pointer" style={{ borderColor: "#E2E8F0" }}>
                      <RadioGroupItem value={patient.id.toString()} id={`patient-${patient.id}`} />
                      <Label htmlFor={`patient-${patient.id}`} className="flex-1 cursor-pointer">
                        <div className="font-medium" style={{ color: "#0F172A" }}>{patient.name}</div>
                        <div className="text-sm" style={{ color: "#94A3B8" }}>
                          Age: {patient.age} | ID: {patient.aadharOrAbhaId}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Section B: Add New Patient */}
            <div className="border-t pt-6" style={{ borderColor: "#E2E8F0" }}>
              <Label className="text-lg font-semibold mb-3 block" style={{ color: "#0D9488" }}>
                B: Add New Patient
              </Label>

              {!showNewPatientForm ? (
                <Button
                  onClick={() => setShowNewPatientForm(true)}
                  variant="outline"
                  className="w-full rounded-full"
                  style={{
                    backgroundColor: account.patients && account.patients.length >= 5 ? "#F1F5F9" : "#0D9488",
                    color: account.patients && account.patients.length >= 5 ? "#94A3B8" : "white",
                    borderColor: "#E2E8F0",
                    boxShadow: "0 10px 30px rgba(13,148,136,0.2)"
                  }}
                  disabled={account.patients && account.patients.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {account.patients && account.patients.length >= 5 ? "Member limit reached" : "Add Family Member"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium" style={{ color: "#0F172A" }}>
                      Patient Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Ramesh Sharma"
                      value={newPatientForm.name}
                      onChange={(e) =>
                        setNewPatientForm({ ...newPatientForm, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-sm font-medium" style={{ color: "#0F172A" }}>
                      Age *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 45"
                      value={newPatientForm.age}
                      onChange={(e) =>
                        setNewPatientForm({ ...newPatientForm, age: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aadhar" className="text-sm font-medium" style={{ color: "#0F172A" }}>
                      Aadhar ID (12 digits) *
                    </Label>
                    <Input
                      id="aadhar"
                      type="text"
                      placeholder="e.g., 123456789012"
                      maxLength={12}
                      value={newPatientForm.aadharOrAbhaId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setNewPatientForm({
                          ...newPatientForm,
                          aadharOrAbhaId: val,
                        });
                      }}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="idType" className="text-sm font-medium" style={{ color: "#0F172A" }}>
                      ID Type
                    </Label>
                    <select
                      id="idType"
                      value={newPatientForm.identityType}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, identityType: e.target.value })}
                      className="w-full mt-1 p-2 border rounded"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <option value="AADHAR">Aadhar</option>
                      <option value="ABHA">ABHA</option>
                      <option value="AYUSHMAN">Ayushman</option>
                      <option value="HANDICAPPED">Handicapped Card</option>
                    </select>
                  </div>

                  <div className="text-xs p-3 rounded" style={{ backgroundColor: "#EEF2FF", color: "#94A3B8" }}>
                    <strong>Auto-assigned:</strong> Phone: {account.phoneNumber}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddPatient}
                      className="flex-1 text-white rounded-full"
                      style={{ backgroundColor: "#0D9488", boxShadow: "0 10px 30px rgba(13,148,136,0.2)" }}
                    >
                      Add Patient
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewPatientForm(false);
                        setNewPatientForm({ name: "", age: "", aadharOrAbhaId: "", identityType: "AADHAR" });
                      }}
                      variant="outline"
                      className="flex-1 rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button
                onClick={handleProceed}
                className="w-full text-white font-semibold py-3 rounded-full"
                style={{
                  backgroundColor: "#0D9488",
                  boxShadow: "0 10px 30px rgba(13, 148, 136, 0.2)",
                  letterSpacing: "0.5px"
                }}
              >
                Proceed with Selected Patient
              </Button>
              <Button
                onClick={() => {
                  sessionStorage.removeItem("accountData");
                  navigate("/");
                }}
                variant="outline"
                className="w-full rounded-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>

        {/* Family Account Info */}
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#EEF2FF", borderColor: "#C7D2FE", border: "1px solid #C7D2FE" }}>
          <p className="text-xs text-center" style={{ color: "#94A3B8" }}>
            Your account can manage up to <strong>5 family members</strong>. Each member has their own medical profile and appointment history.
          </p>
        </div>

        {/* Wellness Quote */}
        <div className="mt-4 p-6 rounded-lg" style={{ backgroundColor: "white", border: "2px solid #0D9488", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.15)" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0D9488" }}>Wellness Tip</p>
              <p className="text-xs mt-1 font-serif" style={{ color: "#475569" }}>
                "Your health is your wealth. Regular check-ups ensure you stay at your best. Book your appointment today!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
