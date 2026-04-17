import { Button, Image } from "react-bootstrap";
import {
  analyzeResult,
  resultNarrative,
  traitToLabel,
} from "../utils/analyzeResult";
import "./Result.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { FaInstagram } from "react-icons/fa6";

const Result = ({ answers, setAnswers }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // 🔹 โหลด result เก่า
  const savedResult = useMemo(() => {
    try {
      const raw = localStorage.getItem("myself-result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  console.log("answers", answers);

  // 🔹 วิเคราะห์
  const analysis = useMemo(() => {
    const currentAnswers =
      answers?.length > 0 ? answers : savedResult?.rawAnswers || [];
    return analyzeResult(currentAnswers);
  }, [answers, savedResult]);

  // 🔥 ใช้ trait แทน group
  const trait = analysis.primary;
  const secondaryTrait = analysis.secondary;
  const data = resultNarrative[trait];
  // 🔹 ส่งข้อมูลไป sheet (ครั้งเดียว)
  useEffect(() => {
    const finalAnswers =
      answers?.length > 0 ? answers : savedResult?.rawAnswers || [];

    if (!finalAnswers.length) return;
    if (!data?.title) return;

    const alreadySent = localStorage.getItem("sheet-sent");
    if (alreadySent) return;

    saveToSheet(finalAnswers, data.title);
    localStorage.setItem("sheet-sent", "true");
  }, [answers, savedResult, data]);

  // 🔹 save local
  useEffect(() => {
    if (!answers?.length || !trait || !data) return;

    const resultToSave = {
      trait,
      result: data,
      rawAnswers: answers,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("myself-result", JSON.stringify(resultToSave));
  }, [answers, trait, data]);

  // 🔹 save image
  const handleSaveImage = async () => {
    const element = document.getElementById("result-export-card");
    if (!element) return;

    setIsGenerating(true);

    const computedStyle = window.getComputedStyle(element);
    const currentBgColor = computedStyle.backgroundColor;

    element.classList.add("exporting");

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: currentBgColor,
        logging: false,
        onclone: (doc) => {
          const card = doc.querySelector(".result-card");
          if (card) {
            card.style.background = "#ffffff";
            card.style.backdropFilter = "none";
            card.style.animation = "none";
          }
        },
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `result-${trait}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถบันทึกรูปได้");
    } finally {
      element.classList.remove("exporting");
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem("myself-result");
    localStorage.removeItem("sheet-sent");
    setAnswers([]);
    navigate("/");
  };

  // ❗ กันพัง
  if (!trait || !data) return <p>ไม่สามารถวิเคราะห์ได้</p>;

  // 🔹 send sheet
  const saveToSheet = async (answers, result) => {
    const userId =
      localStorage.getItem("psychoUserId") ||
      Math.random().toString(36).substring(2);
    localStorage.setItem("psychoUserId", userId);
    await fetch(
      "https://script.google.com/macros/s/AKfycbzSAcODKtiXbrqhpMA1p-4cOLYQaJRO7TCSpqiS_KRzfRZEt7ITYbBojmdkSsMZ83L2zw/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers, result }),
      }
    );
  };

  return (
    <div id="result-export">
      <div className={`result-page-1 theme-${trait}`} id="result-export-card">
        <div className="result-card">
          {/* IG */}
          <div className="d-flex justify-content-end ">
            <Button
              className="instagram-btn"
              href="https://www.instagram.com/whoyouare.official/"
              target="_blank"
            >
              <FaInstagram /> @whoyouare
            </Button>
          </div>

          {/* HEADER */}
          <div className="text-center ">
            <h2>{traitToLabel[analysis.primary]}</h2>
            {/* IMAGE */}{" "}
            <p>
              คุณเป็น {analysis.primaryPercent}%{" "}
              {traitToLabel[analysis.primary]}
            </p>
            {data.image && (
             <div className="d-flex justify-content-center align-items-center">
             <Image src={data.image} style={{ maxWidth: "300px" }} />
           </div>
            )}
            <p className="mt-4">{data.story}</p>
          </div>

          {/* STORY */}

          {/* SECONDARY */}
          {secondaryTrait && (
            <div className="secondary-box">
              <p>
                คุณยังมีลักษณะของ{" "}
                <strong>{resultNarrative[secondaryTrait]?.title}</strong>{" "}
                {analysis.secondaryPercent}%
              </p>
              <p className="secondary-desc">
                {resultNarrative[secondaryTrait]?.short}
              </p>
            </div>
          )}

          <hr />

          <h4>🧠 สิ่งที่คำตอบของคุณกำลังบอก</h4>
          <ul>
            {analysis.insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
          {/* STRENGTH */}

          <hr />

          {/* WEAKNESS */}
          <h4>🌗 สิ่งที่ควรระวัง</h4>
          <ul>
            {analysis.weaknesses?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>

          <hr />

          {/* ACTION */}
          <div className="no-export d-flex justify-content-center gap-2">
            <Button
              variant="dark"
              className="btn"
              onClick={handleSaveImage}
              disabled={isGenerating}
            >
              {isGenerating ? "กำลังบันทึก..." : "บันทึก"}
            </Button>

            <Button
              variant="outline-dark"
              className="btn"
              onClick={handleRestart}
            >
              เริ่มใหม่
            </Button>
          </div>

          {/* FOOTER */}
          <div className="text-center mt-4">
            <p style={{ fontSize: "0.8rem", color: "#666" }}>
              แบบทดสอบนี้ไม่ใช่การวินิจฉัยทางจิตเวช
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
