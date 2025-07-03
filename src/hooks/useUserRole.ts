import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { app } from "../firebase";

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    const fetchRole = async () => {
      const db = getFirestore(app);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      setRole(snap.exists() ? snap.data()?.role ?? null : null);
    };
    fetchRole();
  }, [user]);

  return role;
}