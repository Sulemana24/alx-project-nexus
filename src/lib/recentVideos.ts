import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  type FieldValue,
} from "firebase/firestore";
import { db } from "./firebase";
import type { VideoResource } from "@/lib/youtube-api";

// Firestore type — completedAt is FieldValue
export type FirestoreRecentVideo = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  createdBy?: string;
  youtubeUrl: string;
  completedAt?: FieldValue;
};

let completedAtNumber: number | undefined;

export type RecentVideoDoc = Partial<VideoResource> & {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  createdBy?: string;
  youtubeUrl: string;
  completedAt?: number;
};

// -------------------------
// Save a recent video
// -------------------------
export async function saveRecentVideo(
  uid: string,
  video: Omit<FirestoreRecentVideo, "completedAt">,
  maxItems = 10
) {
  if (!uid || !video?.id) return;

  const colRef = collection(db, "users", uid, "recentVideos");
  const docRef = doc(colRef, video.id);

  const payload: FirestoreRecentVideo = {
    ...video,
    completedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload, { merge: true });

  // Trim older items
  const allQuery = query(colRef, orderBy("completedAt", "desc"));
  const snapshot = await getDocs(allQuery);
  const docs = snapshot.docs;
  if (docs.length > maxItems) {
    const toDelete = docs.slice(maxItems);
    await Promise.all(toDelete.map((d) => deleteDoc(d.ref)));
  }
}

// -------------------------
// Get recent videos
// -------------------------
export async function getRecentVideos(
  uid: string,
  limit = 10
): Promise<RecentVideoDoc[]> {
  if (!uid) return [];

  const colRef = collection(db, "users", uid, "recentVideos");
  const q = query(colRef, orderBy("completedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.slice(0, limit).map((d) => {
    const data = d.data() as FirestoreRecentVideo;

    let completedAtNumber: number | undefined;
    if (data.completedAt instanceof Timestamp) {
      completedAtNumber = data.completedAt.toMillis();
    } else if (typeof data.completedAt === "number") {
      completedAtNumber = data.completedAt;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      createdBy: data.createdBy,
      youtubeUrl: data.youtubeUrl,
      completedAt: completedAtNumber,
    };
  });
}

// -------------------------
// Delete a recent video
// -------------------------
export async function deleteRecentVideo(uid: string, videoId: string) {
  if (!uid || !videoId) return;
  const docRef = doc(db, "users", uid, "recentVideos", videoId);
  await deleteDoc(docRef);
}
