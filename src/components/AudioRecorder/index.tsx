import React from "react";
import axios from "axios";

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

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setTranscript(response.data.text);
    } catch (e) {
      console.error(e);
      setTranscript("");
    }
  };

  return (
    <div>
      <h1>Gravador de áudio</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Parar de gravar" : "Gravar"}
      </button>
      {transcript && (
        <div>
          <h2>Transcrição:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
