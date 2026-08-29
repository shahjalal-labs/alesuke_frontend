"use client";

import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "sonner";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Crown,
    Calendar,
    Edit3,
    X,
    Camera,
    Heart,
    BookOpen,
    Loader2,
    CheckCircle2,
    CreditCard,
    IdCard,
} from "lucide-react";

import { useGetMeDataQuery, useLazyGetMeDataQuery } from "@/redux/api/authApi";
import { useUpdateProfileMutation, useUpdateAddressMutation, useAddAddressMutation } from "@/redux/api/profileApi";
import { setUser } from "@/redux/ReduxFunction";
import type { RootState } from "@/redux/store";

type ReligionValue = "CHRISTIAN" | "BUDDHIST" | "HINDU" | "JUDAISM" | "SIKH" | "TAOISM" | "OTHER";
type MaritalStatusValue = "MARRIED" | "SINGLE";

const religionOptions: Array<{ value: ReligionValue; label: string }> = [
    { value: "CHRISTIAN", label: "Christian" },
    { value: "BUDDHIST", label: "Buddhist" },
    { value: "HINDU", label: "Hindu" },
    { value: "JUDAISM", label: "Judaism" },
    { value: "SIKH", label: "Sikh" },
    { value: "TAOISM", label: "Taoism" },
    { value: "OTHER", label: "Other" },
];

const maritalStatusOptions: Array<{ value: MaritalStatusValue; label: string }> = [
    { value: "SINGLE", label: "Single" },
    { value: "MARRIED", label: "Married" },
];

function formatReligion(value: string | null | undefined): string {
    if (!value) return "Not set";
    const match = religionOptions.find((opt) => opt.value === value);
    return match ? match.label : value.charAt(0) + value.slice(1).toLowerCase();
}

