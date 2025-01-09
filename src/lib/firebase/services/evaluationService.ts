import { Room } from "@/types/room";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../config";

export const evaluationService = {
  async submitEvaluation(roomId: string, teamId: string, points: number) {
    const roomRef = doc(db, "rooms", roomId);

    await runTransaction(db, async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      if (!roomDoc.exists()) return;

      const room = roomDoc.data() as Room;
      const scores = room.gameData?.scores || {};

      const evaluationScores = {
        ...(scores.evaluation || {}),
        [teamId]: (scores.evaluation?.[teamId] || 0) + points,
      };

      const totalScores = Object.keys(room.teams).reduce(
        (acc, id) => ({
          ...acc,
          [id]: (scores.millionaire?.[id] || 0) + (evaluationScores[id] || 0),
        }),
        {}
      );

      transaction.update(roomRef, {
        "gameData.scores": {
          ...scores,
          evaluation: evaluationScores,
          total: totalScores,
        },
      });
    });
  },
};
