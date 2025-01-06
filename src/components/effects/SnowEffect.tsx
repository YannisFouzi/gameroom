"use client";

import { useEffect, useRef } from "react";

class Snowflake {
  x: number;
  y: number;
  size: number;
  velocity: number;
  fill: string;
  windSpeed: number;
  windAngle: number;
  wind: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    const maxSize = 4;
    this.size = Math.random() * (maxSize - 1) + 1;
    this.velocity = this.size * 0.25;
    const opacity = (this.size / maxSize) * 0.8;
    this.fill = `rgb(255 255 255 / ${opacity})`;
    this.windSpeed = (Math.random() - 0.5) * 0.05;
    this.windAngle = Math.random() * Math.PI * 2;
    this.wind = 0;
  }

  isOutsideCanvas(canvasHeight: number) {
    return this.y > canvasHeight + this.size;
  }

  reset(canvasWidth: number) {
    this.x = Math.random() * canvasWidth;
    this.y = -this.size;
  }

  update(canvasHeight: number, canvasWidth: number) {
    this.windAngle += this.windSpeed;
    this.wind = Math.cos(this.windAngle) * 0.3;
    this.x += this.wind;
    this.y += this.velocity;

    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;

    if (this.isOutsideCanvas(canvasHeight)) {
      this.reset(canvasWidth);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.closePath();
  }
}

export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const snowflakes: Snowflake[] = [];

    const createSnowflakes = () => {
      const snowflakeCount = Math.floor(
        (window.innerWidth * window.innerHeight) / 2000
      );
      snowflakes.length = 0;
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(
          new Snowflake(canvas.width / pixelRatio, canvas.height / pixelRatio)
        );
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(pixelRatio, pixelRatio);
      createSnowflakes();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((snowflake) => {
        snowflake.update(canvas.height / pixelRatio, canvas.width / pixelRatio);
        snowflake.draw(ctx);
      });
      requestAnimationFrame(render);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
  );
}
