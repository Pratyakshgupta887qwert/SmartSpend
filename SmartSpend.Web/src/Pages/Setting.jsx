import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Setting.css";

function Setting() {
	const apiBaseUrl = "https://localhost:5030";
	const roleOptions = ["User", "Student", "Business"];
	const navigate = useNavigate();
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
			setSuccess(response.data?.message || "Profile updated successfully");
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

			setSuccess(response.data?.message || "Profile image uploaded successfully");
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

				<div className="settings-content p-6 bg-[#f5f7fb] min-h-screen overflow-y-auto">
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

						<div className="settings-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
							<div className="mb-6 settings-card-head">
								<h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
								<p className="text-sm text-gray-500 mt-1">
									Update your personal details used across SmartSpend.
								</p>
							</div>

							{loading ? (
								<div className="text-sm text-gray-500 py-10">Loading your profile...</div>
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

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="settings-label block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
												Full Name
											</label>
											<input
												id="name"
												name="name"
												type="text"
												value={form.name}
												onChange={handleInputChange}
												className="settings-input w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
												placeholder="Enter your name"
												required
											/>
										</div>

										<div>
											<label className="settings-label block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
												Email Address
											</label>
											<input
												id="email"
												name="email"
												type="email"
												value={form.email}
												onChange={handleInputChange}
												className="settings-input w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
												placeholder="Enter your email"
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="settings-label block text-sm font-medium text-gray-700 mb-2">Role</label>
											<select
												name="role"
												value={form.role}
												onChange={handleInputChange}
												className="settings-input w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
											>
												{roleOptions.map((option) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="settings-label block text-sm font-medium text-gray-700 mb-2">Member Since</label>
											<input
												type="text"
												value={memberSince}
												readOnly
												className="settings-input muted w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
											/>
										</div>
									</div>

									<div className="pt-2 flex justify-end">
										<button
											type="submit"
											disabled={!hasChanges || saving}
											className="settings-save-btn px-5 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
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
