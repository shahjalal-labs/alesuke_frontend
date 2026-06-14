'use client';

import Link from 'next/link';
import { useGetAllAssetsQuery } from '@/redux/api/assetsApi';
import { ReactNode } from 'react';
import { useGetWillDetailsQuery } from '@/redux/api/profileApi';

// Helper function to get icon based on asset type
function getAssetIcon(type: string): ReactNode {
    switch (type) {
        case 'BANK_ACCOUNT':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8L12 3L22 8L12 13L2 8Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 11V16M10 11V16M14 11V16M18 11V16" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 21H20" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 21V16H19V21" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'RETIREMENT_ACCOUNT':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8H9L12 2Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V16M8 22H16" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 8H6L7 18H17L18 8Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 11H15" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'INVESTMENT_ACCOUNT':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17V20H21V17" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 7L12 3L19 7L12 11L5 7Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12L12 16L19 12" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 9L12 10.5L15 9" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'INSURANCE_PLAN':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L3 7L12 11L21 7L12 3Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 10L5 14.5C5 17 8 19 12 19C16 19 19 17 19 14.5L19 10" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15L12 11" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 13L12 15L14 13" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'SAFE_DEPOSIT_BOX':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="10" width="18" height="11" rx="2" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 10V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V10" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14V17" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="17" r="0.5" fill="#8b7d73" stroke="#8b7d73" strokeWidth="1.5" />
                </svg>
            );
        case 'CRYPTO':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 8H14C15.1 8 16 8.9 16 10C16 11.1 15.1 12 14 12H9M9 8V12M9 8L8 6M9 12L8 14" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16H15C16.1 16 17 15.1 17 14C17 12.9 16.1 12 15 12H12V16Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16L13 18" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'BUSINESS_INTEREST':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="10" width="18" height="11" rx="2" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14V17" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="17" r="0.5" fill="#8b7d73" stroke="#8b7d73" strokeWidth="1.5" />
                </svg>
            );
        case 'PROPERTY':
        case 'REAL_ESTATE':
        case 'RESIDENTIAL':
        case 'COMMERCIAL':
        case 'LAND':
        case 'INDUSTRIAL':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 3L21 9V20H3V9Z" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 20V12H15V20" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6V12L16 14" stroke="#8b7d73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="0.5" fill="#8b7d73" stroke="#8b7d73" strokeWidth="1.5" />
                </svg>
            );
    }
}

