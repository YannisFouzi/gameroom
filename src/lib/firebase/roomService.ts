import { generateUUID } from "@/lib/utils";
import {
  AnswerState,
  JokerType,
  MillionaireCategory,
} from "@/types/millionaire";
import { Celebrity, Room, RoomStatus, Team } from "@/types/room";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./config";

const CELEBRITIES: Record<string, Celebrity> = {
  sarkozy: {
    id: "sarkozy",
    name: "Nicolas Sarkozy",
    validAnswers: ["sarkozy", "nicolas sarkozy"],
    imageUrl: "/ratDeStar/Nicolas_Sarkozy.png",
  },
  zidane: {
    id: "zidane",
    name: "Zinedine Zidane",
    validAnswers: ["zidane", "zinedine zidane"],
    imageUrl: "/ratDeStar/Zinedine_Zidane.png",
  },
};

export const roomService = {
  async createRoom(hostId: string) {
    const db = getDb();
    const roomRef = await addDoc(collection(db, "rooms"), {
      hostId,
      status: "waiting" as RoomStatus,
      currentGame: 0,
      teams: {},
      settings: {
        maxTeams: 10,
        isPublic: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return roomRef.id;
  },

  async startGame(roomId: string) {
    const db = getDb();
    const teamIds = Object.keys((await this.getRoom(roomId)).teams);

    await updateDoc(doc(db, "rooms", roomId), {
      status: "playing",
      currentGame: 1,
      gamePhase: "explanation",
      gameData: {
        celebrities: CELEBRITIES,
        remainingTeams: teamIds,
        currentTeamIndex: 0,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async startMemorizationPhase(roomId: string) {
    const db = getDb();
    const now = Date.now();

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "memorization",
      "gameData.startTime": now,
      updatedAt: serverTimestamp(),
    });
  },

  async startGuessingPhase(roomId: string) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "guessing",
      updatedAt: serverTimestamp(),
    });
  },

  async submitGuess(roomId: string, teamId: string, guess: string) {
    const db = getDb();
    const room = await this.getRoom(roomId);
    const normalizedGuess = guess.toLowerCase().trim();

    // Trouver la célébrité correspondante
    const celebrity = Object.values(room.gameData?.celebrities || {}).find(
      (c) => !c.foundBy && c.validAnswers.includes(normalizedGuess)
    );

    if (celebrity) {
      // Réponse correcte
      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.celebrities.${celebrity.id}.foundBy`]: teamId,
        "gameData.currentTeamIndex":
          (room.gameData!.currentTeamIndex + 1) %
          room.gameData!.remainingTeams.length,
        updatedAt: serverTimestamp(),
      });
      return true;
    } else {
      // Réponse incorrecte - éliminer l'équipe
      const remainingTeams = room.gameData!.remainingTeams.filter(
        (id) => id !== teamId
      );

      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.remainingTeams": remainingTeams,
        "gameData.currentTeamIndex": 0,
        gamePhase: remainingTeams.length === 1 ? "results" : "guessing",
        updatedAt: serverTimestamp(),
      });
      return false;
    }
  },

  async addTeam(
    roomId: string,
    teamData: {
      name: string;
      members: { name: string }[];
      avatar: string;
    }
  ) {
    const db = getDb();
    const teamId = generateUUID();
    const deviceId = generateUUID();

    const team: Omit<Team, "lastSeen"> & { lastSeen: any } = {
      id: teamId,
      name: teamData.name,
      members: teamData.members.map((member) => ({
        name: member.name,
        score: 0,
      })),
      avatar: teamData.avatar,
      score: 0,
      isOnline: true,
      lastSeen: serverTimestamp(),
      deviceId,
    };

    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}`]: team,
      updatedAt: serverTimestamp(),
    });

    return { teamId, deviceId };
  },

  async updateTeamScore(roomId: string, teamId: string, score: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}.score`]: score,
      updatedAt: serverTimestamp(),
    });
  },

  async updateRoomStatus(roomId: string, status: RoomStatus) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async getRoom(roomId: string) {
    const db = getDb();
    const roomSnap = await getDoc(doc(db, "rooms", roomId));
    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }
    return roomSnap.data() as Room;
  },

  async startNextGame(roomId: string) {
    const db = getDb();
    const room = await this.getRoom(roomId);

    // Vérifier que gameData et remainingTeams existent
    if (!room.gameData?.remainingTeams?.length) {
      throw new Error("No winning team found");
    }

    const winningTeamId = room.gameData.remainingTeams[0];
    const winningTeam = room.teams[winningTeamId];

    if (!winningTeam) {
      throw new Error("Winning team not found");
    }

    // Récupérer tous les IDs d'équipes et mettre l'équipe gagnante en premier
    const allTeamIds = Object.keys(room.teams);
    const reorderedTeams = [
      winningTeamId,
      ...allTeamIds.filter((id) => id !== winningTeamId),
    ];

    await updateDoc(doc(db, "rooms", roomId), {
      currentGame: 2,
      gamePhase: "millionaire-rules",
      gameData: {
        currentTeamIndex: 0,
        remainingTeams: reorderedTeams, // Toutes les équipes sont de retour en jeu
        startingTeam: winningTeamId,
        winningTeamName: winningTeam.name,
        questions: [],
        currentQuestion: 0,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async startMillionaireGame(roomId: string) {
    const db = getDb();
    const room = await this.getRoom(roomId);

    if (!room.gameData) return;

    // Initialiser les données du jeu avec les jokers
    const initialJokers = Object.fromEntries(
      room.gameData.remainingTeams.map((teamId) => [
        teamId,
        { phoneCall: false, fiftyFifty: false },
      ])
    );

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "millionaire-playing",
      "gameData.currentQuestionIndex": 0,
      "gameData.usedCategories": [],
      "gameData.scores": {},
      "gameData.currentCategory": null,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.jokers": initialJokers,
      updatedAt: serverTimestamp(),
    });
  },

  async selectMillionaireCategory(
    roomId: string,
    category: MillionaireCategory
  ) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentCategory": category,
      "gameData.currentQuestionIndex": 0,
      "gameData.usedCategories": arrayUnion(category),
      updatedAt: serverTimestamp(),
    });
  },

  calculateSecurePoints(questionIndex: number): number {
    if (questionIndex < 5) return 0;
    if (questionIndex < 10) {
      // Points de la question 5
      return 5; // À ajuster selon vos besoins
    }
    // Points de la question 10
    return 10; // À ajuster selon vos besoins
  },

  async submitMillionaireAnswer(
    roomId: string,
    isCorrect: boolean,
    currentQuestionIndex: number,
    points: number
  ) {
    const db = getDb();
    const room = await this.getRoom(roomId);
    const currentTeamIndex = room.gameData?.currentTeamIndex || 0;
    const currentTeam = room.gameData?.remainingTeams[currentTeamIndex];

    if (!currentTeam || !room.gameData?.remainingTeams) return;

    if (!isCorrect) {
      // En cas de mauvaise réponse, on passe directement au joueur suivant
      const securePoints = this.calculateSecurePoints(currentQuestionIndex);
      const nextTeamIndex =
        (currentTeamIndex + 1) % room.gameData.remainingTeams.length;

      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.scores.${currentTeam}`]: increment(securePoints),
        "gameData.currentTeamIndex": nextTeamIndex,
        "gameData.currentCategory": null,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async quitWithPoints(roomId: string, points: number) {
    const db = getDb();
    const room = await this.getRoom(roomId);
    const currentTeamIndex = room.gameData?.currentTeamIndex || 0;
    const currentTeam = room.gameData?.remainingTeams[currentTeamIndex];

    if (!currentTeam || !room.gameData?.remainingTeams) return;

    const nextTeamIndex =
      (currentTeamIndex + 1) % room.gameData.remainingTeams.length;

    await updateDoc(doc(db, "rooms", roomId), {
      [`gameData.scores.${currentTeam}`]: increment(points),
      "gameData.currentTeamIndex": nextTeamIndex,
      "gameData.currentCategory": null,
      updatedAt: serverTimestamp(),
    });
  },

  async moveToNextQuestion(roomId: string, nextQuestionIndex: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentQuestionIndex": nextQuestionIndex,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.hiddenAnswers": [],
      updatedAt: serverTimestamp(),
    });
  },

  async moveToNextTeam(roomId: string, nextTeamIndex: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentTeamIndex": nextTeamIndex,
      "gameData.currentCategory": null,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.hiddenAnswers": [],
      updatedAt: serverTimestamp(),
    });
  },

  async useJoker(roomId: string, teamId: string, jokerType: JokerType) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`gameData.jokers.${teamId}.${jokerType}`]: true,
      updatedAt: serverTimestamp(),
    });
  },

  async updateAnswerState(
    roomId: string,
    selectedAnswer: string | null,
    answerState: AnswerState,
    selectedAnswers: number[] = []
  ) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.selectedAnswer": selectedAnswer,
      "gameData.answerState": answerState,
      "gameData.selectedAnswers": selectedAnswers,
      updatedAt: serverTimestamp(),
    });
  },

  async setPhoneCallModalState(roomId: string, isOpen: boolean) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.phoneCallModalOpen": isOpen,
      updatedAt: serverTimestamp(),
    });
  },

  async setHiddenAnswers(roomId: string, hiddenAnswers: number[]) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.hiddenAnswers": hiddenAnswers,
      updatedAt: serverTimestamp(),
    });
  },
};
