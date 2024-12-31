import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import LiquidFillGauge from "react-liquid-gauge";

type ScoreGaugeProps = {
  score: number;
  teamName: string;
};

export default function ScoreGauge({ score, teamName }: ScoreGaugeProps) {
  // Convertir le score (0-20) en pourcentage (0-100)
  const percentage = (score / 20) * 100;

  const radius = 100;
  const startColor = "#4ECDC4"; // Couleur pour score bas
  const endColor = "#FF6B6B"; // Couleur pour score élevé

  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(percentage / 100);

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
              <tspan style={{ fontSize: textPixels * 0.4 }}>/20</tspan>
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
