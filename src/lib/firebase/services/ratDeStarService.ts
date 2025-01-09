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
  sarkozy: {
    id: "sarkozy",
    name: "Nicolas Sarkozy",
    validAnswers: ["sarkozy", "nicolas sarkozy"],
    imageUrl: "/ratDeStar/Nicolas_Sarkozy.png",
  },
  zidane: {
    id: "zidane",
    name: "Zinédine Zidane",
    validAnswers: ["zidane", "zinedine zidane", "zinédine zidane"],
    imageUrl: "/ratDeStar/Zinedine_Zidane.png",
  },
  alainDelon: {
    id: "alainDelon",
    name: "Alain Delon",
    validAnswers: ["delon", "alain delon"],
    imageUrl: "/ratDeStar/Alain_Delon.jpg",
  },
  angelinaJolie: {
    id: "angelinaJolie",
    name: "Angelina Jolie",
    validAnswers: ["jolie", "angelina jolie"],
    imageUrl: "/ratDeStar/Angelina_Jolie.jpg",
  },
  bernardHinault: {
    id: "bernardHinault",
    name: "Bernard Hinault",
    validAnswers: ["hinault", "bernard hinault"],
    imageUrl: "/ratDeStar/Bernard_Hinault.jpg",
  },
  barackObama: {
    id: "barackObama",
    name: "Barack Obama",
    validAnswers: ["obama", "barack obama"],
    imageUrl: "/ratDeStar/Barack_Obama.jpg",
  },
  bradPitt: {
    id: "bradPitt",
    name: "Brad Pitt",
    validAnswers: ["pitt", "brad pitt"],
    imageUrl: "/ratDeStar/Brad_Pitt.jpg",
  },
  catherineDeneuve: {
    id: "catherineDeneuve",
    name: "Catherine Deneuve",
    validAnswers: ["deneuve", "catherine deneuve"],
    imageUrl: "/ratDeStar/Catherine_Deneuve.jpg",
  },
  cristianoRonaldo: {
    id: "cristianoRonaldo",
    name: "Cristiano Ronaldo",
    validAnswers: ["ronaldo", "cristiano ronaldo", "cr7"],
    imageUrl: "/ratDeStar/Cristiano_Ronaldo.png",
  },
  davidBeckham: {
    id: "davidBeckham",
    name: "David Beckham",
    validAnswers: ["beckham", "david beckham"],
    imageUrl: "/ratDeStar/David_Beckham.jpg",
  },
  dorothee: {
    id: "dorothee",
    name: "Dorothée",
    validAnswers: ["dorothee", "dorothée"],
    imageUrl: "/ratDeStar/Dorothée.jpg",
  },
  elonMusk: {
    id: "elonMusk",
    name: "Elon Musk",
    validAnswers: ["musk", "elon musk"],
    imageUrl: "/ratDeStar/Elon_Musk.jpg",
  },
  francoisMitterrand: {
    id: "francoisMitterrand",
    name: "François Mitterrand",
    validAnswers: ["mitterrand", "francois mitterrand", "françois mitterrand"],
    imageUrl: "/ratDeStar/François_Mitterrand.jpg",
  },
  lebronJames: {
    id: "lebronJames",
    name: "LeBron James",
    validAnswers: ["lebron", "james", "lebron james"],
    imageUrl: "/ratDeStar/LeBron_James.png",
  },
  lionelMessi: {
    id: "lionelMessi",
    name: "Lionel Messi",
    validAnswers: ["messi", "lionel messi"],
    imageUrl: "/ratDeStar/Lionel_Messi.png",
  },
  michaelJackson: {
    id: "michaelJackson",
    name: "Michael Jackson",
    validAnswers: ["jackson", "michael jackson"],
    imageUrl: "/ratDeStar/Michael_Jackson.jpg",
  },
  rogerFederer: {
    id: "rogerFederer",
    name: "Roger Federer",
    validAnswers: ["federer", "roger federer"],
    imageUrl: "/ratDeStar/Roger_Federer.jpg",
  },
  sophieMarceau: {
    id: "sophieMarceau",
    name: "Sophie Marceau",
    validAnswers: ["marceau", "sophie marceau"],
    imageUrl: "/ratDeStar/Sophie_Marceau.jpg",
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
  vladimirPoutine: {
    id: "vladimirPoutine",
    name: "Vladimir Poutine",
    validAnswers: ["poutine", "vladimir poutine"],
    imageUrl: "/ratDeStar/Vladimir_Poutine.jpg",
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
