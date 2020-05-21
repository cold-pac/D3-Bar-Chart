fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(response => {
    if(!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
})
.then(responseAsJSON => {
    const dataset = responseAsJSON.data;
    console.log(dataset);

    let node = window.document.createElement("div");
    node.id = "title";
    node.innerHTML = "United States GDP";
    window.document.getElementById("chartContainer").insertBefore(node, window.document.getElementById("chartContainer").firstChild);
 
    const w = 800; 
    const h = 500; 
    const padding = 50;
    const barWidth = ((w - (padding * 2))/(dataset.length));
    const barHeightMultiplier = (h - padding * 2)/d3.max(dataset, (d) => d[1]);

    const xScale = d3.scaleLinear()
                     .domain([1947, 2015])
                     .range([padding, w - padding]);
    
    const yScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d[1]), d3.max(dataset, (d) => d[1])])
                     .range([h - padding, padding]);

    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .style("background", "white")

    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", (d, i) => (i * ((w - (padding * 2))/dataset.length)) + padding)
       .attr("y", (d, i) => {
           return (h -  (d[1] * barHeightMultiplier)) -padding;
       })
       .attr("width", barWidth)
       .attr("height", function(d, i){
           return d[1] * barHeightMultiplier;
       })
       .attr("fill", "black")
       .attr("class", "bar")
       .attr("data-date", (d) => d[0])
       .attr("data-gdp", (d) => d[1])
       .append("title")
       .attr("id", "tooltip")
       .attr("data-date", (d) => d[0])
       .text((d) => d);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("transform", "translate(0, " + (h-padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis")
    
    svg.append("g")
       .attr("transform", "translate(" + (padding) + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");

    
   /*  svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .attr("x", (d, i) => i* (w/dataset.length))
       .attr("y", (d, i) => {
        return h -  (d[1] * barHeightMultiplier + 200);
       })
       .text((d, i) => d[0])
       .attr("fill", "black ")
       .style("font-size", "25px") */


})
.catch(function(error) {
    console.log('Looks like there was a problem: \n', error);
});

