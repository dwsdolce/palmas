// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Aktion fehlgeschlagen',
  success: 'Aktion war erfolgreich',
  welcome: 'Willkommen bei der Palmas App',
  notFound: {
    header: 'Entschuldigung, diese Seite existiert nicht.',
    btn: 'Zurück zu den Rhythmen'
  },
  help: 'Hilfe',
  tuning: 'Stimmgabel',
  shortcuts: 'Tastenkürzel',
  privacy: 'Datenschutzerklärung',
  source: 'Quellcode',
  issues: 'Probleme',
  doc: {
    welcome: {
      title: 'Willkommen bei der Palmas App',
      content: `
Diese App ist dafür entwickelt, Ihnen beim Erlernen und Üben Ihres Musikinstruments zu helfen.
Sie befindet sich noch in der Entwicklung, also haben Sie bitte Geduld, während wir sie weiter verbessern.
Falls Sie Fragen oder Vorschläge haben, kontaktieren Sie uns bitte.`
    },
    getStarted: {
      title: 'Erste Schritte',
      content: `
- Wählen Sie einen **Rhythmus** aus der Liste. Ein Rhythmus (auch "Palo" im Flamenco genannt) ist ein rhythmischer Stil.
- Passen Sie das **Tempo** (Geschwindigkeit) des Rhythmus an.
- Wählen Sie **Instrumente** im Mischpult aus.
- **Starten** Sie das Metronom.`
    },
    options: {
      title: 'Liste der Optionen',
      content: {
        theme: {
          title: 'Design',
          content: `
Sie können zwischen hellem und dunklem Design wählen.
Das dunkle Design ist besser für schwach beleuchtete Umgebungen geeignet, während das helle Design besser für helle Umgebungen geeignet ist.`,
        },
        lang: {
          title: 'Sprache',
          content: `
Wählen Sie die Benutzeroberflächen-Sprache der Anwendung.
Die Änderung wird sofort auf alle Texte angewendet.
Ihre Auswahl wird lokal gespeichert (im Browser / Gerät), sodass sie beim nächsten Öffnen der App beibehalten wird.`,
        },
        tempo: {
          title: 'Tempo',
          content: `
Es gibt 2 Möglichkeiten, das Tempo zu definieren: den Drehregler und Sie können die BPM mit den + und - Tasten verringern/erhöhen.
Sie können das Tempo auch direkt in das Eingabefeld eingeben, das Mausrad verwenden oder die Pfeiltasten nach oben und unten.
Das Tempo ist die Geschwindigkeit des Metronoms, gemessen in Schlägen pro Minute.`,
        },
        mixer: {
          title: 'Instrumenten-Mischpult',
          content: `
Wählen Sie die spielenden Instrumente aus (mindestens eines muss aktiv sein),
stellen Sie die relative Lautstärke jedes Instruments ein, legen Sie fest, ob es zusätzlich
zu den Schlägen auch Achtelnoten spielt, und bestimmen Sie, welches in der Visualisierung
dargestellt wird.`,
        },
        muted: {
          title: 'Stummgeschaltete Schläge',
          content: 'Tippen Sie auf einen Schlag des Compás, um ihn stummzuschalten, und erneut, um ihn zurückzuholen. Auf einem stummen Schlag klingt nichts, während der Compás weiterhin zeigt, wo er liegt. Stummschaltungen werden pro Muster gespeichert.',
        },
        improvise: {
          title: 'Improvisieren',
          content: `
Wenn es aktiviert ist, wird das Metronom manchmal aufhören, sich an das vorprogrammierte Muster zu halten und zufällige Schläge für ein oder mehrere Instrument(e) spielen.
Dies erzeugt eine "Überraschung" im Rhythmus.`,
        },
        humanize: {
          title: 'Humanisieren',
          content: 'Wenn es aktiviert ist, spielt das Metronom die Schläge mit einer kleinen zufälligen Abweichung und simuliert so die menschliche Note.',
        },
        swing: {
          title: 'Swing',
          content: 'Wenn der Wert 0 ist, ist die Achtelnote genau die Hälfte einer Viertelnote. Wenn er sich 1 nähert, wird eine Verzögerung angewendet, für ein "Jazz-ähnliches" Rhythmusgefühl.',
        },
        reverb: {
          title: 'Hall',
          content: 'Passen Sie den Hall des Klangs an. Es simuliert einen Raum- oder Halleneffekt.',
        },
        startBeat: {
          title: 'Startschlag',
          content: `
Ändern Sie den Startschlag (bei welchem Schlag das ausgewählte Muster beginnt).
Dies ist nützlich, wenn Sie das Muster bei einem anderen Schlag starten möchten.
Zum Beispiel, wenn Sie beim 2. Schlag des Musters beginnen möchten, setzen Sie den Startschlag auf 2.
Der Startschlag ist auch nützlich, wenn Sie einen bestimmten Teil des Musters üben möchten.
Die Noten zwischen dem Startschlag und dem Beginn des Musters werden als Klick-Sound gespielt.`,
        },
        viewMode: {
          title: 'Ansichtsmodus',
          content: 'Wählen Sie zwischen Punkten, Zähler und Uhr-Visualisierungen.',
        },
        reset: {
          title: 'Zurücksetzen',
          content: 'Setzen Sie die Einstellungen des Metronoms auf die Standardwerte zurück. Sie können alle Einstellungen zurücksetzen oder die Einstellungen für das aktuelle Muster zurücksetzen.',
        }
      }
    },
    appSettings: {
      title: 'Anwendungseinstellungen',
      content: {
        theme: {
          title: 'Thema-Modus',
          content: `
**Helle und dunkle Thema-Optionen**

Palmas bietet sowohl helle als auch dunkle Themen für die beste visuelle Erfahrung:

- **Helles Thema**: Saubere, helle Oberfläche ideal für gut beleuchtete Umgebungen. Bietet weiße Hintergründe mit dunklem Text für maximale Lesbarkeit bei Tageslicht.
- **Dunkles Thema**: Augenfreundlich mit dunklen Hintergründen und hellem Text. Perfekt für schwache Lichtverhältnisse, reduziert Augenbelastung bei langen Übungseinheiten und spart Batterie bei OLED-Bildschirmen.

**Wie wechseln:**
- Verwenden Sie die Thema-Umschaltung im linken Navigationsmenü
- Änderungen werden sofort in der gesamten Anwendung angewendet
- Ihre Präferenz wird automatisch gespeichert und beim App-Neustart wiederhergestellt`
        },
        language: {
          title: 'Sprachauswahl',
          content: `
**Multi-Sprach-Unterstützung**

Palmas ist in 9 Sprachen verfügbar, um der globalen Flamenco-Gemeinschaft zu dienen:

- **Englisch** (en-US) - Standardsprache
- **Französisch** (Français) - Vollständige Übersetzung
- **Spanisch** (Español) - Native Flamenco-Terminologie
- **Deutsch** (Deutsch) - Komplette Lokalisierung
- **Italienisch** (Italiano) - Vollständige Oberflächenübersetzung
- **Japanisch** (日本語) - Asiatische Marktunterstützung
- **Chinesisch** (中文) - Vereinfachtes Chinesisch
- **Arabisch** (العربية) - Rechts-nach-links Unterstützung
- **Persisch** (فارسی) - Farsi-Lokalisierung

**Wie Sprache ändern:**
Verwenden Sie den Sprachauswahl im linken Navigationsmenü, um zwischen verfügbaren Sprachen zu wechseln.`
        },
        visualization: {
          title: 'Visualisierungsmodi',
          content: `
**Drei Anzeigeoptionen für Beat-Visualisierung**

Wählen Sie die Visualisierung, die am besten zu Ihrem Übungsstil passt:

**1. Punkte-Modus**
- Saubere, minimalistische Anzeige mit animierten Punkten
- Jeder Punkt repräsentiert einen Beat im Pattern
- Aktive Beats werden mit Farbe und Animation hervorgehoben

**2. Zähler-Modus**
- Digitaler Beat-Zähler zeigt aktuelle Position
- Zeigt aktuelle Beat-Nummer und Gesamt-Beats im Pattern
- Klare numerische Progression durch den Compás

**3. Uhr-Modus**
- Kreisförmige Uhren-Visualisierung
- Beats um eine Uhr mit animiertem Zeiger angeordnet
- Bietet intuitive Wahrnehmung des zyklischen Rhythmus`
        },
        // Machine-translated and not yet reviewed by a speaker. The flamenco
        // vocabulary is deliberately left in Spanish.
        reading: {
          title: 'Die Anzeige lesen',
          content: `
**Zwei Dinge zugleich**

Jede Visualisierung zeigt zwei übereinandergelegte Dinge, und sie sind nicht
dasselbe:

- Der **compás** — der Puls des palo selbst. Das ist das abstrakte Muster: wo
  die Akzente im Zyklus liegen, unabhängig davon, wer spielt.
- Die **palmas** — was das Instrument, das Sie gerade betrachten, tatsächlich
  schlägt. Ein Spieler trifft nicht einfach die Akzente; jedes Instrument spielt
  seine eigene Figur dagegen.

Abandolaos ist das deutlichste Beispiel. Sein Puls liegt auf 6, 2 und 4, während
die palmas claras auf 1 und 3 schlagen. Eine Anzeige, die nur den compás zeigt,
widerspräche dem, was Sie hören.

**Farbe bedeutet akzentuiert**

- Ein **roter** Punkt ist ein akzentuierter Schlag des compás. Graue Punkte sind
  die unbetonten, und sie werden kleiner, je weniger sie zählen: ein gezählter
  Schlag, dann ein ungezählter Puls, dann eine Unterteilung auf dem Off-Beat.
- Ein **blauer** Ring ist ein akzentuierter Schlag des gezeichneten Instruments.
  Dünnere Ringe in der Vordergrundfarbe sind seine leiseren Schläge. Gar kein
  Ring bedeutet, dass dieses Instrument auf diesem Schlag schweigt.

Der Ring sitzt leicht abgesetzt vom Punkt, damit er als Ring gelesen wird und
nicht als größerer Punkt. Die Stärke trägt dieselbe Information wie die Farbe, so
dass nichts davon abhängt, Rot von Blau zu unterscheiden.

Zähler und Uhr sagen dasselbe in ihrer eigenen Form: ein Balken unter der Zahl
und ein Strich außerhalb des Zifferblatts, dicker oder länger bei einem härteren
Schlag und eingefärbt, wenn es der akzentuierte ist.

**Achtelnoten**

Ein Instrument kann auch auf den Zwischenschlägen spielen, nicht nur auf den
Schlägen. Die Spalte **8tel** im Instrumenten-Mixer schaltet das für jedes
Instrument einzeln ein.

Ist sie aktiv, erscheinen die Off-Beat-Positionen zwischen den gezählten
Schlägen, kleiner gezeichnet. Ist sie es nicht, sind sie weiterhin vorhanden,
aber unsichtbar, so dass sich der Abstand der Schläge nie verschiebt.

**Auswählen, welches Instrument gezeichnet wird**

Es kann immer nur ein Instrument gezeichnet werden: zwei übereinanderliegende
Figuren wären unlesbar. Die Spalte **Angezeigt** im Mixer wählt aus, welches.

Es ist nie ein Instrument, das Sie nicht hören können: Ihre Wahl gilt, solange
dieses Instrument aktiv bleibt, andernfalls wird das erste aktive gezeichnet. Da
der Mixer nicht zulässt, alle abzuschalten, gibt es immer genau eines.`
        },
        muting: {
          title: 'Schläge stummschalten',
          content: `
Tippen Sie auf einen Schlag, um ihn stummzuschalten. Tippen Sie erneut, um ihn
zurückzuholen.

Ein stummgeschalteter Schlag ist durchgestrichen, und nichts klingt auf ihm –
weder die Palmas noch der Cajón noch die Jaleos. Der Compás zeigt weiterhin, wo
der Schlag liegt, und genau darum geht es: Sie zählen durch die Lücke hindurch.
Schalten Sie Schlag 10 stumm und finden Sie heraus, ob Sie noch auf der 12
ankommen.

Schalten Sie so viele stumm, wie Sie möchten – bis hin zu allen.

Solange etwas stummgeschaltet ist, erscheint unter dem Muster eine Anzahl, und
ihr ✕ holt alle Schläge auf einmal zurück – der Weg zurück, wenn Sie mehr
stummgeschaltet haben, als Sie erinnern. Stummschaltungen werden pro Muster
gespeichert und sind beim nächsten Öffnen der App noch da. Die Rhythmusoptionen zeigen dieselbe Anzahl und holen sie ebenfalls zurück.

Nur sichtbare Schläge lassen sich stummschalten. Wenn das dargestellte Instrument
keine Achtelnoten spielt, sind die Off-Beats ausgeblendet und reagieren nicht.`
        },
        sync: {
          title: 'Audio-/Bildverzögerung',
          content: `
**Wenn Klang und Animation nicht zusammenpassen**

Der Schlag, den Sie sehen, und der, den Sie hören, sollten zusammen eintreffen.
Kommt das Klicken *nach* dem Aufleuchten des Punktes, ist diese Einstellung die
Abhilfe: Sie hält die Animation zurück, bis der Klang aufgeholt hat.

Sie wird in Millisekunden gemessen, und der Regler zeigt die Verzögerung
zusätzlich als Bruchteil eines Schlags beim aktuellen Tempo — feste 120 ms fallen
bei 200 bpm weit stärker ins Gewicht als bei 60.

**Warum das passiert**

Jeder Audioweg fügt Verzögerung hinzu: die Pufferung des Browsers, das
Betriebssystem und dann alles, wodurch der Klang läuft. Die App fragt den Browser
bereits, wie viel Latenz er hinzufügt, und gleicht das automatisch aus. Was sie
nicht sehen kann, ist der Rest.

**Bluetooth ist meist der Übeltäter.** Drahtlose Kopfhörer und Lautsprecher
fügen etwa 100 bis 300 Millisekunden hinzu, die nirgends gemeldet werden, so dass
die App nichts davon wissen kann. Kabelgebundene Ausgabe braucht selten eine
Anpassung.

**So stellen Sie es ein**

Starten Sie das Metronom, achten Sie auf einen gut erkennbaren Schlag — einen
akzentuierten — und schieben Sie den Regler hoch, bis Klang und Animation
zusammenfallen. Vertrauen Sie Ihrem Ohr mehr als der Zahl: der richtige Wert ist
der, bei dem beide übereinstimmen, und er wird bei Kopfhörern anders sein als bei
Lautsprechern.

Die Einstellung wird auf diesem Gerät gespeichert und bleibt zwischen Sitzungen
erhalten. Wenn Sie zwischen Kabel und Funk wechseln, rechnen Sie damit, sie
wieder ändern zu müssen.`
        }
      }
    },
    mute: {
      hint: 'Auf einen Schlag tippen, um ihn stummzuschalten',
      none: 'Keine',
      beat: 'Schlag stummschalten',
      count: '{count} Schläge stumm',
      clear: 'Alle aufheben'
    },
    visualizationModes: {
      dots: 'Punkte',
      counter: 'Zähler',
      clock: 'Uhr'
    },
    utils: {
      wikipediaUrl: 'Wikipedia-Artikel:',
      videoExample: 'Video-Beispiel:',
      openLink: 'Link öffnen',
      source: 'Quelle: Wikipedia',
      beats: '{count} Schläge',
      disabled: 'Diese Option ist für dieses Muster deaktiviert.'
    },
    searchPattern: {
      title: 'Nach einem Rhythmus suchen',
      content: `
Viele Flamenco-**Palos** stammen tatsächlich von anderen rhythmischen Strukturen ab.
Zum Beispiel stammt "Farruca" von "Tientos" ab, "Columbiana" oder "Garrotín" sind Arten von "Tangos".
Hier können Sie den Namen eines beliebigen "Palo" eingeben, von dem Sie je gehört haben, und Palmas wird nach den Rhythmen suchen, von denen er abgeleitet ist.
- Suchen Sie nach einem Rhythmus, indem Sie seinen Namen oder einen Teil davon eingeben.
- Die Suche unterscheidet nicht zwischen Groß- und Kleinschreibung.
- Die Suche wird sowohl im Rhythmusnamen als auch in den verknüpften Rhythmen durchgeführt.
- Die Suche wird über die gesamte Zeichenfolge durchgeführt, nicht über einzelne Wörter.`
    },
    shortcuts: {
      title: 'Die folgenden Tastenkürzel sind für die Verwendung mit der Tastatur verfügbar:',
      space: 'Metronom abspielen/stoppen',
      up: 'Tempo erhöhen (Taste gedrückt halten für schnellere Erhöhung)',
      down: 'Tempo verringern (Taste gedrückt halten für schnellere Verringerung)',
      left: 'Vorheriger Rhythmus',
      right: 'Nächster Rhythmus',
      esc: 'Modal-Fenster schließen',
      tab: 'Fokus-Button wechseln'
    },
    reset: {
      title: 'Standardparameter wiederherstellen',
      warning: 'Warnung! Dies löscht Ihre Metronom-Einstellungen.',
      close: 'Schließen',
      proceed: 'Fortfahren',
      success: 'Erfolg! Ihre Metronom-Einstellungen wurden zurückgesetzt.',
    },
    context: {
      title: 'Kontext auswählen',
    },
    reverb: {
      title: 'Hall-Nachklang',
      content: 'Stellen Sie einen Nachklang für den Klang-Hall ein'
    },
    swing: {
      title: 'Swing',
      content: 'Stellen Sie einen Swing-Wert für das Metronom ein',
      caption: 'Wenn der Wert 0 ist, ist die Achtelnote genau die Hälfte einer Viertelnote. Wenn er sich 1 nähert, wird eine Verzögerung angewendet, für einen "Jazz-ähnlichen" Rhythmus-Geschmack.'
    },
    startBeat: {
      title: 'Startschlag',
      content: 'Stellen Sie den Schlag ein, bei dem das Metronom zu spielen beginnt'
    },
    mixer: {
      title: 'Instrumenten-Mischpult',
      content: 'Wählen Sie die Instrumente aus, die Sie spielen möchten',
      active: {
        title: 'Aktiv',
        content: 'Dieses Instrument spielen'
      },
      shown: {
        title: 'Angezeigt',
        content: 'Dieses Instrument in der Visualisierung darstellen'
      },
      eighth: {
        title: '8tel',
        content: 'Achtelnoten umschalten'
      },
      volume: {
        title: 'Lautstärke (dB)',
        content: 'Instrumentenlautstärke erhöhen oder verringern'
      }
    },
    pattern: {
      title: 'Rhythmus auswählen',
      search: 'Nach einem Rhythmus suchen',
      searchSm: 'Suchen',
    },
    prestart: {
      title: 'Vorlauf ab Schlag',
      content: 'Optional einen Schlag definieren, ab dem ein Vorlauf-Klick startet, bevor die eigentliche Schleife beginnt.'
    },
    privacy: {
      title: 'Datenschutzerklärung',
      content: `
Wir sammeln keine persönlichen Daten.

Wenn Sie die Hilfe zu einem Palo öffnen, fragt die App bei Wikipedia die Zusammenfassung dieses Artikels ab, um sie in Ihrer Sprache anzuzeigen. Wikipedia sieht dabei Ihre IP-Adresse und welcher Artikel angefragt wurde. Sonst verlässt nichts Ihr Gerät.`
    },
    tempo: {
      title: 'Tempo',
      content: 'Stellen Sie das Tempo des Metronoms ein',
      bpm: 'BPM'
    },
    update: {
      title: 'App-Initialisierung',
      content: `
Die Einstellungen der App müssen (erneut) initialisiert werden.

Wenn Sie eine frühere Version dieser App verwendet haben, verlieren Sie alle Ihre Einstellungen und Rhythmen.
Aber das ist der einzige Weg, um die neuen Funktionen zu erhalten. Wenn es Ihre erste Verwendung ist, ändert sich nichts, also machen Sie weiter.`,
      button: 'App neu laden'
    },
    tuning: {
      title: 'Stimmgabel',
      content: 'Einen Stimmgabel-Klang abspielen',
      caption: 'alle',
      play: 'Abspielen',
      stop: 'Stoppen'
    },
    changelog: {
      title: 'Änderungsprotokoll',
      description: 'Neueste Änderungen und Updates zu Palmas',
        releases: {
          v1_0_0: [
            '**Palmas ist eine neue App**, abgeleitet von [A Compás](https://gitlab.com/acompas/acompas) 4.2.4 von Olivier Ricordeau und Jérémie Sieffert, unter derselben AGPL-3.0-Lizenz. Sie trägt einen eigenen Namen, eigene Anwendungs-Identifier und eine eigene Versionsnummerierung, denn die Änderungen hier haben die beiden nicht zu verantworten. Melden Sie alles zu Palmas [in ihrem eigenen Repository](https://github.com/dwsdolce/palmas/issues).',
            '**Einzelne Schläge stummschalten.** Tippen Sie auf einen Schlag, um ihn stummzuschalten, und erneut, um ihn zurückzuholen. Auf einem stummen Schlag klingt nichts – weder die Palmas noch der Cajón noch die Jaleos –, während der Compás weiterhin zeigt, wo er liegt, sodass Sie durch die Lücke hindurch zählen. Schalten Sie so viele stumm, wie Sie möchten; sie werden pro Muster gespeichert. Gewünscht von einem Flamenco-Meister in Spanien, der hören wollte, ob ein Schüler noch auf der 12 ankommt.',
            'Neue Identität: ein geschriebenes **P** in einem Ring aus zwölf Punkten – dem Compás, den die App zeichnet – und ein Schriftzug in Playball, der Schrift, die A Compás selbst in ihren 2.x-Versionen verwendete.',
            '**Die Visualisierung zeigt jetzt, welche Schläge betont sind.** Farbe bedeutet Betonung in beiden Ebenen: eine rote Scheibe für einen betonten Schlag des Compás, ein blauer Ring für einen betonten Schlag des dargestellten Instruments. Die Stärke eines Schlags waren früher ein, zwei oder drei Pixel Linienbreite, was niemand sehen konnte.',
            'Die fünf Rhythmus-Kontexte teilen sich jetzt eine Farbe. Die ganze App je Kontext umzufärben verbrauchte den einzigen freien Farbkanal für einen Modus, den die Oberfläche ohnehin zweimal benennt.',
            'Neue Hilfe dazu, was die Anzeige zeigt, zur Achtelnoten-Spalte, zur Wahl des dargestellten Instruments und zur Audio/Bild-Verzögerung – in alle neun Sprachen übersetzt.',
            '**Die Palo-Beschreibungen sind übersetzt.** Sie waren in vier Sprachen ein Wikipedia-Auszug und in den übrigen fünf Englisch – und Englisch für alle ohne Netz, sobald die Abfrage fehlschlug. Jetzt sind sie in allen neun Sprachen der eigene Text der App, und Wikipedia ist nur noch ein Link statt des Textkörpers.',
            '**Content Security Policy** in jedem Produktionsbuild, was zwei echte Fehler zutage förderte: vue-i18n kompilierte Übersetzungen mit `Function()`, und Tone.js lädt sein Audio-Worklet von einer Blob-URL.',
            '**Sämtliche Analytik entfernt.** Keine Konten, kein Tracking, keine Cookies. Die einzige Anfrage, die die App an Dritte stellt, ist eine Wikipedia-Abfrage beim Öffnen der Hilfe zu einem Palo – und die Datenschutzerklärung sagt das jetzt auch.',
            'Der Web-Build läuft aus jedem Unterordner und kann daher überall gehostet werden, nicht nur im Wurzelverzeichnis einer Domain.',
            'Neun Sprachen sind wieder erreichbar: Arabisch, Persisch, Japanisch und Chinesisch waren vorhanden, wurden aber nie angeboten. Sprachen werden bei Bedarf geladen, was das Haupt-Bundle von 230 KB auf 190 KB gzip-komprimiert verkleinert hat.',
            '**Python wird zum Bauen nicht mehr gebraucht.** Die Audio-Pipeline, das Setup und das Desktop-Packaging sind Node-Skripte, die unter macOS, Windows und Linux gleichermaßen laufen; auch der iOS-Asset-Schritt braucht keinen Mac mehr.',
            'Das Setup besteht aus zwei kleinen Skripten – `setup.ps1` und `setup.sh` –, die auf Node prüfen, es bei Bedarf installieren und dann an ein gemeinsames Node-Skript übergeben, das den Rest erledigt und vor jeder Änderung nachfragt.',
            'Dokumentation neu aufgebaut nach Build-Zielen statt nach Host-Betriebssystemen, und Schritt für Schritt auf einer Maschine ohne installierte Toolchain überprüft.'
          ]
        }
    }
  },
  patterns: {
    alegria: {
      doc: '<p>Ein Compás besteht aus 12 Schlägen, mit Betonungen auf den Schlägen 12, 3, 6, 8 und 10.</p><p>Man kann es so hören: „die erste Hälfte des Compás ist ternär“ und „die zweite Hälfte ist binär“.</p><p>Dieser Rhythmus ist derselbe für Alegría und für Soleá por bulería (eine beschleunigte Form der traditionellen Soleá).</p><p>Der Unterschied zwischen beiden Stilen liegt darin, dass der eine in Dur gespielt wird (alegría heißt auf Spanisch „Freude“) und der andere in Moll (Flamenco-Tonfolge Am G F E).</p><p>Er passt auch zu vielen weiteren Stilen derselben „Familien“, etwa Cantiñas, Caracoles oder Mirabrás (der Alegría nahe) sowie Caña, Polo und Bambera (eher der Soleá por bulería nahe), und sogar zur Guajira.</p>',
      places: 'Cádiz'
    },
    abandolaos: {
      doc: '<p>Eine Art 3/4-Muster. Es wird für eine große Bandbreite von Palos verwendet, etwa Verdiales, Fandangos abandolaos, Jaleos extremeños und sogar einige Bulería-Muster.</p>',
      places: 'Málaga, Huelva, Extremadura'
    },
    'buleria-6': {
      doc: '<p>Ein Compás besteht aus 2 Gruppen zu je 3 ternären Vierteln, dieser Palo ist also rein ternär.</p><p>Man kann ihn als die erste Hälfte einer Bulería mit 12 Schlägen auffassen.</p>',
      places: 'Jerez de la Frontera'
    },
    'buleria-12': {
      doc: '<p>Ein Compás besteht aus 12 Schlägen, mit Betonungen auf den Schlägen 12, 3, 6, 8 und 10.</p><p>Man kann es so hören: „die erste Hälfte des Compás ist ternär (3 Schläge + 3 Schläge = 6 Schläge)“ und „die zweite Hälfte ist binär (2 Schläge + 2 Schläge + 2 Schläge = 6 Schläge)“.</p>',
      places: 'Jerez de la Frontera und andere'
    },
    'buleria-12-variation': {
      doc: '<p>In dieser verbreiteten Variante des Bulería-Compás mit 12 Schlägen liegt der Akzent auf Schlag 7 statt auf Schlag 6.</p>',
      places: 'Jerez de la Frontera und andere'
    },
    fandangos: {
      doc: '<p>Dieser Palo mit 12 Schlägen hat Akzente auf den Schlägen 12, 3, 6, 9 und 10.</p>',
      places: 'Huelva, Málaga und andere'
    },
    rumba: {
      doc: '<p>Die Rumba ist ein Palo im 4/4-Takt; sie wird 1, 2, 3, 4 gezählt.</p><p>Auf dem ersten Schlag liegt ein Akzent. Hinweis: unser Beispielmuster umfasst 2 Takte.</p>',
      places: 'Barcelona und andere'
    },
    sevillana: {
      doc: '<p>Die Sevillana ist ein rein ternärer Palo mit einem Akzent auf Schlag 1. Sie ist wie ein Walzer.</p><p>Hinweis: unser Beispielmuster umfasst 2 Takte.</p>',
      places: 'Sevilla'
    },
    siguiriya: {
      doc: '<p>Die Siguiriya ist ein Palo mit 12 Schlägen, mit Akzenten auf den Schlägen 12, 2, 4, 7 und 10.</p>',
      places: 'Sevilla, Cádiz und andere'
    },
    solea: {
      doc: '<p>Die Soleá ist ein trauriger Palo mit 12 Schlägen, mit Akzenten auf den Schlägen 3, 6, 8, 10 und 12.</p>',
      places: 'Sevilla, Cádiz und andere'
    },
    tanguillos: {
      doc: '<p>Tanguillos sind eine Art Mischrhythmus zwischen 3/4, 6/8 und 4/4; sie werden 1, 2, 3 gezählt.</p><p>Auf dem ersten Schlag liegt ein Akzent und manchmal … auf der Zwei und einhalb.</p><p>Hinweis: unser Beispielmuster umfasst 2 Takte.</p>',
      places: 'Cádiz und andere'
    },
    tangos: {
      doc: '<p>Tangos sind ein Palo im 4/4-Takt; sie werden 1, 2, 3, 4 gezählt. Auf dem ersten Schlag liegt ein Akzent.</p><p>Hinweis: unser Beispielmuster umfasst 2 Takte.</p>',
      places: 'Granada, Málaga, Extremadura'
    },
    tientos: {
      doc: '<p>Tientos sind ein Palo im 4/4-Takt; sie werden 1, 2, 3, 4 gezählt. Auf dem ersten Schlag liegt ein Akzent.</p><p>Sie enden oft „por tangos“.</p><p>Hinweis: unser Beispielmuster umfasst 2 Takte.</p>',
      places: 'Cádiz und andere Orte in Andalusien'
    }
  },
  buttons: {
    context : 'Kontext auswählen',
    pattern: 'Rhythmus',
    restore: 'Einstellungen wiederherstellen',
    options: 'Rhythmus-Optionen',
    settings: 'App-Einstellungen'
  },
  notify: {
    loading: 'Wird geladen…',
    audioInit: 'Audio wird initialisiert…',
    loadSamplesFailed: 'Audio-Samples konnten nicht geladen werden!',
    startSequencesFailed: 'Audiosequenzen konnten nicht gestartet werden. Bitte erneut versuchen.',
    fetchDataError: 'Fehler beim Abrufen der Daten',
    oneInstrumentRequired: 'Es muss mindestens ein Instrument ausgewählt sein!',
    tempo: {
      verySlow: 'Dein Tempo ist sehr langsam',
      veryFast: 'Dein Tempo ist sehr schnell',
      rhythmVerySlow: 'Dein Rhythmus ist sehr langsam',
      porTientos: 'Dein Tempo ist por tientos',
      verySlowTientos: 'Dein Tempo ist sehr langsam, sogar für tientos',
      tangosRumbas: 'Dein Tempo ist eher das von tangos oder rumbas',
      porBuleria: 'Dein Tempo ist por bulería',
      porRumba: 'Dein Tempo ist por rumba',
      soleaBuleriaAlegria: 'Dein Tempo ist soleá por bulería oder alegría'
    },
    browserUnsupported: {
      title: 'Aktualisiere deinen Browser!',
      message: 'Dein Browser unterstützt eine oder mehrere von dieser App verwendete Technologien nicht. Bitte komm mit einem anderen Browser oder einer anderen Version davon zurück.'
    }
  },
  sync: {
    title: 'Audio-/Bild-Verzögerung',
    caption: 'Verschiebt die Animation, damit sie zum Ton passt. Erhöhen, wenn der Klick nach der Animation zu hören ist — typischerweise bei Bluetooth-Kopfhörern.'
  }
}