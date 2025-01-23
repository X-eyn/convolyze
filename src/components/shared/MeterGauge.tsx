// src/components/shared/MeterGauge.tsx
"use client";

import React, { useMemo } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";

if (typeof Highcharts === "object") {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

export const MeterGauge = ({ value }: { value: number }) => {
  const options = useMemo(() => ({
    chart: {
      type: "solidgauge",
      height: 200,
      width: 300,
      backgroundColor: "transparent"
    },
    title: null,
    pane: {
      center: ["50%", "50%"],
      size: "100%",
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#EEE",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc"
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, "#FF4560"], // red
        [0.5, "#FEB019"], // yellow
        [0.9, "#00E396"], // green
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },
    series: [{
      name: "Effectiveness",
      data: [value],
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:20px;font-weight:bold">{y}%</span><br/>' +
          '<span style="font-size:12px;opacity:0.8">Effectiveness</span>' +
          '</div>'
      }
    }],
    credits: {
      enabled: false
    }
  }), [value]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};