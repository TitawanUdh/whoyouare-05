import NarcissistImg from "../assets/images/Narcissist.png";
import MachiavellianImg from "../assets/images/Machiavellian.png";
import PsychopathImg from "../assets/images/Psychopath.png";

export const weaknessByTrait = {
  narcissist: "ต้องการการยอมรับมากจนเปราะบางต่อคำวิจารณ์",
  psychopath: "ตัดสินใจโดยไม่สนความรู้สึกของคนอื่น",
  machiavellian: "ควบคุมและวางแผนจนไม่ไว้ใจใคร",
};

export const traitToLabel = {
  narcissist: "Narcissist",
  psychopath: "Psychopath",
  machiavellian: "Machiavellian",
};

export const analyzeWeakness = (answers) => {
  const count = {};

  answers.forEach((t) => {
    count[t] = (count[t] || 0) + 1;
  });

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trait]) => weaknessByTrait[trait])
    .filter(Boolean);
};

export const analyzeResult = (answers) => {
  const score = {
    narcissist: 0,
    psychopath: 0,
    machiavellian: 0,
  };

  answers.forEach((a) => {
    score[a.trait]++;
  });

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);

  const [primary, primaryScore] = sorted[0];
  const [secondary, secondaryScore] = sorted[1];

  return {
    primary,
    secondary,
    primaryPercent: Math.round((primaryScore / answers.length) * 100),
    secondaryPercent: Math.round((secondaryScore / answers.length) * 100),
    weaknesses: analyzeWeakness(answers.map((a) => a.trait)),
    insights: answers.map((a) => a.insight), // 🔥 เพิ่มตรงนี้
  };
};

export const resultNarrative = {
  narcissist: {
    title: "The Narcissist",
    subtitle: "ผู้ต้องการการยอมรับ",
    story: `
    คุณเป็นคนที่รู้ว่าตัวเองมีคุณค่า และคุณไม่อยากให้มันถูกมองข้าม
    คุณต้องการการยอมรับ ไม่ใช่เพราะคุณอ่อนแอ แต่เพราะคุณ “เห็นศักยภาพของตัวเองชัด”
    
    คุณผลักดันตัวเองให้ดีขึ้น พยายามเป็นเวอร์ชันที่ดีที่สุด
    และลึก ๆ แล้ว… คุณแค่อยากให้มีใครสักคน “เห็นมัน” จริง ๆ
    
    แต่ในบางครั้ง ความต้องการนั้นอาจทำให้คุณผูกคุณค่าของตัวเองไว้กับสายตาคนอื่น
    คำชมทำให้คุณสูงขึ้น และคำวิจารณ์ก็อาจทำให้คุณสั่นคลอนได้มากกว่าที่คิด
    
    คุณไม่จำเป็นต้องพิสูจน์ตัวเองตลอดเวลา
    เพราะคุณค่าของคุณ… ไม่ได้หายไปแม้ในวันที่ไม่มีใครมองเห็น
    `,
    short:
      "คุณให้ความสำคัญกับภาพลักษณ์และคุณค่าของตัวเอง และต้องการให้คนอื่นมองเห็นมัน",
      image: NarcissistImg
  },

  psychopath: {
    title: "The Psychopath",
    subtitle: "ผู้ตัดสินใจด้วยเหตุผลล้วน",
    story: `
    คุณเป็นคนที่ตัดสินใจได้โดยไม่ปล่อยให้อารมณ์มาควบคุม นั่นคือพลังที่ทำให้คุณ “นิ่ง” ในสถานการณ์ที่คนอื่นสั่นไหว
    คุณมองโลกตามความเป็นจริง ไม่ใช่ตามความรู้สึก และคุณกล้าทำในสิ่งที่คนอื่นลังเล
    
    แต่ในความนิ่งนั้น… บางครั้งคุณอาจค่อย ๆ ถอยห่างจากความรู้สึกของตัวเองโดยไม่รู้ตัว
    คุณอาจไม่ได้เย็นชา — แค่เคยชินกับการ “ไม่รู้สึก” เพื่อให้ตัวเองอยู่รอด
    
    คุณเข้าใจว่าการตัดสินใจที่ดี คือการเลือกสิ่งที่ได้ผลที่สุด
    แต่บางครั้ง สิ่งที่ได้ผลที่สุด… อาจไม่ใช่สิ่งที่ทำให้คุณ “รู้สึกมีชีวิต”
    
    คำถามสำคัญไม่ใช่ว่า “อะไรถูกหรือผิด”
    แต่คือ… คุณยังรู้สึกอยู่ไหมกับสิ่งที่คุณเลือก
    `,
    short: "คุณตัดสินใจโดยไม่ใช้อารมณ์ ทำให้คุณนิ่งและเด็ดขาดในสถานการณ์กดดัน",
    image: PsychopathImg

  },

  machiavellian: {
    title: "The Machiavellian",
    subtitle: "นักวางแผนเบื้องหลัง",
    story: `
    คุณเป็นคนที่มองโลกอย่างมีชั้นเชิง คุณไม่รีบร้อน และไม่เดินเกมแบบสุ่ม
    คุณคิดล่วงหน้า วางแผน และมองเห็นสิ่งที่คนอื่นยังไม่ทันคิด
    
    คุณเข้าใจว่า “ทุกอย่างมีระบบ” และคนส่วนใหญ่ก็ขับเคลื่อนด้วยเหตุผลบางอย่าง
    นั่นทำให้คุณสามารถจัดวางตัวเองในเกมของชีวิตได้อย่างแม่นยำ
    
    แต่ในขณะเดียวกัน… การมองทุกอย่างเป็นเกม อาจทำให้คุณเผลอระวังตัวมากเกินไป
    คุณอาจเริ่มไม่ไว้ใจความจริงใจ และมองความสัมพันธ์เป็นเพียง “กลยุทธ์”
    
    คุณเก่งในการควบคุมสถานการณ์
    แต่คำถามคือ… คุณยังปล่อยให้ตัวเอง “เป็นธรรมชาติ” ได้อยู่ไหม โดยไม่ต้องคุมทุกอย่าง
    `,
    short:
      "คุณเป็นคนคิดเป็นระบบ มองเกมขาด และมักวางแผนล่วงหน้าเพื่อให้ได้เปรียบ",
      image: MachiavellianImg
  },
};
