import { Link } from "react-router-dom";
import "../App.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { SiGoogleearth } from "react-icons/si";
import { IoClose } from "react-icons/io5"; // เพิ่มไอคอนปิด (ถ้ามี)
import Papa from "papaparse"; // ตัวช่วยแปลง CSV เป็น JSON
import { useEffect, useState } from "react";

function Home() { const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [links, setLinks] = useState([]); // เปลี่ยนมาใช้ State เก็บข้อมูลแทน

  // URL ของ Google Sheet ที่ Publish เป็น CSV แล้ว
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8s6uutgfkSb4T3HkLvMqRzjKzS1tX2awIZGoPvdXFD-9CPuVdIPVsGNVn956n-OJsDmaacVgmW4zv/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    const fetchData = async () => {
      Papa.parse(SHEET_URL, {
        download: true,
        header: true, // ใช้หัวแถว (num, title, link) เป็น key
        complete: (results) => {
          // แปลงข้อมูลให้เข้ากับ Icon (เพราะ CSV เก็บ Icon เป็น Component ไม่ได้)
          const formattedData = results.data.map((item) => ({
            ...item,
            // เงื่อนไข: ถ้า num เป็น 5 ให้ใช้หัวใจ นอกนั้นใช้โลก
            icon: parseInt(item.num) === 0 ? <FaHeart /> : <SiGoogleearth />
          }));
          setLinks(formattedData);
        },
      });

    };
    fetchData();
  }, []);
  
  const handleLinkClick = (href) => {
    if (!href) return;
    setIsMenuOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
 <div className="App">
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-header" style={{textAlign: 'right'}}>
           <span onClick={() => setIsMenuOpen(false)} style={{color: 'white', fontSize: '30px', cursor: 'pointer'}}>
             <IoClose />
           </span>
        </div>
        <div className="menu-list">
           {links.length > 0 ? (
             links.map((item, index) => (
               <div key={index} className="menu-item" onClick={() => handleLinkClick(item.link)}>
                 <span className="menu-icon">{item.icon}</span>
                 <span className="menu-title">{item.title}</span>
               </div>
             ))
           ) : (
             <div className="menu-item">กำลังโหลดเมนู...</div>
           )}
        </div>
      </div>

      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
      
      <div className="menu-bar" onClick={() => setIsMenuOpen(true)}>
         <GiHamburgerMenu />
      </div>
  {/* background effects */}
  <div className="stars" />
  <div className="stars2" />
  <div className="stars3" />

  <div className="fog fog1" />
  <div className="fog fog2" />

  {/* content */}
  <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
    <h1 className="title">รู้จักตัวเองไหม ?</h1>

    <p className="subtitle ">
      เคยสงสัยไหมว่า
      <br />
      Dark Triad ของคุณคืออะไร ?
    </p>

    <Link to="/question/1" className="start-button">
  เริ่ม
</Link>

  </div>
</div>

  );
}

export default Home;
