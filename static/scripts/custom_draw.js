var svg_position = {
    row1: {height: 80, width1: 1200},
    row2: {height: 400, width1: 700, width2: 350, width3: 150},
    row3: {height: 300, width1: 450, width2: 300, width3: 450}
}

var global_colors = {
    "<=50K": "#FFA443",
    ">50K": "#7FBBD8",
    "barText": "#FF0000"
}

var transition_duration = 200;

function init() {
    // d3.select(".header")
    //     .attr("width", svg_position.row1.width1)
    //     .attr("height", svg_position.row1.height)
        // .style("top", 0)
        // .style("left", 0);
    d3.select(".parallelcoord")
        .attr("width", svg_position.row2.width1)
        .attr("height", svg_position.row2.height)
        // .style("top", svg_position.row1.height)
        // .style("left", 0);

    d3.select(".piechart")
        .attr("width", svg_position.row2.width2)
        .attr("height", svg_position.row2.height)
        // .style("top", svg_position.row1.height)
        // .style("left", svg_position.row2.width1);

    d3.select(".legends")
        .attr("width", svg_position.row2.width3)
        .attr("height", svg_position.row2.height)
        // .style("top", svg_position.row1.height)
        // .style("left", svg_position.row2.width1);

    d3.select(".horizontalbar")
        .attr("width", svg_position.row3.width1)
        .attr("height", svg_position.row3.height)
        .style("top", -90)
        // .style("top", svg_position.row1.height + svg_position.row2.height)
        // .style("left", 0);

    d3.select(".stackedbar")
        .attr("width", svg_position.row3.width2)
        .attr("height", svg_position.row3.height)
        .style("top", -90)
        // .style("top", svg_position.row1.height + svg_position.row2.height)
        // .style("left", svg_position.row3.width1);

    d3.select(".insights")
        .attr("width", svg_position.row3.width3)
        .attr("height", svg_position.row3.height)
        // .style("top", svg_position.row1.height + svg_position.row2.height)
        // .style("left", svg_position.row3.width1 + svg_position.row3.width2);

    draw_legends();
    draw_all('');
}

function draw_legends() {
    margin = {left:25, legendTop: 35}
    legend = d3.select('.legends')

    legend.append('rect')
        .attr('fill', '#979797')
        .attr('height', 120)
        .attr('width', svg_position.row2.width3)

    legend.append('text')
        .attr('transform', 'translate('+margin.left+', '+margin.legendTop+')')
        .attr('class', 'quadHeader')
        .text('Legends')
        .attr('fill', 'white')

    legend.append('rect')
        .attr('transform', 'translate('+(margin.left*1.4)+','+(margin.legendTop+15)+')')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', global_colors['<=50K'])
        .style('stroke-width',1)
        .style('stroke','white')

    legend.append('text')
        .attr('transform', 'translate('+(margin.left*1.4 + 30)+','+(margin.legendTop+30)+')')
        .text("<=50K income")
        .attr('fill', 'white')

    legend.append('rect')
        .attr('transform', 'translate('+(margin.left*1.4)+','+(margin.legendTop+45)+')')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', global_colors['>50K'])
        .style('stroke-width',1)
        .style('stroke','white')

    legend.append('text')
        .attr('transform', 'translate('+(margin.left*1.4 + 30)+','+(margin.legendTop+60)+')')
        .text(">50K income")
        .attr('fill', 'white')

    legend.append('rect')
        .attr('transform', 'translate(0, 150)')
        .attr('width',svg_position.row2.width3 )
        .attr('height', 50)
        .attr('fill', '#DE5B7B')
        .on('click',resetButton)

    legend.append('text')
        .attr('transform', 'translate('+(svg_position.row2.width3/2)+', 182)')
        .text("RESET")
        .attr('text-anchor', 'middle')
        .attr('fill','white')
        .style('font-size',20)
        .on('click',resetButton)

    function resetButton() {
        draw_all('')
    }
}

function draw_all(filter_string, income_filter) {
    // d3.select('.progress-div').style('display', 'block');
    // d3.select('.allSvg').style('display', 'none');
    if (filter_string === '') {
        $.post("/piechart", {}, draw_piechart);
        $.post("/hori_bc", {}, draw_hori_bc);
        $.post("/barch", {}, draw_bc);
        $.post("/getpca",{}, function(d) {draw_pca(d, false)});
        $.post("/pc", {}, function(d) {draw_pc(d, false)});
    } else {
        console.log({'list': filter_string, 'income_filter': income_filter})
        $.post("/piechart", {'list': filter_string, 'income_filter': income_filter}, draw_piechart);
        $.post("/hori_bc", {'list': filter_string, 'income_filter': income_filter}, draw_hori_bc);
        $.post("/barch", {'list': filter_string, 'income_filter': income_filter}, draw_bc);
        $.post("/getpca", {'list': filter_string, 'income_filter': income_filter},function(d) {draw_pca(d, true)});
        $.post("/pc", {'list': filter_string, 'income_filter': income_filter}, function(d) {draw_pc(d, true)});
    }
}


