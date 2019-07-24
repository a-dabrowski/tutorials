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

const bars = chart.selectAll() //returns empty set
  .data(sample) //function tells DOM how many elements should be updated
      .enter()
      .append('rect')
  .attr('x', (s) => xScale(s.language))
  .attr('y', (s) => yScale(s.value))
  .attr('width', xScale.bandwidth())
  .attr('class', 'value')
  .attr('height', (s) => height - yScale(s.value))
  .on('mouseenter', function (actual, i) {
    console.log('enter');
    d3.selectAll('.value').attr('opacity', 0.2);
    d3.select(this)
      .transition()
      .duration(200)
      .attr('opacity', 0.7)
      .attr('x', (a) => xScale(a.language) - 5)
      .attr('width', xScale.bandwidth() + 10)

    const tempY = yScale(actual.value);
    chart.append('line')
      .attr('id', 'limit')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', tempY)
      .attr('y2', tempY)

    bars.append('text') //text showing differences
      .attr('class', 'divergence')
      .attr('x', (dataPiece) => xScale(dataPiece.language) + xScale.bandwidth() / 2)
      .attr('y', (dataPiece) => yScale(dataPiece.value) + 30)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((dataPiece, index) => {
        const diff = (dataPiece.value - actual.value).toFixed(1);
        console.log('boo');

        let text = actual.value;

        return index !== i ? text : '';
      })


  })
  .on('mouseleave', function (actual, i) {
    d3.selectAll('.value')
      .transition()
      .duration(200)
      .attr('opacity', 1)
      .attr('x', (dataPiece) => xScale(dataPiece.language))
      .attr('width', xScale.bandwidth())
    d3.selectAll('#limit').remove();
    console.log('out');
  });

chart.append('g') //adding horizontal grid lines to help guide eyes
  .attr('class', 'grid')
  .call(d3.axisLeft()
    .scale(yScale)
    .tickSize(-width, 0, 0)
    .tickFormat('')
  );
baseSvg.append('text')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 2.4)
  .attr('transform', 'rotate(-90)')
  .text('love meter')
  .attr('text-anchor', 'middle')
  .attr('class', 'label');

baseSvg.append('text')
  .attr('x', width / 2 + margin)
  .attr('y', 30)
  .text('% of love')
  .attr('text-anchor', 'middle')
  .attr('class', 'label');

