import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNotifications } from "../context/NotificationContext";
import "./Setting.css";

function Setting() {
  const apiBaseUrl = "https://localhost:5030";
  const roleOptions = ["User", "Student", "Business"];
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState({ name: "", email: "", role: "User" });
  const [initialForm, setInitialForm] = useState({ name: "", email: "", role: "User" });
  const [firstLoginAt, setFirstLoginAt] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("https://localhost:5030/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const profile = {
          name: data?.name || "",
          email: data?.email || "",
          role: data?.role || "User",
        };

        setForm(profile);
        setInitialForm(profile);
        setFirstLoginAt(data?.firstLoginAt || data?.createdAt || "");
        setProfileImageUrl(data?.profileImageUrl || "");
        localStorage.setItem("userName", profile.name || "User");
        localStorage.setItem("userRole", profile.role || "User");
        if (data?.profileImageUrl) {
          localStorage.setItem("userImage", data.profileImageUrl);
        }
      } catch (loadError) {
        const message = loadError.response?.data || "Unable to load your profile";
        setError(message);

        if (loadError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const hasChanges = useMemo(() => {
    return (
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.role !== initialForm.role
    );
  }, [form, initialForm]);

  const resolvedImageUrl = useMemo(() => {
    if (!profileImageUrl) {
      return "https://ui-avatars.com/api/?name=User&background=E2E8F0&color=334155";
    }

    if (profileImageUrl.startsWith("/profile-images/")) {
      const fileName = profileImageUrl.split("/").pop();
      return `${apiBaseUrl}/api/auth/profile-image/${fileName}`;
    }

    if (profileImageUrl.startsWith("http://") || profileImageUrl.startsWith("https://")) {
      return profileImageUrl;
    }

    return `${apiBaseUrl}${profileImageUrl}`;
  }, [apiBaseUrl, profileImageUrl]);

  const handleInputChange = (event) => {
    setError("");
    setSuccess("");
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        "https://localhost:5030/api/auth/profile",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const nextToken = response.data?.token;
      if (nextToken) {
        localStorage.setItem("token", nextToken);
      }

      const updatedName = response.data?.user?.name || form.name.trim();
      localStorage.setItem("userName", updatedName);

      const updatedForm = {
        name: updatedName,
        email: response.data?.user?.email || form.email.trim(),
        role: response.data?.user?.role || form.role,
      };

      setForm(updatedForm);
      setInitialForm(updatedForm);
      localStorage.setItem("userRole", updatedForm.role);
      const successMessage = response.data?.message || "Profile updated successfully";
      setSuccess(successMessage);
      addNotification({
        title: "Profile updated",
        message: "Your name, email, or role details were updated successfully.",
        type: "success",
      });
    } catch (saveError) {
      const message = saveError.response?.data || "Unable to save profile changes";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("https://localhost:5030/api/auth/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const nextImage = response.data?.profileImageUrl || "";
      setProfileImageUrl(nextImage);
      if (nextImage) {
        localStorage.setItem("userImage", nextImage);
      }

      const successMessage = response.data?.message || "Profile image uploaded successfully";
      setSuccess(successMessage);
      addNotification({
        title: "Profile photo updated",
        message: "Your display picture has been updated successfully.",
        type: "success",
      });
    } catch (uploadError) {
      const message = uploadError.response?.data || "Unable to upload profile image";
      setError(message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const memberSince = firstLoginAt
    ? new Date(firstLoginAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

  return (
    <div className="settings-page flex h-screen bg-[#f5f7fb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="settings-content min-h-screen overflow-y-auto bg-[#f5f7fb] p-4 pb-24 sm:p-6 sm:pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="settings-profile-head mb-6">
              <img src={resolvedImageUrl} alt="Profile" className="settings-profile-avatar" />
              <div>
                <h3 className="settings-profile-name">{form.name || "User"}</h3>
                <p className="settings-profile-sub">Manage your profile photo and personal details</p>
                <label className="settings-upload-btn mt-3 inline-flex cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadingImage ? "Uploading..." : "Upload Profile Image"}
                </label>
              </div>
            </div>

            <div className="settings-meta-grid mb-6">
              <div className="settings-meta-card">
                <p className="settings-meta-label">Account Type</p>
                <p className="settings-meta-value">{form.role}</p>
              </div>
              <div className="settings-meta-card">
                <p className="settings-meta-label">Member Since</p>
                <p className="settings-meta-value">{memberSince}</p>
              </div>
              <div className="settings-meta-card">
                <p className="settings-meta-label">Profile Status</p>
                <p className="settings-meta-value">Active</p>
              </div>
            </div>

            <div className="settings-card bg-white p-6 sm:p-8">
              <div className="mb-6 settings-card-head">
                <h2 className="text-2xl font-bold text-[#1a1516]">Account Settings</h2>
                <p className="mt-1 text-sm text-[#8f8583]">
                  Update your personal details used across SmartSpend.
                </p>
              </div>

              {loading ? (
                <div className="py-10 text-sm text-[#8f8583]">Loading your profile...</div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5">
                  {error && (
                    <div className="settings-alert error rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="settings-alert success rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="settings-label mb-2 block text-sm font-medium" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange}
                        className="settings-input w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="settings-label mb-2 block text-sm font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className="settings-input w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="settings-label mb-2 block text-sm font-medium">Role</label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleInputChange}
                        className="settings-input w-full rounded-lg border px-3 py-2.5 text-sm"
                      >
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="settings-label mb-2 block text-sm font-medium">Member Since</label>
                      <input
                        type="text"
                        value={memberSince}
                        readOnly
                        className="settings-input muted w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!hasChanges || saving}
                      className="settings-save-btn rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