function formatMaritalStatus(value: string | null | undefined): string {
    if (!value) return "Not set";
    const match = maritalStatusOptions.find((opt) => opt.value === value);
    return match ? match.label : value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-SG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function MyProfile() {
    const { data: meResponse, isLoading, isError } = useGetMeDataQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [fetchMeData] = useLazyGetMeDataQuery();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const [updateAddress] = useUpdateAddressMutation();
    const [addAddress] = useAddAddressMutation();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editNickname, setEditNickname] = useState("");
    const [editReligion, setEditReligion] = useState<ReligionValue>("OTHER");
    const [editMaritalStatus, setEditMaritalStatus] = useState<MaritalStatusValue>("SINGLE");
    const [editNric, setEditNric] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editStreetAddress, setEditStreetAddress] = useState("");
    const [editUnitNumber, setEditUnitNumber] = useState("");
    const [editPostCode, setEditPostCode] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const profileData = meResponse?.data;

    const initials = useMemo(() => {
        const parts = (profileData?.fullName || "").trim().split(/\s+/).filter(Boolean);
        return (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
    }, [profileData?.fullName]);

    const openEditModal = () => {
        if (!profileData) return;
        setEditFullName(profileData.fullName || "");
        setEditNickname(profileData.nickname || "");
        setEditReligion((profileData.religion as ReligionValue) || "OTHER");
        setEditMaritalStatus((profileData.maritalStatus as MaritalStatusValue) || "SINGLE");
        setEditNric(profileData.nid || "");
        setEditPhone(profileData.phoneNumber || "");
        const addr = profileData.addresses?.[0];
        setEditCountry(addr?.country || "");
        setEditStreetAddress(addr?.streetAddress || "");
        setEditUnitNumber(addr?.unitNumber || "");
        setEditPostCode(addr?.postCode || "");
        setPreviewImage(profileData.profileImage || null);
        setSelectedFile(null);
        setIsEditModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        const formData = new FormData();
        formData.append(
            "data",
            JSON.stringify({
                fullName: editFullName.trim(),
                nickname: editNickname.trim(),
                religion: editReligion,
                maritalStatus: editMaritalStatus,
                nid: editNric.trim(),
                phoneNumber: editPhone.trim(),
            })
        );

        if (selectedFile) {
            formData.append("profileImage", selectedFile);
        }

        try {
            await updateProfile(formData).unwrap();

            // Update or add address
            const addressPayload = {
                country: editCountry.trim(),
                streetAddress: editStreetAddress.trim(),
                unitNumber: editUnitNumber.trim(),
                postCode: editPostCode.trim(),
            };

            const existingAddress = profileData?.addresses?.[0];
            if (existingAddress?.id) {
                await updateAddress({ id: existingAddress.id, address: addressPayload }).unwrap();
            } else if (addressPayload.country || addressPayload.streetAddress) {
                await addAddress(addressPayload).unwrap();
            }

            const meResponse = await fetchMeData(undefined).unwrap();
            dispatch(
                setUser({
                    role: auth.role,
                    token: auth.token,
                    email: auth.email,
                    me: meResponse?.data ?? auth.me,
                })
            );
            toast.success("Profile updated successfully.");
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("Unable to update profile. Please try again.");
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#192233]" />
                    <p className="text-[1rem] text-[#8b7d73]">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !profileData) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <X className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-[1.1rem] font-medium text-[#192233]">Failed to load profile</p>
                    <p className="text-[0.95rem] text-[#8b7d73]">Please try again later.</p>
                </div>
            </div>
        );
    }

    const address = profileData.addresses?.[0];
    const subscriptionActive =
        profileData.subscriptionExpiresAt && new Date(profileData.subscriptionExpiresAt) > new Date();

    return (
        <div className="relative min-h-screen bg-[#FFF8F3] pb-16 pt-[92px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_48%)]" />

            <main className="relative mx-auto w-full max-w-[800px] px-5 sm:px-8">
                {/* ─── Profile Header Card ─── */}
                <div className="overflow-hidden rounded-[14px] border border-[#e8e4df] bg-white/80 shadow-[0_8px_32px_rgba(25,34,51,0.06)]">
                    <div className="relative h-[120px] bg-gradient-to-br from-[#192233] via-[#2a3a5c] to-[#3d506e]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                    </div>

                    <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
                        {/* Avatar */}
                        <div className="-mt-14 flex items-end justify-between">
                            <div className="relative">
                                {profileData.profileImage ? (
                                    <Image
                                        src={profileData.profileImage}
                                        alt={profileData.fullName}
                                        width={108}
                                        height={108}
                                        className="h-[108px] w-[108px] rounded-full border-4 border-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <span className="flex h-[108px] w-[108px] items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#192233] to-[#2a3a5c] text-[2.2rem] font-semibold text-white shadow-lg">
                                        {initials.toUpperCase()}
                                    </span>
                                )}
                                {profileData.isVerified && (
                                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={openEditModal}
                                className="mb-2 inline-flex items-center gap-2 rounded-[6px] bg-[#192233] px-4 py-2.5 text-[0.88rem] font-medium text-white shadow-[0_4px_12px_rgba(25,34,51,0.18)] transition-all hover:bg-[#111929] hover:shadow-[0_6px_18px_rgba(25,34,51,0.25)]"
                            >
                                <Edit3 className="h-4 w-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="mt-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#192233]">
                                    {profileData.fullName}
                                </h1>
                                {profileData.subscriptionTier && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-amber-700 shadow-sm">
                                        <Crown className="h-3 w-3" />
                                        {profileData.subscriptionTier}
                                    </span>
                                )}
                            </div>
                            {profileData.nickname && (
                                <p className="mt-1 text-[0.98rem] text-[#8b7d73]">@{profileData.nickname}</p>
                            )}
                            <p className="mt-1 text-[0.9rem] text-[#a9a29b]">
                                Member since {formatDate(profileData.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── Info Sections ─── */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Personal Information */}
                    <div className="rounded-[12px] border border-[#e8e4df] bg-white/80 p-5 shadow-[0_2px_12px_rgba(25,34,51,0.04)] sm:p-6">
                        <h2 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8b7d73]">
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <InfoRow
                                icon={<Mail className="h-[18px] w-[18px]" />}
                                label="Email"
                                value={profileData.email}
                            />
                            <InfoRow
                                icon={<Phone className="h-[18px] w-[18px]" />}
                                label="Phone"
                                value={profileData.phoneNumber || "Not provided"}
                            />
                            <InfoRow
                                icon={<IdCard className="h-[18px] w-[18px]" />}
                                label="NRIC"
                                value={profileData.nid || "Not provided"}
                            />
                            <InfoRow
                                icon={<BookOpen className="h-[18px] w-[18px]" />}
                                label="Religion"
                                value={formatReligion(profileData.religion)}
                            />
                            <InfoRow
                                icon={<Heart className="h-[18px] w-[18px]" />}
                                label="Marital Status"
                                value={formatMaritalStatus(profileData.maritalStatus)}
                            />
                        </div>
                    </div>

                    {/* Address & Account */}
                    <div className="flex flex-col gap-5">
                        {/* Address */}
                        <div className="rounded-[12px] border border-[#e8e4df] bg-white/80 p-5 shadow-[0_2px_12px_rgba(25,34,51,0.04)] sm:p-6">
                            <h2 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8b7d73]">
                                Address
                            </h2>
                            {address ? (
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={<MapPin className="h-[18px] w-[18px]" />}
                                        label="Street"
                                        value={address.streetAddress}
                                    />
                                    <InfoRow
                                        icon={<MapPin className="h-[18px] w-[18px]" />}
                                        label="Country"
                                        value={address.country}
                                    />
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <p className="text-[0.75rem] text-[#a9a29b]">Unit No.</p>
                                            <p className="mt-0.5 text-[0.92rem] font-medium text-[#192233]">
                                                {address.unitNumber || "—"}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[0.75rem] text-[#a9a29b]">Post Code</p>
                                            <p className="mt-0.5 text-[0.92rem] font-medium text-[#192233]">
                                                {address.postCode || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[0.92rem] text-[#a9a29b]">No address added yet.</p>
                            )}
                        </div>

                        {/* Subscription */}
                        <div className="rounded-[12px] border border-[#e8e4df] bg-white/80 p-5 shadow-[0_2px_12px_rgba(25,34,51,0.04)] sm:p-6">
                            <h2 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8b7d73]">
                                Subscription
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                            <Crown className="h-[18px] w-[18px]" />
                                        </span>
                                        <div>
                                            <p className="text-[0.92rem] font-medium text-[#192233]">
                                                {profileData.subscriptionTier || "Free"}
                                            </p>
                                            <p className="text-[0.78rem] text-[#a9a29b]">
                                                {profileData.subscriptionType || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${subscriptionActive
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-500"
                                            }`}
                                    >
                                        {subscriptionActive ? "Active" : "Expired"}
                                    </span>
                                </div>
                                {profileData.subscriptionExpiresAt && (
                                    <InfoRow
                                        icon={<Calendar className="h-[18px] w-[18px]" />}
                                        label="Expires"
                                        value={formatDate(profileData.subscriptionExpiresAt)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </main>

            {/* ─── Edit Profile Modal ─── */}
            {isEditModalOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 py-4 backdrop-blur-[2px]"
                    onClick={() => setIsEditModalOpen(false)}
                    role="presentation"
                >
                    <div
                        className="w-full max-w-[750px] overflow-hidden rounded-[14px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                        role="presentation"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#f0efed] px-6 py-5">
                            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-[#192233]">
                                Edit Profile
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8b7d73] transition-colors hover:bg-[#f5f3f0] hover:text-[#192233]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
                            {/* Profile Image Upload */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    {previewImage ? (
                                        <Image
                                            src={previewImage}
                                            alt="Profile preview"
                                            width={96}
                                            height={96}
                                            className="h-24 w-24 rounded-full border-2 border-[#e8e4df] object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#e8e4df] bg-gradient-to-br from-[#192233] to-[#2a3a5c] text-[1.6rem] font-semibold text-white">
                                            {initials.toUpperCase()}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#192233] text-white shadow-md transition-all hover:bg-[#111929]"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Full Name
                                    </label>
                                    <input
                                        value={editFullName}
                                        onChange={(e) => setEditFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Nickname */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Nickname
                                    </label>
                                    <input
                                        value={editNickname}
                                        onChange={(e) => setEditNickname(e.target.value)}
                                        placeholder="Enter your nickname"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Religion */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Religion
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={editReligion}
                                            onChange={(e) => setEditReligion(e.target.value as ReligionValue)}
                                            className="h-12 w-full appearance-none rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 pr-10 text-[0.95rem] text-[#192233] outline-none transition-all focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                        >
                                            {religionOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Marital Status */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Marital Status
                                    </label>
                                    <div className="flex gap-3">
                                        {maritalStatusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setEditMaritalStatus(opt.value)}
                                                className={`flex-1 rounded-[6px] border px-4 py-3 text-[0.92rem] font-medium transition-all ${editMaritalStatus === opt.value
                                                    ? "border-[#192233] bg-[#192233] text-white shadow-[0_4px_12px_rgba(25,34,51,0.18)]"
                                                    : "border-[#e8e4df] bg-[#fafaf8] text-[#5e6574] hover:border-[#c5bfb8] hover:bg-white"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="my-2 h-px bg-[#e8e4df]" />

                                {/* NRIC */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        NRIC
                                    </label>
                                    <input
                                        value={editNric}
                                        onChange={(e) => setEditNric(e.target.value)}
                                        placeholder="Enter your NRIC"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Phone Number
                                    </label>
                                    <input
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="my-2 h-px bg-[#e8e4df]" />

                                {/* Address Section Label */}
                                <p className="text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[#8b7d73]">
                                    Address
                                </p>

                                {/* Country */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Country
                                    </label>
                                    <input
                                        value={editCountry}
                                        onChange={(e) => setEditCountry(e.target.value)}
                                        placeholder="Enter your country"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Street Address */}
                                <div>
                                    <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                        Street Address
                                    </label>
                                    <input
                                        value={editStreetAddress}
                                        onChange={(e) => setEditStreetAddress(e.target.value)}
                                        placeholder="Enter your street address"
                                        className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                    />
                                </div>

                                {/* Unit Number & Post Code (side by side) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                            Unit Number
                                        </label>
                                        <input
                                            value={editUnitNumber}
                                            onChange={(e) => setEditUnitNumber(e.target.value)}
                                            placeholder="Unit no."
                                            className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[0.82rem] font-medium text-[#5e6574]">
                                            Post Code
                                        </label>
                                        <input
                                            value={editPostCode}
                                            onChange={(e) => setEditPostCode(e.target.value)}
                                            placeholder="Post code"
                                            className="h-12 w-full rounded-[6px] border border-[#e8e4df] bg-[#fafaf8] px-4 text-[0.95rem] text-[#192233] outline-none transition-all placeholder:text-[#b8b2ab] focus:border-[#192233] focus:bg-white focus:shadow-[0_0_0_3px_rgba(25,34,51,0.06)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-[#f0efed] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="rounded-[6px] border border-[#e8e4df] px-5 py-2.5 text-[0.9rem] font-medium text-[#5e6574] transition-all hover:bg-[#f5f3f0]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={isUpdating || !editFullName.trim()}
                                className={`inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-[0.9rem] font-medium text-white shadow-[0_4px_12px_rgba(25,34,51,0.18)] transition-all ${isUpdating || !editFullName.trim()
                                    ? "cursor-not-allowed bg-[#aeb3bc]"
                                    : "bg-[#192233] hover:bg-[#111929]"
                                    }`}
                            >
                                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Sub-components ─── */

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3f0] text-[#8b7d73]">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[0.75rem] text-[#a9a29b]">{label}</p>
                <p className="mt-0.5 truncate text-[0.92rem] font-medium text-[#192233]">{value}</p>
            </div>
        </div>
    );
}


