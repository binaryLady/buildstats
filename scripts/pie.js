/* Created by SCookBroen on 1/29/14.
 */


var custom_bubble_chart;
custom_bubble_chart = (function (d3) {

    "use strict";
    var mNodes;
    var viewType;
    //a global date variable
    var currentNodes,
        test,
        groupT,
//    var width = 900,
//        height = 900,
       // tooltip = CustomTooltip("custom_tooltip", 240),
        l_nodes = [];
    var margin = {top: 40, right: 20, bottom: 50, left: 200},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom,
        radius = Math.min(width - margin, height - margin) / 2,
        currGroup,
        mDate,
        mGroup,
        arcs,
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


    var enterAntiClockwise = {
        startAngle: Math.PI * 2,
        endAngle: Math.PI * 2
    };



    var min = Math.min(width, height);
    var oRadius = min / 1.5 * 0.9;
    var iRadius = 0;
    //arc generator
    var arc = d3.svg.arc()
        .outerRadius(oRadius)
        .innerRadius(iRadius);

    function custom_chart(data) {

        //create nodes from original data
        data.forEach(function (d) {


            var l_node = new Node();
            l_node.name = d.Application,
                l_node.colors = d.colors,
                l_node.app_group = d.app_group,
                l_node.total = +d.line_total,
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
    function instructions() {
        textBox
            .append("g").append("text").text("This is a drillable piechart showing the total lines of code for all measures applications." +
                "Click on the segments to drill-down. Choose from the date menu to view a different date.").attr("class", "info");
    }

    var createGradients = function (defs, colors, r) {
        var gradient = defs.selectAll('.gradient')
            .data(colors).enter().append("radialGradient")
            .attr("id", function (d, i) {
                return "gradient" + i;
            })
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("cx", "0").attr("cy", "0").attr("r", r).attr("spreadMethod", "pad");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", function (d) {
            return d;
        });

        gradient.append("stop").attr("offset", "30%")
            .attr("stop-color", function (d) {
                return d;
            })
            .attr("stop-opacity", 1);

        gradient.append("stop").attr("offset", "70%")
            .attr("stop-color", function (d) {
                return "black";
            })
            .attr("stop-opacity", 1);
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
        svg.selectAll(".one").remove();
        currentDate = this.innerHTML;

        groupT.text("Date: " + currentDate).attr("class", "group");

    }

    function sixM() {
        svg.selectAll(".two").remove();
        sixMos = this.innerHTML;

        svg.append("g").append("text").text("Date 2 " + sixMos).attr("class", "two dates").attr("x", width + 150).attr("y", 95);

    }

    function oneY() {
        svg.selectAll(".three").remove();
        oneYear = this.innerHTML;

        svg.append("g").append("text").text("Date 3 " + oneYear).attr("class", "three dates").attr("x", width + 150).attr("y", 110);
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
                    "total": d3.sum(leaves, function (d) {
                        return d.total;
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
                    "total": d3.sum(leaves, function (d) {
                        return d.total;
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
                    "total": d3.sum(leaves, function (d) {
                        return d.total;
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

        test = nodes;

        test.sort(d3.ascending);

        // console.log(test);
        //   console.log(test);

        layoutChart()

    }

    //Tool tip holder
    var tiper = d3.select('body')
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0);

    function hideTip() {
        tiper.style('opacity', 0);
    }

    function layoutChart() {
        d3.selectAll("pie").on("click",change);
       // svg.selectAll('.legend').remove();
        svg.selectAll("text").remove();
        svg.selectAll("rect").remove();
        svg.selectAll("circle").remove();
        var color = d3.scale.category10();

        var min = Math.min(width, height);
        var oRadius = min / 1.5 * 0.9;
        var iRadius = 0;

        //default pie layout

        test.forEach(function (d) {
            d.value.color = color(d.key);
        })


        var pie = d3.layout.pie().value(function (d) {
            return d.value.total;
        }).sort(null);

        //Display the app Group at the top
        groupT = svg.append("g").append("text").text("WEX total lines of code: " + currentDate).attr("class", "group");

        //arc generator
        var arc = d3.svg.arc()
            .outerRadius(oRadius)
            .innerRadius(iRadius);
        var g = svg.append("g")
            .attr("transform", "translate(200,320)");

        createGradients(g.append("defs"), test.map(function (d) {
            return d.value.color;
        }), 2.5 * oRadius);


       arcs = g.selectAll("path")
            .data(pie(test))


        arcs
            .enter().append("path")
            .attr("class", "pie")
            .attr("d", arc)
            .on("click", function (d) {
                return drill(d.data.key);
            })
            .attr("fill", function (d, i) {
                return "url(#gradient" + i + ")";
            })
            .on("mouseover",function(d){
                var k = d.data.key.split(" ");
                k = k[0];
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                    tiper
                        .transition()
                        .duration(200)
                        .style("opacity",.9)
                tiper.html('<p>' + k + '</p><p>Total Lines: ' + d.data.value.total + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)
            .each(function (d) {
                this._current = d;
            }); // store the initial values


        arcs  .attr("d", arc(enterAntiClockwise))
            .each(function (d) {
                this._current = {
//                    data: d.data,
//                    value: d.value,
                    startAngle: enterAntiClockwise.startAngle,
                    endAngle: enterAntiClockwise.endAngle
                };
            }); // store the initial values



        arcs.selectAll("path.pie")
            .attr("title", function(d) { return d.data.value.total; })
            .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });

        arcs.exit()
            .transition()
            .duration(750)
            .attrTween('d', arcTweenOut)
            .remove() // now remove the exiting arcs

        arcs.transition().duration(750).attrTween("d", arcTween); // redraw the arcs


        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")

        legend.selectAll('rect')
            .data(pie(test))
            .enter()
            .append('rect')
            //.attr("x", 400 )
            .attr("y", function(d, i){ return i *  25;})
            .attr("width", 18)
            .attr("height", 18)
            .style("fill",  function(d) { return d.data.value.color });

        legend.selectAll('text')
            .data(pie(test))
            .enter()
            .append('text')
            .attr('class','detail')
            .attr("x", 20 )
            .attr("y", function(d, i){ return (i *  25) + 8;})
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { console.log("data:" + d.key); return d.data.key; });
    }

    function drill(wedge) {
        d3.selectAll("path").on("click",change);
        svg.selectAll("rect").remove();
        svg.selectAll("text").remove();
        svg.selectAll('.legend').remove();
        svg.selectAll("circle").remove();
        //console.log("e " + wedge);
        var keyStr = wedge;
        var keySplit = keyStr.split(" ");

        var mDateStr = keySplit[1];
        var groupStr = keySplit[0];
        currGroup = groupStr;
        //console.log("strings: " + keySplit);
        var mNodes = createDateNodes(currentNodes);
        mNodes = mNodes[groupStr];


        //Display the app Group at the top
        svg.append("g").append("text").text("Total lines of code: " + groupStr).attr("class", "group");

        mNodes = d3.entries(mNodes);

        var color = d3.scale.category10();

        mNodes.forEach(function (d) {
            d.value.color = color(d.key);
        })

        var min = Math.min(width, height);
        var oRadius = min / 1.5 * 0.9;
        var iRadius = 0;

        //default pie layout

        var pie = d3.layout.pie().value(function (d) {
            return d.value.total;
        }).sort(null);

        //arc generator
        var arc = d3.svg.arc()
            .outerRadius(oRadius)
            .innerRadius(iRadius);
        var g = svg.append("g")
            .attr("transform", "translate(200,320)")
            .attr("font-size", "20px");


        createGradients(g.append("defs"), mNodes.map(function (d) {
            return d.value.color;
        }), 2.5 * oRadius);

        arcs = g.selectAll("path")
            .data(pie(mNodes))


        arcs
            .enter().append("path")
            .attr("class", "pie")
            .attr("d", arc)
            .on("click", function (d) {
                return drillDeep(d.data.key);
            })
            .attr("fill", function (d, i) {
                return "url(#gradient" + i + ")";
            })
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p>'+ d.data.key + '</p><p>Total Lines: ' + d.data.value.total + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)
            .each(function (d) {
                this._current = d;
            }); // store the initial values


        arcs  .attr("d", arc(enterAntiClockwise))
            .each(function (d) {
                this._current = {
//                    data: d.data,
//                    value: d.value,
                    startAngle: enterAntiClockwise.startAngle,
                    endAngle: enterAntiClockwise.endAngle
                };
            }); // store the initial values

        arcs.exit()
            .transition()
            .duration(750)
            .attrTween('d', arcTweenOut)
            .remove() // now remove the exiting arcs

        arcs.transition().duration(750).attrTween("d", arcTween); // redraw the arcs


       var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")

           legend.selectAll('rect')
               .data(pie(mNodes))
               .enter()
               .append('rect')
               //.attr("x", 400 )
               .attr("y", function(d, i){ return i *  25;})
               .attr("width", 18)
               .attr("height", 18)
               .style("fill",  function(d) { return d.data.value.color });

        legend.selectAll('text')
            .data(pie(mNodes))
            .enter()
            .append('text')
            .attr('class','detail')
            .attr("x", 20 )
            .attr("y", function(d, i){ return (i *  25) + 8;})
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { console.log("data:" + d.key); return d.data.key; });

    }

    function drillDeep(wedge) {
        d3.selectAll("path").on("click",change);
        svg.selectAll("rect").remove();
        svg.selectAll("text").remove();
        svg.selectAll("circle").remove();
        svg.selectAll(".legend").remove();

        var keyStr = wedge;


        var mNodes = createAllNodes(currentNodes);

        var keySplit = keyStr.split(" ");

        var mDateStr = keySplit[1];
        var groupStr = keySplit[0];


        //Display the app Group at the top
        svg.append("g").append("text").text("Application Breakdown: " + groupStr).attr("class", "group");

        mNodes = d3.values(mNodes);
        //console.log("these: "+  keyStr);
        var color = d3.scale.category10();

        mNodes.forEach(function (d) {
            d.value.color = color(d.key);
        })


        var pie = d3.layout.pie().value(function (d) {
            return d.value.total;
        }).sort(null);

        var g = svg.append("g")
            .attr("transform", "translate(200,320)")
            .attr("font-size", "20px");

        d3.selectAll("pie").on("change", change);

        createGradients(g.append("defs"), mNodes.map(function (d) {
            return d.value.color;
        }), 2.5 * oRadius);

        arcs = g.selectAll("path")
            .data(pie(mNodes))

        arcs
            .enter().append("path")
            .attr("class", "pie")
            .attr("d", arc)
            .on("click", createGroupNodes)
            .attr("data-legend", function (d) {
                return d.data.key;
            })
            .on("mouseover",function(d){
                tiper.transition()
                    .duration(500)
                    .style("opacity", 0)
                tiper
                    .transition()
                    .duration(200)
                    .style("opacity",.9)
                tiper.html('<p>'+ d.data.key + '</p><p>Total Lines: ' + d.data.value.total + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", hideTip)

       .attr("fill", function (d, i) {
            return "url(#gradient" + i + ")";
        })

            .each(function (d) {
                this._current = d;
            }); // store the initial values


        arcs  .attr("d", arc(enterAntiClockwise))
            .each(function (d) {
                this._current = {
//                    data: d.data,
//                    value: d.value,
                    startAngle: enterAntiClockwise.startAngle,
                    endAngle: enterAntiClockwise.endAngle
                };
            }); // store the initial values

        arcs.exit()
            .transition()
            .duration(750)
            .attrTween('d', arcTweenOut)
            .remove() // now remove the exiting arcs

        arcs.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        g.selectAll("data-legend")
            .attr("fill", function (d) {
                return d.value.color;
            })

//        g.selectAll("text")
//            .data(pie(mNodes))
//            .enter().append("text")
//            .attr("transform", function (d) {
//                return "translate(" + arc.centroid(d) + ")";
//            })
//            .attr("dy", ".40em")
//            .style("text-anchor", "middle")
//            .text(function (d) {
//                return d.data.value.total
//            })


        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + 620 + ",30)")

        legend.selectAll('rect')
            .data(pie(mNodes))
            .enter()
            .append('rect')
            //.attr("x", 400 )
            .attr("y", function(d, i){ return i *  25;})
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return d.data.value.color });

        legend.selectAll('text')
            .data(pie(mNodes))
            .enter()
            .append('text')
            .attr('class','detail')
            .attr("x", 20 )
            .attr("y", function(d, i){ return (i *  25) + 8;})
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { console.log("data:" + d.key); return d.data.key; });


    }

    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }

    function arcTweenOut(a) {
        var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }
    function change() {

        arcs.enter().append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc(enterAntiClockwise))
            .each(function (d) {
                this._current = {
                    data: d.data,
                    value: d.value,
                    startAngle: enterAntiClockwise.startAngle,
                    endAngle: enterAntiClockwise.endAngle
                };
            }); // store the initial values

        arcs.exit()
            .transition()
            .duration(750)
            .attrTween('d', arcTweenOut)
            .remove() // now remove the exiting arcs

        svg.selectAll(".legend").transition()
            .duration(750)
            .each("end", function () {
                d3.select(this).remove();
            })

        arcs.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    }
    function dateMenu() {
        //make menu for date select
        mDate.sort(function (a, b) {
            var f = moment(a, "MMMM-DD-YYYY");
            var g = moment(b, "MMMM-DD-YYYY");
            //console.log("date:" + f + " " + g);
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

        var sub = d3.selectAll(".submit");

        lines1.on("click", createGroupNodes);

        var res = d3.selectAll(".reset");

        res.on("click", reset);
    }

    function reset() {
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

    /*
     function showGroups() {
     //var data = currentNodes;
     var c_data = l_nodes;

     */

    //makeMenu(c_data);


    /*        function makeMenu(mData) {
     //make menu for date select
     var lines = d3.selectAll("#date-nav-list").selectAll("ul")
     .data(mData, function (d, i) {
     return d.date;
     });


     lines.enter().append("li").append("a")
     .attr("href", "#")
     .text(function (d) {
     return d.date;
     })
     .on("click", dateNode);
     lines.exit().remove();

     }*/
    /*
     function dateNode() {
     console.log(currDate);
     //make sure if user selects a app_group it shows data from the correct cat.
     var type = this.parentNode.parentNode.parentNode;
     type = type.children[0].innerHTML;
     //console.log(type);
     //pass the current cat. to the nodeSwitcher
     my_mod.setView(type);
     //switch nodes if necessary
     //nodeSwitcher();
     var mData = currentNodes;
     var groupNodes = [];
     var groupNode = new Node();
     var mDate = this.innerHTML;
     setDate(mDate);
     //isolate the nodes by app_group
     //select only the nodes of the chosen app_group and pass to dataChange()
     for (var i = 0; i < mData.length; i++) {

     if (mData[i].date == mDate) {
     groupNode = mData[i];
     groupNodes.push(groupNode);

     }
     //console.log(groupNodes);
     }
     dataChange(groupNodes);

     }*/

    /*        function setDate(date) {
     //TODO create a date function that maintains the nodes date through switching from app_group view to app view
     //until a new date is selected, maybe try a string to store the curr date globally
     currDate = date;
     var lines = d3.selectAll("#vis").selectAll("h3")
     .text(currDate);


     lines.exit;
     return currDate;
     }

     }*/

    var my_mod = {};
    my_mod.init = function (_data) {
        //console.log('raw data'+_data);
        custom_chart(_data);
        //nodeSwitcher();
        //showGroups();
    };


    return my_mod;

})(d3);