import axios from "axios";
import { Container } from "./styles";
import React from "react";
import { FaPlay, FaStop } from "react-icons/fa";

interface RecordButtonProps {
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  setIsTranscripted: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecordButton({ setTranscript, setIsTranscripted }: RecordButtonProps) {
  const [isRecording, setIsRecording] = React.useState(false);
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
    formData.append("file", blob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "pt");
    const openaiKey = import.meta.env.VITE_OPENAI_KEY;
    setTranscript("...");
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
      setIsTranscripted(true);
    } catch (e) {
      console.error(e);
      setTranscript("Erro na transcrição, verifique sua internet ou API-Key.");
      setIsTranscripted(false);
    }
  };
  return (
    <Container onClick={isRecording ? stopRecording : startRecording}>
      {isRecording ? (
        <FaStop style={{ scale: 5 }} />
      ) : (
        <FaPlay style={{ scale: 5 }} />
      )}
    </Container>
  );
}

export default RecordButton;
