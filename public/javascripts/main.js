var config = {
    containerId: "chartContainer",
    width: 600,
    height: 600,
    data: sampleData,
    heading: {
        text: "Stats from Social Media",
        pos: "top"
    },
    label: function(d) {
        return d.data.name + ": " + d.data.number;
    },
    value: "number",
    name: "name",
    inner: "drilldown",
    transition: "bounce",
    transitionDuration: 200,
    donutRadius: 75
};


var samplePie = new psd3.Pie(config);

