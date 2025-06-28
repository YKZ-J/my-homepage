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
                style={{ color: "#1da1f2", textDecoration: "none", marginLeft: 4, display: "inline-flex", alignItems: "center" }}
                className="hover:text-blue-500"
            >
                <FaXTwitter className="w-6 h-6 text-black" style={{ marginRight: 4 }} />
                X（旧Twitter）
            </a>
            までお願いします。
        </p>
    </main>
);


export default Contact;