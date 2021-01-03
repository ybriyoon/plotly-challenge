// Use the D3 library to read in samples.json.
d3.json("samples.json").then(function createPlotly(data) {
    console.log(data);
    var testid = data.names;
    console.log(testid);
  
    // Create a dynamic dropdown menu
    d3.select("#selDataset")
      .selectAll("option")
      .data(testid)
      .enter()
      .append("option")
      .html(function(d) {
        return `<option>${d}</option`;
      });
  
    var dropdownmenu = d3.select("#selDataset");
    var dropdownval = dropdownmenu.property("value");
    var index = testid.indexOf(dropdownval);
  
    // interactive demographic info
    d3.select("#sample-metadata").html("");
    d3.select("#sample-metadata")
      .selectAll("p")
      .data(Object.entries(data.metadata[index]))
      .enter()
      .append("p")
      .html(function(d) {
        return `${d[0]} : ${d[1]}`;
      });
  
    console.log(Object.entries(data.metadata[index]));
  
    // bar graph
    var samplevalues = data.samples[index].sample_values.slice(0, 10).reverse();
    var defaultotuData = data.samples[index].otu_ids.slice(0, 10).reverse();
    var otulabel = data.samples[index].otu_labels.slice(0, 10).reverse();
    var baryxis = defaultotuData.map(a => "OTU" + a);
  
    var bardata = [{
        y: baryxis,
        x: samplevalues,
        type: "bar",
        orientation: "h",
        text: otulabel
      }
    ];
  
    var barLayout = {
      title: "TOP10 Sample Values",
      yaxis: { title: "OTU ID" },
      xaxis: { title: "Sample Values" }
      
    };
  
    Plotly.newPlot("bar", bardata, barLayout);
  
    // bubble chart
    var bubbleData = [{
        y: data.samples[index].sample_values,
        x: data.samples[index].otu_ids,
        mode: "markers",
        text: data.samples[index].otu_labels,
        marker: {
          size: data.samples[index].sample_values,
          color: data.samples[index].otu_ids,
          colorscale: "Viridis"
        }
      }
    ];
  
    var bubbleLabels = {
      title: "Bacteria Cultures Per Sample",
      yaxis: { title: "Sample Values" },
      xaxis: { title: "OTU ID" }
    };
  
    Plotly.newPlot("bubble", bubbleData, bubbleLabels);
  

    d3.select("#selDataset").on("change", optionChanged);
  
    function optionChanged() {
      console.log("Different item was selected.");
      var dropdownmenu = d3.select("#selDataset");
      var dropdownval = dropdownmenu.property("value");
      console.log(`Currently test id ${dropdownval} is shown on the page`);
  
      // Update graph
      createPlotly(data);
    }
  });

// Initialize the dashboard
init();
