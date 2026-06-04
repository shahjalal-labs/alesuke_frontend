import { useGetDigitalAssetsQuery } from '@/redux/api/assetsApi';
import { useGetMeDataQuery } from '@/redux/api/authApi';
import React from 'react';

function DigitalAssetPdfPreview() {
  const { data: getMeUserData } = useGetMeDataQuery(undefined);
  const { data: digitalAssets } = useGetDigitalAssetsQuery(undefined);
  
  const userData = getMeUserData?.data;
  const assetsData = digitalAssets?.data;

  // Helper function to check if any asset is selected in a category
  const hasAnyAsset = (assets: string[]) => {
    if (!assetsData) return false;
    return assets.some(asset => assetsData[asset] === true);
  };

  // Get selected platforms for display
  const getSelectedPlatforms = (platforms: { key: string; name: string }[]) => {
    if (!assetsData) return [];
    return platforms
      .filter(platform => assetsData[platform.key] === true)
      .map(platform => platform.name);
  };

  const videoStreamingPlatforms = [
    { key: 'hasNetflix', name: 'Netflix' },
    { key: 'hasDisneyPlus', name: 'Disney+' },
    { key: 'hasPrimeVideo', name: 'Prime Video' },
    { key: 'hasViu', name: 'Viu' },
    { key: 'hasAppleTVPlus', name: 'Apple TV+' },
  ];

  const musicPlatforms = [
    { key: 'hasSpotify', name: 'Spotify' },
    { key: 'hasYouTubePremium', name: 'YouTube Premium' },
    { key: 'hasAudible', name: 'Audible' },
  ];

  const cloudPlatforms = [
    { key: 'hasICloud', name: 'iCloud' },
    { key: 'hasGoogleDrive', name: 'Google Drive' },
    { key: 'hasOneDrive', name: 'OneDrive' },
  ];

  const foodPlatforms = [
    { key: 'hasGrab', name: 'Grab' },
    { key: 'hasFoodpanda', name: 'Foodpanda' },
  ];

  const selectedVideoStreaming = getSelectedPlatforms(videoStreamingPlatforms);
  const selectedMusic = getSelectedPlatforms(musicPlatforms);
  const selectedCloud = getSelectedPlatforms(cloudPlatforms);
  const selectedFood = getSelectedPlatforms(foodPlatforms);
  const hasBrokerage = assetsData?.hasBrokerageETF === true;

  return (
   <div className="rounded-[28px] border border-[#e4d8cb] bg-[#efe7db] p-4 shadow-[0_20px_50px_rgba(17,24,39,0.06)]">
     <div className="max-w-4xl mx-auto bg-white shadow-lg my-8">
      {/* Main Container */}
      <div className="p-8 md:p-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Digital Asset Memorandum
          </h1>
        </div>

        {/* 1. Appointment of Digital Representative */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300 mb-4 pb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              1. Appointment of Digital Representative
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            I, <span className="font-medium">{userData?.fullName || '[Full Name]'}</span>, 
            NRIC/Passport No: <span className="font-medium">{userData?.addresses?.[0]?.postCode || '[NRIC/Passport No]'}</span>, 
            hereby authorize my appointed Executor(s) as named in my Will (my &quot;Digital Representative&quot;) 
            to access, manage, and close the accounts listed herein.
          </p>
        </div>

        {/* 2. Media & Entertainment Subscriptions */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300 mb-4 pb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              2. Media & Entertainment Subscriptions
            </h2>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Platform Examples
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Mandate for Executor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                  Video Streaming
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {selectedVideoStreaming.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedVideoStreaming.map(platform => (
                        <li key={platform}>{platform}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None selected</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  Cancel billing immediately; terminate account.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                  Music &amp; Audio
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {selectedMusic.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedMusic.map(platform => (
                        <li key={platform}>{platform}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None selected</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  Cancel premium tiers; delete profile data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Cloud Storage & Digital Records */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300 mb-4 pb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              3. Cloud Storage &amp; Digital Records
            </h2>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Service
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Identifier (Email/ID)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Mandate for Executor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                  Cloud / Drive
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {selectedCloud.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedCloud.map(platform => (
                        <li key={platform}>{platform}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None selected</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  Download personal photos/documents for heirs, then wipe data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Lifestyle & Financial Utilities */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300 mb-4 pb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              4. Lifestyle &amp; Financial Utilities
            </h2>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  App Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Specific Platforms
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Mandate for Executor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                  Logistics / Food
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {selectedFood.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedFood.map(platform => (
                        <li key={platform}>{platform}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None selected</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  Withdraw/liquidate wallet credits; close account.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                  Investment / Trade
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {hasBrokerage ? (
                    <div>
                      <span>Brokerage/ETF Platforms</span>
                      {assetsData?.brokerageDetails && (
                        <div className="text-sm text-gray-500 mt-1">
                          Details: {assetsData.brokerageDetails}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">None selected</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  Close open positions (e.g. Options); liquidate and transfer to Estate Account.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Formal Authorization Statement */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300 mb-4 pb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              5. Formal Authorization Statement
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            To any Service Provider, Custodian, or Data Controller: I hereby waive any &quot;Non-Transferability&quot; 
            or &quot;Right of Survivorship&quot; clauses in your Terms of Service in favor of my Estate. 
            I direct you to provide my Digital Representative with access to my data for the limited 
            purpose of settling my affairs, as permitted under the fiduciary duties of an Executor.
          </p>
          
          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-gray-700 mb-2">Signature of Testator</p>
              <div className="border-b border-gray-400 w-full mt-6 mb-1"></div>
              <p className="text-sm text-gray-500 mt-1">Date: _______________</p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">Signature of Witness</p>
              <div className="border-b border-gray-400 w-full mt-6 mb-1"></div>
              <p className="text-sm text-gray-500 mt-1">Name: _______________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
          Digital Asset Memorandum - Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
   </div>
  );
}

export default DigitalAssetPdfPreview;