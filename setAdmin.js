require('dotenv').config({ path: '.env.local' });
const admin = require("firebase-admin");

// .env.localのFIREBASE_ADMIN_KEY_JSONが存在するかチェック
if (!process.env.FIREBASE_ADMIN_KEY_JSON) {
  console.error("FIREBASE_ADMIN_KEY_JSONが設定されていません。");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY_JSON);
} catch (e) {
  console.error("FIREBASE_ADMIN_KEY_JSONのパースに失敗しました。", e);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 管理者にしたいユーザーのUIDを指定
const targetUid = "e0wTsPrbGXRKc1XqmkMm6ZUs4Km1"; // ←ここを実際のUIDに書き換えてください

admin.auth().setCustomUserClaims(targetUid, { admin: true })
  .then(() => {
    console.log("管理者権限を付与しました");
    process.exit(0);
  })
  .catch((error) => {
    console.error("エラー:", error);
    process.exit(1);
  });