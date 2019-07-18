import * as d3 from 'd3';
import './index.css';
import sample from './sample';
const margin = 60;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const baseSvg = d3.select('svg');

const chart = baseSvg.append('g').attr('transform', `translate(${margin}, ${margin})`);

const yScale = d3.scaleLinear().range([height, 0]).domain([0,100]);
// height is first, because svg itself starts from top left corner,we want our chart to start from bottom left

//append x axis
chart.append('g').call(d3.axisLeft(yScale));

const xScale = d3.scaleBand().range([0, width])
        .domain(sample.map(el => el.language))
        .padding(0.2);

chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
