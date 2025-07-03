import React, { useState } from "react";
import { useUserRole } from "../hooks/useUserRole";
import { User } from "firebase/auth";
import { auth } from "../firebase"; 
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);


  const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

  const loginEmail = async () => {
    setError("");
    if (!validateEmail(email)) {
      setError("正しいメールアドレスを入力してください。");
      return;
    }
    if (!validatePassword(password)) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "code" in e) {
        const errorObj = e as { code?: string; message?: string };
        if (errorObj.code === "auth/user-not-found") {
          setError("ユーザーが見つかりません。新規登録してください。");
        } else if (errorObj.code === "auth/wrong-password") {
          setError("パスワードが間違っています。");
        } else {
          setError("ログインエラー: " + (errorObj.message ?? ""));
        }
      } else {
        setError("ログインエラー: 不明なエラー");
      }
    }
  };

  const registerEmail = async () => {
    setError("");
    if (!validateEmail(email)) {
      setError("正しいメールアドレスを入力してください。");
      return;
    }
    if (!validatePassword(password)) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user"
      });
      setUser(user);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "code" in e) {
        const errorObj = e as { code?: string; message?: string };
        if (errorObj.code === "auth/email-already-in-use") {
          setError("このメールアドレスは既に登録されています。ログインしてください。");
        } else {
          setError("登録エラー: " + (errorObj.message ?? ""));
        }
      } else {
        setError("登録エラー: 不明なエラー");
      }
    }
  };

  // ...残りのコードはそのまま...

  // ボタンのonClick
  // onClick={loginEmail}
  // onClick={registerEmail}


  const logout = () => signOut(auth);

  // ここでroleを取得
  const role = useUserRole(user);

  if (user) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          minWidth: "420px",
          gap: "16px",
          whiteSpace: "nowrap",
          overflow: "auto"
        }}
      >
        <span
          style={{
        padding: "8px 16px",
        background: "#fff",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px",
        display: "inline-block"
          }}
          title={user.email ?? ""}
        >
          {user.email}
        </span>
        <button
          onClick={logout}
          style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px 16px",
        background: "#fff",
        cursor: "pointer",
        whiteSpace: "nowrap"
          }}
        >
          ログアウト
        </button>
        {/* 管理者専用UI */}
        {role === "admin" && (
          <div style={{ marginLeft: "16px", whiteSpace: "nowrap" }}>
        <p style={{ margin: 0 }}>管理者専用</p>
        {/* ここに管理者だけのボタンやリンクを追加 */}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      minHeight: "100px"
      }}
    >
      <div
      style={{
        background: "rgba(255,255,255,0.8)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        width: "260px"
      }}
      >
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px 16px",
        marginBottom: "8px",
        background: "rgba(255,255,255,0.7)",
        width: "100%",
        boxSizing: "border-box"
        }}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px 16px",
        marginBottom: "8px",
        background: "rgba(255,255,255,0.7)",
        width: "100%",
        boxSizing: "border-box"
        }}
      />
       <button
        type="button"
        style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px 16px",
        background: "#fff",
        flex: 1,
        marginRight: "8px"
        }}
        onClick={loginEmail} // ← ここを修正
        >
          ログイン
        </button>
        <button
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px 16px",
          background: "#fff",
          cursor: "pointer",
          flex: 1
        }}
        onClick={registerEmail}
        >
        新規登録
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "8px", fontSize: "0.9em", width: "100%" }}>
        {error}
        </div>
      )}
    </div>
  );
}