// Ceci n'est qu'un exemple,
// vous pouvez donc supprimer en toute sécurité toutes les propriétés par défaut ci-dessous

export default {
  failed: 'Action échouée',
  success: 'Action réussie',
  welcome: 'Bienvenue dans l\'application Palmas',
  notFound: {
    header: 'Désolé, cette page n\'existe pas.',
    btn: 'Retourner aux motifs'
  },
  help: 'Aide',
  tuning: 'Diapason',
  shortcuts: 'Raccourcis',
  privacy: 'Politique de confidentialité',
  source: 'Code source',
  issues: 'Problèmes',
  doc: {
    welcome: {
      title: 'Bienvenue dans l\'application Palmas',
      content: `
Cette application est conçue pour vous aider à apprendre et à pratiquer votre instrument de musique.
C'est un travail en cours, alors soyez patient avec nous pendant que nous continuons à l'améliorer.
Si vous avez des questions ou des suggestions, veuillez nous contacter.`
    },
    getStarted: {
      title: 'Commencer',
      content: `
- Sélectionnez un **motif** dans la liste. Un motif (aussi appelé "palo" dans le flamenco) est un style rythmique.
- Ajustez le **tempo** (vitesse) du motif.
- Sélectionnez des **instruments** dans la table de mixage.
- **Démarrez** le métronome.`
    },
    options: {
      title: 'Liste des options',
      content: {
        theme: {
          title: 'Thème',
          content: `
Vous pouvez choisir entre les thèmes clair et sombre.
Le thème sombre est plus adapté aux environnements faiblement éclairés, tandis que le thème clair est plus adapté aux environnements lumineux.`,
        },
        lang: {
          title: 'Langue',
          content: `
Choisissez la langue d'interface de l'application.
Le changement s'applique immédiatement à tous les textes.
Votre sélection est stockée localement (navigateur / appareil) et sera conservée lors de la prochaine ouverture de l'application.`,
        },
        tempo: {
          title: 'Tempo',
          content: `
Il y a 2 façons de définir le tempo : le cercle de bouton rotatif, et vous pouvez décrémenter/incrémenter les bpm avec les boutons + et -.
Vous pouvez aussi taper le tempo directement dans le champ de saisie, utiliser la molette de la souris, ou les touches fléchées haut et bas.
Le tempo est la vitesse du métronome, mesurée en battements par minute.`,
        },
        mixer: {
          title: 'Table de mixage des instruments',
          content: `
Sélectionnez les instruments qui jouent (assurez-vous d'en avoir au moins un actif),
réglez le volume relatif de chacun, choisissez s'il joue aussi les croches en plus des temps,
et désignez celui qui est dessiné dans la visualisation.`,
        },
        muted: {
          title: 'Temps silencieux',
          content: 'Touchez un temps du compás pour le faire taire, touchez-le à nouveau pour le rétablir. Rien ne sonne sur un temps silencieux, tandis que le compás continue de montrer où il tombe. Les silences sont conservés par motif.',
        },
        improvise: {
          title: 'Improviser',
          content: `
Si c'est activé, alors parfois le métronome cessera de suivre le motif préprogrammé et jouera des battements aléatoires pour un ou plusieurs instrument(s).
Cela produit de la "surprise" dans le motif.`,
        },
        humanize: {
          title: 'Humaniser',
          content: 'Si c\'est activé, alors le métronome jouera les battements avec une petite déviation aléatoire, simulant le toucher humain.',
        },
        swing: {
          title: 'Swing',
          content: 'Si sa valeur est 0, la croche est exactement la moitié d\'une noire. Quand elle approche de 1, un décalage est appliqué, pour une sensation rythmique \'jazz\'.',
        },
        reverb: {
          title: 'Réverbération',
          content: 'Ajustez la réverbération du son. Elle simule l\'effet d\'une pièce ou d\'une salle.',
        },
        startBeat: {
          title: 'Battement de départ',
          content: `
Changez le battement de départ (sur quel battement sélectionné le motif commence).
C'est utile si vous voulez commencer le motif sur un battement différent.
Par exemple, si vous voulez commencer sur le 2e battement du motif, définissez le battement de départ à 2.
Le battement de départ est aussi utile si vous voulez pratiquer une partie particulière du motif.
Les notes entre le battement de départ et le début du motif seront jouées comme un son de clic.`,
        },
        viewMode: {
          title: 'Mode d\'affichage',
          content: 'Choisissez entre les visualisations points, compteur et horloge.',
        },
        reset: {
          title: 'Réinitialiser',
          content: 'Réinitialisez les paramètres du métronome aux valeurs par défaut. Vous pouvez réinitialiser tous les paramètres ou réinitialiser les paramètres pour le motif actuel.',
        }
      }
    },
    appSettings: {
      title: 'Paramètres de l\'application',
      content: {
        theme: {
          title: 'Mode de thème',
          content: `
**Options de thème clair et sombre**

Palmas propose des thèmes clair et sombre pour offrir la meilleure expérience visuelle :

- **Thème clair** : Interface claire et lumineuse idéale pour les environnements bien éclairés. Présente des arrière-plans blancs avec du texte sombre pour une lisibilité maximale en plein jour.
- **Thème sombre** : Facile pour les yeux avec des arrière-plans sombres et du texte clair. Parfait pour les conditions de faible éclairage, réduit la fatigue oculaire pendant les longues sessions de pratique et économise la batterie sur les écrans OLED.

**Comment changer :**
- Utilisez le bouton de basculement de thème dans le menu de navigation de gauche
- Les changements s'appliquent immédiatement à toute l'application
- Votre préférence est automatiquement sauvegardée et restaurée au redémarrage de l'app

**Détection automatique :**
L'application respecte par défaut la préférence de thème système de votre appareil, mais vous pouvez remplacer ce paramètre à tout moment.`
        },
        language: {
          title: 'Sélection de langue',
          content: `
**Support multi-langues**

Palmas est disponible en 9 langues pour servir la communauté flamenco mondiale :

- **Anglais** (en-US) - Langue par défaut
- **Espagnol** (Español) - Terminologie flamenco native
- **Français** (Français) - Traduction complète
- **Allemand** (Deutsch) - Localisation complète
- **Italien** (Italiano) - Traduction complète de l'interface
- **Japonais** (日本語)
- **Chinois** (简体中文) - Simplifié
- **Arabe** (العربية) - De droite à gauche
- **Persan** (فارسی) - De droite à gauche

**Fonctionnalités :**
- Tous les menus, boutons et textes d'aide sont traduits
- Les noms de palos flamenco restent en espagnol pour l'authenticité
- Les changements de langue s'appliquent instantanément sans redémarrage de l'app
- Les paramètres sont sauvegardés localement sur votre appareil

**Comment changer de langue :**
Utilisez le sélecteur de langue dans le menu de navigation de gauche pour passer entre les langues disponibles.`
        },
        visualization: {
          title: 'Modes de visualisation',
          content: `
**Trois options d'affichage pour la visualisation des battements**

Choisissez la visualisation qui convient le mieux à votre style de pratique :

**1. Mode Points**
- Affichage épuré et minimaliste avec des points animés
- Chaque point représente un battement dans le motif
- Les battements actifs sont mis en évidence avec couleur et animation
- Parfait pour les apprenants visuels qui préfèrent des affichages simples et épurés
- Excellent pour se concentrer sur la structure du motif

**2. Mode Compteur**
- Compteur numérique affichant la position actuelle
- Affiche le numéro du battement actuel et le total de battements dans le motif
- Progression numérique claire à travers le compás
- Idéal pour les musiciens qui pensent en chiffres
- Utile pour apprendre les structures de motifs complexes et le timing

**3. Mode Horloge**
- Visualisation circulaire type cadran d'horloge
- Battements disposés autour d'une horloge avec aiguille animée
- Fournit une sensation intuitive du rythme cyclique
- Excellent pour comprendre la nature circulaire du compás flamenco
- Représentation visuelle correspondant aux méthodes de comptage flamenco traditionnelles

**Comment changer :**
Accédez aux options de visualisation via le menu des paramètres. Les changements s'appliquent immédiatement et votre préférence est sauvegardée automatiquement.

**Conseils :**
- Essayez différents modes pendant la pratique pour trouver ce qui vous convient le mieux
- Le mode horloge est particulièrement efficace pour les motifs à 12 temps comme la Soleá
- Le mode compteur aide lors de l'apprentissage des rythmes complexes
- Le mode points minimise les distractions pour les praticiens avancés`
        },
        // Machine-translated and not yet reviewed by a speaker. The flamenco
        // vocabulary is deliberately left in Spanish.
        reading: {
          title: 'Lire l\'affichage',
          content: `
**Deux choses à la fois**

Chaque visualisation montre deux choses superposées, et ce ne sont pas les
mêmes :

- Le **compás** — la pulsation du palo lui-même. C'est le motif abstrait : où
  tombent les accents dans le cycle, quel que soit celui qui joue.
- Les **palmas** — ce que frappe réellement l'instrument que vous regardez. Un
  interprète ne se contente pas de marquer les accents ; chaque instrument joue
  sa propre figure face à eux.

Les abandolaos en sont l'exemple le plus clair. Leur pulsation tombe sur 6, 2 et
4, tandis que les palmas claras frappent sur 1 et 3. Un affichage ne montrant
que le compás contredirait ce que vous entendez.

**La couleur signifie accentué**

- Un point **rouge** est un temps accentué du compás. Les points gris sont les
  temps non accentués, et ils rétrécissent à mesure qu'ils comptent moins : un
  temps compté, puis une pulsation non comptée, puis une subdivision à
  contretemps.
- Un anneau **bleu** est une frappe accentuée de l'instrument dessiné. Les
  anneaux plus fins, dans la couleur de premier plan, sont ses frappes plus
  douces. L'absence d'anneau signifie que cet instrument se tait sur ce temps.

L'anneau est légèrement détaché du point afin de se lire comme un anneau plutôt
que comme un point plus gros. L'épaisseur porte la même information que la
couleur, de sorte que rien ne dépend de la distinction entre rouge et bleu.

Le compteur et l'horloge disent la même chose à leur manière : une barre sous le
chiffre et un repère à l'extérieur du cadran, plus épais ou plus long pour une
frappe plus forte, et coloré lorsqu'il s'agit de la frappe accentuée.

**Croches**

Un instrument peut aussi jouer sur les contretemps, pas seulement sur les temps.
La colonne **8e** de la table de mixage l'active instrument par instrument.

Lorsqu'elle est active, les positions à contretemps apparaissent entre les temps
comptés, dessinées plus petites. Lorsqu'elle ne l'est pas, elles sont toujours
là mais invisibles, si bien que l'espacement des temps ne bouge jamais.

**Choisir l'instrument dessiné**

Un seul instrument peut être dessiné à la fois : deux figures superposées
seraient illisibles. La colonne **Affiché** de la table de mixage choisit lequel.

Ce n'est jamais un instrument que vous ne pouvez pas entendre : votre choix tient
tant que cet instrument reste actif, sinon c'est le premier instrument actif qui
est dessiné. Comme la table de mixage refuse de tous les désactiver, il y en a
toujours exactement un.`
        },
        muting: {
          title: 'Rendre des temps silencieux',
          content: `
Touchez un temps pour le rendre silencieux. Touchez-le à nouveau pour le
rétablir.

Un temps silencieux est barré et rien n'y sonne : ni les palmas, ni le cajón, ni
les jaleos. Le compás continue de montrer où tombe le temps, et c'est tout
l'intérêt : vous comptez à travers le vide. Faites taire le temps 10 et voyez si
vous arrivez encore sur le 12.

Rendez-en silencieux autant que vous voulez, jusqu'à tous.

Tant que quelque chose est silencieux, un compteur apparaît sous le motif, et son
✕ rétablit tous les temps d'un coup — la sortie quand vous en avez fait taire
plus que vous ne vous en souvenez. Les silences sont conservés par motif et sont
encore là à la prochaine ouverture de l'application. Les options de rythme affichent le même nombre et les rétablissent également.

Seuls les temps visibles peuvent être rendus silencieux. Lorsque l'instrument
dessiné ne joue pas les croches, les contretemps sont masqués et ne réagissent
pas.`
        },
        sync: {
          title: 'Décalage audio/visuel',
          content: `
**Quand le son et l'animation ne coïncident pas**

Le temps que vous voyez et celui que vous entendez devraient arriver ensemble. Si
le clic survient *après* l'allumage du point, ce réglage corrige cela : il retient
l'animation jusqu'à ce que le son la rattrape.

Il se mesure en millisecondes, et le curseur affiche aussi le décalage en
fraction de temps au tempo courant : 120 ms fixes comptent bien davantage à
200 bpm qu'à 60.

**Pourquoi cela arrive**

Toute chaîne audio ajoute du retard : la mise en mémoire tampon du navigateur, le
système d'exploitation, puis ce par quoi le son transite. L'application demande
déjà au navigateur quelle latence il ajoute et la compense automatiquement. Ce
qu'elle ne peut pas voir, c'est le reste.

**Le Bluetooth est le coupable habituel.** Les casques et enceintes sans fil
ajoutent entre 100 et 300 millisecondes environ que rien ne signale, si bien que
l'application n'a aucun moyen de le savoir. Une sortie filaire ne demande presque
jamais d'ajustement.

**Comment le régler**

Lancez le métronome, repérez un temps facile à identifier — un temps accentué —
et montez le curseur jusqu'à ce que le son et l'animation coïncident. Fiez-vous à
votre oreille plutôt qu'au chiffre : la bonne valeur est celle où ils coïncident,
et elle différera entre votre casque et vos enceintes.

Le réglage est enregistré sur cet appareil et se conserve d'une session à
l'autre. Si vous passez du filaire au sans-fil, attendez-vous à devoir le
changer.`
        }
      }
    },
    mute: {
      hint: 'Touchez un temps pour le faire taire',
      none: 'Aucun',
      beat: 'Silencer le temps',
      count: '{count} temps en silence',
      clear: 'Tout rétablir'
    },
    visualizationModes: {
      dots: 'Points',
      counter: 'Compteur',
      clock: 'Horloge'
    },
    utils: {
      wikipediaUrl: 'Article Wikipédia :',
      videoExample: 'Exemple vidéo :',
      openLink: 'Ouvrir le lien',
      source: 'Source : Wikipédia',
      beats: '{count} temps',
      disabled: 'Cette option est désactivée pour ce motif.'
    },
    searchPattern: {
      title: 'Rechercher un motif',
      content: `
Beaucoup de **palos** flamencos sont en fait dérivés d'autres structures rythmiques.
Par exemple, "farruca" est dérivé de "tientos", "columbiana" ou "garrotín" sont des types de "tangos".
Ici vous pouvez saisir le nom de n'importe quel "palo" que vous avez entendu et Palmas recherchera les motifs dont il dérive.
- Recherchez un motif en tapant son nom ou une partie de celui-ci.
- La recherche ne distingue pas les majuscules des minuscules.
- La recherche est effectuée sur le nom du motif et sur les motifs liés.
- La recherche est effectuée sur toute la chaîne, pas sur les mots.`
    },
    shortcuts: {
      title: 'Les raccourcis suivants sont disponibles pour l\'utilisation avec le clavier :',
      space: 'Jouer/Arrêter le métronome',
      up: 'Incrémenter le tempo (maintenir la touche enfoncée pour incrémenter plus rapidement)',
      down: 'Décrémenter le tempo (maintenir la touche enfoncée pour décrémenter plus rapidement)',
      left: 'Motif précédent',
      right: 'Motif suivant',
      esc: 'Fermer la fenêtre modale',
      tab: 'Changer le bouton de focus'
    },
    reset: {
      title: 'Restaurer les paramètres par défaut',
      warning: 'Attention ! Cela supprimera vos paramètres de métronome.',
      close: 'Fermer',
      proceed: 'Continuer',
      success: 'Succès ! Vos paramètres de métronome ont été réinitialisés.',
      options: {
        pattern: 'Uniquement le motif actuel',
        all: 'Tous les motifs'
      },
    },
    context: {
      title: 'Sélectionner un contexte',
    },
    reverb: {
      title: 'Déclin de réverbération',
      content: 'Définir un déclin pour la réverbération des sons'
    },
    swing: {
      title: 'Swing',
      content: 'Définir une valeur de swing pour le métronome',
      caption: 'Si sa valeur est 0, la croche est exactement la moitié d\'une noire. Quand elle approche de 1, un décalage est appliqué, pour une saveur rythmique \'jazz\'.'
    },
    startBeat: {
      title: 'Battement de départ',
      content: 'Définir le battement où le métronome commencera à jouer'
    },
    mixer: {
      title: 'Table de mixage des instruments',
      content: 'Sélectionnez les instruments que vous voulez jouer',
      active: {
        title: 'Actif',
        content: 'Jouer cet instrument'
      },
      shown: {
        title: 'Affiché',
        content: 'Représenter cet instrument dans la visualisation'
      },
      eighth: {
        title: '8e',
        content: 'Basculer les croches'
      },
      volume: {
        title: 'Volume (db)',
        content: 'Augmenter ou diminuer le volume de l\'instrument'
      }
    },
    pattern: {
      title: 'Sélectionner un motif',
      search: 'Rechercher un motif',
      searchSm: 'Rechercher',
    },
    prestart: {
      title: 'Pré-démarrage depuis le battement',
      content: 'Définir optionnellement un battement à partir duquel un clic de pré-comptage commencera avant que la boucle réelle ne commence.'
    },
    privacy: {
      title: 'Politique de confidentialité',
      content: `
Nous ne collectons aucune donnée personnelle.

Lorsque vous ouvrez l'aide d'un palo, l'application demande à Wikipédia le résumé de cet article afin de l'afficher dans votre langue. Wikipédia voit votre adresse IP et l'article demandé. Rien d'autre ne quitte votre appareil.`
    },
    tempo: {
      title: 'Tempo',
      content: 'Définir le tempo du métronome',
      bpm: 'BPM'
    },
    update: {
      title: 'Initialisation de l\'application',
      content: `
Les paramètres de l'application doivent être (ré)initialisés.

Si vous utilisiez une version précédente de cette application, vous perdrez tous vos paramètres et motifs.
Mais c'est le seul moyen d'obtenir les nouvelles fonctionnalités. Si c'est votre première utilisation, cela ne changera rien alors allez-y.`,
      button: 'Recharger l\'application'
    },
    tuning: {
      title: 'Diapason',
      content: 'Jouer un son de diapason',
      caption: 'tout',
      play: 'Jouer',
      stop: 'Arrêter'
    },
    changelog: {
      title: 'Journal des modifications',
      description: 'Derniers changements et mises à jour de Palmas',
        releases: {
          v1_0_0: [
            '**Palmas est une nouvelle application**, dérivée de [A Compás](https://gitlab.com/acompas/acompas) 4.2.4 d\'Olivier Ricordeau et Jérémie Sieffert, sous la même licence AGPL-3.0. Elle porte son propre nom, ses propres identifiants d\'application et sa propre numérotation de versions, car les changements faits ici ne sont pas de leur ressort. Signalez tout ce qui concerne Palmas [sur son propre dépôt](https://github.com/dwsdolce/palmas/issues).',
            '**Rendez des temps silencieux.** Touchez un temps pour le faire taire, touchez-le à nouveau pour le rétablir. Rien ne sonne sur un temps silencieux — ni les palmas, ni le cajón, ni les jaleos — tandis que le compás continue de montrer où il tombe, de sorte que vous comptez à travers le vide. Faites-en taire autant que vous voulez ; ils sont conservés par motif. Demandé par un maître de flamenco en Espagne, qui voulait entendre si l\'élève arrivait toujours sur le 12.',
            'Nouvelle identité : un **P** calligraphique dans un anneau de douze points — le compás que l\'application dessine — et un logotype composé en Playball, la police qu\'A Compás elle-même utilisait pour ses versions 2.x.',
            '**La visualisation indique désormais quelles frappes sont accentuées.** La couleur signifie accent dans les deux couches : un disque rouge pour un temps accentué du compás, un anneau bleu pour une frappe accentuée de l\'instrument dessiné. La force d\'une frappe se traduisait auparavant par une épaisseur de trait de un, deux ou trois pixels, que personne ne pouvait voir.',
            'Les cinq contextes rythmiques partagent maintenant une seule couleur. Repeindre toute l\'application selon le contexte dépensait le seul canal de couleur libre pour un mode que l\'interface nomme déjà deux fois.',
            'Nouvelle aide sur ce que montre l\'affichage, la colonne des croches, le choix de l\'instrument dessiné et le réglage du décalage audio/visuel — traduite dans les neuf langues.',
            '**Les descriptions des palos sont traduites.** C\'était un extrait de Wikipédia dans quatre langues et de l\'anglais dans les cinq autres — et de l\'anglais pour quiconque hors ligne, dès que la requête échouait. C\'est désormais le texte propre à l\'application dans les neuf langues, Wikipédia n\'étant plus le corps du texte mais un lien.',
            '**Politique de sécurité du contenu (CSP)** sur toutes les compilations de production, ce qui a révélé deux vrais défauts : vue-i18n compilait les traductions avec `Function()`, et Tone.js charge son audio worklet depuis une URL blob.',
            '**Toute l\'analytique a été retirée.** Pas de comptes, pas de suivi, pas de cookies. La seule requête que l\'application adresse à un tiers est une recherche Wikipédia à l\'ouverture de l\'aide d\'un palo, et la politique de confidentialité le dit désormais.',
            'La version web fonctionne depuis n\'importe quel sous-dossier : elle peut donc être hébergée n\'importe où, et pas seulement à la racine d\'un domaine.',
            'Les neuf langues sont à nouveau accessibles : l\'arabe, le persan, le japonais et le chinois étaient présents mais n\'étaient jamais proposés. Les langues se chargent à la demande, ce qui a fait passer le bundle principal de 230 Ko à 190 Ko compressés.',
            '**Python n\'est plus nécessaire pour compiler.** La chaîne audio, l\'installation et l\'empaquetage de bureau sont des scripts Node qui fonctionnent aussi bien sur macOS, Windows et Linux ; l\'étape des ressources iOS n\'exige plus de Mac non plus.',
            'L\'installation tient en deux petits scripts — `setup.ps1` et `setup.sh` — qui vérifient la présence de Node, l\'installent s\'il manque, et passent la main à un script Node commun qui fait le reste, en demandant avant de modifier quoi que ce soit.',
            'Documentation réécrite autour des cibles de compilation plutôt que des systèmes d\'exploitation hôtes, et vérifiée pas à pas sur une machine sans aucun outil installé.'
          ]
        }
    }
  },
  patterns: {
    alegria: {
      doc: '<p>Un compás compte 12 temps, avec des accents sur les temps 12, 3, 6, 8 et 10.</p><p>On peut l\'entendre comme « la première moitié du compás est ternaire » et « la seconde moitié est binaire ».</p><p>Ce rythme est le même pour l\'alegría et pour la soleá por bulería (qui est une accélération de la soleá traditionnelle).</p><p>La différence entre les deux styles est que l\'un se joue en tons majeurs (alegría signifie « joie » en espagnol) et l\'autre en mineurs (tonalité flamenca Am G F E).</p><p>Il convient aussi à bien d\'autres styles des mêmes « familles », comme les cantiñas, caracoles ou mirabrás (proches de l\'alegría), ou la caña, le polo et la bambera (plus proches de la soleá por bulería), et même à la guajira.</p>',
      places: 'Cádiz'
    },
    abandolaos: {
      doc: '<p>Une sorte de motif à 3/4. Il est utilisé pour un large éventail de palos : verdiales, fandangos abandolaos, jaleos extremeños et même certains motifs de bulería.</p>',
      places: 'Málaga, Huelva, Extremadura'
    },
    'buleria-6': {
      doc: '<p>Un compás est fait de 2 groupes de 3 noires ternaires : ce palo est donc purement ternaire.</p><p>On peut le voir comme la première moitié d\'une bulería à 12 temps.</p>',
      places: 'Jerez de la Frontera'
    },
    'buleria-12': {
      doc: '<p>Un compás compte 12 temps, avec des accents sur les temps 12, 3, 6, 8 et 10.</p><p>On peut l\'entendre comme « la première moitié du compás est ternaire (3 temps + 3 temps = 6 temps) » et « la seconde moitié est binaire (2 temps + 2 temps + 2 temps = 6 temps) ».</p>',
      places: 'Jerez de la Frontera et autres'
    },
    'buleria-12-variation': {
      doc: '<p>Dans cette variante répandue du compás de bulería à 12 temps, l\'accent tombe sur le temps 7 au lieu du temps 6.</p>',
      places: 'Jerez de la Frontera et autres'
    },
    fandangos: {
      doc: '<p>Ce palo à 12 temps porte des accents sur les temps 12, 3, 6, 9 et 10.</p>',
      places: 'Huelva, Málaga et autres'
    },
    rumba: {
      doc: '<p>La rumba est un palo à 4/4 ; elle se compte 1, 2, 3, 4.</p><p>Il y a un accent sur le premier temps. Remarque : notre motif d\'exemple compte 2 mesures.</p>',
      places: 'Barcelona et autres'
    },
    sevillana: {
      doc: '<p>La sevillana est un palo purement ternaire, avec un accent sur le temps 1. C\'est exactement comme une valse.</p><p>Remarque : notre motif d\'exemple compte 2 mesures.</p>',
      places: 'Sevilla'
    },
    siguiriya: {
      doc: '<p>La siguiriya est un palo à 12 temps, avec des accents sur les temps 12, 2, 4, 7 et 10.</p>',
      places: 'Sevilla, Cádiz et autres'
    },
    solea: {
      doc: '<p>La soleá est un palo triste à 12 temps, avec des accents sur les temps 3, 6, 8, 10 et 12.</p>',
      places: 'Sevilla, Cádiz et autres'
    },
    tanguillos: {
      doc: '<p>Les tanguillos sont une sorte de rythme hybride entre 3/4, 6/8 et 4/4 ; ils se comptent 1, 2, 3.</p><p>Il y a un accent sur le premier temps et parfois… sur le deux et demi.</p><p>Remarque : notre motif d\'exemple compte 2 mesures.</p>',
      places: 'Cádiz et autres'
    },
    tangos: {
      doc: '<p>Les tangos sont un palo à 4/4 ; ils se comptent 1, 2, 3, 4. Il y a un accent sur le premier temps.</p><p>Remarque : notre motif d\'exemple compte 2 mesures.</p>',
      places: 'Granada, Málaga, Extremadura'
    },
    tientos: {
      doc: '<p>Les tientos sont un palo à 4/4 ; ils se comptent 1, 2, 3, 4. Il y a un accent sur le premier temps.</p><p>Ils se terminent souvent « por tangos ».</p><p>Remarque : notre motif d\'exemple compte 2 mesures.</p>',
      places: 'Cádiz et d\'autres lieux d\'Andalousie'
    }
  },
  buttons: {
    context : 'Sélectionner le contexte',
    pattern: 'Motif',
    restore: 'Restaurer les paramètres',
    options: 'Options de rythme',
    settings: 'Paramètres de l\'application'
  },
  notify: {
    loading: 'Chargement…',
    audioInit: 'Initialisation de l\'audio…',
    loadSamplesFailed: 'Échec du chargement des échantillons audio !',
    startSequencesFailed: 'Échec du démarrage des séquences audio. Veuillez réessayer.',
    fetchDataError: 'Erreur lors de la récupération des données',
    oneInstrumentRequired: 'Au moins un instrument doit être sélectionné !',
    tempo: {
      verySlow: 'Votre tempo est très lent',
      veryFast: 'Votre tempo est très rapide',
      rhythmVerySlow: 'Votre rythme est très lent',
      porTientos: 'Votre tempo est por tientos',
      verySlowTientos: 'Votre tempo est très lent, même pour des tientos',
      tangosRumbas: 'Votre tempo est plutôt celui de tangos ou rumbas',
      porBuleria: 'Votre tempo est por bulería',
      porRumba: 'Votre tempo est por rumba',
      soleaBuleriaAlegria: 'Votre tempo est solea por bulería ou alegría'
    },
    browserUnsupported: {
      title: 'Mettez votre navigateur à jour !',
      message: 'Votre navigateur ne prend pas en charge une ou plusieurs technologies utilisées par cette application. Revenez avec un autre navigateur ou une autre version de celui-ci.'
    }
  },
  sync: {
    title: 'Décalage audio/visuel',
    caption: 'Décale l\'animation pour qu\'elle coïncide avec le son. Augmentez la valeur si le clic est entendu après l\'animation — typiquement avec un casque Bluetooth.'
  },
  contexts: {
    flamenco: 'Flamenco',
    afroCuban: 'Afro-cubain',
    afroBrazilian: 'Afro-brésilien',
    fundamentalGlobal: 'Global fondamental',
    ternaryAfrican: 'Africain ternaire'
  },
  aria: {
    menu: 'Menu',
    home: 'Palmas - retour au métronome',
    lightMode: 'Passer en mode clair',
    darkMode: 'Passer en mode sombre'
  }
}
