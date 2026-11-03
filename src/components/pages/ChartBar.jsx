import React, { useEffect, useState } from "react";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
const examName = ["Quiz 1", "Quiz 2", "Mid Term", "Project", "Final"];
const ChartBar = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const chartData = examName.map((name, index) => {
      return {
        name: name,
        x: Number(props.data[index]) || 0
      };
    });
    setData(chartData);
  }, [props.data]);
  return (
    <div className="chartbar">
      <ResponsiveContainer
        width="100%"
        height={120}
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="colorUv"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="50%"
                stopColor="#C22327"
              />
              <stop
                offset="90%"
                stopColor="#F8EDFF"
              />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" />
          <YAxis />
          <Area

            dataKey="x"
            stackId="1"
            stroke="false"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ChartBar;
