// data route
var sampleMetaDataRoute = "/metadata/";
var dataRoute = "/samples/";

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  
    // construct url
    var MetaURL = (sampleMetaDataRoute+sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panelSelect = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panelSelect.html("");

    d3.json(MetaURL).then(function(response){
      // console.log(response);

      /*loop through response object to pull AGE, BBTYPE, ETHNICITY
         GENDER, LOCATION 
      */

        Object.entries(response).forEach(function([key,value]){
          var entry = panelSelect.append("div");
          entry.text(key+": "+value);   
        
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  // construct url
   var url = (dataRoute+sample);

    // @TODO: Build a Bubble Chart using the sample data
      // Use d3 to select the panel with id of `#bubble`
      var bubbleSelect = d3.select("#bubble");

      // Use `.html("") to clear any existing metadata
      bubbleSelect.html("");

      d3.json(url).then(function(response){
        var otu_ids = response.otu_ids;
        var otu_labels = response.otu_labels;
        var samples = response.sample_values.map(function(item){
          return parseFloat(item,2);
        });

        // console.log(otu_ids);
        // console.log(otu_labels);
        // console.log(samples);

        var traceBubble = {
          x: otu_ids,
          y: samples,
          mode: 'markers',
          hovertext: otu_labels,
          marker: {
            size: samples,
            color: otu_ids
            
          }
        };

        var bubbleData = [traceBubble];

        var bubbleLayout = {
          title: "Belly Button Distribution",
          showlegend: false
        };

        Plotly.newPlot("bubble",bubbleData, bubbleLayout);
        buildPlot();
      });
      
    // @TODO: Build a Pie Chart

      // Use d3 to select the panel with id of `#pie`
      var pieSelect = d3.select("#pie");

      // Use `.html("") to clear any existing metadata
      pieSelect.html("");

        d3.json(url).then(function(response){

          var otu_ids_10 = response.otu_ids.slice(0,10);
          var otu_labels_10 = response.otu_labels.slice(0,10);
          var samples_10 = response.sample_values.slice(0,10).map(function(item){
            return parseFloat(item,2);
          });

          // console.log(otu_ids_10);
          // console.log(otu_labels_10);
          // console.log(samples_10);

          var tracePie = {
            labels: otu_ids_10,
            values: samples_10,
            hovertext: otu_labels_10,
            type: 'pie'
          };

          var pieData = [tracePie];

          var pieLayout = {
            title: "Top 10 Belly Button Samples"
          };

          Plotly.newPlot("pie",pieData, pieLayout);
          buildPlot();

      });

  
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