function draw_pca(dt, update){
    var margin = {top: 50, right: 25, bottom: 60, left: 25, text: 90},
    width = svg_position.row3.width3 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom;
    
    var data = dt['data_dict'];
    
    var l = data.length;

    var x = d3.scale.linear()
        .domain([d3.min(data, function(d){return d[0];}), d3.max(data, function(d){return d[0];})])
        .range([0 , width]);

    var y = d3.scale.linear()
        .domain([d3.min(data, function(d){return d[1];}), d3.max(data, function(d){return d[1];})])
        .range([0, height]);


    var ydash = d3.scale.linear()
        .domain([d3.min(data, function(d){return d[1];}), d3.max(data, function(d){return d[1];})])           
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");


    var yAxis = d3.svg.axis()
        .scale(ydash)
        .orient("left");

    if (update) {
        d3.select('.insights').selectAll('circle').remove();
        draw_pca_cirles(d3.select('.insights').select('#drawArea'));
        return;
    }

    d3.select('.insights')
        .append('text')
        .attr('class', 'quadHeader')
        .text("PCA Plot")
        .attr('transform','translate('+(margin.left * 2)+', 30)');

    d3.select('.insights')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Random Sampled")
        .attr('transform','translate('+(margin.left * 2 + 80)+', 30)')
        .style('fill','red')
        .style('font-size',20);

    var svg = d3.select(".insights")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + margin.text)
        .append("g")
        .attr('id', 'drawArea')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+(margin.left)+"," + (height + margin.top/5)  + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+(margin.left)+"," + (margin.top/5)  + ")")
        .call(yAxis);

    svg.append("text")
        .attr("class","axis")
        .attr("transform", "translate("+(width/2 - margin.left)+"," + (height + margin.top)  + ")")
        .text("Principal Component 1");

    svg.append("text")
        .attr("class","axis")
        .attr("transform", "rotate(-90) translate("+ (height/2 - 5*margin.top) +","+( margin.left/5 - 5 )+")" )
        .text("Principal Component 2")

    xMap = function(d) { return x(d[0]) + margin.left;};
    yMap = function(d) { return y(d[1]);}; 

    draw_pca_cirles(svg);

    function draw_pca_cirles(drawA) {
        d3.select('.allSvg')
            .select('.insights')
            .append('rect')
            .attr('fill','none')
            .attr('stroke', "#979797")
            .attr('height',svg_position.row3.height)
            .attr('width', svg_position.row3.width3)

        var cir = drawA.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("stroke", "red")
            .attr("stroke-width", "0")
            .attr("fill", function(d){ return d[3]?global_colors[d[2]]:"#e1e1e1"})
            .attr("r", 1.5)
            .attr("cx", (xMap))
            .attr("cy", (yMap))
            .style("opacity","0")
            .transition().duration(1500)
            .style("opacity","1");
    }
}


