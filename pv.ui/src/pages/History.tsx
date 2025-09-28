import React, { useState, useEffect } from 'react';
import { fetchHistoryData } from '../api/api';
import LineChart from '../components/LineChart';
import DatePicker from '../components/DatePicker';
import { format, startOfToday, startOfTomorrow } from 'date-fns';

const History: React.FC = () => {
  const [batteryStart, setBatteryStart] = useState(format(startOfToday(), 'yyyy-MM-dd'));
  const [batteryEnd, setBatteryEnd] = useState(format(startOfTomorrow(), 'yyyy-MM-dd'));
  const [pvStart, setPvStart] = useState(format(startOfToday(), 'yyyy-MM-dd'));
  const [pvEnd, setPvEnd] = useState(format(startOfTomorrow(), 'yyyy-MM-dd'));

  const [batteryData, setBatteryData] = useState<any[]>([]);
  const [pvData, setPvData] = useState<any[]>([]);

  const fetchData = () => {
    fetchHistoryData(batteryStart, batteryEnd).then(res => {
      setBatteryData(res.data.battery);
    });
    fetchHistoryData(pvStart, pvEnd).then(res => {
      setPvData(res.data.pv);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Battery History</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <DatePicker label="Start Date" value={batteryStart} onChange={setBatteryStart} />
        <DatePicker label="End Date" value={batteryEnd} onChange={setBatteryEnd} />
        <button onClick={fetchData}>Update</button>
      </div>
      <LineChart
        data={batteryData}
        yLeftLabel="Voltage (V)"
        yRightLabel="Current (A)"
        yLeftKey="voltage"
        yRightKey="current"
        title="Battery Voltage and Current over Time"
      />

      <h2>PV Panels</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <DatePicker label="Start Date" value={pvStart} onChange={setPvStart} />
        <DatePicker label="End Date" value={pvEnd} onChange={setPvEnd} />
        <button onClick={fetchData}>Update</button>
      </div>
      <LineChart
        data={pvData}
        yLeftLabel="Power (W)"
        yRightLabel="Voltage (A)"
        yLeftKey="power"
        yRightKey="voltage"
        title="PV Panels Power and Voltage"
      />
    </div>
  );
};

export default History;