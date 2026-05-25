"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MapPin, House, Building2, FileText, ChevronDown, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import FamilyFlowShell from "./FamilyFlowShell";
import { toast } from "sonner";
import { useAddAddressMutation } from "@/redux/api/profileApi";
import * as z from "zod";
import CompletionScreen from "@/components/dashboard/shared/CompletionScreen";

const countryOptions = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "Åland Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "JP", name: "Japan" },
  { code: "MY", name: "Malaysia" },
  { code: "MM", name: "Myanmar" },
  { code: "NP", name: "Nepal" },
  { code: "NZ", name: "New Zealand" },
  { code: "PK", name: "Pakistan" },
  { code: "PH", name: "Philippines" },
  { code: "SG", name: "Singapore" },
  { code: "LK", name: "Sri Lanka" },
  { code: "TH", name: "Thailand" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
].sort((left, right) => left.name.localeCompare(right.name));

const residentialAddressSchema = z.object({
  country: z.string().min(2, 'Country is required'),
  streetAddress: z.string().min(2, 'Street address is required'),
  unitNumber: z.string().optional(),
  postCode: z.string().min(2, 'Post code is required'),
});

function InputRow({
  label,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#6a707c]">{label}</label>
      <div className="flex h-[46px] items-center rounded-[6px] bg-[#f4f5f7] px-3 text-[#223048] md:h-[56px] md:px-4">
        <div className="flex items-center gap-3">
          <span>{icon}</span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-[0.95rem] outline-none placeholder:text-[#8993a3]"
          />
        </div>
      </div>
    </div>
  );
}

export default function YourResidentialStep() {
  const [completed, setCompleted] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryOptions.find((country) => country.code === 'SG') ?? countryOptions[0]);
  const [streetAddress, setStreetAddress] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [postCode, setPostCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ streetAddress?: string; postCode?: string }>({});

  const [addAddress] = useAddAddressMutation();

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    if (!query) return countryOptions;
    return countryOptions.filter((country) => `${country.code} ${country.name}`.toLowerCase().includes(query));
  }, [countryQuery]);

  const handleSave = async () => {
    const validation = residentialAddressSchema.safeParse({
      country: selectedCountry.name,
      streetAddress,
      unitNumber,
      postCode,
    });

    if (!validation.success) {
      const nextErrors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        streetAddress: nextErrors.streetAddress?.[0],
        postCode: nextErrors.postCode?.[0],
      });

      toast.error('Please fill in the required address fields.');
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await addAddress({
        country: selectedCountry.name,
        streetAddress,
        unitNumber,
        postCode,
      }).unwrap();
      toast.success('Address saved successfully.');
      setCompleted(true);
    } catch (error) {
      console.error(error);
      toast.error('Unable to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return <CompletionScreen />;
  }

  return (
    <div className="relative">
      {countryOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default bg-transparent"
          aria-label="Close country dropdown"
          onClick={() => setCountryOpen(false)}
        />
      ) : null}

      <FamilyFlowShell
        step={4}
        title="Your residential address"
        subtitle="Your current address"
        nextHref={undefined}
        nextLabel={submitting ? 'Saving...' : 'Save & Continue'}
        onNext={handleSave}
        optionsBlock={
          <div className="space-y-4 rounded-[8px] bg-[#eee7de] p-4 md:space-y-5 md:p-6">
            <div className="relative">
              <label className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#6a707c]">Country</label>
              <button
                type="button"
                onClick={() => setCountryOpen((current) => !current)}
                className="flex h-[46px] w-full items-center justify-between rounded-[6px] border border-[#69c9df] bg-white px-3 text-left text-[#223048] md:h-[56px] md:px-4"
              >
                <span className="flex items-center gap-2 text-[0.95rem] text-[#8993a3]">
                  <MapPin className="h-4 w-4 text-[#8993a3]" />
                  <span>{selectedCountry.code} {selectedCountry.name}</span>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
              </button>

              {countryOpen ? (
                <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-[4px] border border-[#e8e8e8] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-2 border-b border-[#ececec] px-3 py-2">
                    <Search className="h-4 w-4 text-[#8a93a3]" />
                    <input
                      value={countryQuery}
                      onChange={(event) => setCountryQuery(event.target.value)}
                      placeholder="Search country"
                      className="w-full bg-transparent text-[0.92rem] outline-none placeholder:text-[#9aa3b2]"
                    />
                    {countryQuery ? (
                      <button type="button" onClick={() => setCountryQuery('')} className="text-[#8a93a3]">
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  <div className="max-h-[220px] overflow-y-auto">
                    {filteredCountries.map((country) => {
                      const active = country.code === selectedCountry.code;
                      return (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountryOpen(false);
                            setCountryQuery('');
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[0.95rem] transition-colors ${active ? 'bg-[#eefdfd] font-semibold text-[#223048]' : 'text-[#223048] hover:bg-[#f6f7f9]'}`}
                        >
                          <span className="w-8 text-[0.78rem] uppercase tracking-[0.08em] text-[#7b8593]">{country.code}</span>
                          <span>{country.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <InputRow
              label="Street Address"
              placeholder="222"
              icon={<House className="h-4 w-4" />}
              value={streetAddress}
              onChange={setStreetAddress}
            />
            {fieldErrors.streetAddress ? <p className="-mt-2 text-[0.78rem] text-[#d0454c]">{fieldErrors.streetAddress}</p> : null}
            <InputRow
              label="Unit Number"
              placeholder="222333"
              icon={<Building2 className="h-4 w-4" />}
              value={unitNumber}
              onChange={setUnitNumber}
            />
            <InputRow
              label="Postal Code"
              placeholder="44"
              icon={<FileText className="h-4 w-4" />}
              value={postCode}
              onChange={setPostCode}
            />
            {fieldErrors.postCode ? <p className="-mt-2 text-[0.78rem] text-[#d0454c]">{fieldErrors.postCode}</p> : null}
          </div>
        }
        prevHref="/will/you-and-your-family/your-pets"
      />
    </div>
  );
}
