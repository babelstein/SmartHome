import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface GaugeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  unit: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, min, max, value, unit }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();

      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2 - 20;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background arc
      const arcBackground = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

      svg.append('path')
        .attr('d', arcBackground as any)
        .attr('fill', '#eee')
        .attr('transform', `translate(${centerX}, ${centerY})`);

      // Draw foreground arc based on value
      const percent = (value - min) / (max - min);
      const endAngle = -Math.PI / 2 + percent * Math.PI;

      const arcForeground = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(endAngle);

      svg.append('path')
        .attr('d', arcForeground as any)
        .attr('fill', '#3b82f6')
        .attr('transform', `translate(${centerX}, ${centerY})`);

      // Add value text
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text(`${value.toFixed(2)} ${unit}`);
    }
  }, [value, min, max]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{label}</div>
      <svg ref={ref} width={200} height={200} />
    </div>
  );
};

export default Gauge;