function draw_bc(dt){
    d3.select('.stackedbar').html('');
    var margin = {top: 50, right: 25, bottom: 25, left: 25, text: 90},
    width = svg_position.row3.width2 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom - margin.text;

    d3.select('.stackedbar')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Demographic by Marital Status")
        .attr('transform','translate('+margin.left+', 30)');

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
            .attr("transform", function(d, i) {return "translate(" + ( (i * barwidth) + margin.left)+ ","+ (margin.top/5 + y(d[1])) +")" ;})
            .on("mouseover", stackedBar1MouseOver)
            .on("mouseout", stackedBar1MouseOut)
            .on("click", stackedBar1MouseClick);

    var bar2 = svg2.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) {return "translate(" + ( (i * barwidth) + margin.left)+ ","+ (margin.top/5 + (y(d[1] + d[2]))) +")" ;})
            .on("mouseover", stackedBar2MouseOver)
            .on("mouseout", stackedBar2MouseOut)  
            .on("click", stackedBar2MouseClick);

    bar2.append("rect")
        .attr("width", barwidth-2)
        .attr("height", function(d){return (height - y(d[2])) ;})
        .attr("fill",global_colors[">50K"]);
    bar1.append("rect")
        .attr("width", barwidth-2)
        .attr("height", function(d){return (height - y(d[1]));})
        .attr("fill",global_colors["<=50K"]);

    bar1.append("text")
        .attr("x", 0)
        .attr("transform", function(d,i){return "translate("+ (10) +","+(height - y(d[1]))+") rotate(75) translate(10,0)" ;})
        .text(function(d) { return d[0];});

    bar1.append("text")
        .attr('x', barwidth/2)
        .attr('y', function(d){return -height + y(d[2]) + (height - y(d[1]+d[2]))/2;})
        .text(function(d){return d[1]})
        .style('text-anchor', 'middle')
        .attr("fill",global_colors["barText"])
        .style('opacity', 0)
        .attr('id', function(d,i){return "stackedBar1_"+i})

    bar1.append("text")
        .attr('x', barwidth/2)
        .attr('y', function(d){return -height + y(d[2]) + (height - y(d[1]+d[2]))/2;})
        .text(function(d){return d[2]})
        .style('text-anchor', 'middle')
        .attr("fill",global_colors["barText"])
        .style('opacity', 0)
        .attr('id', function(d,i){return "stackedBar2_"+i})

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+(margin.left)+"," + (height + margin.top/5)  + ")")
            .call(xAxis);
    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+(margin.left)+"," + (margin.top/5)  + ")")
            .call(yAxis);

    d3.select('.allSvg')
        .select('.stackedbar')
        .append('rect')
        .attr('fill','none')
        .attr('stroke', "#979797")
        .attr('height',svg_position.row3.height)
        .attr('width', svg_position.row3.width2)

    function stackedBar1MouseOver(d, i) {
        d3.select('#stackedBar1_'+i).transition().duration(transition_duration).style('opacity',1)
    }
    function stackedBar1MouseOut(d, i) {
        d3.select('#stackedBar1_'+i).transition().duration(transition_duration).style('opacity',0) 
    }
    function stackedBar2MouseOver(d, i) {
        d3.select('#stackedBar2_'+i).transition().duration(transition_duration).style('opacity',1)
    }
    function stackedBar2MouseOut(d, i) {
        d3.select('#stackedBar2_'+i).transition().duration(transition_duration).style('opacity',0) 
    }
    function stackedBar1MouseClick(d, i) {
        string = "(dataframe.marital_status == '" + d[0] + "')";
        draw_all(string,'None');  
    }
    function stackedBar2MouseClick(d, i) {
        string = "(dataframe.marital_status == '" + d[0] + "')";
        draw_all(string,'None');  
    }
}

function draw_hori_bc(dt){
    d3.select('.horizontalbar').html('');
    var margin = {top: 50, right: 25, bottom: 25, left: 25},
    width = svg_position.row3.width1 - margin.left - margin.right,
    height = svg_position.row3.height - margin.top - margin.bottom;

    d3.select('.horizontalbar')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Demographic by Profession")
        .attr('transform','translate('+(margin.left * 2)+', 30)');

    var svg = d3.select(".horizontalbar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg1 = svg.append("g");
    var svg2 = svg.append("g");

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
            .on("mouseover", horiBar1MouseOver)
            .on("mouseout", horiBar1MouseOut)
            .on("click", horiBar1MouseClick);

    var bar2 = svg2.selectAll("g")
            .data(data_hbc)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + (margin.left/2 + y(d[1])) + "," + (i * barwidth + margin.top/5) +")" ;})
            .on("mouseover", horiBar2MouseOver)
            .on("mouseout", horiBar2MouseOut)
            .on("click", horiBar2MouseClick);
    
    bar2.append("rect")
          .attr("height", barwidth-1)
          .attr("width", function(d){return (y(d[2]));})
          .attr("fill",global_colors['>50K']);
    bar1.append("rect")
          .attr("height", barwidth-1)
          .attr("width", function(d){return (y(d[1]));})
          .attr("fill",global_colors['<=50K']);

    bar2.append("text")
        .attr('id', function(d,i){ return 'hori_bc_bar_txt'+i})
        .attr("x", (barwidth) / 2)
        .attr("transform", function(d,i){return "translate("+ (-y(d[1])) +","+(barwidth/2 + 3)+")" ;})
        .attr("fill",global_colors["barText"])
        .text(function(d) { return d[0];});

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+(margin.left/2)+"," + (margin.top/5)  + ")")
            .call(xAxis);

    bar2.append("text")
        .text(function(d){return d[0]+' (>50K): '+d[2]})
        .attr('x', function(d){return 8-y(d[1])})
        .attr('y', 12)
        .attr("fill",global_colors["barText"])
        .style('opacity', 0)
        .attr('id', function(d,i){return "hori_bc_bar2"+i})

    bar1.append("text")
        .text(function(d){return d[0]+' (<=50K): '+d[1]})
        .attr('x', function(d){return 8})
        .attr('y', 12)
        .attr("fill",global_colors["barText"])
        .style('opacity', 0)
        .attr('id', function(d,i){return "hori_bc_bar1"+i})

    d3.select('.allSvg')
        .select('.horizontalbar')
        .append('rect')
        .attr('fill','none')
        .attr('stroke', "#979797")
        .attr('height',svg_position.row3.height)
        .attr('width', svg_position.row3.width1)

    function horiBar1MouseOver(d, i) {
        d3.select('#hori_bc_bar1'+i).style('opacity',1)
        d3.select('#hori_bc_bar_txt'+i).style('opacity', 0)        
    }
    function horiBar1MouseOut(d, i) {
        d3.select('#hori_bc_bar1'+i).style('opacity',0)
        d3.select('#hori_bc_bar_txt'+i).style('opacity', 1)        
    }
    function horiBar1MouseClick(d, i) {
        string = "(dataframe.occupation == '" + d[0] + "')";
        draw_all(string,'None');  
    }
    function horiBar2MouseOver(d, i) {
        d3.select('#hori_bc_bar2'+i).style('opacity',1)
        d3.select('#hori_bc_bar_txt'+i).style('opacity', 0)
    }
    function horiBar2MouseOut(d, i) {
        d3.select('#hori_bc_bar2'+i).style('opacity',0)
        d3.select('#hori_bc_bar_txt'+i).style('opacity', 1)
    }
    function horiBar2MouseClick(d, i) {
        string = "(dataframe.occupation == '" + d[0] + "')";
        draw_all(string,'None');  
    }
}

