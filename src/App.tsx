import "./App.css";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  return (
    <div className="app-container">
      <div className="background-split">
        <div className="left-half" />
        <div className="right-half" />
      </div>
      <div className="content">
        <div className="title">
          <h1 className="first-title">Sound</h1>
          <h1 className="second-title">Script</h1>
        </div>
        <AudioRecorder />
      </div>
    </div>
  );
}

export default App;
