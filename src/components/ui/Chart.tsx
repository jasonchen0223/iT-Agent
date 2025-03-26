// components/ui/Chart.tsx
"use client";

import { useEffect, useRef } from "react";
import { Card } from "./Card";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  type?: "bar" | "line" | "pie";
  height?: number;
  className?: string;
  showLabels?: boolean;
}

const DEFAULT_COLORS = [
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#f97316", // orange-500
];

export function Chart({
  data,
  title,
  description,
  type = "bar",
  height = 250,
  className = "",
  showLabels = true,
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 根据图表类型绘制
    if (type === "bar") {
      drawBarChart(ctx, data, canvas.offsetWidth, height, showLabels);
    } else if (type === "line") {
      drawLineChart(ctx, data, canvas.offsetWidth, height, showLabels);
    } else if (type === "pie") {
      drawPieChart(ctx, data, canvas.offsetWidth, height);
    }
  }, [data, type, height, showLabels]);

  return (
    <Card className={className} data-oid="zf3nl.y">
      <div className="flex justify-between items-start mb-4" data-oid="_apt10m">
        <div data-oid="dh87ig5">
          <h3
            className="text-lg font-semibold text-indigo-100"
            data-oid="lizlltb"
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-indigo-300/70" data-oid="1rvlnwr">
              {description}
            </p>
          )}
        </div>
      </div>

      <div
        className="relative"
        style={{ height: `${height}px` }}
        data-oid="oga_62t"
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: `${height}px` }}
          className="absolute inset-0"
          data-oid="m--fzd2"
        />
      </div>

      {showLabels && (
        <div className="mt-4 flex flex-wrap gap-3" data-oid="-abaxb6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center" data-oid="hicl2k3">
              <span
                className="block w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                }}
                data-oid="e6zl1ta"
              />

              <span className="text-sm text-indigo-300/70" data-oid="6jnliui">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// 绘制柱状图
function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: ChartDataPoint[],
  width: number,
  height: number,
  showLabels: boolean,
) {
  const padding = {
    top: 20,
    right: 20,
    bottom: showLabels ? 40 : 20,
    left: 40,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 找出最大值用于缩放
  const maxValue = Math.max(...data.map((item) => item.value));

  // 绘制Y轴
  ctx.beginPath();
  ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"; // indigo-500/20
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.stroke();

  // 绘制Y轴刻度
  const yAxisSteps = 5;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(165, 180, 252, 0.7)"; // indigo-300/70
  ctx.font = "12px sans-serif";

  for (let i = 0; i <= yAxisSteps; i++) {
    const y = padding.top + chartHeight - (i / yAxisSteps) * chartHeight;
    const value = (i / yAxisSteps) * maxValue;

    ctx.beginPath();
    ctx.moveTo(padding.left - 5, y);
    ctx.lineTo(padding.left, y);
    ctx.stroke();

    ctx.fillText(value.toFixed(0), padding.left - 10, y);

    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = "rgba(99, 102, 241, 0.1)"; // indigo-500/10
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // 绘制柱状图
  const barWidth = (chartWidth / data.length) * 0.6;
  const barSpacing = chartWidth / data.length;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2;
    const y = height - padding.bottom - barHeight;

    // 绘制柱子
    ctx.beginPath();
    const barColor =
      item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    ctx.fillStyle = barColor;

    // 添加渐变效果
    const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
    gradient.addColorStop(0, barColor);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
    ctx.fillStyle = gradient;

    // 绘制圆角矩形
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, height - padding.bottom);
    ctx.lineTo(x, height - padding.bottom);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();

    // 添加光泽效果
    ctx.beginPath();
    const shineGradient = ctx.createLinearGradient(x, y, x + barWidth, y);
    shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    shineGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
    shineGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
    ctx.fillStyle = shineGradient;
    ctx.fillRect(x, y, barWidth, 5);

    // 如果需要显示标签，则在X轴绘制标签
    if (showLabels) {
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(165, 180, 252, 0.7)"; // indigo-300/70
      ctx.font = "12px sans-serif";
      ctx.fillText(item.label, x + barWidth / 2, height - padding.bottom + 10);
    }
  });
}

