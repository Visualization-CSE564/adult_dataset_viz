var svg_position = {
    row1: {height: 130, width1: 1200},
    row2: {height: 400, width1: 750, width2: 450},
    row3: {height: 250, width1: 450, width2: 400, width3: 350}
}

function init() {
    d3.select(".header")
        .attr("width", svg_position.row1.width1)
        .attr("height", svg_position.row1.height)
        .style("top", 0)
        .style("left", 0);

    d3.select(".parallelcoord")
        .attr("width", svg_position.row2.width1)
        .attr("height", svg_position.row2.height)
        .style("top", svg_position.row1.height)
        .style("left", 0);

    d3.select(".piechart")
        .attr("width", svg_position.row2.width2)
        .attr("height", svg_position.row2.height)
        .style("top", svg_position.row1.height)
        .style("left", svg_position.row2.width1);

    d3.select(".horizontalbar")
        .attr("width", svg_position.row3.width1)
        .attr("height", svg_position.row3.height)
        .style("top", svg_position.row1.height + svg_position.row2.height)
        .style("left", 0);

    d3.select(".stackedbar")
        .attr("width", svg_position.row3.width2)
        .attr("height", svg_position.row3.height)
        .style("top", svg_position.row1.height + svg_position.row2.height)
        .style("left", svg_position.row3.width1);

    d3.select(".insights")
        .attr("width", svg_position.row3.width3)
        .attr("height", svg_position.row3.height)
        .style("top", svg_position.row1.height + svg_position.row2.height)
        .style("left", svg_position.row3.width1 + svg_position.row3.width2);
    $.post("/barch", {}, function(data_infunc){
            draw_bc(data_infunc);
        });

}
function draw_hori_bc(dt){

    var margin = {top: 25, right: 25, bottom: 25, left: 25},
    width = svg_position.row3.width1 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom;

    var svg = d3.select(".horizontalbar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = svg.append("g");
    var svg1 = svg.append("g");

    var data_hbc = dt['data_dict'];
    var l = data_hbc.length;
    console.log(data_hbc);
    var barwidth = height/l;

    var x = d3.scale.ordinal().rangePoints([height,0]);
    var y = d3.scale.linear().domain([0, d3.max(data_hbc, function(d){return d[1]+d[2]})]).range([0, width]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("left");

    var bar1 = svg1.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + (margin.left/2)+ ","+ (i * barwidth + margin.top/5) +")" ;})
    var bar2 = svg2.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + (margin.left/2 + y(d[1])) + "," + (i * barwidth + margin.top/5) +")" ;})
    
    bar2.append("rect")
          .attr("height", barwidth)
          .attr("width", function(d){return (y(d[2]));})
          .attr("fill","#3A8399");
    bar1.append("rect")
          .attr("height", barwidth)
          .attr("width", function(d){return (y(d[1]));})
          .attr("fill","orange");

    bar1.append("text")
          .attr("x", (barwidth) / 2)
          .attr("font-size",barwidth+"px")
          .attr("transform", function(d,i){return "translate("+ (0) +","+(barwidth/2 + 3)+")" ;})
          .attr("fill","#B63617")
          .text(function(d) { return d[0];});

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+(margin.left/2)+"," + (margin.top/5)  + ")")
            .call(xAxis);
}

