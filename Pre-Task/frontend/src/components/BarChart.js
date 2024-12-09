import React from "react";
import * as d3 from "d3";

const BarChart = ({ data, onBarClick, title }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const width = 300,
      height = 200,
      margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Bar rendering
    const bars = svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue")
      .on("click", function(_, d) {
        // When bar is clicked, call the onBarClick function (filter images)
        onBarClick(d.label);

        // Highlight the clicked bar by changing its fill color
        bars.attr("fill", "steelblue"); // Reset all bars to default color
        d3.select(this).attr("fill", "orange"); // Highlight the clicked bar
      });

    // Add count labels on top of bars
    svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5) // Position slightly above the bar
      .attr("text-anchor", "middle")
      .attr("fill", "#000") // Change count color to black for better visibility
      .text((d) => d.value); // Display count as text on top of the bars

    // X and Y Axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", `translate(${margin.left},0)`);
    svg.append("g")
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0,${height - margin.bottom})`);
  }, [data, onBarClick]);

  return (
    <div>
      <h3>{title}</h3>
      <svg ref={ref} width={400} height={250}></svg>
    </div>
  );
};

export default BarChart;