// Helper to format currency
function formatCurrency(value?: number | null): string | null {
    if (value == null) return null;
    return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

// Helper to format date nicely
function formatDate(dateString?: string | null): string | null {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function AssetCard({ asset }: { asset: any }) {
    const typeLabel = getTypeLabel(asset.type);
    const Icon = getAssetIcon(asset.type);
    const hasTags = asset.isJointlyOwned || asset.isNominated || asset.isJointProperty;

    // Determine primary display title
    let title = '';
    if (asset.institutionName) title = asset.institutionName;
    else if (asset.accountNumber) title = asset.accountNumber;
    else if (asset.policyNumber) title = `Policy: ${asset.policyNumber}`;
    else if (asset.companyName) title = asset.companyName;
    else if (asset.streetAddress) title = asset.streetAddress;
    else if (asset.type === 'RESIDENTIAL') title = 'Residential Property';
    else if (asset.type === 'COMMERCIAL') title = 'Commercial Property';
    else if (asset.type === 'LAND') title = 'Land';
    else if (asset.type === 'INDUSTRIAL') title = 'Industrial Property';
    else title = typeLabel;

    // Secondary info line
    let secondaryInfo = '';
    if (asset.type === 'INSURANCE_PLAN') {
        if (asset.coverType) secondaryInfo = `Cover: ${asset.coverType.replace('_', ' ')}`;
        if (asset.maturityDate) secondaryInfo += ` • Matures: ${formatDate(asset.maturityDate)}`;
    } else if (asset.type === 'BANK_ACCOUNT' && asset.accountNumber) {
        secondaryInfo = `Account: ${asset.accountNumber}`;
    } else if (asset.type === 'INVESTMENT_ACCOUNT' && asset.companyName) {
        secondaryInfo = `Holding: ${asset.companyName}`;
    } else if (asset.type === 'RESIDENTIAL' || asset.type === 'COMMERCIAL' || asset.type === 'LAND' || asset.type === 'INDUSTRIAL') {
        if (asset.unitNumber) secondaryInfo = `Unit: ${asset.unitNumber}`;
        if (asset.postcode) secondaryInfo += ` • Postcode: ${asset.postcode}`;
        if (asset.country) secondaryInfo += ` • ${asset.country}`;
    }

    // Get the value to display (approximateValue for financial, estimatedValue for properties)
    const displayValue = asset.approximateValue ?? asset.estimatedValue ?? asset.faceValue;

    return (
        <div className="group rounded-xl border border-[#ece8e2] bg-white p-5 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5f3f0] transition-colors group-hover:bg-[#e8e4df]">
                    {Icon}
                </div>
                <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-[#b0a69b]">{typeLabel}</span>
                            <h4 className="mt-0.5 text-lg font-semibold text-[#1a1a1a]">{title}</h4>
                        </div>
                        {displayValue != null && (
                            <div className="text-right">
                                <span className="text-sm text-[#8b7d73]">Estimated Value</span>
                                <p className="text-xl font-bold text-[#192233]">{formatCurrency(displayValue)}</p>
                            </div>
                        )}
                    </div>
                    {secondaryInfo && <p className="mt-1 text-sm text-[#8b7d73]">{secondaryInfo}</p>}
                    {asset.description && <p className="mt-2 text-sm text-[#5b6b72]">{asset.description}</p>}
                    {hasTags && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {asset.isJointlyOwned && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f9] px-3 py-1 text-xs text-[#5b6b72]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Jointly owned
                                </span>
                            )}
                            {asset.isNominated && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f5ee] px-3 py-1 text-xs text-[#b08a5d]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L15 8H9L12 2Z" />
                                        <path d="M12 22V16M8 22H16" />
                                        <path d="M18 8H6L7 18H17L18 8Z" />
                                    </svg>
                                    Nominated
                                </span>
                            )}
                            {asset.isJointProperty && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f9] px-3 py-1 text-xs text-[#5b6b72]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Joint Property
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getTypeLabel(type?: string): string {
    switch (type) {
        case 'BANK_ACCOUNT':
            return 'Bank Account';
        case 'RETIREMENT_ACCOUNT':
            return 'Retirement Account';
        case 'INVESTMENT_ACCOUNT':
            return 'Investment Account';
        case 'INSURANCE_PLAN':
            return 'Insurance Plan';
        case 'SAFE_DEPOSIT_BOX':
            return 'Safe Deposit Box';
        case 'CRYPTO':
            return 'Cryptocurrency';
        case 'BUSINESS_INTEREST':
            return 'Business Interest';
        case 'PROPERTY':
        case 'REAL_ESTATE':
            return 'Property';
        case 'RESIDENTIAL':
            return 'Residential Property';
        case 'COMMERCIAL':
            return 'Commercial Property';
        case 'LAND':
            return 'Land';
        case 'INDUSTRIAL':
            return 'Industrial Property';
        default:
            return type?.replace('_', ' ') ?? 'Asset';
    }
}

export default function AssetVault() {
    const { data, isLoading, isFetching, error } = useGetAllAssetsQuery(undefined);
    const { data: willDetails } = useGetWillDetailsQuery(undefined);
    const assets = data?.data ?? [];

    // Get properties from will details if available
    const willProperties = willDetails?.data?.assets?.properties ?? [];
    
    // Combine assets from both sources for properties
    const allProperties = [
        ...assets.filter((a: any) => ['PROPERTY', 'REAL_ESTATE'].includes(a.type)),
        ...willProperties
    ];

    // Separate assets by category
    const financeAssets = assets.filter((a: any) => !['PROPERTY', 'REAL_ESTATE'].includes(a.type));
    const propertyAssets = allProperties;

    const Section = ({ title, description, assets, emptyMessage }: { title: string; description: string; assets: any[]; emptyMessage: string }) => (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all">
            <div className="border-b border-[#ece8e2] bg-white px-8 py-6">
                <h3 className="text-2xl font-semibold text-[#192233]">{title}</h3>
                <p className="mt-1 text-base text-[#8b7d73]">{description}</p>
            </div>
            <div className="p-8">
                {isLoading || isFetching ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#192233] border-t-transparent"></div>
                        <span className="ml-3 text-[#8b7d73]">Loading assets...</span>
                    </div>
                ) : assets.length ? (
                    <div className="space-y-4">
                        {assets.map((asset: any, index: number) => (
                            <AssetCard key={asset.id || index} asset={asset} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-[#ece8e2] bg-[#fafaf8] py-16 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0efed]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b7d73" strokeWidth="1.5">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="text-[#8b7d73]">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );

    if (error) {
        return (
            <section className="w-full px-8 py-8">
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                    <p className="text-red-600">Unable to load assets. Please try again later.</p>
                </div>
            </section>
        );
    }

    // Calculate totals from summary if available
    const summary = willDetails?.data?.summary;
    const totalPropertiesValue = summary?.totalProperties ?? propertyAssets.reduce((sum: number, p: any) => sum + (p.estimatedValue || 0), 0);
    const totalFinancialValue = summary?.totalFinancial ?? financeAssets.reduce((sum: number, f: any) => sum + (f.approximateValue || f.faceValue || 0), 0);
    const netWorth = summary?.netWorth ?? (totalFinancialValue + totalPropertiesValue);

    return (
        <section className="w-full px-8 py-8">
            <div className="mb-12">
                <h1 className="mb-3 text-6xl font-semibold italic tracking-tight text-[#192233]">Asset Vault</h1>
                <p className="text-xl text-[#8b7d73]">All your assets, organised in one place.</p>
            </div>

            {/* Summary Cards */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-br from-[#192233] to-[#2a3a5c] p-6 text-white shadow-lg">
                    <p className="text-sm font-medium uppercase tracking-wide text-white/70">Total Financial Assets</p>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(totalFinancialValue)}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#2d5a4c] to-[#3d7a66] p-6 text-white shadow-lg">
                    <p className="text-sm font-medium uppercase tracking-wide text-white/70">Total Properties Value</p>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(totalPropertiesValue)}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#8b5d3c] to-[#b07d5a] p-6 text-white shadow-lg">
                    <p className="text-sm font-medium uppercase tracking-wide text-white/70">Net Worth</p>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(netWorth)}</p>
                </div>
            </div>

            <div className="space-y-10">
                <Section
                    title="Finances"
                    description="Cash accounts, savings, investments, insurance plans, and retirement accounts."
                    assets={financeAssets}
                    emptyMessage="No financial assets added yet."
                />

                <Section
                    title="Properties & Real Estate"
                    description="Land, residential, commercial properties, and other real estate holdings."
                    assets={propertyAssets}
                    emptyMessage="No properties added yet."
                />
            </div>
        </section>
    );
}