
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/widgets/Legend"
], (
    Map,
    MapView,
    Basemap,
    VectorTileLayer,
    FeatureLayer,
    Graphic,
    Legend
) => {
    // Predefined data
    const initialData = [
        {
            geometry: {
                type: "point",
                longitude: -117.2425,
                latitude: 32.6735
            },
            attributes: {
                Name: "Cabrillo National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -118.5590,
                latitude: 35.2234
            },
            attributes: {
                Name: "Cesar E. Chavez National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -119.0850,
                latitude: 37.6251
            },
            attributes: {
                Name: "Devils Postpile National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -115.0935,
                latitude: 35.2915
            },
            attributes: {
                Name: "Castle Mountains National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -121.5267,
                latitude: 41.7588
            },
            attributes: {
                Name: "Lava Beds National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -122.5811,
                latitude: 37.8970
            },
            attributes: {
                Name: "Muir Woods National Monument",
                Type: "National Monument"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: -121.3717,
                latitude: 41.8868
            },
            attributes: {
                Name: "Tule Lake National Monument",
                Type: "National Monument"
            }
        }
    ];

    // create map using custom basemap from ArcGIS Online
    const map = new Map({
        basemap: new Basemap({
            baseLayers: [
                new VectorTileLayer({
                    portalItem: { id: "474f0cb226884dd68f707ab0f2f1aa10" }
                })
            ],
            referenceLayers: [
                new VectorTileLayer({
                    portalItem: { id: "1768e8369a214dfab4e2167d5c5f2454" }
                })
            ]
        })
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 5,
        center: [-122.18, 37.49] // longitude, latitude
    });

    // create FeatureLayer
    const monumentLayer = new FeatureLayer({
        title: "National Monuments",
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            },
            {
                name: "Name",
                alias: "Name",
                type: "string"
            },
            {
                name: "Type",
                alias: "Type",
                type: "string"
            }
        ],
        objectIdField: "ObjectID",
        geometryType: "point",
        spatialReference: { wkid: 4326 },
        source: [],
        renderer: {
            type: "simple",
            symbol: {
                type: "web-style",
                styleName: "Esri2DPointSymbolsStyle",
                name: "landmark"
            }
        },
        popupTemplate: {
            title: "{Name}"
        }
    });
    map.add(monumentLayer);

    // add legend
    const legend = new Legend({
        view: view
    });
    view.ui.add(legend, "bottom-left");

    // add buttons to the mapView
    view.ui.add(document.getElementById("actions"), "top-right");

    const addBtn = document.getElementById("add");
    const removeBtn = document.getElementById("remove");
    const openModalBtn = document.getElementById("openModal");
    const modal = document.getElementById("myModal");
    const closeModalBtn = document.getElementsByClassName("close")[0];
    const addFeatureForm = document.getElementById("addFeatureForm");

    let clickedCoordinates = null;

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    addFeatureForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        if (clickedCoordinates && name) {
            const graphic   = new Graphic({
                geometry: {
                    type: "point",
                    latitude: clickedCoordinates.latitude,
                    longitude: clickedCoordinates.longitude
                },
                attributes: {
                    Name: name,
                    Type: "National Monument"
                }
                
            });
            const graphicObject = {
                geometry: {
                    type: "point",
                    latitude: clickedCoordinates.latitude,
                    longitude: clickedCoordinates.longitude
                },
                attributes: {
                    Name: name,
                    Type: "National Monument"
                }
            };
            
            //const graphicJSON = JSON.stringify(graphicObject);
            //mongo d


            saveEditedGraphic(graphicObject);
            
            const addEdits = {
                addFeatures: [graphic]
            };
            applyEditsToLayer(addEdits);
            modal.style.display = "none";
            addFeatureForm.reset();
            clickedCoordinates = null;
        } else {
            alert("Please click on the map to get coordinates and enter a name.");
        }
    });
    

    addBtn.addEventListener("click", addInitialFeatures);
    removeBtn.addEventListener("click", removeFeatures);

    view.on("click", (event) => {
        const lat = event.mapPoint.latitude.toFixed(4);
        const lon = event.mapPoint.longitude.toFixed(4);
        clickedCoordinates = { latitude: lat, longitude: lon };
        modal.style.display = "block";
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;
    });

    function addInitialFeatures() {
        const graphics = initialData.map(data => new Graphic(data));
        const addEdits = {
            addFeatures: graphics
        };
        applyEditsToLayer(addEdits);
    }

    function applyEditsToLayer(edits) {
        monumentLayer
            .applyEdits(edits)
            .then((results) => {
                if (results.deleteFeatureResults.length > 0) {
                    console.log(
                        results.deleteFeatureResults.length,
                        "features have been removed"
                    );
                    openModalBtn.disabled = false;
                    removeBtn.disabled = true;
                }
                if (results.addFeatureResults.length > 0) {
                    let objectIds = [];
                    results.addFeatureResults.forEach((item) => {
                        objectIds.push(item.objectId);
                    });
                    monumentLayer
                        .queryFeatures({
                            objectIds: objectIds
                        })
                        .then((results) => {
                            console.log(
                                results.features.length,
                                "features have been added."
                            );
                            openModalBtn.disabled = false;
                            removeBtn.disabled = false;
                        })
                }
            })
            .catch((error) => {
                console.error(error);
            });
        saveLayerData();
    }

    function removeFeatures() {
        monumentLayer.queryFeatures().then((results) => {
            const deleteEdits = {
                deleteFeatures: results.features
            };
            applyEditsToLayer(deleteEdits);
        });
    }

    async function saveLayerData() {
        console.log("saveLayerData function called");
        try {
            const response = await fetch('http://localhost:5000/api/save-feature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: monumentLayer.toJSON() })
            });
            const data = await response.json();
            console.log('Layer saved:', data);
        } catch (error) {
            console.error('Error saving layer data:', error);
        }
    }

    async function saveEditedGraphic(graphicObject){
        console.log("saveLayerData function called");
        try {
            const response = await fetch('http://localhost:5000/api/save-graphic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphicObject),
            });
            const data = await response.json();
            console.log('Saving new Graphic:', data);
        } catch (error) {
            console.error('Error saving graphic data:', error);
        }
    }
});
