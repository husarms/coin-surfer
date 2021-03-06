import React from "react";
import * as d3 from "d3";

export interface MultilineChartProps {
    data: ChartData[];
    dimensions: Dimensions;
}

interface Dimensions {
    width: number;
    height: number;
    margin: Margin;
}

interface Margin {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

interface ChartData {
    name: string;
    color: string;
    strokeWidth: number;
    strokeDashArray?: string;
    items: any[];
}

const MultilineChart = ({ data, dimensions }: MultilineChartProps) => {
    const svgRef = React.useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    React.useEffect(() => {
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data[0].items, (d) => d.date))
            .range([0, width]);
        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min([...data[0].items, ...data[1].items, ...data[2].items], (d) => d.value) * 0.95,
                d3.max([...data[0].items, ...data[1].items, ...data[2].items], (d) => d.value) * 1.05,
            ])
            .range([height, 0]);
        // Create root container where we will append all other chart elements
        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
        const svg = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        // Add X grid lines with labels
        const xAxis = d3
            .axisBottom(xScale)
            .ticks(5)
            .tickSize(-height + margin.bottom);
        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "white")
            .attr("font-size", "0.75rem");
        // Add Y grid lines with labels
        const yAxis = d3
            .axisLeft(yScale)
            .ticks(10)
            .tickSize(-width)
            .tickFormat((val) => `${val}`);
        const yAxisGroup = svg.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
        yAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "white")
            .attr("font-size", "0.75rem");
        // Draw the lines
        const line = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.value));
        svg.selectAll(".line")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", (d) => d.strokeWidth)
            .attr("stroke-dasharray", (d) => d.strokeDashArray ? d.strokeDashArray : '')
            .attr("d", (d) => line(d.items));
    }, [data]); // Redraw chart if data changes

    return <svg ref={svgRef} height='100%' width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} />;
};

export default MultilineChart;
