import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, title }) => {
  const chartRef = useRef();
  const [width, setWidth] = useState(0);
  //set up chart dimensions
  const height = 500;
  const margin = { top: 30, right: 30, bottom: 130, left: 75 }; 
  const [containerWidth, setContainerWidth] = useState(800);

  //update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const newWidth = chartRef.current.parentElement.clientWidth;
        setContainerWidth(newWidth);
        // console.log(newWidth);
      }
    };

    updateDimensions(); //set initial dimensions
    window.addEventListener('resize', updateDimensions); //update on resize
    return () => window.removeEventListener('resize', updateDimensions); //cleanup
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    //clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    //create svg container
    const svg = d3.select(chartRef.current)
      .attr('width', containerWidth)
      .attr('height', height);

    //dynamically adjust bar width based on container size
    const maxBarWidth = 50; //maximum bar width
    const minBarWidth = 10; //minimum bar width
    const availableWidth = containerWidth - margin.left - margin.right;
    const calculatedBandwidth = Math.max(
      Math.min(availableWidth / data.length - 2, maxBarWidth),
      minBarWidth
    );


    //create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d[0])) //words or trigrams
      .range([margin.left, containerWidth - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])]) //frequencies
      .nice()
      .range([height - margin.bottom, margin.top]);

    //add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#333'); 

    //add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px') 
      .style('fill', '#333');

    //create tooltip for when hovering over bar
    const tooltip = d3.select(chartRef.current.parentNode)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('padding', '5px')
      .style('font-size', '12px')
      .style('pointer-events', 'none') //prevent tooltip from interfering with mouse events
      .style('opacity', 0);

    //add bars
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d[1]))
      .attr('width', calculatedBandwidth)
      .attr('height', d => y(0) - y(d[1]))
      .attr('fill', '#08003ab3')
      .attr('rx', 4) 
      .attr('ry', 4)
      .on('mouseover', function (event, d) {
        //highlight bar on hover
        d3.select(this)
          .attr('fill', '#08003a'); //darker shade for hover
        
        tooltip
          .style('opacity', 1)
          .html(`${d[0]}: ${d[1]}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })

      .on('mousemove', function (event) {
        // Move tooltip with mouse
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })

      .on('mouseout', function (event, d) {
        //revert to original color
        d3.select(this)
          .attr('fill', '#08003ab3');

        tooltip.style('opacity', 0);
      });

    //add title
    svg.append('text')
      .attr('x', containerWidth / 2)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title);
  }, [data, title, containerWidth]);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;