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
        xAxe,
        yAxe,
        grid,
        grid2,
        currGroup,
        grid3,
        grid4,
        format = d3.time.format("%B-%d-%Y"),
        padding = 3, // separation between same-color nodes
        currentDate = 0,
        sixMos = 0,
        colorNodes,
        oneYear = 0;
    var nodes;
    var bars;

    var x,
        y,
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
                l_node.colors = d.colors,
                l_node.app_group = d.app_group,
                l_node.line_total = +d.line_total,
                l_node.testedp = +d.line_tested,
                l_node.unTested = +d.line_total - +d.line_tested,
                l_node.date = d.date;

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
        //console.log(colorNodes);

    }

    function currDate() {
        textBox.selectAll(".info").remove();
        textBox.selectAll(".one").remove();
        currentDate = this.innerHTML;
        textBox
            .append("g").append("text").text("Date 1 " + currentDate).attr("class", "one dates").attr("x", width + 150).attr("y", 95);

    }

    function sixM() {
        textBox.selectAll(".info").remove();
        textBox.selectAll(".two").remove();
        sixMos = this.innerHTML;
        textBox
            .append("g").append("text").text("Date 2 " + sixMos).attr("class", "two dates").attr("x", width+ 150).attr("y", 110);

    }

    function oneY() {
        textBox.selectAll(".info").remove();
        textBox.selectAll(".three").remove();
        oneYear = this.innerHTML;
        textBox
            .append("g").append("text").text("Date 3 " + oneYear).attr("class", "three dates").attr("x", width +150).attr("y", 125);
    }
    function instructions() {
        textBox
            .append("g").append("text").text("This is a drillable barchart showing the automated testing percentages with a three date comparison." +
                "Click on the bars to drill-down. Choose from the date menu to compare different dates.").attr("class", "info");
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

                    "testedP": d3.sum(leaves, function (d) {
                        return d.testedp;
                    }),
                    "untested": d3.sum(leaves, function (d) {
                        return d.unTested;
                    }),
                    "total": d3.sum(leaves, function (d) {
                        return +d.line_total;
                    })}
            })
            .sortValues(d3.ascending)
            .sortKeys(d3.ascending)
            .map(nodes, d3.map);


        // var key = d3.keys(mCurrentNodes[0]);
        //currentNodes = d3.entries(mCurrentNodes);
        mGroup = d3.keys(mCurrentNodes);
        mDate = d3.keys(mCurrentNodes[mGroup[0]]);
        nodes = d3.entries(mCurrentNodes[currGroup]);
        //nodes = mCurrentNodes;
        //dateMenu(mDate);


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

                    "testedP": d3.sum(leaves, function (d) {
                        return d.testedp;
                    }),
                    "untested": d3.sum(leaves, function (d) {
                        return d.unTested;
                    }),
                    "total": d3.sum(leaves, function (d) {
                        return +d.line_total;
                    })}
            })
            .sortValues(d3.ascending)
            .sortKeys(d3.ascending)
            .map(nodes, d3.map);


        // var key = d3.keys(mCurrentNodes[0]);
        //currentNodes = d3.entries(mCurrentNodes);
        mGroup = d3.keys(mCurrentNodes);
        mDate = d3.keys(mCurrentNodes[mGroup[0]]);
        nodes = d3.entries(mCurrentNodes[mGroup[0]]);
        //nodes = mCurrentNodes;
        //dateMenu(mDate);

        //console.log(d3.entries(mCurrentNodes));
        //console.log(nodes);

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

                    "testedP": d3.sum(leaves, function (d) {
                        return d.testedp;
                    }),
                    "untested": d3.sum(leaves, function (d) {
                        return d.unTested;
                    }),
                    "total": d3.sum(leaves, function (d) {
                        return +d.line_total;
                    })}
            })
            .sortValues(d3.ascending)
            .map(nodes, d3.map);

        //console.log("dates: " + sixMos + " " + oneYear + " " + currentDate);
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
        if (oneYear === 0) {
            oneYear = mDate[int3];
        }
        mGroup = d3.merge([d3.keys(mCurrentNodes[currentDate]), d3.keys(mCurrentNodes[sixMos]), d3.keys(mCurrentNodes[oneYear])]);

        mGroup.sort(d3.ascending);

        //create an array of the nodes we want to use
        //TODO variable-ize the time stamps  to be 6months and one year from most recent with toggle function for the user

        nodes = d3.entries(mCurrentNodes[currentDate]);
        var nodes2 = d3.entries(mCurrentNodes[sixMos]);
        var nodes3 = d3.entries(mCurrentNodes[oneYear]);

        test = d3.merge([nodes, nodes2, nodes3]);

        //ftest.sort(d3.ascending);


        layoutChart()

    }

    var userFunctionstack = [function (d) {
        return y(d.key);
    } , function (d) {
        return y(d.key) + y.rangeBand() / 3;
    },
        function (d) {
            return y(d.key) + y.rangeBand() / 3 * 2;
        },
        function (d) {
            var k = d.key.split(" ");
            return k[0];
        }

    ];

    var userFunctionstack2 = [function (d) {
        return y(new Date(d.key));
    },
        function (d) {
            return y(new Date(d.key)) + y.rangeBand() / 3;
        },
        function (d) {
            return y(new Date(d.key)) + y.rangeBand() / 3 * 2;
        },
        function (d) {
            var k = d.key.split(" ");
            return k[0];
        },
        function (d) {
            return drillDeeper(d);
        }];

    //Tool tip holder
    var tiper = d3.select('body')
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function hideTip() {
        tiper.style('opacity', 0);
    }

    function makeBars(thisData, action, key) {
        var bars = svg.selectAll(".bar")
            .data(thisData);

        var formatter = d3.format(".0%");

        bars
            .enter().append("rect")
            .attr("class", "enter")
            .style("fill", '#009999')
            .attr("y", key[0])
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Tested Percentage")
            .on("click", action)
            .on("mouseover", function (d) {
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity", .9)
                tiper.html('<p> Tested Percentage: ' + formatter(d.value.testedP) + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)


        bars
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value.testedP);
            })

        bars.exit()
            .remove()
        bars
            .enter().append("rect")
            .attr("class", "enter")
            .style("fill", "#99FF66")
            .attr("y", key[0])
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Untested Percentage")
            .on("click", action)
            .on("mouseover", function (d) {
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity", .9)
                tiper.html('<p> Untested Percentage: ' + formatter(d.value.untested) + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)


        bars
            .transition()
            .duration(750)
            .attr("x", function (d) {
                return x(d.value.testedP);
            })
            .attr("width", function (d) {
                return x(d.value.untested);
            })
        bars.exit()
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
        var formatter = d3.format(".0%");

        svg.append("g").append("text").text("Automated Testing Percentages All WEX").attr("class", "group");
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

        test.forEach(function (d) {

            d.value.testedP = d.value.testedP / d.value.total;
            d.value.untested = d.value.untested / d.value.total;
            d.value.total = d.value.testedP + d.value.untested;
        })

        //console.log("these ds: " + d3.values(test));

        function make_x_axis() {
            return d3.svg.axis()
                .scale(x)
                .orient("bottom")
            // .ticks("")
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
            .tickFormat(formatter);

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


        svg.selectAll("g.bars")
            .data(test)
            .enter().append("text")
            .attr("class", "labels")
            .text(userFunctionstack2[3])
            .attr("x", width)
            .attr("y", userFunctionstack[0])
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
        currGroup = groupStr;
        //console.log("strings: " + keySplit);
        var mNodes = createDateNodes(currentNodes);
        mNodes = mNodes[groupStr];


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

        mNodes.forEach(function (d) {
            d.value.name = keySplit;
            d.value.testedP = d.value.testedP / d.value.total;
            d.value.untested = d.value.untested / d.value.total;
            d.value.total = d.value.testedP + d.value.untested;
        })

      //  //console.log(d3.keys(mNodes));
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
                .tickFormat(formatter);
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
            .tickFormat(formatter);


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(mNodes.length)
            .tickFormat(d3.time.format("%B-%d-%Y"));


        x.domain([0, d3.max(mNodes, function (d) {
            return d.value.total
        })]);


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
        grid.remove();
        grid2.remove();
        svg.selectAll(".enter").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".exit").transition().duration(750).ease("linear").attr("width", 0).attr("x", 0).each("end", function () {
            d3.select(this).remove();
        });
        svg.selectAll(".group").remove();
        svg.selectAll(".dates").remove();

        var dateF = d3.time.format("%B-%d-%Y");

        svg.selectAll(".labels").remove();
        svg.selectAll(".x axis").remove();
        svg.selectAll(".y axis").remove();
        //var parseDate = d3.time.format("%B-%d-%Y").parse;
        //console.log("strings: " + new Date(bar.key));
        var formatter = d3.format(".0%");
        var color = d3.scale.category10();

        //var keyStr = bar;


        var mDateStr = new Date(bar.key);
        mDateStr = dateF(mDateStr);
        //var groupStr = keyStr[0];

        var mNodes = createAllNodes(currentNodes);
        //mNodes = mNodes[groupStr];


        //Display the app Group at the top
        svg.append("g").append("text").text(currGroup + " Application Breakdown: " + mDateStr).attr("class", "group");

        mNodes = d3.values(mNodes);

      //  //console.log("nodes: " + mNodes);

        mNodes.forEach(function (d) {
            d.value.color = color(d.key)
            d.value.testedP = d.value.testedP / d.value.total;
            d.value.untested = d.value.untested / d.value.total;
            d.value.total = d.value.testedP + d.value.untested;
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
                .tickFormat(formatter);
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
            .tickFormat(formatter);


        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(mNodes.length)
            ;


        x.domain([0, d3.max(mNodes, function (d) {
            return d.value.total
        })]);


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

       // makeBars(mNodes, createGroupNodes, userFunctionstack);

        bars = svg.selectAll("bars")
            .data(mNodes);

        bars
            .enter().append("rect")
            .attr("class", "exit")
            .style("fill", function (d) {
                return d.value.color;
            })
            .attr("y", function (d) {
         //       ////console.log('y: ' + d.key);
                return y(d.key);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Tested Percentage")
            .on("click", createGroupNodes)
            .on("mouseover", function (d) {
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity", .9)
                tiper.html('<p> Tested Percentage: ' + formatter(d.value.testedP) + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)


        bars
            .transition()
            .duration(750)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(+d.value.testedP);
            })

        bars.exit()
            .remove();

        svg
            .append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)

        bars
            .enter().append("rect")
            .attr("class", "exit")
            .style("fill", function (d) {
                return d.value.color;
            })
            .attr("y", function (d) {
                return y(d.key);
            })
            .style('fill', 'url(#diagonalHatch)')
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", 0)
            .attr("data-legend", "Untested Percentage")
            .on("click", createGroupNodes)
            .on("mouseover", function (d) {
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity", .9)
                tiper.html('<p> Untested Percentage: ' + formatter(d.value.untested) + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)



        bars
            .transition()
            .duration(750)
            .attr("x", function (d) {
                return x(+d.value.testedP);
            })
            .attr("width", function (d) {
                return x(+d.value.untested);
            })

        bars.exit()
            .remove();


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
            ////console.log("date:" + f + " " + g);
            return f - g;
        })
        var lines1 = d3.selectAll("#date-nav-list").selectAll("ul")
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
        var lines3 = d3.selectAll("#date-nav-list3").selectAll("ul")
            .data(mDate);

        lines3.enter().append("li").append("a")
            .attr("href", "#")
            .text(function (d) {
                return d;
            })
            .on("click", oneY);


        lines3.exit().remove();

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