"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { HeatmapData } from "@/lib/api";

interface ReadingHeatmapProps {
  data: HeatmapData[];
  year?: number;
}

export function ReadingHeatmap({
  data,
  year = new Date().getFullYear(),
}: ReadingHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    pages: number;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate all days for the year
  const generateYearDays = () => {
    const days: Date[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }

    return days;
  };

  const yearDays = generateYearDays();

  // Create a map for quick lookup
  const dataMap = new Map(
    data.map((item) => [new Date(item.date).toDateString(), item.pagesRead])
  );

  // Get color intensity based on pages read
  const getColor = (pagesRead: number) => {
    if (pagesRead === 0) return "bg-gray-800/50";
    if (pagesRead < 10) return "bg-green-900/60";
    if (pagesRead < 25) return "bg-green-700/70";
    if (pagesRead < 50) return "bg-green-500/80";
    return "bg-green-400";
  };

  // Group days by week
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  // Start from the first day of the year
  const firstDay = yearDays[0];
  const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Add empty cells for days before the first day of the year
  for (let i = 0; i < dayOfWeek; i++) {
    currentWeek.push(null);
  }

  yearDays.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || index === yearDays.length - 1) {
      // Fill remaining days of the week with null
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get month labels with proper positioning
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find((day) => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.getMonth();
        if (month !== lastMonth && weekIndex > 0) {
          lastMonth = month;
          labels.push({
            month: firstValidDay.toLocaleDateString("en-US", {
              month: "short",
            }),
            weekIndex,
          });
        } else if (weekIndex === 0) {
          lastMonth = month;
          labels.push({
            month: firstValidDay.toLocaleDateString("en-US", {
              month: "short",
            }),
            weekIndex: 0,
          });
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  const handleMouseEnter = (
    date: Date,
    pages: number,
    event: React.MouseEvent
  ) => {
    setHoveredCell({
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      pages,
    });
    // Position tooltip above the cell
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  return (
    <div className="relative w-full">
      {/* Year label */}
      <div className="text-gray-400 text-sm font-medium mb-3">{year}</div>

      <div className="flex gap-3">
        {/* Day labels - all 7 days */}
        <div
          className="flex flex-col justify-start"
          style={{ paddingTop: "24px" }}
        >
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Sun
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Mon
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Tue
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Wed
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Thu
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Fri
          </div>
          <div className="text-xs text-gray-500 h-[11px] flex items-center mb-[2px]">
            Sat
          </div>
        </div>

        {/* Heatmap grid container */}
        <div className="flex-1 overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-2 h-5 relative">
            {monthLabels.map((label) => (
              <div
                key={`${label.month}-${label.weekIndex}`}
                className="text-xs text-gray-500 absolute"
                style={{
                  left: `${label.weekIndex * 13}px`,
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="w-[11px] h-[11px]"
                      />
                    );
                  }

                  const dateKey = day.toDateString();
                  const pagesRead = dataMap.get(dateKey) || 0;
                  const colorClass = getColor(pagesRead);

                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: weekIndex * 0.003 }}
                      className={`w-[11px] h-[11px] rounded-sm ${colorClass} hover:ring-1 hover:ring-green-400 transition-all cursor-pointer border border-gray-700/30 z-0`}
                      onMouseEnter={(e) => handleMouseEnter(day, pagesRead, e)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-99 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-sm pointer-events-none"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-white font-medium">{hoveredCell.date}</div>
          <div className="text-gray-400">
            {hoveredCell.pages} {hoveredCell.pages === 1 ? "page" : "pages"}{" "}
            read
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-[11px] h-[11px] rounded-sm bg-gray-800/50 border border-gray-700/30" />
          <div className="w-[11px] h-[11px] rounded-sm bg-green-900/60 border border-gray-700/30" />
          <div className="w-[11px] h-[11px] rounded-sm bg-green-700/70 border border-gray-700/30" />
          <div className="w-[11px] h-[11px] rounded-sm bg-green-500/80 border border-gray-700/30" />
          <div className="w-[11px] h-[11px] rounded-sm bg-green-400 border border-gray-700/30" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
