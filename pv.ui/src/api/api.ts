import axios from 'axios';

export const fetchLiveData = () => axios.get('https://mbyczek.eu/sh-api/summary');

export const fetchHistoryData = (startDate: string, endDate: string) => axios.get('https://mbyczek.eu/sh-api/summary', { params: { startDate, endDate } });

export const fetchTimeSummary = (date: string, aggregation: 'day' | 'week' | 'month') => axios.get('https://mbyczek.eu/sh-api/summary/production', { params: { date, aggregation } });