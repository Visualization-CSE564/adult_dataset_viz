var svg_position = {
    row1: {height: 120, width1: 1200},
    row2: {height: 400, width1: 750, width2: 450},
    row3: {height: 250, width1: 450, width2: 300, width3: 450}
}

var global_colors = {
    "<=50K": "orange",
    ">50K": "#3A8399"
}

var transition_duration = 200;

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

    $.post("/pc", {}, draw_pc);
    $.post("/piechart", {}, draw_piechart);
    $.post("/hori_bc", {}, draw_hori_bc);
    $.post("/barch", {}, draw_bc);
}

function draw_bc(dt){
    var margin = {top: 25, right: 25, bottom: 25, left: 25, text: 100},
    width = svg_position.row3.width2 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom - margin.text;

    var svg = d3.select(".stackedbar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + margin.text)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = svg.append("g");
    var svg1 = svg.append("g");

    var data_hbc = dt['data_dict'];
    var l = data_hbc.length;
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
          .attr("transform", function(d,i){return "translate("+ (0) +","+(height - y(d[1]))+") rotate(75) translate(10,0)" ;})
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
          .attr("fill",global_colors['>50K']);
    bar1.append("rect")
          .attr("height", barwidth)
          .attr("width", function(d){return (y(d[1]));})
          .attr("fill",global_colors['<=50K']);

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

function draw_piechart(dt) {
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = svg_position.row2.width2 - margin.left - margin.right,
    height = svg_position.row2.height - margin.top - margin.bottom;
    var radius = {r1: 50, r2: 100, r3: 150};

    var colorCode = {
        'White': '#82E0AA', 
        'Black': '#F1948A', 
        'Asian-Pac-Islander': '#f9dba0',
        'Other': '#633974',
        'Amer-Indian-Eskimo': '#2ca25f',
        '<=50K': global_colors['<=50K'],
        '>50K': global_colors['>50K']
    }

    var data = []
    var max_val = 0
    var margin_add = 0.5
    for (var i = 0; i < dt.data_dict.length; i++) {
        if (i==0) {
            data.push([dt.data_dict[i][0], margin_add, dt.data_dict[i][1] + dt.data_dict[i][2], 'inner', dt.data_dict[i][1] + dt.data_dict[i][2]]);
            data.push([dt.data_dict[i][0] + " <=50K", margin_add, dt.data_dict[i][1], 'outer', dt.data_dict[i][1]]);
            data.push([dt.data_dict[i][0] + " >50K", dt.data_dict[i][1] + margin_add, dt.data_dict[i][1] + dt.data_dict[i][2], 'outer', dt.data_dict[i][2]]);
            max_val = dt.data_dict[i][1] + dt.data_dict[i][2];
        } else {
            data.push([dt.data_dict[i][0], max_val + margin_add, max_val + dt.data_dict[i][1] + dt.data_dict[i][2], 'inner', dt.data_dict[i][1] + dt.data_dict[i][2]]);
            data.push([dt.data_dict[i][0] + " <=50K", max_val + margin_add, max_val + dt.data_dict[i][1], 'outer', dt.data_dict[i][1]]);
            data.push([dt.data_dict[i][0] + " >50K", max_val + dt.data_dict[i][1] + margin_add, max_val + dt.data_dict[i][1] + dt.data_dict[i][2], 'outer', dt.data_dict[i][2]]);
            max_val = max_val + dt.data_dict[i][1] + dt.data_dict[i][2];
        }
    }
    for (var i = 0; i < data.length; i++) {
        data[i][1] = data[i][1]/max_val;
        data[i][2] = data[i][2]/max_val;
    }
    var svg = d3.select('.piechart')
        .append("g")
        .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

    svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', path)
        .attr("fill", function(d, i) {return colorCode[d[0]]?colorCode[d[0]]:colorCode[d[0].substr(d[0].length-5).trim()];})
        .on("mouseover", pieMouseOver)
        .on("mouseout", pieMouseOut);

    var textPth = d3.svg.arc()({
        startAngle: 0,
        endAngle: 2 * Math.PI,
        innerRadius: 0,
        outerRadius: radius.r1 - 1
    });
    svg.append('path')
        .attr('id', 'txtPie')
        .attr('d', textPth)
        .attr('fill', 'white');

    function path(d) {
        var arcGenerator = d3.svg.arc();
        var ir = radius.r1;
        var or = radius.r2;
        if (d[3] == 'inner') {
            ir = radius.r1;
            or = radius.r2;
        } else {
            ir = radius.r2 + 1;
            or = radius.r3;
        }
        var pathData = arcGenerator({
            startAngle: 2 * Math.PI * d[1],
            endAngle: 2 * Math.PI * d[2],
            innerRadius: ir,
            outerRadius: or
        });
        return pathData
    }

    function pieMouseOver(d, i) {
        svg.select('#txtPie')
            .attr("fill", colorCode[d[0]]?colorCode[d[0]]:colorCode[d[0].substr(d[0].length-5).trim()])
            .attr('opacity', 0)
            .transition().duration(transition_duration*2)
            .attr('opacity', 1);

        svg.selectAll('text')
            .data((d[0]+' Count:'+d[4]+' Share:'+(Math.round((d[2]-d[1])*100))+'%').split(' '))
            .enter()
            .append('text')
            .attr('transform', function(d, i) {return 'translate(0, '+(-10+i*10)+')'})
            .text(function(d, i) { return d;})
            .style('text-anchor', 'middle')
            .attr('opacity', 0)
            .transition().duration(transition_duration*2)
            .attr('opacity', 1)
            ;
    }

    function pieMouseOut(d, i) {
        d3.select('#txtPie')
            .transition().duration(transition_duration*2)
            .attr("fill", 'white');
        svg.selectAll('text').remove()
    }
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
        data.push({'Index': dt['data_dict'][i][0], 'Age':dt['data_dict'][i][1], 'FnlWgt':dt['data_dict'][i][2], 'CapitalGain':dt['data_dict'][i][3], 'CapitalLoss':dt['data_dict'][i][4], 'HrsPerWk':dt['data_dict'][i][5], 'Income':dt['data_dict'][i][6]})
    }

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
            .attr("d", path)
            .attr("stroke", function(d,i){ return global_colors[d[6]];});

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
            .attr("class", "foreground")
        .selectAll("path")
            .data(data)
        .enter().append("path")
            .attr("d", path)
            .attr("stroke", function(d,i){ return global_colors[d.Income];});

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