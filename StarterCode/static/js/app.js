d3.json("https://camiloibanez.github.io/plotly-challenge/StarterCode/samples.json").then(function(data) {
    data.names.forEach(function(id) {
        var dropdown = d3.select("#selDataset");
        dropdown.append("option").text(id);
    });

    function init() {
        
        var ids = data.samples[0].otu_ids;
        var values = data.samples[0].sample_values;
        var labels = data.samples[0].otu_labels;

        var otus = ids.map(function(value, index) {
            return {"id": value, "count": values[index], "name": labels[index]};
        });

        otus.sort((a,b) => b.count - a.count);

        var otuId = otus.map(OTU => OTU.id).slice(0,10).reverse();
        var otuValues = otus.map(OTU => OTU.count).slice(0,10).reverse();
        var otuLabels = otus.map(OTU => OTU.name).slice(0,10).reverse();

        var trace1 = {
            x: otuValues,
            y: otuId.map(id => `OTU ${id}`),
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var layout1 = {
            title: "Top 10 OTU of Patient 940",
            xaxis: {title: "Count of OTU"},
            yaxis: {title: "OTU Id"}
        };

        var trace2 = {
            x: otuId,
            y: otuValues,
            mode: "markers",
            text: otuLabels,
            marker: {size: otuValues,
                    color: otuId}
        };

        var layout2 = {
            title: "Top 10 OTU of Patient 940",
            xaxis: {title: "OTU Id"},
            yaxis: {title: "Count of OTU"}
        };

        var trace3 = {
            title: {text: "Scrubs per Week"},
            domain: {x: [0, 1], y: [0, 1]},
            value: data.metadata[0].wfreq,
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {range: [null, 9]},
                steps: [
                    {range: [0,1], color: "#FFFFCC"},
                    {range: [1,2], color: "#F7FFCC"},
                    {range: [2,3], color: "#EEFF99"},
                    {range: [3,4], color: "#BFFF80"},
                    {range: [4,5], color: "#99FF33"},
                    {range: [5,6], color: "#2BFF00"},
                    {range: [6,7], color: "#22CC00"},
                    {range: [7,8], color: "#1A9900"},
                    {range: [8,9], color: "#116600"},
                ]
            }

        };

        var layout3 = {
            title: "Belly Button Washing Frequency"
        };
        
        Plotly.newPlot("bar", [trace1], layout1);
        Plotly.newPlot("bubble", [trace2], layout2);
        Plotly.newPlot("gauge", [trace3], layout3);

        var idMetadata = data.metadata[0];

        for (var i = 0; i < Object.keys(idMetadata).length; i++) {
            var keys = Object.keys(idMetadata);
            var values = Object.values(idMetadata);
            var infoBox = d3.select("#sample-metadata");

            infoBox.append("p").text(`${keys[i]}: ${values[i]}`);
        };
    };

    
    init();
});

function optionChanged(id) {
    d3.json("https://camiloibanez.github.io/plotly-challenge/StarterCode/samples.json").then(function(data) {
    
    var idIndex = data.names.indexOf(id);
    
    var ids2 = data.samples[idIndex].otu_ids;
    var values2 = data.samples[idIndex].sample_values;
    var labels2 = data.samples[idIndex].otu_labels;

    var otus2 = ids2.map(function(value, index) {
        return {"id": value, "count": values2[index], "name": labels2[index]};
    });

    otus2.sort((a,b) => b.count - a.count);

    var newValues= otus2.map(OTU => OTU.count).slice(0,10).reverse();
    var newId = otus2.map(OTU => OTU.id).slice(0,10).reverse();
    var newOTUId = newId.map(id => `OTU ${id}`);
    var newLabels = otus2.map(OTU => OTU.name).slice(0,10).reverse();

    var newLayout = {
        title: `Top 10 OTU of Patient ${id}`
    };

    var newWFreq = data.metadata[idIndex].wfreq;
    
    Plotly.restyle("bar", {x: [newValues], y: [newOTUId], text: [newLabels]});
    Plotly.relayout("bar", newLayout);

    Plotly.restyle("bubble", {x: [newId], y: [newValues], text: [newLabels]});
    Plotly.relayout("bubble", newLayout);

    Plotly.restyle("gauge", {value: [newWFreq]});

    d3.select("#sample-metadata").html("");

    var idMetadata = data.metadata[idIndex];

    for (var i = 0; i < Object.keys(idMetadata).length; i++) {
        var keys = Object.keys(idMetadata);
        var values = Object.values(idMetadata);
        var infoBox = d3.select("#sample-metadata");

        infoBox.append("p").text(`${keys[i]}: ${values[i]}`);
    };
})};

d3.select("#selDataset").on("change", optionChanged(this.value));

