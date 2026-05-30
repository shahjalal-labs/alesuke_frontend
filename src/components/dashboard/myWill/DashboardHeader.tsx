"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { useGetMeDataQuery } from "@/redux/api/authApi";

type Props = {
  timeZone?: string; // optional IANA timezone string e.g. 'Asia/Dhaka'
};

function formatTime(date: Date, timeZone?: string) {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
  };

  const time = new Intl.DateTimeFormat(undefined, opts).format(date);
  return time.replace(":", " : ");
}

function getOrdinal(day: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = day % 100;

  return `${day}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

function formatDate(date: Date, timeZone?: string) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone }).format(date);
  const dayNum = Number(new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone }).format(date));
  const day = getOrdinal(dayNum);

  return `${weekday}, ${month} ${day}`;
}

function getTimezoneShortName(date: Date, timeZone?: string) {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { timeZone, timeZoneName: "short" }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value ?? timeZone ?? "";
  } catch (e) {
    return timeZone ?? "";
  }
}

function getHourInTZ(date: Date, timeZone?: string) {
  try {
    const hourStr = new Intl.DateTimeFormat(undefined, { hour: "2-digit", hour12: false, timeZone }).format(date);
    return Number(hourStr.replace(/^0/, ""));
  } catch (e) {
    return date.getHours();
  }
}

export default function DashboardHeader({ timeZone }: Props) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const { data: meData } = useGetMeDataQuery({});
  const userName = meData?.data?.fullName ?? "User";
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzShort = now ? getTimezoneShortName(now, tz) : "";

  const hourInTz = now ? getHourInTZ(now, tz) : 0;
  const greeting = !mounted
    ? "Good Morning,"
    : hourInTz < 12
      ? "Good Morning,"
      : hourInTz < 18
        ? "Good Afternoon,"
        : "Good Evening,";

  useEffect(() => {
    setMounted(true);
    setNow(new Date());

    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <h1 className="max-w-[620px] text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-[#161616] sm:text-[2.8rem] lg:text-[3.25rem]">
        <span className="italic">{greeting}</span>
        <br />
        <span className="italic">{userName}</span>
      </h1>

      <div className="flex flex-col items-end gap-2 pt-3 text-right text-[#8a93a6]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8a93a6]">
          <Clock3 className="h-5 w-5" />
        </div>
        <div className="text-[1rem] leading-none" suppressHydrationWarning>
          {now ? formatTime(now, tz) : "-- : --"}
        </div>
        <div className="text-[1rem] leading-none" suppressHydrationWarning>
          {now ? formatDate(now, tz) : ""}
        </div>
        {tzShort ? <div className="text-[0.85rem] text-[#9aa0ab]">{tzShort}</div> : null}
      </div>
    </div>
  );
}
