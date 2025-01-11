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
        text: "Quelle est la couleur du maillot porté par le leader du Tour d'Italie ?",
        answer: "Rose",
        difficulty: 2,
      },
      {
        id: "cycl2",
        text: "Combien de fois Bernard Hinault a-t-il remporté le Tour de France ?",
        answer: "5 fois",
        difficulty: 4,
      },
      {
        id: "cycl3",
        text: "En quelle année, le Tour de France a-t-il été retransmis en direct à la télévision pour la première fois ?",
        answer: "1948",
        difficulty: 7,
      },
      {
        id: "cycl4",
        text: "En 1989, Greg LeMond a gagné le Tour de France avec seulement 8 secondes d'avance sur quel coureur français ?",
        answer: "Laurent Fignon",
        difficulty: 10,
      },
    ],
    Football: [
      {
        id: "foot1",
        text: "Quel joueur a marqué le seul but de l'équipe de France lors de la finale 2006 contre l'Italie ?",
        answer: "Zinédine Zidane",
        difficulty: 2,
      },
      {
        id: "foot2",
        text: "Quel joueur est le meilleur buteur de l'histoire des équipes nationales avec 123 buts ?",
        answer: "Cristiano Ronaldo",
        difficulty: 4,
      },
      {
        id: "foot3",
        text: "Quel est le joueur qui compte le plus de match en coupe du monde?",
        answer: "Lionel Messi",
        difficulty: 7,
      },
      {
        id: "foot4",
        text: "Quelle était l'affiche et le score de la finale du championnat d'Europe des nations 1996 ?",
        answer: "Dannemark 2 - 0 Allemagne",
        difficulty: 10,
      },
    ],
    "Jeux Olympiques": [
      {
        id: "jo1",
        text: "En quelle année les premiers Jeux Olympiques modernes ont-ils eu lieu ?",
        answer: "1896",
        difficulty: 2,
      },
      {
        id: "jo2",
        text: "Quelle ville a accueilli les Jeux Olympiques d'hiver en 1992 ?",
        answer: "Albertville, France",
        difficulty: 4,
      },
      {
        id: "jo3",
        text: "Qui est le premier athlète à avoir remporté 4 médailles d'or lors des Jeux Olympiques de Berlin en 1936 ?",
        answer: "Jesse Owens",
        difficulty: 7,
      },
      {
        id: "jo4",
        text: "Qui est la première femme à avoir remporté une médaille d'or aux Jeux Olympiques modernes ?",
        answer: "Charlotte Cooper",
        difficulty: 10,
      },
    ],
    "Ski français": [
      {
        id: "ski1",
        text: "Quel est le skieur français le plus titré de l'histoire en Coupe du Monde, avec 34 victoires ?",
        answer: "Alexis Pinturault",
        difficulty: 2,
      },
      {
        id: "ski2",
        text: 'Dans quelle station des Alpes françaises se trouve la célèbre piste de descente "La Face de Bellevarde" ?',
        answer: "Val-d'Isère",
        difficulty: 4,
      },
      {
        id: "ski3",
        text: "En quelle année la station de Val-d'Isère a-t-elle accueilli les championnats du monde de ski alpin ?",
        answer: "2009",
        difficulty: 7,
      },
      {
        id: "ski4",
        text: "Quel skieur français a remporté le Globe de cristal en 1973, marquant l'histoire du ski alpin ?",
        answer: "Jean-Noël Augert",
        difficulty: 10,
      },
    ],
    "Formule 1": [
      {
        id: "f11",
        text: "Quel constructeur a remporté le plus de titres en Formule 1 ?",
        answer: "Ferrari",
        difficulty: 2,
      },
      {
        id: "f12",
        text: "Qui sont les 2 pilotes ex æquo avec le plus de titres de champion du monde de Formule 1 ?",
        answer: "Lewis Hamilton et Michael Schumacher",
        difficulty: 4,
      },
      {
        id: "f13",
        text: "Combien de virages comporte le circuit de Monaco ?",
        answer: "18 virages",
        difficulty: 7,
      },
      {
        id: "f14",
        text: "En quelle année Alain Prost a-t-il remporté son dernier championnat du monde de Formule 1 ?",
        answer: "1993",
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
        text: 'Quel duo masculin a interprété "Nuit de folie", un tube des années 80 ?',
        answer: "Début de soirée",
        difficulty: 2,
      },
      {
        id: "chan2",
        text: 'Quel artiste français a sorti l\'album "Déclic" en 1984?',
        answer: "Laurent Voulzy",
        difficulty: 4,
      },
      {
        id: "chan3",
        text: "Parmi cette liste, quel type de bonbon n'est pas cité dans la chanson Mistral Gagnant de Renaud : roudoudou, car-en-sac, carambar, pimousse ?",
        answer: "pimousse",
        difficulty: 7,
      },
      {
        id: "chan4",
        text: "Quel est le chanteur du groupe Les Rita Mitsouko qui ont notamment chanté C'est comme ça en 1986 ?",
        answer: "Fred Chichin",
        difficulty: 10,
      },
    ],
    "Acteurs et actrices": [
      {
        id: "act1",
        text: 'Quel acteur américain a joué Marty McFly dans la trilogie "Retour vers le futur" ?',
        answer: "Michael J. Fox",
        difficulty: 2,
      },
      {
        id: "act2",
        text: "Quel acteur a incarné le personnage du détective John McClane dans le film Piège de cristal (1988) ?",
        answer: "Bruce Willis",
        difficulty: 4,
      },
      {
        id: "act3",
        text: 'Quel acteur britannique a interprété le rôle d\'Eric Liddell dans "Les Chariots de feu" (1981) ?',
        answer: "Ian Charleson",
        difficulty: 7,
      },
      {
        id: "act4",
        text: 'Quelle actrice américaine a joué le rôle de "Glendolene" l\'institutrice dans le film Tom Horn de 1980 ?',
        answer: "Linda Evans",
        difficulty: 10,
      },
    ],
    Films: [
      {
        id: "film1",
        text: "Quel film français de 1986 met en scène des aventures comiques sur les pistes de ski ?",
        answer: "Les Bronzés font du ski",
        difficulty: 2,
      },
      {
        id: "film2",
        text: "Quel film de science-fiction culte sorti en 1982, réalisé par Ridley Scott, met en scène Harrison Ford dans un rôle de détective ?",
        answer: "Blade Runner",
        difficulty: 4,
      },
      {
        id: "film3",
        text: "Quel film d'horreur de 1989, réalisé par Tim Burton, raconte l'histoire de deux jeunes mariés récemment décédés deviennent des fantômes hantant leur ancienne maison ?",
        answer: "Beetlejuice",
        difficulty: 7,
      },
      {
        id: "film4",
        text: "Quel long-métrage japonais de 1988, sorti en 1996 en France et réalisé par Isao Takahata, raconte l'histoire tragique de deux enfants pendant la Seconde Guerre mondiale ?",
        answer: "Le tombeau des lucioles",
        difficulty: 10,
      },
    ],
    Musiques: [
      {
        id: "mus1",
        text: "Complétez ces paroles de « Yeux revolver » de Marc Lavoine par un seul mot : « Un peu spéciale elle est … »",
        answer: "Célibataire",
        difficulty: 2,
      },
      {
        id: "mus2",
        text: "A qui Daniel Balavoine dédie-t-il « l'Aziza » en 1985 ?",
        answer: "sa compagne",
        difficulty: 4,
      },
      {
        id: "mus3",
        text: "Quelle chanson culte de Queen est illustrée par un clip où les membres du groupe sont grimés en femme au foyer ?",
        answer: "I want to break free",
        difficulty: 7,
      },
      {
        id: "mus4",
        text: 'Quel groupe new-wave a sorti l\'album "Speak and Spell" en 1981, contenant le hit "Just Can\'t Get Enough" ?',
        answer: "Depeche Mode",
        difficulty: 10,
      },
    ],
    Chanteuses: [
      {
        id: "chant1",
        text: 'Qui chante "T\'as le look coco" ?',
        answer: "laroche valmont",
        difficulty: 2,
      },
      {
        id: "chant2",
        text: 'Qui chante cette musique :"Oh femme unique, péché, désir. Pour un serpent de bible. A brisé son empire. Bleu de l\'enfer, couleur amour."',
        answer: "Julie Piétri",
        difficulty: 4,
      },
      {
        id: "chant3",
        text: 'Qui a remporté l\'Eurovision pour la France en 1983 avec "Si la vie est cadeau" ?',
        answer: "Corinne Hermès",
        difficulty: 7,
      },
      {
        id: "chant4",
        text: 'Completez les paroles de cette musique de Jackie Quartz : "Juste une mise au point / Sur les plus belles images de ma vie…"',
        answer: '"Sur les clichés trop pâles d\'une love-story"',
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
  "Télé / Ciné": {
    "Séries télé": [
      {
        id: "sfr1",
        text: 'Quel est le nom et prénom du père de famille dans "La petite maison dans la prairie" ?',
        answer: "Charles Ingalls",
        difficulty: 2,
      },
      {
        id: "sfr2",
        text: 'Quel est le prénom d\'Eric Judor dans "H" ?',
        answer: "Aymé",
        difficulty: 4,
      },
      {
        id: "sfr3",
        text: 'Quel est le nom de la tueuse de vampires dans la série "Buffy contre les vampires" ?',
        answer: "Buffy Summers",
        difficulty: 7,
      },
      {
        id: "sfr4",
        text: "Comment se nomme ce chasseur de primes qui deviendra l'ami et l'allié du héros dans la série culte des années 90 : Le Rebelle ?",
        answer: "Bobby Sixxkiller",
        difficulty: 10,
      },
    ],
    "Émissions françaises de l'époque": [
      {
        id: "emf1",
        text: "Quel jeu télévisé animé par Guy Lux et Léon Zitrone opposait des équipes de villes françaises ?",
        answer: "Intervilles",
        difficulty: 2,
      },
      {
        id: "emf2",
        text: "L'émission A table, présentée par Maïté, reprenait le générique de quelle série des années 60 ?",
        answer: "Ma sorcière bien-aimée",
        difficulty: 4,
      },
      {
        id: "emf3",
        text: 'En 1977, dans "L\'École des fans" de Jacques Martin, comment se nommait le contrebassiste ?',
        answer: "Bob Quibel",
        difficulty: 7,
      },
      {
        id: "emf4",
        text: "Un seul de ces journalistes présent dans cette liste, n'animait pas d'émission sur la science. Lequel ? Mac Lesgy, Laurent Weil, Jerôme Bonaldi, Jamy Gourmaud",
        answer: "Laurent Weil",
        difficulty: 10,
      },
    ],
    "Film classique français": [
      {
        id: "fcf1",
        text: "Comment se nomme le père Noël dans le film Le Père Noël est une ordure ?",
        answer: "Felix",
        difficulty: 2,
      },
      {
        id: "fcf2",
        text: 'Dans "Les Tontons flingueurs" quel est le surnom de Louis ?',
        answer: "Le Mexicain",
        difficulty: 4,
      },
      {
        id: "fcf3",
        text: "Quel est le nom de l'association dans laquelle travaillent Pierre et Thérèse dans le film Le Père Noël est une ordure ?",
        answer: "SOS Détresse Amitié",
        difficulty: 7,
      },
      {
        id: "fcf4",
        text: "Avec combien d'allumettes, Pignon a-t-il fait la maquette de la tour Eiffel ? (Á 20 000 près)",
        answer: "346 422",
        difficulty: 10,
      },
    ],
    "Le film Les Bronzés font du ski": [
      {
        id: "bfs1",
        text: "Quelle station de ski a servi de lieu de tournage principal pour le film ?",
        answer: "Val-d'Isère",
        difficulty: 2,
      },
      {
        id: "bfs2",
        text: "Quel jeu de société est oublié par les anciens locataires de l'appartement de Bernard et Nathalie ?",
        answer: "Le Scrabble",
        difficulty: 4,
      },
      {
        id: "bfs3",
        text: 'Quel est le prénom du personnage incarné par Bruno Moynot dans le film "Les Bronzés fond du ski" ?',
        answer: "Gilbert",
        difficulty: 7,
      },
      {
        id: "bfs4",
        text: 'Quelle est la liqueur (avec un crapaud dans la bouteille) consommée dans le film "Les Bronzés font du ski" ?',
        answer: "Liqueur d'échalote",
        difficulty: 10,
      },
    ],
    "Le film Les Bronzés": [
      {
        id: "br1",
        text: "Dans quel pays le Club Med utilisé pour le film se trouve-t-il ?",
        answer: "En Côte d'Ivoire",
        difficulty: 2,
      },
      {
        id: "br2",
        text: "Sur la plage, comment Christiane surnomme-t-elle Jean-Claude Dusse, alors qu'il tente de la draguer ?",
        answer: "Le peignoir",
        difficulty: 4,
      },
      {
        id: "br3",
        text: "Pourquoi Jean-Claude Dusse passe-t-il la nuit dans son sac de couchage sur la plage ?",
        answer: "Son coloc ronfle trop fort",
        difficulty: 7,
      },
      {
        id: "br4",
        text: "Comment le chef du village s'appelle-t-il ?",
        answer: "Marcus",
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
  },
  "Histoire / Géo": {
    "L'Afrique": [
      {
        id: "afr1",
        text: "Quel est le plus grand pays d'Afrique en termes de superficie ?",
        answer: "L'Algérie",
        difficulty: 2,
      },
      {
        id: "afr2",
        text: "Quelle est la troisième plus grande ville d'Algérie après Alger et Oran ?",
        answer: "Constantine",
        difficulty: 4,
      },
      {
        id: "afr3",
        text: "Quel est nom de l'espèce de manchots présente dans le sud de l'Afrique ?",
        answer: "Manchot du Cap",
        difficulty: 7,
      },
      {
        id: "afr4",
        text: "En quelle année l'Afrique du Sud a-t-elle organisé ses premières élections multiraciales ?",
        answer: "1994",
        difficulty: 10,
      },
    ],
    "Les Rois de la Renaissance": [
      {
        id: "ren1",
        text: "Qui était le premier roi de France de la Renaissance ?",
        answer: "François Ier",
        difficulty: 2,
      },
      {
        id: "ren2",
        text: "Quel est le nom du château que François Ier a fait construire et qui est un exemple emblématique de l'architecture de la Renaissance",
        answer: "Le Château de Chambord",
        difficulty: 4,
      },
      {
        id: "ren3",
        text: 'Quel roi de France, avant son accession au trône, était surnommé "le Dauphin" et a été couronné en 1559 ?',
        answer: "Charles IX",
        difficulty: 7,
      },
      {
        id: "ren4",
        text: "Quel roi de France a institué le premier impôt royal sur les terres en 1445, une réforme qui a eu des conséquences profondes sur la fiscalité et le pouvoir royal ?",
        answer: "Charles VII",
        difficulty: 10,
      },
    ],
    "Les Rois Français au Moyen Âge": [
      {
        id: "ma1",
        text: "Qui était le dernier roi de la dynastie des Mérovingiens ?",
        answer: "Clovis II",
        difficulty: 2,
      },
      {
        id: "ma2",
        text: 'Quel roi de France a été surnommé "le Lion de France" ?',
        answer: "Philippe Auguste",
        difficulty: 4,
      },
      {
        id: "ma3",
        text: "Quel roi français a participé à la bataille de Bouvines en 1214 ?",
        answer: "Philippe Auguste",
        difficulty: 7,
      },
      {
        id: "ma4",
        text: "Quelle décision majeure a été prise par le roi Louis IX en 1254 ?",
        answer:
          "Il a signé la paix avec l'Angleterre, mettant fin à la guerre de Saintonge",
        difficulty: 10,
      },
    ],
    "Les Guerres Napoléoniennes": [
      {
        id: "nap1",
        text: "En quelle année Napoléon a-t-il été exilé sur l'île d'Elbe après sa première abdication ?",
        answer: "1814",
        difficulty: 2,
      },
      {
        id: "nap2",
        text: "Napoléon a épousé une autre femme après le divorce avec Joséphine. Quel était le nom de sa seconde épouse ?",
        answer: "Marie-Louise d'Autriche",
        difficulty: 4,
      },
      {
        id: "nap3",
        text: "À quel âge Napoléon Bonaparte a-t-il commencé son service militaire, et dans quel régiment ?",
        answer: "À 16 ans, dans le régiment d'artillerie",
        difficulty: 7,
      },
      {
        id: "nap4",
        text: "Qui était le général napoléonien qui a commandé la campagne d'Égypte avant de se retourner contre Napoléon et de rejoindre les royalistes ?",
        answer: "Jean-Baptiste Kléber",
        difficulty: 10,
      },
    ],
    "L'Asie": [
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
  },
};
