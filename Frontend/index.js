function getQueryParams() {
    const queryParamsString = window.location.search;
    const searchParams = new URLSearchParams(queryParamsString);
    const queryParams = {};

    // Iterate over each parameter and add it to the queryParams object
    for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
    }

    return queryParams;
}
const params = getQueryParams();
const userId = params.userId;

async function CheckAuthorize(){

   try {
    const response = await fetch('http://localhost:5000/auth/'+userId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.status!==200){
        console.log("Unauthorized access Please login");
        window.location.href = 'login.html';
    }
    
    
   } catch (error) {
    console.log("Error",error);
    window.location.href = 'login.html';
    
   }

}



if (!userId) {
  console.log("Unauthorized access Please login");
  window.location.href = 'login.html';
}
else{
  CheckAuthorize();
  require([
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/support/SnappingControls",
    "esri/Map",
    "esri/layers/GraphicsLayer",
    "esri/views/MapView",
    "esri/widgets/Expand",
    "esri/Graphic",
    "esri/geometry/geometryEngine"
  ], (
    SketchViewModel,
    SnappingControls,
    Map,
    GraphicsLayer,
    MapView,
    Expand,
    Graphic,
    geometryEngine
  ) => {
    const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });
   
    const map = new Map({
      basemap: "hybrid",
      layers: [graphicsLayer]
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 7,
      center: [-65.82579570034679, -37.385467010889435]
    });
  
    const sketchVM = new SketchViewModel({
      view: view,
      layer: graphicsLayer
    });


    const pointBtn = document.getElementById("pointBtn");
    const polylineBtn = document.getElementById("polylineBtn");
    const polygonBtn = document.getElementById("polygonBtn");
    const circleBtn = document.getElementById("circleBtn");
    const rectangleBtn = document.getElementById("rectangleBtn");
    const clearBtn = document.getElementById("clearBtn");
    const selectBtn = document.getElementById("selectBtn");
    const geoarea=document.getElementById("geodesicArea");
    let total_cost = 0;

    async function fetchGraphicsByUserId(userId) { 
      console.log("Fetching Graphics by userId");
      try {
          const response = await fetch('http://localhost:5000/api/save-graphicLayer/'+userId, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
              
          });
          
          const data = await response.json();
          console.log('Graphics fetched', data);
          return data;
      } catch (error) {
          console.log('Error saving graphic data:', error);
      }
      
  }  

    async function addUserGraphicsToLayer(){
      const graphicsJSON = await fetchGraphicsByUserId(userId);
      console.log(" User graphics fetched", graphicsJSON[0]);
      if(graphicsJSON[0]){
        graphicsJSON[0].data.forEach((feature) => {
          graphicsLayer.add(Graphic.fromJSON(feature));
        });
      console.log("Graphics added to the layer");
      total_cost=graphicsJSON[0].total_cost;
      geoarea.textContent = total_cost.toFixed(2); 
      console.log("Total cost", total_cost);

      }else{
        console.log("No graphics found for user", userId);
      }

      
    }
    addUserGraphicsToLayer();


    
  
    sketchVM.on("create", function(event) {
      
      if (event.state === "complete") {
        var cost=0;
        var geometry = event.graphic.geometry;
        if (geometry.type === "polygon" || geometry.type === "circle") {
          cost = computeAndDisplayArea(geometry);
        } else if (geometry.type === "polyline" || geometry.type === "line") {
         cost =  computeAndDisplayLength(geometry);
        } else {
          console.log("Geometry type not supported for area/length computation.");
        }
        console.log("cost: " + cost);
        total_cost += Number(cost);
        geoarea.textContent = total_cost.toFixed(2); 
        UpdateLayerData();
       
  
  }
     
    });

    sketchVM.on("delete", function(event) {
      event.graphics.forEach(function(graphic){
        console.log("deleted", graphic)
      });
    });
  
  
  
    // Add the calcite-panel for the styler to an Expand to hide/show the panel
    const stylerExpand = new Expand({
      view: view,
      content: document.getElementById("propPanel"),
      expanded: true,
      expandIcon: "pencil",
      expandTooltip: "Open Styler"
    });
  
    // Add SnappingControls to handle snapping
    const snappingControls = new SnappingControls({
      view: view,
      // Sets the widget to use the SketchViewModel's SnappingOptions
      snappingOptions: sketchVM.snappingOptions
    });
  
    // Add the SnappingControls to an Expand widget to hide/show the widget
    const snappingExpand = new Expand({
      view: view,
      content: snappingControls,
      expanded: false,
      expandIcon: "configure",
      expandTooltip: "Snapping Controls"
    });
  
    // Add the shortcut key description panel to an Expand widget
    const shortcutKeysExpand = new Expand({
      view: view,
      content: document.getElementById("sketchVM-controls"),
      expanded: false,
      expandIcon: "information",
      expandTooltip: "Keyboard Shortcuts"
    });
  
    view.when(() => {
      console.log("edit apllied");
      // Configure the UI to use the default property values from our SketchViewModel
      setDefaultCreateOptions();
      setDefaultUpdateOptions();
      setDefaultPointSymbol();
      setDefaultPolylineSymbol();
      setDefaultPolygonSymbol();
    });
  
    view.ui.add(stylerExpand, "top-right"); // Add the calcite panel
    view.ui.add(snappingExpand, "bottom-left"); // Add the Expand with SnappingControls widget
    view.ui.add(shortcutKeysExpand, "top-left");
  
    // Connecting the calcite actions with their corresponding SketchViewModel tools
  
  
    pointBtn.onclick = () => { sketchVM.create("point"); }
    polylineBtn.onclick = () => { sketchVM.create("polyline"); }
    polygonBtn.onclick = () => { sketchVM.create("polygon"); }
    circleBtn.onclick = () => { sketchVM.create("circle"); }
    rectangleBtn.onclick = () => { sketchVM.create("rectangle"); }
    clearBtn.onclick = () => { sketchVM.layer.removeAll(); }
    selectBtn.onclick = () => { sketchVM.cancel(); }
  
    // Calcite UI logic
    // Auto-populate UI with default SketchViewModel properties set.
    // If no default values are set, UI will be set accordingly.
    function setDefaultCreateOptions() {
      
      const options = sketchVM.defaultCreateOptions;
      const modeSelect = document.getElementById("mode-select");
  
      // set default mode in the select element if defined
      if (options?.mode) {
        setDefaultOption(modeSelect, options.mode);
      }
  
      // handles mode select changes
      modeSelect.addEventListener("calciteSelectChange", () => {
        sketchVM.defaultCreateOptions["mode"] = modeSelect.selectedOption.value;
      });
    }
  
    function setDefaultUpdateOptions() {
      const options = sketchVM.defaultUpdateOptions;
      const rotationSwitch = document.getElementById("rotationSwitch");
      const scaleSwitch = document.getElementById("scaleSwitch");
      const multipleSelectionSwitch = document.getElementById("multipleSelectionSwitch");
      const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");
  
      // set the UI elements to the default property values
      rotationSwitch.checked = options.enableRotation;
      scaleSwitch.checked = options.enableScaling;
      multipleSelectionSwitch.checked = options.multipleSelectionEnabled;
      aspectRatioSwitch.checked = options.preserveAspectRatio;
  
      // event listeners for UI interactions
      rotationSwitch.addEventListener("calciteSwitchChange", (evt) => {
          console.log("rotate")
        sketchVM.defaultUpdateOptions.enableRotation = evt.target.checked;
      });
      scaleSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.enableScaling = evt.target.checked;
      });
      multipleSelectionSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.multipleSelectionEnabled = evt.target.checked;
      });
      aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.preserveAspectRatio = evt.target.checked;
      });
    }
  
    function setDefaultPointSymbol() {
      console.log("point added");
      const pointSymbol = sketchVM.pointSymbol;
      const pointStyleSelect = document.getElementById("point-style-select");
      const pointSymbolOutlineBtn = document.getElementById("point-outline-btn");
      const pointSizeInput = document.getElementById("point-size-input");
      const pointXOffsetInput = document.getElementById("point-xoffset-input");
      const pointYOffsetInput = document.getElementById("point-yoffset-input");
      const pointAngleInput = document.getElementById("point-angle-input");
      const pointColorInput = document.getElementById("point-color-input");
      const slsWidthInput = document.getElementById("point-sls-width-input");
      const slsColorInput = document.getElementById("point-sls-color-input");
  
      pointSizeInput.value = pointSymbol.size;
      pointXOffsetInput.value = pointSymbol.xoffset;
      pointYOffsetInput.value = pointSymbol.yoffset;
      pointAngleInput.value = pointSymbol.angle;
      slsWidthInput.value = pointSymbol.outline.width;
  
      // set default style in the select element
      setDefaultOption(pointStyleSelect, pointSymbol.style);
  
      pointSizeInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.size = parseInt(evt.target.value);
      });
      pointXOffsetInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.xoffset = parseInt(evt.target.value);
      });
      pointYOffsetInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.yoffset = parseInt(evt.target.value);
      });
      pointAngleInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.angle = parseInt(evt.target.value);
      });
      pointStyleSelect.addEventListener("calciteSelectChange", () => {
        pointSymbol.style = pointStyleSelect.selectedOption.value;
      });
      pointColorInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.color = evt.target.value;
      });
      pointSymbolOutlineBtn.onclick = () => {
        openModal("point-outline-modal");
      };
      // point outline modal event listeners
      slsWidthInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.outline.width = parseInt(evt.target.value);
      });
      slsColorInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.outline.color = evt.target.value;
      });
    }
  
    function setDefaultPolylineSymbol() {
      const lineSymbol = sketchVM.polylineSymbol;
      const lineStyleSelect = document.getElementById("line-style-select");
      const lineWidthInput = document.getElementById("line-width-input");
      const lineColorInput = document.getElementById("line-color-input");
  
      lineWidthInput.value = lineSymbol.width;
  
      // set default style in the select element
      setDefaultOption(lineStyleSelect, lineSymbol.style);
  
      lineStyleSelect.addEventListener("calciteSelectChange", () => {
        lineSymbol.style = lineStyleSelect.selectedOption.value;
      });
      lineWidthInput.addEventListener("calciteInputInput", (evt) => {
        lineSymbol.width = parseInt(evt.target.value);
      });
      lineColorInput.addEventListener("calciteInputInput", (evt) => {
        lineSymbol.color = evt.target.value;
      });
    }
  
    function setDefaultPolygonSymbol() {
      const polygonSymbol = sketchVM.polygonSymbol;
      const polygonStyleSelect = document.getElementById("polygon-style-select");
      const polygonSymbolOutlineBtn = document.getElementById("polygon-outline-btn");
      const polygonColorInput = document.getElementById("polygon-color-input");
      const slsStyleSelect = document.getElementById("polygon-sls-style-select");
      const slsWidthInput = document.getElementById("polygon-sls-width-input");
      const slsColorInput = document.getElementById("polygon-sls-color-input");
  
      slsWidthInput.value = polygonSymbol.outline.width;
  
      // set default style in the select element
      setDefaultOption(polygonStyleSelect, polygonSymbol.style);
      setDefaultOption(slsStyleSelect, polygonSymbol.outline.style);
  
      polygonStyleSelect.addEventListener("calciteSelectChange", () => {
        polygonSymbol.style = polygonStyleSelect.selectedOption.value;
      });
      polygonColorInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.color = evt.target.value;
      });
      polygonSymbolOutlineBtn.onclick = () => {
        openModal("polygon-outline-modal");
      };
      // polygon outline modal event listeners
      slsStyleSelect.addEventListener("calciteSelectChange", () => {
        polygonSymbol.outline.style = slsStyleSelect.selectedOption.value;
      });
      slsWidthInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.outline.width = parseInt(evt.target.value);
      });
      slsColorInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.outline.color = evt.target.value;
      });
    }
  
    // function to auto-populate calcite select components
    function setDefaultOption(selectElement, value) {
      for (let i = 0; i < selectElement.children.length; i++) {
        let option = selectElement.children[i];
        if (option.value === value) {
          option.selected = true;
        }
      }
    }
  
    // displays the appropriate modals
    function openModal(id) {
      document.getElementById(id).open = true;
    }
  
    async function saveLayerData() {
      console.log("saveLayerData function called");
      try {
          const response = await fetch('http://localhost:5000/api/save-graphicLayer', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ data: graphicsLayer.toJSON(), userId: userId })
          });
          // if(response.status === 401){
          //     window.location.href = 'login.html';
          // }
          const data = await response.json();
          console.log('Layer saved:', data);
      } catch (error) {
          console.error('Error saving layer data:', error);
      }
  }

  async function UpdateLayerData() {
    console.log("UpdateLayerData function called");
    try {
        const response = await fetch('http://localhost:5000/api/save-graphicLayer', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: graphicsLayer.graphics.toJSON(), userId: userId , total_cost: total_cost})
        });
        // if(response.status === 401){
        //     window.location.href = 'login.html';
        // }
        const data = await response.json();
        console.log('Layer updated:', data);
    } catch (error) {
        console.error('Error updated layer data:', error);
    }
}

 // Function to compute and display area for polygons/circles
 function computeAndDisplayArea(geometry) {
  var area;
  var cost;
  if (geometry.type === "polygon" || geometry.type === "circle") {
    area = geometryEngine.geodesicArea(geometry, "square-kilometers");
    cost=computeCost(area,10);
    console.log("Area: " + area.toFixed(2) + " square kilometers");

    return cost.toFixed(2);
  } else {
    console.log("Area computation is not applicable for this geometry type.");
  }
}

// Function to compute and display length for lines/polylines
function computeAndDisplayLength(geometry) {
  var length;
  var cost;
  if (geometry.type === "polyline" || geometry.type === "line") {
    length = geometryEngine.geodesicLength(geometry, "kilometers");
    cost=computeCost(length,5);
    console.log("Length: " + length.toFixed(2) + " kilometers");

    return cost.toFixed(2);


  } else {
    console.log("Length computation is not applicable for this geometry type.");
  }
}

function computeCost(dimension, factor){
  return dimension * factor;
}

 
  });
  

}
