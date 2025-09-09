import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { GaugeSegment } from '../types/models';

interface GaugeProps {
  label: string;
  min: number;
  max: number;
  segments: GaugeSegment[];
  value: number;
  unit: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, min, max, segments, value, unit }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  function scaleToRadians(value: number, minValue: number, maxValue: number): number {
    const angleRange = Math.PI;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (value - minValue) / (maxValue - minValue) * angleRange;
    return endAngle;
  }

  function valueToAngle(value: number, minValue: number, maxValue: number): number {
    const minAngle = -Math.PI / 2; // 12 o'clock
    const maxAngle = Math.PI / 2;  // 6 o'clock

    return minAngle + (value - minValue) / (maxValue - minValue) * (maxAngle - minAngle);
  }

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();

      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2 - 20;
      const centerX = width / 2;
      const centerY = height / 2;

      if (segments.length > 1) {
        segments.forEach(segment => {
          // Draw background arc
          const startRad = scaleToRadians(segment.from, min, max);
          const endRad = scaleToRadians(segment.to, min, max);

          const arcBackground = d3.arc()
            .innerRadius(radius - 10)
            .outerRadius(radius)
            .startAngle(startRad)
            .endAngle(endRad);

          svg.append('path')
            .attr('d', arcBackground as any)
            .attr('fill', segment.color)
            .attr('transform', `translate(${centerX}, ${centerY})`);

          const needle = svg.append('line')
            .attr('x1', centerX)
            .attr('y1', centerY - 10)
            .attr('x2', centerX)
            .attr('y2', centerY - 65) // length of the needle
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('transform', `rotate(${(valueToAngle(value, min, max)) * 180 / Math.PI}, ${centerX}, ${centerY})`);
        });
      } else {
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
      }

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