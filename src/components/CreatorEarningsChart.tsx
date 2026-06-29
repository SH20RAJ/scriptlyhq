"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, ArrowUpRight, DollarSign, ShoppingBag } from "lucide-react";

interface SalesItem {
  amount: number;
  date: Date | string;
  creatorShare: number;
}

interface CreatorEarningsChartProps {
  sales: SalesItem[];
}

export default function CreatorEarningsChart({ sales }: CreatorEarningsChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [metric, setMetric] = useState<"revenue" | "sales">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Process data based on timeRange
  const chartData = useMemo(() => {
    const daysToLookback = timeRange === "7d" ? 7 : 30;
    const dataMap: Record<string, { dateStr: string; label: string; revenue: number; sales: number }> = {};

    // Initialize all dates in range
    for (let i = daysToLookback - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dataMap[dateKey] = {
        dateStr: dateKey,
        label,
        revenue: 0,
        sales: 0,
      };
    }

    // Populate with actual sales
    sales.forEach((s) => {
      const dateObj = new Date(s.date);
      const dateKey = dateObj.toISOString().split("T")[0];
      if (dataMap[dateKey]) {
        dataMap[dateKey].revenue += s.creatorShare / 100;
        dataMap[dateKey].sales += 1;
      }
    });

    return Object.values(dataMap);
  }, [sales, timeRange]);

  // Calculations for SVGs
  const maxVal = useMemo(() => {
    const values = chartData.map((d) => (metric === "revenue" ? d.revenue : d.sales));
    const max = Math.max(...values, 0);
    return max === 0 ? 10 : max * 1.15; // Add some headroom
  }, [chartData, metric]);

  const svgPoints = useMemo(() => {
    if (chartData.length === 0) {
      return {
        pathStr: "",
        closedPathStr: "",
        points: [],
        height: 240,
        width: 800,
        paddingBottom: 30,
        paddingLeft: 40,
        chartWidth: 740,
        chartHeight: 190,
      };
    }
    const width = 800;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = chartData.map((d, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * chartWidth;
      const yVal = metric === "revenue" ? d.revenue : d.sales;
      const y = height - paddingBottom - (yVal / maxVal) * chartHeight;
      return { x, y, ...d };
    });

    const pathStr = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    
    // Closed path for gradient area
    const closedPathStr = `${pathStr} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

    return { pathStr, closedPathStr, points, height, width, paddingBottom, paddingLeft, chartWidth, chartHeight };
  }, [chartData, metric, maxVal]);

  const totalSummary = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        revenue: acc.revenue + curr.revenue,
        sales: acc.sales + curr.sales,
      }),
      { revenue: 0, sales: 0 }
    );
  }, [chartData]);

  return (
    <Card className="rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border/40">
        <div className="space-y-1">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> Sales Performance
          </CardTitle>
          <p className="text-[10px] text-muted-foreground font-semibold">
            Real-time split earnings metrics and transaction volumes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex p-0.5 bg-muted/40 border border-border/40 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMetric("revenue")}
              className={`rounded-lg h-7 px-3 text-[9px] font-black uppercase tracking-wider ${
                metric === "revenue" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Revenue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMetric("sales")}
              className={`rounded-lg h-7 px-3 text-[9px] font-black uppercase tracking-wider ${
                metric === "sales" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <ShoppingBag className="w-3 h-3 mr-1" />
              Sales
            </Button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex p-0.5 bg-muted/40 border border-border/40 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimeRange("7d")}
              className={`rounded-lg h-7 px-3 text-[9px] font-black uppercase tracking-wider ${
                timeRange === "7d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              7 Days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimeRange("30d")}
              className={`rounded-lg h-7 px-3 text-[9px] font-black uppercase tracking-wider ${
                timeRange === "30d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              30 Days
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border/40 rounded-2xl bg-muted/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Range Earnings</span>
            <div className="text-xl font-black text-foreground mt-1">${totalSummary.revenue.toFixed(2)}</div>
          </div>
          <div className="p-4 border border-border/40 rounded-2xl bg-muted/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Range Volume</span>
            <div className="text-xl font-black text-foreground mt-1">{totalSummary.sales} sales</div>
          </div>
        </div>

        {/* SVG Chart */}
        {sales.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center border border-dashed border-border/40 rounded-2xl p-6 text-center text-xs text-muted-foreground font-semibold">
            <Calendar className="w-8 h-8 mb-2 opacity-40 text-primary" />
            No transaction records found in database.
          </div>
        ) : (
          <div className="relative">
            <svg
              viewBox={`0 0 ${svgPoints.width} ${svgPoints.height}`}
              className="w-full h-60 overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58CC02" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#58CC02" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={svgPoints.paddingLeft}
                y1={svgPoints.height - svgPoints.paddingBottom}
                x2={svgPoints.width - 20}
                y2={svgPoints.height - svgPoints.paddingBottom}
                stroke="currentColor"
                className="text-border/40"
                strokeWidth={1}
              />
              <line
                x1={svgPoints.paddingLeft}
                y1={svgPoints.height - svgPoints.paddingBottom - svgPoints.chartHeight / 2}
                x2={svgPoints.width - 20}
                y2={svgPoints.height - svgPoints.paddingBottom - svgPoints.chartHeight / 2}
                stroke="currentColor"
                className="text-border/20"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <line
                x1={svgPoints.paddingLeft}
                y1={svgPoints.height - svgPoints.paddingBottom - svgPoints.chartHeight}
                x2={svgPoints.width - 20}
                y2={svgPoints.height - svgPoints.paddingBottom - svgPoints.chartHeight}
                stroke="currentColor"
                className="text-border/20"
                strokeDasharray="4 4"
                strokeWidth={1}
              />

              {/* Shaded Area */}
              {svgPoints.closedPathStr && (
                <path d={svgPoints.closedPathStr} fill="url(#chartGradient)" />
              )}

              {/* Line path */}
              {svgPoints.pathStr && (
                <path
                  d={svgPoints.pathStr}
                  fill="none"
                  stroke="#58CC02"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Hover highlight line */}
              {hoveredIndex !== null && svgPoints.points[hoveredIndex] && (
                <line
                  x1={svgPoints.points[hoveredIndex].x}
                  y1={svgPoints.height - svgPoints.paddingBottom}
                  x2={svgPoints.points[hoveredIndex].x}
                  y2={svgPoints.points[hoveredIndex].y}
                  stroke="currentColor"
                  className="text-primary/30"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}

              {/* Data points */}
              {svgPoints.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 5 : 2}
                  fill={hoveredIndex === i ? "#58CC02" : "currentColor"}
                  className={hoveredIndex === i ? "text-white" : "text-primary/60"}
                  stroke="#58CC02"
                  strokeWidth={hoveredIndex === i ? 2.5 : 0}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                />
              ))}

              {/* X Axis Labels */}
              {svgPoints.points
                .filter((_, i) => {
                  const step = timeRange === "7d" ? 1 : 5;
                  return i % step === 0 || i === svgPoints.points.length - 1;
                })
                .map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={svgPoints.height - 10}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider"
                  >
                    {p.label}
                  </text>
                ))}

              {/* Y Axis Max Label */}
              <text
                x={10}
                y={svgPoints.height - svgPoints.paddingBottom - svgPoints.chartHeight + 4}
                fill="currentColor"
                className="text-[8px] font-mono text-muted-foreground"
              >
                {metric === "revenue" ? `$${Math.round(maxVal)}` : Math.round(maxVal)}
              </text>
              <text
                x={10}
                y={svgPoints.height - svgPoints.paddingBottom + 4}
                fill="currentColor"
                className="text-[8px] font-mono text-muted-foreground"
              >
                0
              </text>
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredIndex !== null && svgPoints.points[hoveredIndex] && (
              <div
                className="absolute bg-background/95 backdrop-blur-md border border-border/80 px-3 py-2 rounded-xl shadow-lg pointer-events-none text-left z-20 space-y-0.5 transition-all duration-100"
                style={{
                  left: `${(svgPoints.points[hoveredIndex].x / svgPoints.width) * 100}%`,
                  top: `${(svgPoints.points[hoveredIndex].y / svgPoints.height) * 100 - 25}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <p className="text-[8px] font-black uppercase text-muted-foreground">
                  {svgPoints.points[hoveredIndex].label}
                </p>
                <p className="text-[11px] font-black text-foreground">
                  {metric === "revenue"
                    ? `$${svgPoints.points[hoveredIndex].revenue.toFixed(2)}`
                    : `${svgPoints.points[hoveredIndex].sales} sales`}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
