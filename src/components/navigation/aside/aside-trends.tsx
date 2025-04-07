"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function AsideTrends() {
  const router = useRouter();
  const { data, isLoading } = useSWR("/api/feed/trends", fetcher);

  // Obtener código de país y su nombre
  const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
  const countryCode = locale.split("-")[1] || "US";
  const countryName =
    new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ||
    "tu país";

  const trendsToShow = data ? data.slice(0, 3) : [];
  type TrendType = {
    word: string;
    count: number;
  };
  return (
    <div className="rounded-xl dark:bg-gray-800 bg-gray-100 mb-4">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-xl font-bold">What&apos;s trending</h2>
      </div>
      <div>
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        )}

        {trendsToShow.map((trend: TrendType, index: string) => (
          <div
            key={index}
            className="cursor-pointer p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => router.push(`/explore/trends?q=${trend.word}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">
                  Trending in {countryName}
                </p>
                <p className="font-bold">{trend.word}</p>
                <p className="text-xs text-gray-500">
                  {trend.count.toLocaleString()} posts
                </p>
              </div>
              <button className="rounded-full p-1 text-gray-500 hover:bg-indigo-500/10 hover:text-indigo-500">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <div className="cursor-pointer p-3 text-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-xl">
          <Link href="/explore">Show more</Link>
        </div>
      </div>
    </div>
  );
}
