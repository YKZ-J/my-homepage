import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  if (process.env.FIREBASE_ADMIN_KEY_JSON) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY_JSON))
    });
  } else {
    admin.initializeApp();
  }
}
setGlobalOptions({ maxInstances: 10 });

// ...existing code...

export const incrementCounter = onRequest(
  { region: "asia-northeast1" },
  async (req, res) => {
  // CORSヘッダーを追加
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエスト対応
  if (req.method === "OPTIONS") {
    res.status(204).send('');
    return;
  }

  console.log('incrementCounter called', req.method, req.body);
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const ref = admin.firestore().collection("counters").doc("visits");
  try {
    // トランザクションで安全にインクリメント
    const result = await admin.firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      let newValue = 1;
      if (!snap.exists) {
        tx.set(ref, { value: 1 });
      } else {
        const current = snap.data()?.value ?? 0;
        newValue = typeof current === 'number' ? current + 1 : 1;
        tx.update(ref, { value: newValue });
      }
      return newValue;
    });
    console.log('インクリメント後の値:', result);
    res.status(200).json({ value: result });
  } catch (e) {
    console.error('incrementCounter error', e);
    res.status(500).json({ error: "カウントアップ失敗" });
  }
});
// ...existing code...