function draw_bc(dt){
    var margin = {top: 25, right: 25, bottom: 25, left: 25},
    width = svg_position.row3.width2 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom;

    var svg = d3.select(".stackedbar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = svg.append("g");
    var svg1 = svg.append("g");

    var data_hbc = dt['data_dict'];
    var l = data_hbc.length;
    console.log(data_hbc);
    var barwidth = (width-margin.right)/l;

    var x = d3.scale.ordinal().rangePoints([0,width - margin.right]);
    var y = d3.scale.linear().domain([0, d3.max(data_hbc, function(d){return d[1]+d[2]})]).range([height,0]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    var bar1 = svg1.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) {console.log(i*barwidth, d, y(d[1])); return "translate(" + ( (i * barwidth) + margin.left)+ ","+ (margin.top/5 + y(d[1])) +")" ;})
    var bar2 = svg2.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) { console.log(i*barwidth, d, y(d[2])); return "translate(" + ( (i * barwidth) + margin.left)+ ","+ (margin.top/5 + (y(d[1] + d[2]))) +")" ;})
    
    bar2.append("rect")
          .attr("width", barwidth)
          .attr("height", function(d){return (height - (y(d[1] + d[2]))) ;})
          .attr("fill","#3A8399");
    bar1.append("rect")
          .attr("width", barwidth)
          .attr("height", function(d){return (height - y(d[1]));})
          .attr("fill","orange");

    bar1.append("text")
          .attr("x", 0)
          // .attr("font-size",barwidth+"px")
          .attr("transform", function(d,i){return "translate("+ (i*barwidth) +","+(barwidth/2 + 3)+")" ;})
          .attr("fill","#B63617")
          .text(function(d) { return d[0];});

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+(margin.left)+"," + (height + margin.top/5)  + ")")
            .call(xAxis);
    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+(margin.left)+"," + (margin.top/5)  + ")")
            .call(yAxis);
}

function draw_pc(dt) {
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = svg_position.row2.width1 - margin.left - margin.right,
    height = svg_position.row2.height - margin.top - margin.bottom;

    var dimensions = [
        {
            name: "Age",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        },
        {
            name: "FnlWgt",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        },
        {
            name: "CapitalGain",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        },
        {
            name: "CapitalLoss",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        },
        {
            name: "HrsPerWk",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        }
    ];

    var x = d3.scale.ordinal().domain(dimensions.map(function(d) { return d.name; })).rangePoints([0, width]),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select(".parallelcoord")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = []
    for (var i = 0; i < dt['data_dict'].length; i++) {
        data.push({'Index': dt['data_dict'][i][0], 'Age':dt['data_dict'][i][1], 'FnlWgt':dt['data_dict'][i][2], 'CapitalGain':dt['data_dict'][i][3], 'CapitalLoss':dt['data_dict'][i][4], 'HrsPerWk':dt['data_dict'][i][5]})
    }

    console.log(dt['data_dict'])


    //Create the dimensions depending on attribute "type" (number|string)
    //The x-scale calculates the position by attribute dimensions[x].name
    dimensions.forEach(function(dimension) {
        dimension.scale.domain(dimension.type === "number"
            ? d3.extent(data, function(d) { return +d[dimension.name]; })
            : data.map(function(d) { return d[dimension.name]; }).sort());
    });

    // Add grey background lines for context.
    background = svg.append("g")
            .attr("class", "background")
        .selectAll("path")
            .data(data)
        .enter().append("path")
            .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
            .attr("class", "foreground")
        .selectAll("path")
            .data(data)
        .enter().append("path")
            .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
                .data(dimensions)
            .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
            .call(d3.behavior.drag()
                    .origin(function(d) { return {x: x(d.name)}; })
                .on("dragstart", function(d) {
                    dragging[d.name] = x(d.name);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { return position(a) - position(b); });
                    x.domain(dimensions.map(function(d) { return d.name; }));
                    g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
                .on("dragend", function(d) {
                    delete dragging[d.name];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                })
            );

    // Add an axis and title.
    g.append("g")
            .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(d.scale)); })
            .append("text")
                .style("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("y", -19)
                .text(function(d) { return d.name; });

    // Add and store a brush for each axis.
    g.append("g")
            .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(d.scale.brush = d3.svg.brush().y(d.scale).on("brushstart", brushstart).on("brush", brush));
        })
        .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    function position(d) {
        var v = dragging[d.name];
        return v == null ? x(d.name) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        //return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        return line(dimensions.map(function(dimension) {
            var v = dragging[dimension.name];
            var tx = v == null ? x(dimension.name) : v;
            return [tx, dimension.scale(d[dimension.name])];
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !p.scale.brush.empty(); }),
            extents = actives.map(function(p) { return p.scale.brush.extent(); });

        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                if(p.type==="number"){
                    return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
                }else{
                    return extents[i][0] <= p.scale(d[p.name]) && p.scale(d[p.name]) <= extents[i][1];
                }
            }) ? null : "none";
        });
    }
}