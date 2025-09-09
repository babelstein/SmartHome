import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  return (
    <div style={{ margin: '8px 0' }}>
      {label && <label style={{ marginRight: '8px' }}>{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DatePicker;