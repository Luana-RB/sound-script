import React from "react";
import { AudioSection, Container } from "./styles";
import TextBox from "../TextBox";
import RecordButton from "../RecordButton";

const AudioRecorder = () => {
  const [transcript, setTranscript] = React.useState("");
  const [isTranscripted, setIsTranscripted] = React.useState(false);

  return (
    <Container>
      <AudioSection>
        <h2>Gravador de áudio</h2>
        <RecordButton
          setTranscript={setTranscript}
          setIsTranscripted={setIsTranscripted}
        />
      </AudioSection>
      <TextBox
        transcript={transcript}
        isTranscripted={isTranscripted}
        setIsTranscripted={setIsTranscripted}
      />
    </Container>
  );
};

export default AudioRecorder;
