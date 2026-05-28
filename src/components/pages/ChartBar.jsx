import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis } from "recharts";

const examName = ["Quiz 1", "Quiz 2", "Mid Term", "Final", "Project"];

const ChartBar = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log(props.data);
    const chartData = examName.map((name, index) => {
      return {
        name: name,
        x: props.data[index],
      };
    });
    setData(chartData);
  }, [props.data]);

  return (
    <div className="chartbar">
      <AreaChart width={800} height={120} data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="50%" stopColor="#C22327" />
            <stop offset="90%" stopColor="#F8EDFF" />
          </linearGradient>
        </defs>
        {/* <CartesianGrid /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Area
          //   type="monotone"
          dataKey="x"
          stackId="1"
          stroke="false"
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
};

export default ChartBar;
