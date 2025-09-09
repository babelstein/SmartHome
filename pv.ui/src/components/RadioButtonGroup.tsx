import React from 'react';

interface RadioButtonGroupProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: 'day' | 'week' | 'month') => void;
  name?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selected,
  onChange,
  name = 'period',
}) => {
  return (
    <div>
      {options.map((opt) => (
        <label key={opt.value} style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value as 'day' | 'week' | 'month')}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtonGroup;