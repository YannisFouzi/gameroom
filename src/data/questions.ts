import { Theme } from "@/types/wheel";

export type Question = {
  id: string;
  text: string;
  answer: string;
  difficulty: 2 | 4 | 7 | 10;
};

export const questions: Record<Theme, Record<string, Question[]>> = {
  Sport: {
    Cyclisme: [
      {
        id: "cycl1",
        text: "Quel cycliste français a remporté le Tour de France 1987 ?",
        answer: "Bernard Hinault",
        difficulty: 2,
      },
      {
        id: "cycl2",
        text: "Qui a remporté le Tour de France en 2019 ?",
        answer: "Egan Bernal",
        difficulty: 4,
      },
      {
        id: "cycl3",
        text: "Quel coureur a remporté le plus grand nombre de victoires d'étapes sur le Tour de France ?",
        answer: "Eddy Merckx",
        difficulty: 7,
      },
      {
        id: "cycl4",
        text: "Quel est le premier coureur non européen à avoir remporté le maillot jaune du Tour de France ?",
        answer: "Greg LeMond",
        difficulty: 10,
      },
    ],
    Football: [
      {
        id: "foot1",
        text: "Quel pays a remporté la Coupe du Monde de football en 1998 ?",
        answer: "La France",
        difficulty: 2,
      },
      {
        id: "foot2",
        text: "Quel club a remporté la Ligue des champions en 1993 ?",
        answer: "L'Olympique de Marseille",
        difficulty: 4,
      },
      {
        id: "foot3",
        text: "Qui est le meilleur buteur de l'histoire de l'équipe de France de football ?",
        answer: "Olivier Giroud",
        difficulty: 7,
      },
      {
        id: "foot4",
        text: "Quel joueur italien a été élu Ballon d'or en 1969 ?",
        answer: "Gianni Rivera",
        difficulty: 10,
      },
    ],
    "Jeux Olympiques": [
      {
        id: "jo1",
        text: "Dans quelle ville les premiers Jeux Olympiques modernes ont-ils eu lieu en 1896 ?",
        answer: "Athènes",
        difficulty: 2,
      },
      {
        id: "jo2",
        text: "Quel pays a remporté le plus grand nombre de médailles lors des Jeux Olympiques de 1984 ?",
        answer: "Les États-Unis",
        difficulty: 4,
      },
      {
        id: "jo3",
        text: "Quel nageur américain a remporté 8 médailles d'or lors des JO de 2008 ?",
        answer: "Michael Phelps",
        difficulty: 7,
      },
      {
        id: "jo4",
        text: "En quelle année le tir à la corde a-t-il été une discipline olympique pour la dernière fois ?",
        answer: "1920",
        difficulty: 10,
      },
    ],
    Ski: [
      {
        id: "ski1",
        text: "Quel athlète français a remporté deux médailles d'or en ski alpin aux JO de 1968 ?",
        answer: "Jean-Claude Killy",
        difficulty: 2,
      },
      {
        id: "ski2",
        text: "Quel est le nom de la célèbre descente masculine qui se déroule chaque année à Kitzbühel ?",
        answer: "La Streif",
        difficulty: 4,
      },
      {
        id: "ski3",
        text: "Quel skieur français a remporté la Coupe du monde générale en 1997 ?",
        answer: "Luc Alphand",
        difficulty: 7,
      },
      {
        id: "ski4",
        text: "En quelle année a eu lieu la première édition de la FIS Alpine World Ski Championships ?",
        answer: "1931",
        difficulty: 10,
      },
    ],
    Rugby: [
      {
        id: "rug1",
        text: "Quel était le surnom de l'équipe d'Afrique du Sud ?",
        answer: "Les Springboks",
        difficulty: 2,
      },
      {
        id: "rug2",
        text: "Quel pays a remporté le premier Tournoi des Six Nations en 2000 ?",
        answer: "L'Angleterre",
        difficulty: 4,
      },
      {
        id: "rug3",
        text: "Qui est le joueur avec le plus de points inscrits dans l'histoire du rugby international ?",
        answer: "Dan Carter",
        difficulty: 7,
      },
      {
        id: "rug4",
        text: "En quelle année le rugby à XV a-t-il été inclus pour la dernière fois dans les Jeux Olympiques avant son retour en rugby à 7 ?",
        answer: "1924",
        difficulty: 10,
      },
    ],
    Natation: [
      {
        id: "nat1",
        text: 'Quelle nage utilise le mouvement en "cercle" des bras et un battement de jambes alternatif ?',
        answer: "Le crawl",
        difficulty: 2,
      },
      {
        id: "nat2",
        text: "Qui a remporté la médaille d'or au 100 mètres papillon aux Jeux Olympiques de 2008 à Pékin ?",
        answer: "Michael Phelps",
        difficulty: 4,
      },
      {
        id: "nat3",
        text: "Quelle nageuse française a remporté 4 médailles d'or aux Championnats du monde de 1998 ?",
        answer: "Laure Manaudou",
        difficulty: 7,
      },
      {
        id: "nat4",
        text: "Qui a été le premier nageur à terminer le 100 m nage libre en moins de 50 secondes ?",
        answer: "Jim Montgomery",
        difficulty: 10,
      },
    ],
  },
  "Années 80": {
    Chanteurs: [
      {
        id: "chan1",
        text: 'Quelle chanteuse française a interprété "Joe le taxi" ?',
        answer: "Vanessa Paradis",
        difficulty: 2,
      },
      {
        id: "chan2",
        text: 'Quel artiste français a sorti l\'album "Héros" en 1986 ?',
        answer: "Gérald De Palmas",
        difficulty: 4,
      },
      {
        id: "chan3",
        text: 'Quel chanteur américain est connu pour son album "Born in the U.S.A." sorti en 1984 ?',
        answer: "Bruce Springsteen",
        difficulty: 7,
      },
      {
        id: "chan4",
        text: "Sous quel pseudonyme Didier Marouani a-t-il composé des tubes disco à succès ?",
        answer: "Space",
        difficulty: 10,
      },
    ],
    "Modes de vie": [
      {
        id: "vie1",
        text: "Quelle était la boisson gazeuse populaire dans les années 80, souvent consommée lors des fêtes ?",
        answer: "Coca-Cola",
        difficulty: 2,
      },
      {
        id: "vie2",
        text: "Quel gadget technologique a été emblématique des années 80, permettant d'écouter de la musique en déplacement ?",
        answer: "Le Walkman",
        difficulty: 4,
      },
      {
        id: "vie3",
        text: "Quel magazine français dédié aux adolescents a connu un grand succès dans les années 80 ?",
        answer: "Okapi",
        difficulty: 7,
      },
      {
        id: "vie4",
        text: 'Quel sport extrême est devenu populaire dans les années 80, notamment grâce aux films comme "L\'Académie des Ninjas" ?',
        answer: "Le skate",
        difficulty: 10,
      },
    ],
    Films: [
      {
        id: "film1",
        text: "Quel film de 1985 raconte l'histoire d'un jeune garçon voyageant dans le temps ?",
        answer: "Retour vers le futur",
        difficulty: 2,
      },
      {
        id: "film2",
        text: 'Qui a réalisé le film "E.T. l\'extra-terrestre" en 1982 ?',
        answer: "Steven Spielberg",
        difficulty: 4,
      },
      {
        id: "film3",
        text: "Dans quel film de 1986 Tom Cruise joue-t-il un pilote de chasse dans une école d'élite ?",
        answer: "Top Gun",
        difficulty: 7,
      },
      {
        id: "film4",
        text: "Quel film d'horreur de 1982, réalisé par John Carpenter, a marqué l'histoire du cinéma ?",
        answer: "The Thing",
        difficulty: 10,
      },
    ],
    Musiques: [
      {
        id: "mus1",
        text: 'Quel groupe britannique a connu un immense succès avec la chanson "Another One Bites the Dust" en 1980 ?',
        answer: "Queen",
        difficulty: 2,
      },
      {
        id: "mus2",
        text: 'Quel chanteur américain a connu un grand succès avec la chanson "Wake Me Up Before You Go-Go" en 1984 ?',
        answer: "George Michael",
        difficulty: 4,
      },
      {
        id: "mus3",
        text: 'Quel groupe britannique a connu un énorme succès dans les années 80 avec le titre "Don\'t You Want Me" ?',
        answer: "The Human League",
        difficulty: 7,
      },
      {
        id: "mus4",
        text: 'Qui a composé la bande-son du film "Blade Runner", sorti en 1982, devenue une icône de la musique électronique ?',
        answer: "Vangelis",
        difficulty: 10,
      },
    ],
    "Mode et style vestimentaire": [
      {
        id: "mode1",
        text: "Quelle marque de vêtements a lancé dans les années 80 des baskets célèbres, souvent associées aux jeunes de l'époque ?",
        answer: "Nike",
        difficulty: 2,
      },
      {
        id: "mode2",
        text: 'Quelle marque de mode a introduit en 1986 la première ligne de vêtements "unisexes" qui a rencontré un immense succès ?',
        answer: "Comme des Garçon",
        difficulty: 4,
      },
      {
        id: "mode3",
        text: 'Quel créateur de mode a lancé la mode des "jupes-culottes" pour les femmes au début des années 80 ?',
        answer: "Jean-Paul Gaultier",
        difficulty: 7,
      },
      {
        id: "mode4",
        text: "Quel créateur de mode français a lancé la mode des vêtements aux imprimés géométriques et colorés dans les années 80 ?",
        answer: "Jean-Charles de Castelbajac",
        difficulty: 10,
      },
    ],
    Albums: [
      {
        id: "alb1",
        text: "Quel album de Michael Jackson, sorti en 1982, est devenu l'un des plus vendus de tous les temps ?",
        answer: "Thriller",
        difficulty: 2,
      },
      {
        id: "alb2",
        text: 'Quel groupe britannique a sorti l\'album "The Joshua Tree" en 1987 ?',
        answer: "U2",
        difficulty: 4,
      },
      {
        id: "alb3",
        text: "Quel album de Prince, sorti en 1984, a marqué une évolution dans son style musical avec des sons funk et pop ?",
        answer: "Purple Rain",
        difficulty: 7,
      },
      {
        id: "alb4",
        text: "Quel album de 1988 du groupe The Rolling Stones est considéré comme l'un de leurs plus aboutis dans les années 80 ?",
        answer: "Steel Wheels",
        difficulty: 10,
      },
    ],
  },
  Télévision: {
    "Séries françaises de l'époque": [
      {
        id: "sfr1",
        text: 'Dans quelle série télévisée française des années 80, un personnage nommé "Julie" était l\'héroïne, une jeune femme qui résout des mystères ?',
        answer: "Julie Lescaut",
        difficulty: 2,
      },
      {
        id: "sfr2",
        text: "Dans quelle série télévisée française, diffusée à partir de 1984, les protagonistes sont des membres d'une équipe de secours ?",
        answer: "Les Enquêtes du commissaire Maigret",
        difficulty: 4,
      },
      {
        id: "sfr3",
        text: "Dans quelle série télévisée française des années 80, le personnage principal est un avocat nommé Maître Hervé ?",
        answer: "Le Maître du Zodiaque",
        difficulty: 7,
      },
      {
        id: "sfr4",
        text: 'Quelle série française de 1971 met en scène un détective privé français dans une ambiance de "polar noir" ?',
        answer: "Le Manège enchanté",
        difficulty: 10,
      },
    ],
    "Séries françaises actuelles": [
      {
        id: "sfa1",
        text: "Quelle série française, coproduite par Netflix et diffusée en 2021 avec Omar Sy en acteur principal met en scène un gentleman cambrioleur moderne ?",
        answer: "Lupin",
        difficulty: 2,
      },
      {
        id: "sfa2",
        text: "Quelle série dramatique diffusée sur France 2 met en scène une juge d'instruction et son équipe enquêtant sur des affaires criminelles complexes ?",
        answer: "Un si grand soleil",
        difficulty: 4,
      },
      {
        id: "sfa3",
        text: "Quelle série policière française, diffusée sur France 3, met en scène une capitaine de police brillante mais tourmentée, incarnée par Audrey Fleurot ?",
        answer: "HPI (Haut Potentiel Intellectuel)",
        difficulty: 7,
      },
      {
        id: "sfa4",
        text: "Quelle série française de Canal+ raconte l'histoire d'une agente artistique et de son entourage dans le monde exigeant du cinéma ?",
        answer: "Dix pour cent",
        difficulty: 10,
      },
    ],
    "Jeux de l'époque": [
      {
        id: "jte1",
        text: "Quel jeu télévisé français des années 80 consistait à faire tourner une roue pour gagner des prix ?",
        answer: "La Roue de la Fortune",
        difficulty: 2,
      },
      {
        id: "jte2",
        text: "Quelle émission de télévision française, diffusée en 1982, mettait en compétition des équipes autour de questions d'argent ?",
        answer: "Le Juste Prix",
        difficulty: 4,
      },
      {
        id: "jte3",
        text: 'Quel animateur a relancé l\'émission "La Roue de la Fortune" au début des années 2000?',
        answer: "Christophe Dechavanne",
        difficulty: 7,
      },
      {
        id: "jte4",
        text: "Dans quel jeu télévisé français apparu fin des années 80 les candidats devaient deviner des mots grâce à des indices donnés par leurs coéquipiers ?",
        answer: "Le Mot de Passe",
        difficulty: 10,
      },
    ],
    "Jeux actuels": [
      {
        id: "jta1",
        text: "Quel est le nom de l'émission de télé-réalité diffusée chaque année sur TF1, où des célébrités danse avec des danseurs professionnels ?",
        answer: "Danse avec les stars",
        difficulty: 2,
      },
      {
        id: "jta2",
        text: 'Quel célèbre animateur a présenté "Fort Boyard" pendant plusieurs années avant de céder sa place en 2020 ?',
        answer: "Olivier Minne",
        difficulty: 4,
      },
      {
        id: "jta3",
        text: 'Quel animateur présente l\'émission "Tout le monde veut prendre sa place" depuis sa création en 2006 ?',
        answer: "Nagui",
        difficulty: 7,
      },
      {
        id: "jta4",
        text: "Dans quel jeu télévisé français les candidats doivent répondre à des questions de logique ?",
        answer: "100% logique",
        difficulty: 10,
      },
    ],
    "Séries américaines": [
      {
        id: "usa1",
        text: "Dans quelle série culte des années 2000 un groupe d'amis évolue à New York autour de la vie amoureuse et des carrières ?",
        answer: "Friends",
        difficulty: 2,
      },
      {
        id: "usa2",
        text: "Quelle série de science-fiction américaine créée par J.J. Abrams a été diffusée à partir de 2004 et met en scène un avion disparu et ses survivants sur une île mystérieuse ?",
        answer: "Lost",
        difficulty: 4,
      },
      {
        id: "usa3",
        text: "Quelle série télévisée américaine met en scène des détectives qui résolvent des crimes en Californie ?",
        answer: "Les Experts",
        difficulty: 7,
      },
      {
        id: "usa4",
        text: "Dans quelle série dramatique des années 2010 un avocat d'affaires se lance dans un complot politique en manipulant son environnement et ses relations ?",
        answer: "House of Cards",
        difficulty: 10,
      },
    ],
    "Stars des années 80": [
      {
        id: "star1",
        text: 'Dans les années 80, quel animateur a créé et présenté l\'émission "Champs-Élysées" ?',
        answer: "Michel Drucker",
        difficulty: 2,
      },
      {
        id: "star2",
        text: 'Qui présentait l\'émission "La Une est à vous" à la fin des années 80 ?',
        answer: "Jean-Luc Delarue",
        difficulty: 4,
      },
      {
        id: "star3",
        text: "Quel animateur a été à l'origine de l'émission \"Les Enfants de la télé\" ?",
        answer: "Thierry Ardisson",
        difficulty: 7,
      },
      {
        id: "star4",
        text: 'Qui était l\'animateur de "Le Juste Prix" dans les années 80 ?',
        answer: "Patrick Roy",
        difficulty: 10,
      },
    ],
  },
  "Histoire / Géo": {
    "Amérique du Sud": [
      {
        id: "ams1",
        text: "Quelle est la capitale de l'Argentine ?",
        answer: "Buenos Aires",
        difficulty: 2,
      },
      {
        id: "ams2",
        text: "Quel est le plus grand pays d'Amérique du Sud en termes de superficie ?",
        answer: "Le Brésil",
        difficulty: 4,
      },
      {
        id: "ams3",
        text: "Quelle civilisation précolombienne, située principalement au Pérou, est célèbre pour ses lignes de Nazca ?",
        answer: "Les Incas",
        difficulty: 7,
      },
      {
        id: "ams4",
        text: "Quelle est la plus grande chaîne de montagnes du continent sud-américain, qui traverse plusieurs pays comme l'Argentine, le Chili et le Pérou ?",
        answer: "Les Andes",
        difficulty: 10,
      },
    ],
    "Première Guerre mondiale": [
      {
        id: "ww1",
        text: "En quelle année la Première Guerre mondiale a-t-elle commencé ?",
        answer: "1914",
        difficulty: 2,
      },
      {
        id: "ww2",
        text: 'Quel général français, surnommé "Le Lion de Verdun", a joué un rôle déterminant lors de la bataille de Verdun en 1916 ?',
        answer: "Philippe Pétain",
        difficulty: 4,
      },
      {
        id: "ww3",
        text: "Quelle bataille, qui s'est déroulée en 1916, est considérée comme l'une des plus sanglantes de la Première Guerre mondiale ?",
        answer: "La bataille de la Somme",
        difficulty: 7,
      },
      {
        id: "ww4",
        text: "Quel était le nom de l'accord trouvé lors de la conférence secrète, tenue en 1916 entre la France et la Grande-Bretagne, qui a tracé les frontières de l'Empire ottoman après la guerre ?",
        answer: "L'accord Sykes-Picot",
        difficulty: 10,
      },
    ],
    "Guerre froide": [
      {
        id: "gf1",
        text: "Quel mur symbolisait la division de l'Allemagne et de Berlin pendant la Guerre froide ?",
        answer: "Le mur de Berlin",
        difficulty: 2,
      },
      {
        id: "gf2",
        text: "Quel accord, signé en 1962, a permis de mettre fin à la crise des missiles de Cuba, un des moments les plus tendus de la Guerre froide ?",
        answer: "L'accord sur les missiles soviétiques",
        difficulty: 4,
      },
      {
        id: "gf3",
        text: "En 1979, quel pays d'Asie, après un coup d'État, a rejoint le bloc soviétique, provoquant l'invasion de ce pays par l'Union soviétique et exacerbant les tensions de la Guerre froide ?",
        answer: "L'Afghanistan",
        difficulty: 7,
      },
      {
        id: "gf4",
        text: "Qui était le dirigeant de l'Union soviétique pendant la période de la déstalinisation et de la Guerre froide ?",
        answer: "Nikita Khrouchtchev",
        difficulty: 10,
      },
    ],
    "Campagnes napoléoniennes": [
      {
        id: "nap1",
        text: "Lors de quelle bataille Napoléon Bonaparte a-t-il été défait en 1815 ?",
        answer: "La bataille de Waterloo",
        difficulty: 2,
      },
      {
        id: "nap2",
        text: "Quelle campagne militaire de Napoléon a eu lieu en 1812 et s'est soldée par un échec majeur ?",
        answer: "La campagne de Russie",
        difficulty: 4,
      },
      {
        id: "nap3",
        text: "En quelle année Napoléon Ier a-t-il été couronné ?",
        answer: "1804",
        difficulty: 7,
      },
      {
        id: "nap4",
        text: "Quel traité signé en 1814 a mis fin à la guerre de la Sixième Coalition et a conduit à l'exil de Napoléon sur l'île d'Elbe ?",
        answer: "Le traité de Fontainebleau",
        difficulty: 10,
      },
    ],
    "Rois de France": [
      {
        id: "roi1",
        text: "Qui était le roi de France pendant la Révolution française ?",
        answer: "Louis XVI",
        difficulty: 2,
      },
      {
        id: "roi2",
        text: "Quel roi de France a fait construire le château de Versailles ?",
        answer: "Louis XIV",
        difficulty: 4,
      },
      {
        id: "roi3",
        text: 'Quel roi de France est surnommé "Saint Louis" et a régné au XIIIe siècle ?',
        answer: "Louis IX",
        difficulty: 7,
      },
      {
        id: "roi4",
        text: "Quel roi de France, sous son règne, a mené la guerre contre l'Angleterre pendant la guerre de Cent Ans, et a perdu la bataille de Poitiers en 1356 ?",
        answer: "Jean II le Bon",
        difficulty: 10,
      },
    ],
    Afrique: [
      {
        id: "afr1",
        text: "Quel est le plus grand pays d'Afrique en termes de superficie ?",
        answer: "Algerie",
        difficulty: 2,
      },
      {
        id: "afr2",
        text: "Quel est le fleuve le plus long d'Afrique ?",
        answer: "Le Nil",
        difficulty: 4,
      },
      {
        id: "afr3",
        text: "Quel ancien empire africain, fondé par l'empereur Mansa Musa, était connu pour sa richesse en or au XIVe siècle et couvrait une grande partie de l'Afrique de l'Ouest ?",
        answer: "L'Empire du Mali",
        difficulty: 7,
      },
      {
        id: "afr4",
        text: "Quel pays d'Afrique a obtenu son indépendance de la France en 1960 et est aujourd'hui le plus peuplé du continent ?",
        answer: "Le Nigéria",
        difficulty: 10,
      },
    ],
  },
};
