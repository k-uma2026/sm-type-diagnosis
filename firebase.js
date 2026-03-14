import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveDiagnosisResult(result) {
  await addDoc(collection(db, "results"), {
    createdAt: serverTimestamp(),
    typeCode: result.typeCode,
    typeName: result.typeName,
    title: result.title,
    rank: result.rank,
    mPercent: result.mPercent,
    sPercent: result.sPercent,
    flatThinking: result.flatThinking,
    holdIndex: result.holdIndex
  });

  const globalRef = doc(db, "stats", "global");
  const typeRef = doc(db, "stats", `type_${result.typeCode}`);
  const titleRef = doc(db, "stats", `title_${result.title}`);

  await setDoc(globalRef, {
    count: increment(1),
    updatedAt: serverTimestamp()
  }, { merge: true });

  await setDoc(typeRef, {
    count: increment(1),
    label: result.typeName,
    updatedAt: serverTimestamp()
  }, { merge: true });

  await setDoc(titleRef, {
    count: increment(1),
    label: result.title,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function getStatsSummary(typeCode, title) {
  const globalRef = doc(db, "stats", "global");
  const typeRef = doc(db, "stats", `type_${typeCode}`);
  const titleRef = doc(db, "stats", `title_${title}`);

  const [globalSnap, typeSnap, titleSnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(typeRef),
    getDoc(titleRef)
  ]);

  const totalCount = globalSnap.exists() ? Number(globalSnap.data().count || 0) : 0;
  const typeCount = typeSnap.exists() ? Number(typeSnap.data().count || 0) : 0;
  const titleCount = titleSnap.exists() ? Number(titleSnap.data().count || 0) : 0;

  return {
    totalCount,
    typeCount,
    titleCount,
    typePercent: totalCount ? Math.round((typeCount / totalCount) * 1000) / 10 : 0,
    titlePercent: totalCount ? Math.round((titleCount / totalCount) * 1000) / 10 : 0
  };
}
