import { Theme } from "@/types/wheel";

export type Question = {
  id: string;
  text: string;
  answer: string;
  difficulty: 2 | 4 | 7 | 10;
};

export const questions: Record<Theme, Record<string, Question[]>> = {
  Politique: {
    Macron: [
      {
        id: "mac1",
        text: "En quelle année Macron est-il devenu président ?",
        answer: "2017",
        difficulty: 2,
      },
      {
        id: "mac3",
        text: "Quel est le nom de sa femme ?",
        answer: "Brigitte Macron",
        difficulty: 4,
      },
      {
        id: "mac5",
        text: "Dans quelle banque a-t-il travaillé avant la politique ?",
        answer: "Rothschild & Cie",
        difficulty: 7,
      },
      {
        id: "mac8",
        text: "Citez les 3 premiers ministres de ses mandats dans l'ordre",
        answer: "Édouard Philippe, Jean Castex, Élisabeth Borne",
        difficulty: 10,
      },
    ],
    Sarkozy: [
      {
        id: "sar1",
        text: "En quelle année Sarkozy est-il devenu président ?",
        answer: "2007",
        difficulty: 2,
      },
      {
        id: "sar3",
        text: "Quel surnom lui donnait-on dans les médias ?",
        answer: "Sarko",
        difficulty: 4,
      },
      {
        id: "sar5",
        text: "Quel poste occupait-il sous Chirac ?",
        answer: "Ministre de l'Intérieur",
        difficulty: 7,
      },
      {
        id: "sar8",
        text: "Citez 3 réformes majeures de son quinquennat",
        answer:
          "Réforme des retraites, Création du RSA, Réforme des universités",
        difficulty: 10,
      },
    ],
    Hollande: [
      {
        id: "hol1",
        text: "En quelle année Hollande est-il devenu président ?",
        answer: "2012",
        difficulty: 2,
      },
      {
        id: "hol3",
        text: "De quel parti politique était-il ?",
        answer: "Parti Socialiste",
        difficulty: 4,
      },
      {
        id: "hol5",
        text: "Quel surnom lui donnait la presse ?",
        answer: "Flamby",
        difficulty: 7,
      },
      {
        id: "hol8",
        text: "Citez 3 événements majeurs de son quinquennat",
        answer: "Mariage pour tous, Attentats de 2015, COP21",
        difficulty: 10,
      },
    ],
  },

  Informatique: {
    Excel: [
      {
        id: "exc1",
        text: "Que signifie le symbole = en début de formule ?",
        answer: "Début d'une formule de calcul",
        difficulty: 2,
      },
      {
        id: "exc3",
        text: "Quelle fonction permet de chercher une valeur dans un tableau ?",
        answer: "RECHERCHEV",
        difficulty: 4,
      },
      {
        id: "exc5",
        text: "Que fait la fonction CONCATENER ?",
        answer: "Elle fusionne plusieurs textes en un seul",
        difficulty: 7,
      },
      {
        id: "exc8",
        text: "Expliquez la différence entre référence absolue et relative",
        answer: "Relative change lors de la copie, absolue ($) reste fixe",
        difficulty: 10,
      },
    ],
    Photoshop: [
      {
        id: "pho1",
        text: "Quel raccourci pour zoomer ?",
        answer: "Ctrl + ou Cmd +",
        difficulty: 2,
      },
      {
        id: "pho3",
        text: "À quoi sert l'outil lasso ?",
        answer: "À faire une sélection à main levée",
        difficulty: 4,
      },
      {
        id: "pho5",
        text: "Quelle est la différence entre RVB et CMJN ?",
        answer: "RVB pour écran, CMJN pour impression",
        difficulty: 7,
      },
      {
        id: "pho8",
        text: "Citez 3 types de masques et leurs utilisations",
        answer: "Masque de fusion, d'écrêtage, vectoriel",
        difficulty: 10,
      },
    ],
    Spotify: [
      {
        id: "spo1",
        text: "En quelle année Spotify a été créé ?",
        answer: "2006",
        difficulty: 2,
      },
      {
        id: "spo3",
        text: "Dans quel pays est né Spotify ?",
        answer: "Suède",
        difficulty: 4,
      },
      {
        id: "spo5",
        text: "Quel est le format audio utilisé par Spotify ?",
        answer: "Ogg Vorbis",
        difficulty: 7,
      },
      {
        id: "spo8",
        text: "Expliquez l'algorithme de recommandation",
        answer:
          "Collaborative Filtering, analyse d'écoute, similarité musicale",
        difficulty: 10,
      },
    ],
  },

  Histoire: {
    Napoléon: [
      {
        id: "nap1",
        text: "En quelle année Napoléon est-il devenu empereur ?",
        answer: "1804",
        difficulty: 2,
      },
      {
        id: "nap3",
        text: "Sur quelle île est-il mort ?",
        answer: "Sainte-Hélène",
        difficulty: 4,
      },
      {
        id: "nap5",
        text: "Citez 2 grandes batailles qu'il a remportées",
        answer: "Austerlitz, Iéna",
        difficulty: 7,
      },
      {
        id: "nap8",
        text: "Expliquez le système du blocus continental",
        answer:
          "Interdiction de commercer avec l'Angleterre pour l'affaiblir économiquement",
        difficulty: 10,
      },
    ],
    "Seconde Guerre Mondiale": [
      {
        id: "ww1",
        text: "En quelle année a débuté la Seconde Guerre mondiale ?",
        answer: "1939",
        difficulty: 2,
      },
      {
        id: "ww3",
        text: "Qui étaient les 3 principaux pays de l'Axe ?",
        answer: "Allemagne, Italie, Japon",
        difficulty: 4,
      },
      {
        id: "ww5",
        text: "Quelle était l'opération du débarquement en Normandie ?",
        answer: "Opération Overlord",
        difficulty: 7,
      },
      {
        id: "ww8",
        text: "Expliquez ce qu'était l'opération Barbarossa",
        answer: "Invasion de l'URSS par l'Allemagne nazie en 1941",
        difficulty: 10,
      },
    ],
    "Guerre Froide": [
      {
        id: "gf1",
        text: "Quels étaient les deux blocs opposés ?",
        answer: "États-Unis et URSS",
        difficulty: 2,
      },
      {
        id: "gf3",
        text: "En quelle année le mur de Berlin est-il tombé ?",
        answer: "1989",
        difficulty: 4,
      },
      {
        id: "gf5",
        text: "Qu'était la crise des missiles de Cuba ?",
        answer:
          "Confrontation entre USA et URSS sur des missiles nucléaires à Cuba",
        difficulty: 7,
      },
      {
        id: "gf8",
        text: "Expliquez la doctrine Truman et le plan Marshall",
        answer: "Endiguement du communisme et aide économique à l'Europe",
        difficulty: 10,
      },
    ],
  },

  Animaux: {
    Dauphin: [
      {
        id: "dau1",
        text: "Le dauphin est-il un poisson ?",
        answer: "Non, c'est un mammifère",
        difficulty: 2,
      },
      {
        id: "dau3",
        text: "Quelle est la durée de vie moyenne d'un dauphin ?",
        answer: "20-30 ans",
        difficulty: 4,
      },
      {
        id: "dau5",
        text: "Comment s'appelle le système d'écholocation des dauphins ?",
        answer: "Le sonar",
        difficulty: 7,
      },
      {
        id: "dau8",
        text: "Expliquez comment les dauphins dorment",
        answer:
          "Un hémisphère cérébral à la fois, en remontant régulièrement pour respirer",
        difficulty: 10,
      },
    ],
    Singe: [
      {
        id: "sin1",
        text: "Quel est le plus grand des singes ?",
        answer: "Le gorille",
        difficulty: 2,
      },
      {
        id: "sin3",
        text: "Quel singe partage 98% de son ADN avec l'homme ?",
        answer: "Le chimpanzé",
        difficulty: 4,
      },
      {
        id: "sin5",
        text: "Citez 3 espèces de grands singes",
        answer: "Gorille, Chimpanzé, Orang-outan",
        difficulty: 7,
      },
      {
        id: "sin8",
        text: "Expliquez la différence entre singes de l'ancien et du nouveau monde",
        answer:
          "Ancien monde: Afrique/Asie, queue non préhensile. Nouveau monde: Amériques, queue préhensile",
        difficulty: 10,
      },
    ],
    Chien: [
      {
        id: "chi1",
        text: "De quel animal le chien descend-il ?",
        answer: "Le loup",
        difficulty: 2,
      },
      {
        id: "chi3",
        text: "Combien de races de chiens reconnues existe-t-il ?",
        answer: "Plus de 300",
        difficulty: 4,
      },
      {
        id: "chi5",
        text: "Quels sont les 5 sens du chien par ordre d'importance ?",
        answer: "Odorat, ouïe, vue, toucher, goût",
        difficulty: 7,
      },
      {
        id: "chi8",
        text: "Expliquez le langage corporel des chiens",
        answer:
          "Queue, oreilles, posture, regard, babines expriment différentes émotions",
        difficulty: 10,
      },
    ],
  },

  Marque: {
    Asus: [
      {
        id: "asu1",
        text: "Dans quel pays est née la marque Asus ?",
        answer: "Taiwan",
        difficulty: 2,
      },
      {
        id: "asu3",
        text: "Que signifie le nom Asus ?",
        answer: "Dérivé de Pegasus (pégase)",
        difficulty: 4,
      },
      {
        id: "asu5",
        text: "En quelle année a été fondée Asus ?",
        answer: "1989",
        difficulty: 7,
      },
      {
        id: "asu8",
        text: "Citez 3 innovations majeures d'Asus",
        answer:
          "Carte mère pour Intel P6, EeePC (premier netbook), ROG (gaming)",
        difficulty: 10,
      },
    ],
    Google: [
      {
        id: "goo1",
        text: "En quelle année Google a-t-il été créé ?",
        answer: "1998",
        difficulty: 2,
      },
      {
        id: "goo3",
        text: "Qui sont les fondateurs de Google ?",
        answer: "Larry Page et Sergey Brin",
        difficulty: 4,
      },
      {
        id: "goo5",
        text: "Que signifie le mot Google ?",
        answer: "Dérivé de Gogol (10^100)",
        difficulty: 7,
      },
      {
        id: "goo8",
        text: "Expliquez le PageRank",
        answer:
          "Algorithme qui classe les pages web selon leur importance et leurs liens",
        difficulty: 10,
      },
    ],
    Microsoft: [
      {
        id: "mic1",
        text: "Qui est le fondateur de Microsoft ?",
        answer: "Bill Gates",
        difficulty: 2,
      },
      {
        id: "mic3",
        text: "En quelle année Windows a-t-il été lancé ?",
        answer: "1985",
        difficulty: 4,
      },
      {
        id: "mic5",
        text: "Citez 3 produits majeurs de Microsoft",
        answer: "Windows, Office, Xbox",
        difficulty: 7,
      },
      {
        id: "mic8",
        text: "Expliquez l'histoire du système d'exploitation Windows",
        answer:
          "MS-DOS → Windows 1.0 → 95 → XP → 7 → 10 → 11, évolution interface graphique",
        difficulty: 10,
      },
    ],
  },
};
