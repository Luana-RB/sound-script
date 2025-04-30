import styled from "styled-components";

export const RecordButton = styled.button`
  background-color: #c95792;
  padding: 100px;
  border-radius: 100%;
  border-color: transparent;
  &:hover {
    background-color: #7c4585;
  }
  &:focus {
    outline: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 70vh;
  align-self: flex-start;
  justify-content: center;
  gap: 2rem;
`;

export const TextSection = styled.div`
  width: 40%;
  box-sizing: border-box;
  background-color: rgb(256, 256, 256, 0.5);
`;

export const AudioSection = styled.div`
  align-items: end;
  justify-content: end;
  width: 40%;
  box-sizing: border-box;
`;
