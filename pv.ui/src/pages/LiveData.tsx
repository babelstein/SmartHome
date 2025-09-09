import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveData } from '../api/api';
import Gauge from '../components/Gauge';
import { setLiveData } from '../app/LiveDataSlice';
import { BATTERY_CURRENT, BATTERY_VOLTAGE, CHARGER_TEMP, PV_CURRENT, PV_POWER, PV_VOLTAGE } from '../types/segments';

const LiveData: React.FC = () => {
  const dispatch = useDispatch();
  const liveData = useSelector((state: any) => state.liveData.data); // Define proper type later

  useEffect(() => {
    fetchLiveData()
      .then((response) => {
        dispatch(setLiveData(response.data));
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  if (!liveData) return <div>Loading...</div>;

  const { batteryInfo, pvInfo } = liveData;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <Gauge label="Battery Voltage" min={17} max={29} value={batteryInfo.voltage} unit="V" segments={BATTERY_VOLTAGE} />
        <Gauge label="Battery Current" min={0} max={30} value={batteryInfo.current} unit="A" segments={BATTERY_CURRENT}/>
        <Gauge label="Charger Temperature" min={-20} max={60} value={batteryInfo.temp} unit="°C" segments={CHARGER_TEMP}/>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <Gauge label="PV Voltage" min={0} max={80} value={pvInfo.voltage} unit="V" segments={PV_VOLTAGE}/>
        <Gauge label="PV Current" min={0} max={30} value={pvInfo.current} unit="A" segments={PV_CURRENT}/>
        <Gauge label="PV Power" min={0} max={1200} value={pvInfo.power} unit="W" segments={PV_POWER}/>
      </div>
    </>
  );
};

export default LiveData;