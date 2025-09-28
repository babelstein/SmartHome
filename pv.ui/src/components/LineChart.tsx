import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  creationTime: string; // ISO string or date string
  voltage?: number;
  current?: number;
  power?: number;
}

interface LineChartProps {
  data: DataPoint[];
  yLeftLabel: string;
  yRightLabel: string;
  yLeftKey: keyof DataPoint;
  yRightKey: keyof DataPoint;
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  yLeftLabel,
  yRightLabel,
  yLeftKey,
  yRightKey,
  title,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current && data.length > 0) {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();

      const width = 700;
      const height = 400;
      const margin = { top: 50, right: 60, bottom: 50, left: 60 };

      const parseTime = d3.isoParse; // assuming ISO string

      const parsedData = data.map(d => ({
        ...d,
        creationTime: parseTime(d.creationTime) as Date,
      }));

      const xScale = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.creationTime) as [Date, Date])
        .range([margin.left, width - margin.right]);

      const yLeftExtent = d3.extent(parsedData, d => d[yLeftKey]) as [number, number];
      const yRightExtent = d3.extent(parsedData, d => d[yRightKey]) as [number, number];

      const yLeftScale = d3.scaleLinear()
        .domain([0, yLeftExtent[1] * 1.2]) // add some padding
        .range([height - margin.bottom, margin.top]);

      const yRightScale = d3.scaleLinear()
        .domain([0, yRightExtent[1] * 1.2])
        .range([height - margin.bottom, margin.top]);

      // Axes
      const xAxis = d3.axisBottom(xScale);
      const yLeftAxis = d3.axisLeft(yLeftScale);
      const yRightAxis = d3.axisRight(yRightScale);

      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yLeftAxis);

      svg.append('g')
        .attr('transform', `translate(${width - margin.right},0)`)
        .call(yRightAxis);

      // Lines
      const lineLeft = d3.line<DataPoint>()
        .x(d => xScale(new Date(d.creationTime)))
        .y(d => yLeftScale(d[yLeftKey] as number))
        .defined(d => d[yLeftKey] !== undefined);

      const lineRight = d3.line<DataPoint>()
        .x(d => xScale(new Date(d.creationTime)))
        .y(d => yRightScale(d[yRightKey] as number))
        .defined(d => d[yRightKey] !== undefined);

      svg.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', lineLeft as any);

      svg.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('d', lineRight as any);

      // Tooltip
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '8px')
        .style('display', 'none');

      // Points and hover interaction
      const drawPoints = (key: keyof DataPoint, yScale: d3.ScaleLinear<number, number>) => {
        svg.selectAll(`.circle-${key}`)
          .data(parsedData)
          .enter()
          .append('circle')
          .attr('cx', (d: any) => xScale(d.creationTime))
          .attr('cy', (d: any) => yScale(d[key] as number))
          .attr('r', 4)
          .attr('fill', key === yLeftKey ? 'steelblue' : 'orange')
          .on('mouseover', (event, d: any) => {
            tooltip.style('display', 'block')
              .html(`
                <strong>${d.creationTime?.toISOString().slice(0,19).replace('T', ' ')}</strong><br/>
                ${yLeftLabel}: ${d[yLeftKey]}<br/>
                ${yRightLabel}: ${d[yRightKey]}
              `);
          })
          .on('mousemove', (event: any) => {
            tooltip.style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 20) + 'px');
          })
          .on('mouseout', () => {
            tooltip.style('display', 'none');
          });
      };

      drawPoints(yLeftKey, yLeftScale);
      drawPoints(yRightKey, yRightScale);

      // Clean up tooltip on unmount
      return () => {
        tooltip.remove();
      };
    }
  }, [data, yLeftKey, yRightKey, yLeftLabel, yRightLabel]);

  return (
    <div style={{ position: 'relative' }}>
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <svg width={700} height={400} ref={ref} />
    </div>
  );
};

export default LineChart;