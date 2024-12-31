import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { useEffect, useState } from "react";
import LiquidFillGauge from "react-liquid-gauge";

type ScoreGaugeProps = {
  score: number;
  teamName: string;
};

export default function ScoreGauge({ score, teamName }: ScoreGaugeProps) {
  console.log("ScoreGauge render:", { score, teamName });
  const [currentScore, setCurrentScore] = useState(score);

  const radius = 100;
  const startColor = "#3B82F6";
  const endColor = "#EF4444";

  useEffect(() => {
    setCurrentScore(score);
  }, [score]);

  const percentage = (currentScore / 20) * 100;
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
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-white">{teamName}</h3>
      <LiquidFillGauge
        key={currentScore}
        width={radius * 2}
        height={radius * 2}
        value={percentage}
        textRenderer={(props) => {
          const value = Math.round((props.value * 20) / 100);
          const radius = Math.min(props.height / 2, props.width / 2);
          const textPixels = (props.textSize * radius) / 2;
          const valueStyle = {
            fontSize: textPixels,
          };

          return (
            <tspan>
              <tspan className="value" style={valueStyle}>
                {value}
              </tspan>
              <tspan style={{ fontSize: textPixels * 0.4 }}></tspan>
            </tspan>
          );
        }}
        riseAnimation
        waveAnimation
        waveFrequency={2}
        waveAmplitude={1}
        gradient
        gradientStops={gradientStops}
        circleStyle={{
          fill: fillColor,
        }}
        waveStyle={{
          fill: fillColor,
        }}
        textStyle={{
          fill: "#fff",
          fontFamily: "Arial",
        }}
        waveTextStyle={{
          fill: "#fff",
          fontFamily: "Arial",
        }}
      />
    </div>
  );
}
