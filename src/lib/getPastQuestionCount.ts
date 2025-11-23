import {
  collection,
  getCountFromServer,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getPastQuestionCountWithGrowth() {
  try {
    const coll = collection(db, "pastQuestions");

    // Total count
    const totalSnapshot = await getCountFromServer(coll);
    const total = totalSnapshot.data().count;

    // Count for the last 7 days
    const sevenDaysAgo = Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const weeklyQuery = query(coll, where("uploadedAt", ">=", sevenDaysAgo));
    const weeklySnapshot = await getCountFromServer(weeklyQuery);
    const weeklyGrowth = weeklySnapshot.data().count;

    return { total, weeklyGrowth };
  } catch (error) {
    console.error("Error counting past questions:", error);
    return { total: 0, weeklyGrowth: 0 };
  }
}
