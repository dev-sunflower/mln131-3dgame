"use client";

import { Html } from "@react-three/drei";
import React from "react";

const puzzleData = [
  {
    id: 1,
    question:
      "Theo C. Mác, giữa xã hội tư bản chủ nghĩa và xã hội cộng sản chủ nghĩa tồn tại một thời kỳ gì?",
    answer: "Qua Do",
  },
  {
    id: 2,
    question:
      "Nhà nước trong thời kỳ quá độ theo Mác mang bản chất gì?",
    answer: "Chuyen Chinh",
  },
  {
    id: 3,
    question:
      "Giai đoạn thấp của hình thái kinh tế – xã hội cộng sản chủ nghĩa được gọi là gì?",
    answer: "Xa Hoi Chu Nghia",
  },
  {
    id: 4,
    question:
      "Nguyên tắc phân phối ở giai đoạn cao của chủ nghĩa cộng sản là gì?",
    answer: "Theo Nhu Cau",
  },
  {
    id: 5,
    question:
      "Việt Nam đi lên chủ nghĩa xã hội theo con đường quá độ nào?",
    answer: "Gian Tiep",
  },
];

// 🔑 HÀM CHUẨN HOÁ CHUỖI
const normalize = (str: string) =>
  str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/\s+/g, " ") // gộp space
    .trim()
    .toUpperCase();

type DigitalPuzzleModalProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DigitalPuzzleModal({
  step,
  setStep,
  onClose,
  onSuccess,
}: DigitalPuzzleModalProps) {
  const [answer, setAnswer] = React.useState("");
  const [error, setError] = React.useState("");

  const currentPuzzle = puzzleData[step];

  const handleSubmit = () => {
    if (
      normalize(answer) === normalize(currentPuzzle.answer)
    ) {
      setError("");
      setAnswer("");

      if (step === puzzleData.length - 1) {
        onSuccess(); // hoàn thành
      } else {
        setStep((prev) => prev + 1); // sang câu tiếp
      }
    } else {
      setError("Sai rồi, thử lại nhé!");
    }
  };

  return (
    <Html center>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2>
            Giải ô chữ ({step + 1}/{puzzleData.length})
          </h2>

          <p>{currentPuzzle.question}</p>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập đáp án (không dấu)"
            style={inputStyle}
          />

          {error && <p style={{ color: "#f87171" }}>{error}</p>}

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={handleSubmit}>Xác nhận</button>
            <button onClick={onClose}>Thoát</button>
          </div>
        </div>
      </div>
    </Html>
  );
}

/* ===== styles ===== */

const overlayStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.55)",
  padding: 20,
  borderRadius: 12,
};

const modalStyle: React.CSSProperties = {
  background: "#1f2933",
  color: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 360,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  marginTop: 10,
  borderRadius: 6,
  border: "none",
  color: "#000",
  backgroundColor: "#fff",
};
