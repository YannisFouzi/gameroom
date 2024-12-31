declare module "react-liquid-gauge" {
  export interface LiquidFillGaugeProps {
    value: number;
    width?: number;
    height?: number;
    percent?: string;
    textSize?: number;
    textOffsetX?: number;
    textOffsetY?: number;
    textRenderer?: (props: any) => React.ReactNode;
    riseAnimation?: boolean;
    waveAnimation?: boolean;
    waveFrequency?: number;
    waveAmplitude?: number;
    gradient?: boolean;
    gradientStops?: Array<{
      key: string;
      stopColor: string;
      stopOpacity: number;
      offset: string;
    }>;
    circleStyle?: React.CSSProperties;
    waveStyle?: React.CSSProperties;
    textStyle?: React.CSSProperties;
    waveTextStyle?: React.CSSProperties;
  }

  export default function LiquidFillGauge(
    props: LiquidFillGaugeProps
  ): JSX.Element;
}
