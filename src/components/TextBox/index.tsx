import React from "react";
import { TextSection } from "./styles";
import axios from "axios";

interface TextBoxProps {
  transcript: string;
  isTranscripted: boolean;
  setIsTranscripted: React.Dispatch<React.SetStateAction<boolean>>;
}

function TextBox({
  transcript,
  isTranscripted,
  setIsTranscripted,
}: TextBoxProps) {
  const [response, setResponse] = React.useState("");

  React.useEffect(() => {
    if (isTranscripted) sendQuestion(transcript);
  }, [isTranscripted]);

  const sendQuestion = async (prompt: string) => {
    const openaiKey = import.meta.env.VITE_OPENAI_KEY;
    setResponse("...");
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
        }
      );

      setResponse(response.data.choices[0].message.content.slice(0, 350));
    } catch (e) {
      console.error(e);
      setResponse("Erro na resposta, verifique sua internet ou API-Key.");
    } finally {
      setIsTranscripted(false);
    }
  };

  return (
    <TextSection>
      <h2>Transcrição</h2>
      <p>{transcript}</p>
      {response && (
        <>
          <h2>Resposta</h2>
          <p>{response}</p>
        </>
      )}
    </TextSection>
  );
}
export default TextBox;
