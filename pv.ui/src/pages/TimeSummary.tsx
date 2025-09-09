import React, { useState } from 'react';
import { fetchTimeSummary } from '../api/api';
import RadioButtonGroup from '../components/RadioButtonGroup';
import { format, startOfToday } from 'date-fns';

const TimeSummary: React.FC = () => {
  const [date, setDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'));
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [result, setResult] = useState<null | {
    energy: number;
    maxPower: number;
    averagePower: number;
  }>(null);

  const handleSubmit = () => {
    fetchTimeSummary(date, period).then(res => {
      setResult(res.data);
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Time Summary</h2>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ marginRight: '8px' }}>Select Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <RadioButtonGroup
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
          selected={period}
          onChange={setPeriod}
        />
      </div>
      <button onClick={handleSubmit}>Get Summary</button>

      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Results</h3>
          <p>Energy produced: {result.energy} kWh</p>
          <p>Maximum charging power: {result.maxPower} W</p>
          <p>Average charging power: {result.averagePower} W</p>
        </div>
      )}
    </div>
  );
};

export default TimeSummary;