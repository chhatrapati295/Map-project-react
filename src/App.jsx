import MyMap from "./components/MyMap";
import "./App.css";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Otter Map</h1>
      <MyMap />
    </div>
  );
}

export default App;
