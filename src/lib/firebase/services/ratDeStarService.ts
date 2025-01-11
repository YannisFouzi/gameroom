import { Celebrity } from "@/types/room";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const CELEBRITIES: Record<string, Celebrity> = {
  alCapone: {
    id: "alCapone",
    name: "Al Capone",
    validAnswers: ["capone", "al capone"],
    imageUrl: "/ratDeStar/Al_Capone.jpg",
  },
  catherineDeneuve: {
    id: "catherineDeneuve",
    name: "Catherine Deneuve",
    validAnswers: ["deneuve", "catherine deneuve"],
    imageUrl: "/ratDeStar/Catherine_Deneuve.jpg",
  },
  davidBowie: {
    id: "davidBowie",
    name: "David Bowie",
    validAnswers: ["bowie", "david bowie"],
    imageUrl: "/ratDeStar/David_Bowie.jpg",
  },
  elonMusk: {
    id: "elonMusk",
    name: "Elon Musk",
    validAnswers: ["musk", "elon musk"],
    imageUrl: "/ratDeStar/Elon_Musk.jpg",
  },
  fernandoAlonso: {
    id: "fernandoAlonso",
    name: "Fernando Alonso",
    validAnswers: ["alonso", "fernando alonso"],
    imageUrl: "/ratDeStar/Fernando_Alonso.jpg",
  },
  gregoryCoupet: {
    id: "gregoryCoupet",
    name: "Grégory Coupet",
    validAnswers: ["coupet", "gregory coupet", "grégory coupet"],
    imageUrl: "/ratDeStar/Grégory_Coupet.jpg",
  },
  jaysonTatum: {
    id: "jaysonTatum",
    name: "Jayson Tatum",
    validAnswers: ["tatum", "jayson tatum"],
    imageUrl: "/ratDeStar/Jayson_Tatum.jpg",
  },
  lanceArmstrong: {
    id: "lanceArmstrong",
    name: "Lance Armstrong",
    validAnswers: ["armstrong", "lance armstrong"],
    imageUrl: "/ratDeStar/Lance_Armstrong.jpg",
  },
  lewisHamilton: {
    id: "lewisHamilton",
    name: "Lewis Hamilton",
    validAnswers: ["hamilton", "lewis hamilton"],
    imageUrl: "/ratDeStar/Lewis_Hamilton.jpg",
  },
  marieCurie: {
    id: "marieCurie",
    name: "Marie Curie",
    validAnswers: ["curie", "marie curie"],
    imageUrl: "/ratDeStar/Marie_Curie.jpg",
  },
  marilynMonroe: {
    id: "marilynMonroe",
    name: "Marilyn Monroe",
    validAnswers: ["monroe", "marilyn monroe"],
    imageUrl: "/ratDeStar/Marilyn_Monroe.jpg",
  },
  napoleonBonaparte: {
    id: "napoleonBonaparte",
    name: "Napoléon Bonaparte",
    validAnswers: [
      "napoleon",
      "bonaparte",
      "napoléon bonaparte",
      "napoleon bonaparte",
    ],
    imageUrl: "/ratDeStar/Napoléon_Bonaparte.jpg",
  },
  nicolasSarkozy: {
    id: "nicolasSarkozy",
    name: "Nicolas Sarkozy",
    validAnswers: ["sarkozy", "nicolas sarkozy"],
    imageUrl: "/ratDeStar/Nicolas_Sarkozy.png",
  },
  pabloPicasso: {
    id: "pabloPicasso",
    name: "Pablo Picasso",
    validAnswers: ["picasso", "pablo picasso"],
    imageUrl: "/ratDeStar/Pablo_Picasso.jpg",
  },
  patrickFiori: {
    id: "patrickFiori",
    name: "Patrick Fiori",
    validAnswers: ["fiori", "patrick fiori"],
    imageUrl: "/ratDeStar/Patrick_Fiori.jpg",
  },
  rihanna: {
    id: "rihanna",
    name: "Rihanna",
    validAnswers: ["rihanna"],
    imageUrl: "/ratDeStar/Rihanna.jpg",
  },
  sophieMarceau: {
    id: "sophieMarceau",
    name: "Sophie Marceau",
    validAnswers: ["marceau", "sophie marceau"],
    imageUrl: "/ratDeStar/Sophie_Marceau.jpg",
  },
  steveJobs: {
    id: "steveJobs",
    name: "Steve Jobs",
    validAnswers: ["jobs", "steve jobs"],
    imageUrl: "/ratDeStar/Steve_Jobs.jpg",
  },
  thierryArdisson: {
    id: "thierryArdisson",
    name: "Thierry Ardisson",
    validAnswers: ["ardisson", "thierry ardisson"],
    imageUrl: "/ratDeStar/Thierry_Ardisson.jpg",
  },
  tomCruise: {
    id: "tomCruise",
    name: "Tom Cruise",
    validAnswers: ["cruise", "tom cruise"],
    imageUrl: "/ratDeStar/Tom_Cruise.jpg",
  },
  winstonChurchill: {
    id: "winstonChurchill",
    name: "Winston Churchill",
    validAnswers: ["churchill", "winston churchill"],
    imageUrl: "/ratDeStar/Winston_Churchill.jpg",
  },
};

export const ratDeStarService = {
  async startGame(roomId: string) {
    const teamIds = Object.keys((await baseRoomService.getRoom(roomId)).teams);

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
    const now = Date.now();

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "memorization",
      "gameData.startTime": now,
      updatedAt: serverTimestamp(),
    });
  },

  async startGuessingPhase(roomId: string) {
    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "guessing",
      updatedAt: serverTimestamp(),
    });
  },

  async submitGuess(roomId: string, teamId: string, guess: string) {
    const room = await baseRoomService.getRoom(roomId);
    const normalizedGuess = normalizeString(guess);

    const celebrity = Object.values(room.gameData?.celebrities || {}).find(
      (c) =>
        !c.foundBy &&
        c.validAnswers.some(
          (answer) => normalizeString(answer) === normalizedGuess
        )
    );

    if (celebrity) {
      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.celebrities.${celebrity.id}.foundBy`]: teamId,
        "gameData.currentTeamIndex":
          (room.gameData!.currentTeamIndex + 1) %
          room.gameData!.remainingTeams.length,
        updatedAt: serverTimestamp(),
      });
      return true;
    } else {
      await this.setLastWrongCelebrity(roomId, guess);

      await updateDoc(doc(db, "rooms", roomId), {
        [`teams.${teamId}.wrongAnswer`]: guess,
      });

      setTimeout(async () => {
        const remainingTeams = room.gameData!.remainingTeams.filter(
          (id) => id !== teamId
        );

        await updateDoc(doc(db, "rooms", roomId), {
          "gameData.remainingTeams": remainingTeams,
          "gameData.currentTeamIndex": 0,
          "gameData.lastWrongCelebrity": null,
          gamePhase: remainingTeams.length === 1 ? "results" : "guessing",
        });
      }, 3000);

      return false;
    }
  },

  async setLastFoundCelebrity(roomId: string, celebrityName: string | null) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.lastFoundCelebrity": celebrityName,
    });
  },

  async setLastWrongCelebrity(roomId: string, celebrityName: string | null) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.lastWrongCelebrity": celebrityName,
    });
  },
};