// 绘制折线图
function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: ChartDataPoint[],
  width: number,
  height: number,
  showLabels: boolean,
) {
  const padding = {
    top: 20,
    right: 20,
    bottom: showLabels ? 40 : 20,
    left: 40,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 找出最大值用于缩放
  const maxValue = Math.max(...data.map((item) => item.value));

  // 绘制背景网格
  const yAxisSteps = 5;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(165, 180, 252, 0.7)"; // indigo-300/70
  ctx.font = "12px sans-serif";

  for (let i = 0; i <= yAxisSteps; i++) {
    const y = padding.top + chartHeight - (i / yAxisSteps) * chartHeight;
    const value = (i / yAxisSteps) * maxValue;

    ctx.beginPath();
    ctx.moveTo(padding.left - 5, y);
    ctx.lineTo(padding.left, y);
    ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"; // indigo-500/20
    ctx.stroke();

    ctx.fillText(value.toFixed(0), padding.left - 10, y);

    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = "rgba(99, 102, 241, 0.1)"; // indigo-500/10
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // 准备绘制折线
  ctx.beginPath();
  ctx.strokeStyle = "rgba(99, 102, 241, 0.8)"; // indigo-500/80
  ctx.lineWidth = 3;

  // 绘制线条路径
  const points: [number, number][] = [];
  data.forEach((item, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (item.value / maxValue) * chartHeight;
    points.push([x, y]);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  // 添加光晕效果
  ctx.strokeStyle = "rgba(122, 138, 253, 0.8)";
  ctx.shadowColor = "rgba(79, 70, 229, 0.6)"; // indigo-600/60
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 创建渐变填充
  ctx.lineTo(points[points.length - 1][0], height - padding.bottom);
  ctx.lineTo(points[0][0], height - padding.bottom);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(
    0,
    padding.top,
    0,
    height - padding.bottom,
  );
  gradient.addColorStop(0, "rgba(99, 102, 241, 0.5)"); // indigo-500/50
  gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)"); // indigo-500/0
  ctx.fillStyle = gradient;
  ctx.fill();

  // 绘制数据点
  points.forEach(([x, y], index) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(79, 70, 229, 1)"; // indigo-600
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // 如果需要显示标签，则在X轴绘制标签
    if (showLabels) {
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(165, 180, 252, 0.7)"; // indigo-300/70
      ctx.font = "12px sans-serif";
      ctx.fillText(data[index].label, x, height - padding.bottom + 10);
    }
  });
}

// 绘制饼图
function drawPieChart(
  ctx: CanvasRenderingContext2D,
  data: ChartDataPoint[],
  width: number,
  height: number,
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.7;

  // 计算总值
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 绘制饼图
  let startAngle = -Math.PI / 2; // 从顶部开始

  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;

    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);

    const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    ctx.fillStyle = color;
    ctx.fill();

    // 添加高光效果
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const midAngle = startAngle + sliceAngle / 2;
    const highlightX = centerX + Math.cos(midAngle) * radius * 0.5;
    const highlightY = centerY + Math.sin(midAngle) * radius * 0.5;
    const gradient = ctx.createRadialGradient(
      highlightX,
      highlightY,
      0,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fill();

    // 准备下一个扇形
    startAngle = endAngle;

    // 计算文本位置
    const labelAngle = startAngle - sliceAngle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
    const labelY = centerY + Math.sin(labelAngle) * labelRadius;

    // 如果切片足够大，添加百分比标签
    if (sliceAngle > 0.2) {
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const percentage = ((item.value / total) * 100).toFixed(0) + "%";
      ctx.fillText(percentage, labelX, labelY);
    }
  });

  // 添加中心空白区域（甜甜圈效果）
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 23, 42, 0.8)"; // slate-900/80
  ctx.fill();
}
