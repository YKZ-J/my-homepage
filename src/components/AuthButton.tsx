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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

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

  const logout = () => signOut(auth);
  const role = useUserRole(user);

  return (
    <div
      className="flex flex-col items-center gap-6 w-full"
      style={{
        background: "var(--card-bg)",
        borderRadius: "1rem",
        boxShadow: "var(--card-shadow)",
        padding: "2rem 1.5rem",
        width: "100%",
        maxWidth: "400px",
        minWidth: "0",
      }}
    >
      {!user ? (
        <>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-2"
            style={{
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.7)",
              fontSize: "1rem",
              color: "var(--foreground)",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-2"
            style={{
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.7)",
              fontSize: "1rem",
              color: "var(--foreground)",
              boxSizing: "border-box",
            }}
          />
          <div className="flex w-full gap-2">
            <button
              type="button"
              className="button button-blue w-1/2"
              onClick={loginEmail}
              style={{ minWidth: 0 }}
            >
              log in
            </button>
            <button
              type="button"
              className="button button-blue w-1/2"
              onClick={registerEmail}
              style={{ minWidth: 0 }}
            >
              sign up
            </button>
          </div>
          {error && (
            <div style={{ color: "#d32f2f", marginTop: "8px", fontSize: "0.95em", width: "100%", textAlign: "center" }}>
              {error}
            </div>
          )}
        </>
      ) : (
        <>
          <span
            className="truncate w-full text-center"
            style={{
              padding: "0.75rem 1rem",
              background: "#fff",
              borderRadius: "0.5rem",
              color: "var(--foreground)",
              fontWeight: 500,
              fontSize: "1rem",
              display: "block",
              marginBottom: "1rem",
            }}
            title={user.email ?? ""}
          >
            {user.email}
          </span>
          <button
            onClick={logout}
            className="button button-blue w-full"
            style={{ minWidth: "100px" }}
          >
            ログアウト
          </button>
          {role === "admin" && (
            <div style={{ marginTop: "1rem", color: "#992222", fontWeight: 600 }}>
              admin
            </div>
          )}
        </>
      )}
      <style jsx>{`
        @media (min-width: 1024px) {
          .flex.flex-col.items-center.gap-6 {
            width: 100% !important;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
}