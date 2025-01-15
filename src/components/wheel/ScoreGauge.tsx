import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { useEffect, useState } from "react";
import LiquidFillGauge from "react-liquid-gauge";

type ScoreGaugeProps = {
  score: number;
  teamName: string;
  avatar: string;
};

export default function ScoreGauge({
  score,
  teamName,
  avatar,
}: ScoreGaugeProps) {
  const [currentScore, setCurrentScore] = useState(score);

  const radius = 90;
  const startColor = "#6495ed";
  const endColor = "#dc143c";

  useEffect(() => {
    setCurrentScore(score);
  }, [score]);

  const percentage = (currentScore / 25) * 100;
  const fillColor = interpolateRgb(startColor, endColor)(percentage / 100);

  const colorObj = color(fillColor);
  if (!colorObj) return null;

  const gradientStops = [
    {
      key: "0%",
      stopColor: colorObj.darker(0.5).toString(),
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: colorObj.brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-2xl backdrop-blur-sm min-w-[200px]">
      <div className="relative mb-4">
        <img
          src={avatar}
          alt={`Avatar ${teamName}`}
          className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg transform hover:scale-105 transition-transform"
        />
      </div>
      <h3 className="text-xl font-bold mb-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        {teamName}
      </h3>
      <div className="mx-auto">
        <LiquidFillGauge
          width={radius * 2}
          height={radius * 2}
          value={percentage}
          textRenderer={(props) => {
            const value = Math.round((props.value * 25) / 100);
            const radius = Math.min(props.height / 2, props.width / 2);
            const textPixels = (props.textSize * radius) / 2;
            return (
              <tspan>
                <tspan style={{ fontSize: textPixels }}>{value}</tspan>
                <tspan style={{ fontSize: textPixels * 0.4 }}>/25</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          gradient
          gradientStops={gradientStops}
          circleStyle={{ fill: fillColor }}
          waveStyle={{ fill: fillColor }}
          textStyle={{ fill: "#ffffff" }}
          waveTextStyle={{ fill: "#000000" }}
        />
      </div>
    </div>
  );
}