function draw_piechart(dt) {
    d3.select('.piechart').html('');

    var margin = {top: 70, right: 25, bottom: 30, left: 25},
    width = svg_position.row2.width2 - margin.left - margin.right,
    height = svg_position.row2.height - margin.top - margin.bottom;
    var radius = {r1: 50, r2: 100, r3: 150};

    d3.select('.piechart')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Demographic by Race")
        .attr('transform','translate('+margin.left+', 30)')

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
    var margin_add = 0
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
        .style('stroke','white')
        .style('stroke-width', 1)
        .on("mouseover", pieMouseOver)
        .on("mouseout", pieMouseOut)
        .on("click", pieMouseClick);

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

    d3.select('.allSvg')
        .select('.piechart')
        .append('rect')
        .attr('fill','none')
        .attr('stroke', "#979797")
        .attr('height',svg_position.row2.height)
        .attr('width', svg_position.row2.width2)

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
            .attr('transform', function(d, i) {return 'translate(0, '+(-10+i*15)+')'})
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

    function pieMouseClick(d, i) {
        components = d[0].split(' ');
        if (components.length==2) {
            string = "(dataframe.race == '" + components[0] + "') & (dataframe.income == '" + components[1] + "')";
            draw_all(string, components[1]);  
        } else {
            string = "(dataframe.race == '" + components[0] + "')"
            draw_all(string, "None")
        }
    }
}

function draw_pc(dt, update) {
    d3.select('.parallelcoord').html('');

    var margin = {top: 90, right: 50, bottom: 10, left: 50},
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
        foreground;

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

    function update_parallel(drawA, highlight) {
        if (highlight) {
        // Add blue foreground lines for focus.
        foreground = drawA.append("g")
                .attr("class", "foreground")
            .selectAll("path")
                .data(data)
            .enter().append("path")
                .attr("d", path)
                .attr("stroke", function(d,i){ return global_colors[d.Income];});

        } else {
        // Add blue foreground lines for focus.
        foreground = drawA.append("g")
                .attr("class", "foreground")
            .selectAll("path")
                .data(data)
            .enter().append("path")
                .attr("d", path)
                .attr("stroke", function(d,i){ return global_colors[d.Income];});
        }

        d3.select('.allSvg')
            .select('.parallelcoord')
            .append('rect')
            .attr('fill','none')
            .attr('stroke', "#979797")
            .attr('height',svg_position.row2.height)
            .attr('width', svg_position.row2.width1)
    }
 
    var svg = d3.select(".parallelcoord")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr('id','firstG')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    if (update==true) {
        update_parallel(svg, true)
    } else {
        update_parallel(svg, false)
    }
    
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

    d3.select('.parallelcoord')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Sampled")
        .attr('transform','translate('+(margin.left)+', 30)')
        .style('fill', 'red')

    d3.select('.parallelcoord')
        .append('text')
        .attr('class', 'quadHeader')
        .text("Demographic Distribution")
        .attr('transform','translate('+(margin.left + 80)+', 30)')

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

    d3.select('.progress-div').style('display', 'none');
    d3.select('.allSvg').style('display', 'block');
}