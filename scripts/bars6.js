/* Created by SCookBroen on 1/29/14.
 */


var custom_bubble_chart;
custom_bubble_chart = (function (d3, CustomTooltip) {

    "use strict";
    var mNodes;
    var viewType;
    //a global date variable
    var currentNodes,
        test,
//    var width = 900,
//        height = 900,
        tooltip = CustomTooltip("custom_tooltip", 240),
        l_nodes = [];
    var margin = {top: 40, right: 20, bottom: 50, left: 200},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom,
        mDate,
        mGroup,
        yAxis,
        xAxis,
        tip,
        tip2,
        bars,
        currGroup,
        xAxe,
        yAxe,
        grid,
        grid2,
        xAxe2,
        yAxe2,
        grid3,
        grid4,
        format = d3.time.format("%B-%d-%Y"),
        padding = 3, // separation between same-color nodes
        currentDate = 0,
        sixMos = 0,
        colorNodes,
        colorArr =['rgb(208,28,139)','rgb(241,182,218)','rgb(184,225,134)','rgb(77,172,38)'],
        oneYear = 0;
    var nodes;
    var bars;

    var x,
        y,
        x2,
        y2,
        dat = [],
        ext;
    var textBox = d3.select("#vis")
        .append("div")
        .attr("id","dateHolder")
        .attr("width",200)
        .attr("height",400);

    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    function custom_chart(data) {

        //create nodes from original data
        data.forEach(function (d) {


            var l_node = new Node();

            l_node.name = d.Application,
                l_node.date = d.date,
                l_node.colors = d.colors,
                l_node.app_group = d.app_group;
                l_node.total = +d.line_total,
                l_node.build = +d.build * +d.line_total,
                l_node.dep = +d.deployment * +d.line_total,
                l_node.mig = d.migration * +d.line_total;

            l_nodes.push(l_node);
            dat.push(new Date(d.date));

        });

        //Get the min and max date
        ext = d3.extent(dat);
        currentNodes = l_nodes;
        createGroupNodes();
        getColors(l_nodes);
        instructions();
        dateMenu();
        //store the nodes

    }

    //TODO Color Function
    function getColors(nodes) {
        colorNodes = d3.nest()
            .key(function (d) {
                return d.app_group;
            })
            .key(function (d) {
                return d.colors;
            })
            .map(nodes);
        colorNodes = d3.entries(colorNodes);
        ////console.log(colorNodes);

    }
    //Tool tip holder
    var tiper = d3.select('body')
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0);


    function currDate() {
        textBox.selectAll("info").remove();
        textBox.selectAll(".one").remove();
        currentDate = this.innerHTML;
        textBox
            .append("g").append("text").text("Date 1 " + currentDate).attr("class", "one dates").attr("x", width + 150).attr("y", 95);

    }

    function sixM() {
        textBox.selectAll("info").remove();
        textBox.selectAll(".two").remove();
        sixMos = this.innerHTML;
        textBox
            .append("g").append("text").text("Date 2 " + sixMos).attr("class", "two dates").attr("x", width+ 150).attr("y", 110);

    }

    function instructions(){
        textBox
            .append("g").append("text").text("This is a drillable barchart showing the automated testing total for build, migration, and deployment with a two date comparison." +
                "Click on the bars to drill-down. Choose from the date menu to compare different dates.").attr("class","info");
    }

    function createAllNodes(nodes) {


        var mCurrentNodes = d3.nest()
            .key(function (d) {
                return d.app_group;
            })
            .key(function (d) {
                return d.name;
            })
            .rollup(function (leaves) {
                return {
                    "build": d3.sum(leaves, function (d) {
                        return +d.build;
                    }),
                    "mig": d3.sum(leaves, function (d) {
                        return +d.mig;
                    }),
                    "total": d3.sum(leaves, function(d){
                        return +d.total;
                    }),
                    "dep": d3.sum(leaves, function (d) {
                        return +d.dep;
                    })}
            })
            .sortValues(d3.ascending)
            .sortKeys(d3.ascending)
            .map(nodes, d3.map);

        var maxC = d3.max(d3.values(mCurrentNodes));
        //console.log('maxC'+ maxC);

        mGroup = d3.keys(mCurrentNodes);
        mDate = d3.keys(mCurrentNodes[mGroup[0]]);
        nodes = d3.entries(mCurrentNodes[currGroup]);

        return nodes;
    }

    function createDateNodes(nodes) {


        var mCurrentNodes = d3.nest()
            .key(function (d) {
                return d.app_group;
            })
            .key(function (d) {
                return d.date.replace(/-/g, "/");
            })
            .rollup(function (leaves) {
                return {
                    "build": d3.sum(leaves, function (d) {
                        return +d.build;
                    }),
                    "mig": d3.sum(leaves, function (d) {
                        return +d.mig;
                    }),
                    "total": d3.sum(leaves, function(d){
                        return +d.total;
                    }),
                    "dep": d3.sum(leaves, function (d) {
                        return +d.dep;
                    })}
            })
            .sortValues(d3.ascending)
            .sortKeys(d3.ascending)
            .map(nodes, d3.map);


        mGroup = d3.keys(mCurrentNodes);
        mDate = d3.keys(mCurrentNodes[mGroup[0]]);
        nodes = d3.entries(mCurrentNodes[mGroup[0]]);


        return mCurrentNodes;
    }

    function createGroupNodes() {
        //Take data and crunch it!
        var nodes = currentNodes;
        var mCurrentNodes = d3.nest()
            .key(function (d) {
                return format(new Date(d.date));
            })
            .key(function (d) {
                return d.app_group + ' ' + format(new Date(d.date));
            })
            .rollup(function (leaves) {
                return {
                    "build": d3.sum(leaves, function (d) {
                        return +d.build;
                    }),
                    "mig": d3.sum(leaves, function (d) {
                        return +d.mig;
                    }),
                    "total": d3.sum(leaves, function(d){
                        return +d.total;
                    }),
                    "dep": d3.sum(leaves, function (d) {
                        return +d.dep;
                    })}
            })
            .sortValues(d3.ascending)
            .map(nodes, d3.map);
        var maxC = d3.max(d3.values(mCurrentNodes));
        //console.log('maxC'+ maxC);
       // //console.log("dates: " + sixMos + " " + oneYear + " " + currentDate);
        mDate = d3.keys(mCurrentNodes);
        mDate.sort(function (a, b) {
            var f = moment(a, "MMMM-DD-YYYY");
            var g = moment(b, "MMMM-DD-YYYY");
            //console.log("date:" + f + " " + g);
            return f - g;
        })
        var int1 = mDate.length -1;
        var int2 = (mDate.length-1)/2;
        var int3 = 0;
        if (currentDate === 0) {
            currentDate = mDate[int1];
        }
        if (sixMos === 0) {
            sixMos = mDate[int2];
        }


        mGroup = d3.merge([d3.keys(mCurrentNodes[currentDate]), d3.keys(mCurrentNodes[sixMos])]);

        mGroup.sort(d3.ascending);

        //create an array of the nodes we want to use
        //TODO variable-ize the time stamps  to be 6months and one year from most recent with toggle function for the user

        nodes = d3.entries(mCurrentNodes[currentDate]);
        var nodes2 = d3.entries(mCurrentNodes[sixMos]);
       // var nodes3 = d3.entries(mCurrentNodes[oneYear]);

        test = d3.merge([nodes, nodes2]);

        //test.sort(d3.ascending);


        layoutChart()

    }
    var userFunctionstack = [function (d) {
        return y(d.key);
    } , function (d) {
        return y(d.key) + y.rangeBand() / 4;
    },
        function (d) {
            return y(d.key) + y.rangeBand() / 4 * 2;
        },
        function (d) {
            return y(d.key) + y.rangeBand() / 4 * 3;
        }];

    var userFunctionstack2 = [function (d) {
        return y(new Date(d.key));
    },
        function (d) {
            return y(new Date(d.key)) + y.rangeBand() / 4;
        },
        function (d) {
            return y(new Date(d.key)) + y.rangeBand() / 4 * 2;
        },
        function (d) {
            return y(new Date(d.key)) + y.rangeBand() / 4 * 3;
        },
        function (d) {
            return drillDeeper(d);
        }];
    //Tool tip holder
    var tiper = d3.select('body')
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function hideTip(){
        tiper.style('opacity', 0);
    }

    function makeBars(thisData, action, key) {
        var bar = svg.selectAll(".bar")
            .data(thisData);


        bar.enter().append("rect")
            .attr("class", "enter")
            .style("fill", colorArr[0])
            .attr("y",key[0])
            .attr("height", y.rangeBand()/4)
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Build Total")
            .on("click", action)
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p> Build: ' + d.value.build + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)
        bar
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value.build);
            })
        bar.exit()
            .remove();

        bar.enter().append("rect")
            .attr("class", "enter")
            .style("fill", colorArr[1])
            .attr("y", key[1])
            .attr("height", y.rangeBand()/4)
            .attr("x", 0)
            .attr("width",0)
            .attr("data-legend", "Migration Total")
            .on("click", action)
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p> Migration: ' + d.value.mig + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)

        bar
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value.mig);
            })
        bar.exit()
            .remove();

        bar.enter().append("rect")
            .attr("class", "enter")
            .style("fill", colorArr[2])
            .attr("y", key[2])
            .attr("height", y.rangeBand()/4)
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Deployment Total")
            .on("click", action)
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p> Deployment: ' + d.value.dep + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)

        bar
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value.dep);
            })
        bar.exit()
            .remove();
        bar.enter().append("rect")
            .attr("class", "enter")
            .style("fill", colorArr[3])
            .attr("y", key[3])
            .attr("height", y.rangeBand()/4)
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Total Lines")
            .on("click", action)
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p> Total Lines: ' + d.value.total + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)

        bar
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value.total);
            })
        bar.exit()
            .remove();




    }

        function layoutChart() {
        svg.selectAll(".group").remove();
        svg.selectAll(".dates").remove();
        svg.selectAll(".grid").remove();
        svg.selectAll(".exit").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".enter").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".labels").remove();
        //svg.selectAll(".x axis").remove();
        svg.selectAll(".tick").remove();


        svg.append("g").append("text").text("Automated Testing" ).attr("class", "group");

        y = d3.scale.ordinal().rangeRoundBands([height, 0], .05);
        x = d3.scale.linear().range([0, width]);


        test.sort(function (a, b) {
            var akey = a.key.toLowerCase(), bkey = b.key.toLowerCase();
            if (akey < bkey)
                return -1
            if (akey > bkey)
                return 1
            return 0;
        })

       // var formatter = d3.format(".0%");

        function make_x_axis() {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
               // .tickFormat(formatter);
        }

        function make_y_axis() {
            return d3.svg.axis()
                .scale(y)
                .orient("left")
            //    .ticks(test.length)
        }


        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.tickFormat(formatter);

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")


        //  .tickFormat('');

        y.domain(test.map(function (d) {
            return d.key;
        }));
        x.domain([0, d3.max(test, function (d) {
            return d.value.total;
        })]);


        xAxe = svg.append("g");

        xAxe
            .transition()
            .duration(750)
            .call(xAxis);
        xAxe
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (width + 130) + ")")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.4em")
            .attr("dy", ".35em")
            .attr("transform", "rotate(-45)");


        yAxe = svg.append("g");

        yAxe
            .transition()
            .duration(750)
            .call(yAxis);


        yAxe
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end");


        grid = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")


        grid
            .transition()
            .duration(750)
            .call(make_x_axis()
                .tickSize(-height, 0, 0)
                .tickFormat("")
        );


        grid2 = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0,13)")


        grid2
            .transition()
            .duration(750)
            .call(make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
        )
     makeBars(test, drill, userFunctionstack);


            svg.selectAll("g.bar")
                .data(test)
                .enter().append("text")
                .attr("class", "labels")
                .text(function (d) {
                    var k = d.key.split(" ");
                    return k[0];
                })
                .attr("x", width)
                .attr("y", function (d) {
                    return y(d.key);
                })
                .attr("transform", "translate(0,15)")
                .attr("fill", "#cccccc")


            var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")
            .style("font-size", "20px")
            .attr("stroke", "#999999")
            .attr("data-style-padding", 10)
            .attr("fill", "white")
            .call(d3.legend);


    }

    function drill(e) {
        grid.remove();
        grid2.remove();
        svg.selectAll(".enter").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".group").remove();
        svg.selectAll(".dates").remove();
        svg.selectAll(".labels").remove();
        svg.selectAll(".x axis").remove();
        svg.selectAll(".y axis").remove();
        //var parseDate = d3.time.format("%B-%d-%Y").parse;

        var formatter = d3.format(".0%");

        var keyStr = e.key;
        var keySplit = keyStr.split(" ");

        var mDateStr = keySplit[1];
        var groupStr = keySplit[0];
        ////console.log("strings: " + keySplit);
        var mNodes = createDateNodes(currentNodes);
        mNodes = mNodes[groupStr];

        currGroup = groupStr;
        //Display the app Group at the top
        svg.append("g").append("text").text(groupStr).attr("class", "group");

        mNodes = d3.entries(mNodes);

        mNodes.forEach(function (d) {
            var f = moment(d.key, "YYYY/MM/DD");
            d.key = Date.parse(f);

        })

        //sort
        mNodes.sort(function (a, b) {
            var akey = new Date(a.key), bkey = new Date(b.key);
            return akey - bkey;
        })
       // //console.log(d3.keys(mNodes));
        y = d3.scale.ordinal()
            .domain(mNodes.map(function (d) {
                return new Date(d.key);
            }))
            .rangeRoundBands([height, 0], .05);
        //y = d3.time.scale.domain([height, 0], .05);
        x = d3.scale.linear().range([0, width]);

        function make_x_axis() {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
             //   .tickFormat(formatter)
        }

        function make_y_axis() {
            return d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(mNodes.length)
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
          //  .tickFormat(formatter)


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(mNodes.length)
            .tickFormat(d3.time.format("%B-%d-%Y"));


        x.domain([0, d3.max(mNodes,function(d){return d.value.total;})]);


        xAxe
            .transition()
            .duration(750)
            .call(xAxis);

        xAxe
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (width + 130) + ")")
            //.call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.4em")
            .attr("dy", ".35em")
            .attr("transform", "rotate(-45)");

        yAxe
            .transition()
            .duration(750)
            .call(yAxis);
        yAxe
            .attr("class", "y axis")
            //.call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end");


        grid3 = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")

        grid3
            .transition()
            .duration(750)
            .call(make_x_axis()
                .tickSize(-height, 0, 0)
                .tickFormat("")
        );

        grid4 = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0, 0)")

        grid4
            .transition()
            .duration(750)
            .call(make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
        );

        makeBars(mNodes, userFunctionstack2[4], userFunctionstack2);


        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")
            .style("font-size", "20px")
            .attr("stroke", "#999999")
            .attr("data-style-padding", 10)
            .attr("fill", "white")
            .call(d3.legend);


    }
    function drillDeeper(bar) {
        grid3.remove();
        grid4.remove();
        svg.selectAll(".enter").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".exit").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".group").remove();
        svg.selectAll(".dates").remove();
        svg.selectAll(".legend").remove();
        svg.selectAll(".labels").remove();
        svg.selectAll(".x axis").remove();
        svg.selectAll(".y axis").remove();
        //var parseDate = d3.time.format("%B-%d-%Y").parse;
        ////console.log("strings: " + bar);
        //var formatter = d3.format(".0%");
        var color = d3.scale.category10();

        var formatter = d3.format(".0%");
        var keyStr = bar;
        var dateF = d3.time.format("%B-%d-%Y");


        var mDateStr = new Date(bar.key);
        mDateStr = dateF(mDateStr);
        var groupStr = keyStr[0];

        var mNodes = createAllNodes(currentNodes);
        //mNodes = mNodes[groupStr];
        //Display the app Group at the top
        svg.append("g").append("text").text(currGroup + " Application Breakdown: " + mDateStr).attr("class", "group");

        //Display the app Group at the top
        svg.append("g").append("text").text(groupStr).attr("class", "group");

        mNodes = d3.values(mNodes);

       // //console.log("nodes: " + mNodes);
       // mNodes = d3.entries(mNodes);

        mNodes.forEach(function (d) {
            d.value.color = color(d.key)

        })


        y = d3.scale.ordinal()
            .domain(mNodes.map(function (d) {
                return d.key;
            }))
            .rangeRoundBands([height, 0], .05);
        //y = d3.time.scale.domain([height, 0], .05);
        x = d3.scale.linear().range([0, width]);

        function make_x_axis() {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(formatter)

        }

        function make_y_axis() {
            return d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(mNodes.length)
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
          //  .tickFormat(formatter);



        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(mNodes.length)
            ;


        x.domain([0, d3.max(mNodes,function(d){return d.value.total;})]);


        xAxe
            .transition()
            .duration(750)
            .call(xAxis);

        xAxe
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (width + 130) + ")")
            //.call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.4em")
            .attr("dy", ".35em")
            .attr("transform", "rotate(-45)");

        yAxe
            .transition()
            .duration(750)
            .call(yAxis);
        yAxe
            .attr("class", "y axis")
            //.call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end");


        grid3 = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")

        grid3
            .transition()
            .duration(750)
            .call(make_x_axis()
                .tickSize(-height, 0, 0)
                .tickFormat("")
        );

        grid4 = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0, 0)")

        grid4
            .transition()
            .duration(750)
            .call(make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
        );

        makeBars(mNodes, createGroupNodes, userFunctionstack);


        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")
            .style("font-size", "20px")
            .attr("stroke", "#999999")
            .attr("data-style-padding", 10)
            .attr("fill", "white")
            .call(d3.legend);



    }

    function dateMenu() {
        //make menu for date select
        mDate.sort(function (a, b) {
            var f = moment(a, "MMMM-DD-YYYY");
            var g = moment(b, "MMMM-DD-YYYY");
          //  //console.log("date:" + f + " " + g);
            return f - g;
        })
        var lines1 = d3.selectAll("#date-nav-list").selectAll("ul")
            .attr("class","drop")
            .attr("href", "#")
            .data(mDate);

        lines1.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d;
            })
            .on("click", currDate);

        lines1.exit().remove();
        var lines2 = d3.selectAll("#date-nav-list2").selectAll("ul")
            .data(mDate);

        lines2.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d;
            })
            .on("click", sixM);

        lines2.exit().remove();

        var sub = d3.selectAll(".submit");

        sub.on("click", createGroupNodes);

        var res = d3.selectAll(".reset");

        res.on("click", reset);
    }

    function reset() {
        textBox.selectAll(".three").remove();
        textBox.selectAll(".two").remove();
        textBox.selectAll(".one").remove();
        instructions();
        currentDate = 0;
        sixMos = 0;
        oneYear = 0;
        createGroupNodes();
    }

    //node object superclass
    function Node() {
        this.id = "";
        this.name = "";
        this.colors = "";
        this.app_group = "";
        this.line_total = 0;
        this.percent = 0.0;
        this.line_tested = 0;
        this.pass = 0;
        this.date = new Date();

    }



    var my_mod = {};
    my_mod.init = function (_data) {
        ////console.log('raw data'+_data);
        custom_chart(_data);
        //nodeSwitcher();
        //showGroups();
    };


    return my_mod;

})(d3, CustomTooltip);