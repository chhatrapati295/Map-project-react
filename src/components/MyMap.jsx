import { useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw, Modify, Snap } from "ol/interaction"; // Importing drawing related interactions from OpenLayers
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

function MyMap() {
  // State variables to track map, draw type, vector layer,  and pin feature
  const [map, setMap] = useState(null);
  const [drawType, setDrawType] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [pinFeature, setPinFeature] = useState(null);

  // Here we initialize the map
  useEffect(() => {
    const mapInstance = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([77, 28.45]),
        zoom: 10,
      }),
    });
    setMap(mapInstance);

    const vectorLayerInstance = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "black",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "black",
          }),
        }),
      }),
    });
    mapInstance.addLayer(vectorLayerInstance);
    setVectorLayer(vectorLayerInstance);

    return () => mapInstance.dispose();
  }, []);

  // This is the function for handle changes in draw -->
  useEffect(() => {
    if (map && drawType) {
      if (drawInteraction) {
        map.removeInteraction(drawInteraction);
      }

      // Creating a new draw by selecting  draw type
      const draw = new Draw({
        source: vectorLayer.getSource(),
        type: drawType,
      });
      map.addInteraction(draw);
      setDrawInteraction(draw);

      // Adding modification in the map ---->
      const modify = new Modify({ source: vectorLayer.getSource() });
      map.addInteraction(modify);
      const snap = new Snap({ source: vectorLayer.getSource() });
      map.addInteraction(snap);

      return () => {
        // Clean up for remove draw, modify, and snap from the map -->
        map.removeInteraction(draw);
        map.removeInteraction(modify);
        map.removeInteraction(snap);
      };
    }
  }, [map, drawType]);

  // This function to handle adding or removing pin feature
  const togglePin = () => {
    if (!pinFeature) {
      // If pin feature doesn't exist, create a new point feature and add it to the vector layer

      const point = new Feature({
        geometry: new Point(fromLonLat([77, 28.45])),
      });
      vectorLayer.getSource().addFeature(point);
      setPinFeature(point);
    } else {
      // If pin feature exists, remove it from the vector layer
      vectorLayer.getSource().removeFeature(pinFeature);
      setPinFeature(null);
    }
  };

  // Function to handle changes in draw type
  const handleDrawTypeChange = (type) => {
    // Update the draw type state
    setDrawType(type);
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Div element for the map */}
      <div
        id="map"
        style={{ width: "100%", height: "400px", margin: "auto" }}
      ></div>
      {/* Buttons for different draw types and pin handling */}
      <div
        style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-start" }}
      >
        <button className="point" onClick={() => handleDrawTypeChange("Point")}>
          Draw Point
        </button>
        <button
          className="line"
          onClick={() => handleDrawTypeChange("LineString")}
        >
          Draw Line
        </button>
        <button
          className="polygon"
          onClick={() => handleDrawTypeChange("Polygon")}
        >
          Draw Polygon
        </button>
        <button className="drop" onClick={togglePin}>
          {pinFeature ? "Remove Pin" : "Drop Pin"}
        </button>
      </div>
      <i>made by chhatrapati.dev</i>
    </div>
  );
}

export default MyMap;
