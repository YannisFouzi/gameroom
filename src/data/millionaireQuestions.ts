import { MillionaireQuestion } from "@/types/millionaire";

export const millionaireQuestions: Record<string, MillionaireQuestion[]> = {
  histoire: [
    {
      id: "h1",
      text: "Quel pays a été le premier à envoyer un homme sur la Lune en 1969 ?",
      answers: ["États-Unis", "Union Soviétique", "France", "Japon"],
      correctAnswer: 0,
      points: 1,
      category: "histoire",
    },
    {
      id: "h2",
      text: "Quel est le nom de la ville qui a été la capitale de l'Empire Romain ?",
      answers: ["Athènes", "Rome", "Carthage", "Constantinople"],
      correctAnswer: 1,
      points: 1,
      category: "histoire",
    },
    {
      id: "h3",
      text: "Quel célèbre explorateur a découvert l'Amérique en 1492 ?",
      answers: [
        "Vasco de Gama",
        "Marco Polo",
        "Ferdinand Magellan",
        "Christophe Colomb",
      ],
      correctAnswer: 3,
      points: 1,
      category: "histoire",
    },
    {
      id: "h4",
      text: "Quelle bataille de 1815, qui a marqué la fin de l'Empire napoléonien, a vu Napoléon Ier vaincu par une coalition anglo-prussienne ?",
      answers: [
        "Bataille d'Austerlitz",
        "Bataille de Leipzig",
        "Bataille de Waterloo",
        "Bataille de Borodino",
      ],
      correctAnswer: 2,
      points: 2,
      category: "histoire",
    },
    {
      id: "h5",
      text: "Quel est le nom du canal qui relie la mer Méditerranée à la mer Rouge ?",
      answers: [
        "Le canal de Panama",
        "Le canal de Kiel",
        "Le canal de Corinthe",
        "Le canal de Suez",
      ],
      correctAnswer: 3,
      points: 1,
      category: "histoire",
    },
    {
      id: "h6",
      text: "En quelle année la France a-t-elle aboli la peine de mort ?",
      answers: ["1979", "1981", "1999", "1975"],
      correctAnswer: 1,
      points: 2,
      category: "histoire",
    },
    {
      id: "h7",
      text: "Qui était le général français durant la bataille de Verdun en 1916 ?",
      answers: [
        "Charles de Gaulle",
        "Joseph Joffre",
        "Philippe Pétain",
        "Ferdinand Foch",
      ],
      correctAnswer: 2,
      points: 2,
      category: "histoire",
    },
    {
      id: "h8",
      text: "Qui fut le dernier empereur d'Occident avant la chute de l'Empire romain en 476 ?",
      answers: ["Honorius", "Théodose II", "Auguste", "Romulus Augustule"],
      correctAnswer: 3,
      points: 3,
      category: "histoire",
    },
    {
      id: "h9",
      text: "Quel traité signé en 1951 a conduit à la création de la Communauté économique européenne (CEE), ancêtre de l'Union européenne ?",
      answers: [
        "Traité de Maastricht",
        "Traité de Paris",
        "Traité de Rome",
        "Traité de Bruxelles",
      ],
      correctAnswer: 2,
      points: 2,
      category: "histoire",
    },
    {
      id: "h10",
      text: "Qui était le leader du mouvement des droits civiques aux États-Unis dans les années 1960 ?",
      answers: [
        "Malcolm X",
        "Rosa Parks",
        "Nelson Mandela",
        "Martin Luther King Jr.",
      ],
      correctAnswer: 3,
      points: 2,
      category: "histoire",
    },
    {
      id: "h11",
      text: "Quel était le nom de l'Empire qui a contrôlé une grande partie de l'Asie et de l'Europe au Moyen Âge, jusqu'à sa chute en 1453 ?",
      answers: [
        "L'Empire Ottoman",
        "L'Empire Byzantin",
        "L'Empire Romain",
        "L'Empire Mongol",
      ],
      correctAnswer: 1,
      points: 3,
      category: "histoire",
    },
    {
      id: "h12",
      text: "Quel traité de 1648 a mis fin à la guerre de Trente Ans et redéfini les frontières de l'Europe en créant un nouvel équilibre politique ?",
      answers: [
        "Traité de Paris",
        "Traité de Ryswick",
        "Traité de Westphalie",
        "Traité de Versailles",
      ],
      correctAnswer: 2,
      points: 3,
      category: "histoire",
    },
    {
      id: "h13",
      text: "En quelle année l'Empire romain d'Occident est-il tombé ?",
      answers: ["395", "482", "476", "499"],
      correctAnswer: 2,
      points: 2,
      category: "histoire",
    },
    {
      id: "h14",
      text: "En quelle année l'Empire colonial français a-t-il perdu l'Indochine ?",
      answers: ["1952", "1962", "1965", "1954"],
      correctAnswer: 3,
      points: 2,
      category: "histoire",
    },
    {
      id: "h15",
      text: "Quel empereur chinois a fondé la dynastie Ming en 1368 après avoir renversé la dynastie Yuan ?",
      answers: ["Kangxi", "Zhu Yuanzhang", "Qianlong", "Taizu"],
      correctAnswer: 1,
      points: 3,
      category: "histoire",
    },
  ],
  sport: [
    {
      id: "s1",
      text: "Quel est le seul club de football français à avoir remporté la Ligue des Champions ?",
      answers: [
        "Paris Saint-Germain",
        "AS Monaco",
        "Olympique Lyonnais",
        "Olympique de Marseille",
      ],
      correctAnswer: 3,
      points: 2,
      category: "sport",
    },
    {
      id: "s2",
      text: "Dans quel sport le Français Renaud Lavillenie excelle-t-il ?",
      answers: [
        "Lancer du poids",
        "400 m haies",
        "Saut à la perche",
        "Saut en longueur",
      ],
      correctAnswer: 2,
      points: 2,
      category: "sport",
    },
    {
      id: "s3",
      text: "Quelle équipe nationale a remporté le plus de titres en Coupe du Monde de football ?",
      answers: ["Italie", "Le Brésil", "Pays-Bas", "France"],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s4",
      text: "Quel joueur français a été le capitaine de l'équipe de France championne du monde en 1998 ?",
      answers: [
        "Zinédine Zidane",
        "Laurent Blanc",
        "Didier Deschamps",
        "Marcel Desailly",
      ],
      correctAnswer: 2,
      points: 2,
      category: "sport",
    },
    {
      id: "s5",
      text: "Qui est le seul coureur à avoir remporté sept fois consécutivement le Tour de France avant que ses titres ne soient annulés ?",
      answers: [
        "Miguel Indurain",
        "Lance Armstrong",
        "Chris Froome",
        "Eddy Merckx",
      ],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s6",
      text: "En quelle année a eu lieu la première édition des Jeux Olympiques modernes ?",
      answers: ["1800", "1828", "1896", "1515"],
      correctAnswer: 2,
      points: 2,
      category: "sport",
    },
    {
      id: "s7",
      text: "Quelle joueuse de tennis française a remporté Roland-Garros en 2000 ?",
      answers: [
        "Amélie Mauresmo",
        "Mary Pierce",
        "Kristina Mladenovic",
        "Nathalie Tauziat",
      ],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s8",
      text: "En 1986, Luis Fernandez quitte le Paris SG pour s'engager dans quel autre club français ?",
      answers: [
        "Olympique de Marseille",
        "Olympique Lyonnais",
        "Matra Racing de Paris",
        "Girondins de Bordeaux",
      ],
      correctAnswer: 2,
      points: 3,
      category: "sport",
    },
    {
      id: "s9",
      text: "Qui est considéré comme le plus grand skieur français de tous les temps avec 4 médailles d'or olympiques ?",
      answers: [
        "Alexis Pinturault",
        "Jean-Claude Killy",
        "Martin Fourcade",
        "Luc Alphand",
      ],
      correctAnswer: 1,
      points: 3,
      category: "sport",
    },
    {
      id: "s10",
      text: "Quel joueur de tennis est le plus titré à Wimbledon dans l'histoire du tennis masculin ?",
      answers: [
        "Rafael Nadal",
        "Roger Federer",
        "Pete Sampras",
        "Novak Djokovic",
      ],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s11",
      text: "Quel pays a remporté la première Coupe du Monde de rugby en 1987 ?",
      answers: [
        "Australie",
        "La Nouvelle-Zélande",
        "Angleterre",
        "Afrique du Sud",
      ],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s12",
      text: "Quel gardien de but légendaire a été capitaine de l'équipe d'Allemagne championne du monde en 1990 ?",
      answers: [
        "Manuel Neuer",
        "Oliver Kahn",
        "Jens Lehmann",
        "Lothar Matthäus",
      ],
      correctAnswer: 3,
      points: 3,
      category: "sport",
    },
    {
      id: "s13",
      text: "Quel joueur détient le record absolu de buts marqués en Coupe du Monde de football ?",
      answers: ["Gerd Müller", "Miroslav Klose", "Just Fontaine", "Ronaldo"],
      correctAnswer: 1,
      points: 2,
      category: "sport",
    },
    {
      id: "s14",
      text: "Quel joueur de basketball détient le record du plus grand nombre de points marqués en un seul match NBA ?",
      answers: [
        "Michael Jordan",
        "Brandon Ingram",
        "Wilt Chamberlain",
        "LeBron James",
      ],
      correctAnswer: 2,
      points: 3,
      category: "sport",
    },
    {
      id: "s15",
      text: "Quel boxeur a détenu simultanément les titres de champion du monde dans trois catégories de poids différentes ?",
      answers: [
        "Sugar Ray Leonard",
        "Henry Armstrong",
        "Floyd Mayweather",
        "Manny Pacquiao",
      ],
      correctAnswer: 1,
      points: 3,
      category: "sport",
    },
  ],
  annees80: [
    {
      id: "a1",
      text: "Quel film de 1985 avec Michael J. Fox raconte l'histoire d'un adolescent qui voyage dans le temps à bord d'une DeLorean ?",
      answers: [
        "Les Goonies",
        "Retour vers le futur",
        "L'Histoire sans fin",
        "La Guerre des étoiles",
      ],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a2",
      text: 'Quel chanteur français a eu un énorme succès avec "Je te promets" en 1985 ?',
      answers: [
        "Daniel Balavoine",
        "Michel Sardou",
        "Claude François",
        "Johnny Hallyday",
      ],
      correctAnswer: 3,
      points: 2,
      category: "annees80",
    },
    {
      id: "a3",
      text: 'Quel chanteur a interprété le tube "Like a Virgin" en 1984 ?',
      answers: ["Cyndi Lauper", "Whitney Houston", "Madonna", "Tina Turner"],
      correctAnswer: 2,
      points: 2,
      category: "annees80",
    },
    {
      id: "a4",
      text: "Quel film musical de 1987 avec Patrick Swayze et Jennifer Grey raconte une histoire d'amour dans une station balnéaire ?",
      answers: ["Footloose", "Dirty Dancing", "Grease", "Fame"],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a5",
      text: 'Quel groupe a interprété le tube "Sweet Dreams (Are Made of This)" en 1983 ?',
      answers: [
        "Culture Club",
        "The Human League",
        "Eurythmics",
        "Duran Duran",
      ],
      correctAnswer: 2,
      points: 2,
      category: "annees80",
    },
    {
      id: "a6",
      text: "Qui a interprété le célèbre tube \"Don't Stop Believin'\" sorti en 1981 ?",
      answers: ["Queen", "U2", "Journey", "Bon Jovi"],
      correctAnswer: 2,
      points: 2,
      category: "annees80",
    },
    {
      id: "a7",
      text: 'En 1989, le film "Batman" de Tim Burton a marqué l\'histoire du cinéma avec son ambiance sombre. Qui a interprété le rôle du Joker dans ce film ?',
      answers: [
        "Michael Keaton",
        "Jack Nicholson",
        "Christian Bale",
        "Heath Ledger",
      ],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a8",
      text: 'Qui a chanté "Girls Just Want to Have Fun" en 1983 ?',
      answers: ["Madonna", "Diana Ross", "Janet Jackson", "Cyndi Lauper"],
      correctAnswer: 3,
      points: 2,
      category: "annees80",
    },
    {
      id: "a9",
      text: 'En 1983, quel groupe britannique a sorti le tube "Every Breath You Take" ?',
      answers: ["The Rolling Stones", "The Police", "Queen", "The Clash"],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a10",
      text: 'Quel acteur a incarné le personnage de James Bond dans "Rien que pour vos yeux" en 1981 ?',
      answers: [
        "Sean Connery",
        "Daniel Craig",
        "Roger Moore",
        "Pierce Brosnan",
      ],
      correctAnswer: 2,
      points: 2,
      category: "annees80",
    },
    {
      id: "a11",
      text: "Quel film culte de 1986, réalisé par Tony Scott, met en scène des pilotes de chasse dans l'US Navy ?",
      answers: ["Les Goonies", "Top Gun", "Predators", "Apocalypse Now"],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a12",
      text: "Quel jeu vidéo, lancé en 1985, a transformé Mario en un personnage emblématique des jeux vidéo ?",
      answers: [
        "Mario Kart",
        "Mario Party",
        "Super Mario Series",
        "Super Mario Bros.",
      ],
      correctAnswer: 3,
      points: 2,
      category: "annees80",
    },
    {
      id: "a13",
      text: "En quelle année la célèbre chaîne musicale MTV a-t-elle été lancée aux États-Unis ?",
      answers: ["1983", "1980", "1981", "1985"],
      correctAnswer: 2,
      points: 2,
      category: "annees80",
    },
    {
      id: "a14",
      text: "Quel est le nom du film de 1981, qui est une adaptation de l'œuvre de Joseph Conrad, et qui raconte l'histoire d'un capitaine de navire en pleine guerre civile ?",
      answers: [
        "Apocalypse Now",
        "La Mission",
        "Le Pénitentiaire",
        "Le Dernier Empereur",
      ],
      correctAnswer: 1,
      points: 2,
      category: "annees80",
    },
    {
      id: "a15",
      text: "Quel événement musical majeur a eu lieu en 1985 et a réuni plus de 70 artistes internationaux pour lutter contre la famine en Éthiopie, avec des performances en direct à Londres et Philadelphie ?",
      answers: ["Band Aid", "Live Aid", "World Aid", "Unity"],
      correctAnswer: 1,
      points: 3,
      category: "annees80",
    },
  ],
  television: [
    {
      id: "t1",
      text: "Quel jeu télévisé est animé par Jean-Luc Reichmann, connu pour ses questions à choix multiples, diffusé depuis 2001 ?",
      answers: [
        "Le Maillon Faible",
        "N'oubliez pas les paroles",
        "Les 12 Coups de midi",
        "L'amour est dans le pré",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t2",
      text: "Quel jeu télévisé français diffusé depuis 1990 permet aux candidats de participer à des épreuves physiques et de répondre à des questions pour remporter des clés ?",
      answers: ["Les Z'amours", "Pyramide", "Fort Boyard", "Le Maillon Faible"],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t3",
      text: "Quelle émission culinaire a été animée par Cyril Lignac depuis 2010 ?",
      answers: [
        "MasterChef",
        "Top Chef",
        "Le Meilleur Pâtissier",
        "Cauchemar en cuisine",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t4",
      text: 'Qui a été le premier animateur de "Questions pour un champion", un jeu de culture générale diffusé sur France 3 ?',
      answers: [
        "Pierre Bellemare",
        "Julien Lepers",
        "Bernard Pivot",
        "Michel Sardou",
      ],
      correctAnswer: 1,
      points: 2,
      category: "television",
    },
    {
      id: "t5",
      text: 'Qui a animé l\'émission "Le Petit Rapporteur" dans les années 70 ?',
      answers: [
        "Michel Drucker",
        "Thierry Ardisson",
        "Jean-Pierre Foucault",
        "Jacques Martin",
      ],
      correctAnswer: 3,
      points: 2,
      category: "television",
    },
    {
      id: "t6",
      text: "Quelle série télévisée française, diffusée à partir de 2002, raconte l'histoire d'un commissaire de police ?",
      answers: [
        "Julie Lescaut",
        "Navarro",
        "PJ",
        "Les Enquêtes de Maître Lefort",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t7",
      text: 'Quel acteur a joué le rôle principal dans la série "Hercule Poirot" adaptée des romans d\'Agatha Christie ?',
      answers: [
        "Albert Finney",
        "Peter Ustinov",
        "David Suchet",
        "Kenneth Branagh",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t8",
      text: "Quel jeu télévisé a été créé par Louis Laforge en 1992 et est basé sur la culture générale ?",
      answers: [
        "Fort Boyard",
        "La Carte aux Trésors",
        "Pyramide",
        "Le Juste Prix",
      ],
      correctAnswer: 1,
      points: 2,
      category: "television",
    },
    {
      id: "t9",
      text: "Dans quelle série télévisée française des années 90 les personnages principaux sont-ils des policiers du 36 quai des Orfèvres ?",
      answers: [
        "Les Cordier, juge et flic",
        "Les Brigades du Tigre",
        "Louis la Brocante",
        "Le Gendarme de Saint-Tropez",
      ],
      correctAnswer: 1,
      points: 2,
      category: "television",
    },
    {
      id: "t10",
      text: "Dans quelle série des années 90, un couple de détectives résout des affaires mystérieuses à Los Angeles ?",
      answers: [
        "Les Experts : Miami",
        "X-Files",
        "Dr Quinn, femme médecin",
        "Magnum",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t11",
      text: "Quel était le nom de l'émission de variétés diffusée tous les samedis soir pendant des années, animée par Michel Sardou ?",
      answers: [
        "Champs-Élysées",
        "Les Dossiers de l'écran",
        "Le Grand Échiquier",
        "Stars à domicile",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t12",
      text: "Quel personnage de série télévisée était incarné par Gérard Depardieu dans les années 80 ?",
      answers: [
        "Le Colonel Chabert",
        "Le Comte de Monte-Cristo",
        "Les Misérables",
        "Cyrano de Bergerac",
      ],
      correctAnswer: 1,
      points: 2,
      category: "television",
    },
    {
      id: "t13",
      text: "Quel est le nom de la série où un groupe de jeunes élèves d'un lycée de banlieue parisienne fait face à divers défis, diffusée à partir de 2004 ?",
      answers: [
        "Les Secrets du lycée",
        "Plus belle la vie",
        "K2000",
        "Hélène et les garçons",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t14",
      text: 'Quel acteur a joué le rôle de "Louis la Brocante" dans la série télévisée à succès diffusée sur France 3 ?',
      answers: [
        "Gérard Depardieu",
        "Thierry Lhermitte",
        "Victor Lanoux",
        "Jean-Paul Belmondo",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
    {
      id: "t15",
      text: 'Quel acteur français a joué dans la série télévisée "Les Rois Maudits", adaptée du roman de Maurice Druon, diffusée en 1972 ?',
      answers: [
        "Jean-Pierre Aumont",
        "Jean Rochefort",
        "Michel Lemoine",
        "Gérard Depardieu",
      ],
      correctAnswer: 2,
      points: 2,
      category: "television",
    },
  ],
};
