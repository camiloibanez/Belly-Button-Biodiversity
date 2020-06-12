d3.json("../../samples.json").then((data) => {
    data.names.forEach(function(id) {
        var dropdown = d3.select("#selDataset");
        dropdown.append("option").text(id);
    });

    function init() {
        var otuId = data.samples[0].otu_ids.slice(0,10).reverse();
        var otuValues = data.samples[0].sample_values.slice(0,10).reverse();
        var otuLabels = data.samples[0].otu_labels.slice(0,10).reverse();

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

        Plotly.newPlot("bar", [trace1], layout1);
        Plotly.newPlot("bubble", [trace2], layout2);

        var idMetadata = data.metadata[0];

        for (var i = 0; i < Object.keys(idMetadata).length; i++) {
            var keys = Object.keys(idMetadata);
            var values = Object.values(idMetadata);
            var infoBox = d3.select("#sample-metadata");

            infoBox.append("p").text(`${keys[i]}: ${values[i]}`);
        };
    };

    function optionChanged(id) {
        var index = data.names.indexOf(id);
        var newValues= data.samples[index].sample_values.slice(0,10).reverse();
        var newId = data.samples[index].otu_ids.slice(0,10).reverse();
        var newOTUId = newId.map(id => `OTU ${id}`);
        var newLabels = data.samples[index].otu_labels.slice(0,10).reverse();

        var newLayout = {
            title: `Top 10 OTU of Patient ${id}`
        };

        Plotly.restyle("bar", {x: [newValues], y: [newOTUId], text: [newLabels]});
        Plotly.relayout("bar", newLayout);

        Plotly.restyle("bubble", {x: [newId], y: [newValues], text: [newLabels]});
        Plotly.relayout("bubble", newLayout);

        d3.select("#sample-metadata").html("");

        var idMetadata = data.metadata[index];

        for (var i = 0; i < Object.keys(idMetadata).length; i++) {
            var keys = Object.keys(idMetadata);
            var values = Object.values(idMetadata);
            var infoBox = d3.select("#sample-metadata");

            infoBox.append("p").text(`${keys[i]}: ${values[i]}`);
        };
    };
});

init()