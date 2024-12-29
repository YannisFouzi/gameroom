import {
  baseRoomService,
  gameTransitionService,
  jokerService,
  millionaireService,
  ratDeStarService,
} from "./services";

// Service de compatibilité pour la transition
export const roomService = {
  ...baseRoomService,
  ...ratDeStarService,
  ...millionaireService,
  ...jokerService,
  ...gameTransitionService,
};
