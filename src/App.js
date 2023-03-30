import React, { useState, useEffect, useCallback } from "react";

import Chart, {
  ArgumentAxis,
  Series,
  ZoomAndPan,
  Legend,
  ScrollBar
} from "devextreme-react/chart";
const API_URL = "https://demo.questdb.io/exec?query=";
const PAGE_SIZE = 50;
const THRESHOLD = 100;

const App = () => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(
      `${API_URL}select pickup_datetime,trip_distance from trips limit ${PAGE_SIZE}`
    );
    const json = await response.json();
    console.log(json.dataset);
    setData(json.dataset);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = (event) => {
    const target = event.target;
    if (
      target.scrollHeight - target.scrollTop <=
      target.clientHeight + THRESHOLD
    ) {
      setIsLoading(true);
      setOffset(offset + PAGE_SIZE);
      fetchData().then(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div onScroll={handleScroll}>
      <Chart
        id="chart"
        palette="Harmony Light"
        dataSource={data?.map((d) => ({ arg: d[0], y1: d[1] }))}
      >
        <Series argumentField="arg" valueField="y1" />
        <Series argumentField="arg" valueField="y2" />
        <ScrollBar visible={true} />
        <ZoomAndPan argumentAxis="both" />
        <Legend visible={false} />
      </Chart>
    </div>
  );
};

export default App;
