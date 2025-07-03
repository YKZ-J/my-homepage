import React from "react";
import { FaXTwitter } from 'react-icons/fa6'; // Xのアイコン

const X_LINK = "https://twitter.com/ykz_tech"; // あなたのX（旧Twitter）ユーザー名に置き換えてください

const Contact: React.FC = () => (
    <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Contact</h1>
        <p>
            ご連絡は
            <a
            href={X_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#000", textDecoration: "none", marginLeft: 4, display: "inline-flex", alignItems: "center" }}
            className="hover:text-black"
            >
            <FaXTwitter style={{ width: 24, height: 24, marginRight: 4 }} />
            (Twitter)
            </a>
            までお願いします。
        </p>
    </main>
);


export default Contact;