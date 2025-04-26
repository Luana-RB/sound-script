import React from "react";
import axios from "axios";
import { AudioSection, Container, RecordButton, TextSection } from "./styles";
import { FaPlay, FaStop } from "react-icons/fa";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audio = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audio.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = handleStop;

    audio.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleStop = async () => {
    const blob = new Blob(audio.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("file", blob, "audio/webm");
    formData.append("model", "whisper-1");
    const openaiKey = import.meta.env.VITE_OPENAI_KEY;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTranscript(response.data.text);
    } catch (e) {
      console.error(e);
      setTranscript(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Vestibulum auctor euismod turpis, vitae tempor lectus consectetur sed. In nec leo magna. Phasellus sollicitudin, nunc sed maximus tempus, nunc dui varius ipsum, a interdum elit turpis ac risus. Curabitur ultricies auctor justo, non sodales purus feugiat non. Nam efficitur libero at purus feugiat, ac viverra neque fermentum. Fusce venenatis eget felis eget pharetra. Nulla facilisi. Aliquam vehicula purus id nisi fermentum, et venenatis dui tempus. Integer ac dictum augue. Vivamus eget placerat tortor.Mauris in odio nec turpis pretium tincidunt. Sed tincidunt eros vel nibh convallis, nec mollis orci viverra. Integer sit amet purus volutpat, faucibus lorem sit amet, sodales nunc. Etiam lobortis lectus eget ligula sollicitudin auctor. Cras fermentum nunc orci, vel aliquet eros scelerisque vel. Nulla facilisi. Morbi convallis odio vel justo rutrum, sit amet gravida felis ultricies. "
      );
    }
  };

  return (
    <Container>
      <AudioSection>
        <h2>Gravador de áudio</h2>
        <RecordButton onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? (
            <FaStop style={{ scale: 5 }} />
          ) : (
            <FaPlay style={{ scale: 5 }} />
          )}
        </RecordButton>
      </AudioSection>
      <TextSection>
        <h2>Transcrição</h2>
        <p>{transcript}</p>
      </TextSection>
    </Container>
  );
};

export default AudioRecorder;
