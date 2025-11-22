import { auth, db } from "./firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function saveVideoToRecent(videoUrl: string) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    recentVideos: arrayUnion(videoUrl),
  });
}
