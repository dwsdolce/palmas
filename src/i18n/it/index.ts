// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Azione fallita',
  success: 'Azione completata con successo',
  welcome: 'Benvenuto nell\'app Palmas',
  notFound: {
    header: 'Spiacenti, questa pagina non esiste.',
    btn: 'Torna ai pattern'
  },
  help: 'Aiuto',
  tuning: 'Diapason',
  shortcuts: 'Scorciatoie',
  privacy: 'Politica sulla privacy',
  source: 'Codice sorgente',
  issues: 'Problemi',
  doc: {
    welcome: {
      title: 'Benvenuto nell\'app Palmas',
      content: `
Questa app è progettata per aiutarti ad imparare e praticare con il tuo strumento musicale.
È un lavoro in corso, quindi ti preghiamo di essere paziente mentre continuiamo a migliorarla.
Se hai domande o suggerimenti, ti preghiamo di contattarci.`
    },
    getStarted: {
      title: 'Inizia',
      content: `
- Seleziona un **pattern** dall'elenco. Un pattern (chiamato anche "palo" nel flamenco) è uno stile ritmico.
- Regola il **tempo** (velocità) del pattern.
- Seleziona gli **strumenti** nel mixer.
- **Avvia** il metronomo.`
    },
    options: {
      title: 'Elenco delle opzioni',
      content: {
        theme: {
          title: 'Tema',
          content: `
Puoi scegliere tra tema chiaro e scuro.
Il tema scuro è più adatto per ambienti con poca luce, mentre il tema chiaro è più adatto per ambienti luminosi.`,
        },
        lang: {
          title: 'Lingua',
          content: `
Scegli la lingua dell'interfaccia dell'applicazione.
Il cambiamento viene applicato immediatamente a tutti i testi.
La tua selezione viene memorizzata localmente (nel browser / dispositivo) quindi verrà mantenuta la prossima volta che apri l'app.`,
        },
        tempo: {
          title: 'Tempo',
          content: `
Ci sono 2 modi per definire il tempo: la manopola circolare, e puoi decrementare/incrementare i BPM con i pulsanti + e -.
Puoi anche digitare il tempo direttamente nel campo di input, usare la rotella del mouse o i tasti freccia su e giù.
Il tempo è la velocità del metronomo, misurata in battiti per minuto.`,
        },
        mixer: {
          title: 'Mixer strumenti',
          content: `
Seleziona gli strumenti in riproduzione (assicurati di averne almeno uno attivo),
imposta il volume relativo di ciascuno, scegli se suona anche le crome oltre ai tempi,
e indica quale viene disegnato nella visualizzazione.`,
        },
        muted: {
          title: 'Tempi silenziati',
          content: 'Tocca un tempo del compás per silenziarlo, toccalo di nuovo per riportarlo. Su un tempo silenziato non suona nulla, mentre il compás continua a mostrare dove cade. I silenzi sono conservati per pattern.',
        },
        improvise: {
          title: 'Improvvisa',
          content: `
Se è attivato, a volte il metronomo smetterà di seguire il pattern pre-programmato e suonerà battiti casuali per uno o più strumenti.
Questo produce una "sorpresa" nel pattern.`,
        },
        humanize: {
          title: 'Umanizza',
          content: 'Se è attivato, il metronomo suonerà i battiti con una piccola deviazione casuale, simulando il tocco umano.',
        },
        swing: {
          title: 'Swing',
          content: 'Se il suo valore è 0, la nota da un ottavo è esattamente la metà di una nota da un quarto. Quando si avvicina a 1, viene applicato un ritardo, per una sensazione ritmica "jazz-like".',
        },
        reverb: {
          title: 'Riverbero',
          content: 'Regola il riverbero del suono. Simula l\'effetto di una stanza o di una sala.',
        },
        startBeat: {
          title: 'Battito di inizio',
          content: `
Cambia il battito di inizio (su quale battito inizia il pattern selezionato).
Questo è utile se vuoi iniziare il pattern su un battito diverso.
Ad esempio, se vuoi iniziare sul 2° battito del pattern, imposta il battito di inizio a 2.
Il battito di inizio è anche utile se vuoi praticare una parte particolare del pattern.
Le note tra il battito di inizio e l'inizio del pattern verranno suonate come un suono di click.`,
        },
        viewMode: {
          title: 'Modalità visualizzazione',
          content: 'Scegli tra visualizzazioni a punti, contatore e orologio.',
        },
        reset: {
          title: 'Reset',
          content: 'Ripristina le impostazioni del metronomo ai valori predefiniti. Puoi resettare tutte le impostazioni o resettare le impostazioni per il pattern corrente.',
        }
      }
    },
    appSettings: {
      title: 'Impostazioni applicazione',
      content: {
        theme: {
          title: 'Modalità tema',
          content: `
**Opzioni tema chiaro e scuro**

Palmas offre temi chiari e scuri per fornire la migliore esperienza visiva:

- **Tema chiaro**: Interfaccia pulita e luminosa ideale per ambienti ben illuminati. Presenta sfondi bianchi con testo scuro per massima leggibilità alla luce del giorno.
- **Tema scuro**: Facile per gli occhi con sfondi scuri e testo chiaro. Perfetto per condizioni di scarsa illuminazione, riduce l'affaticamento degli occhi durante sessioni di pratica prolungate e risparmia batteria su schermi OLED.

**Come cambiare:**
- Usa il pulsante di cambio tema nel menu di navigazione sinistro
- I cambiamenti si applicano immediatamente a tutta l'applicazione
- La tua preferenza è automaticamente salvata e ripristinata al riavvio dell'app`
        },
        language: {
          title: 'Selezione lingua',
          content: `
**Supporto multilingue**

Palmas è disponibile in 9 lingue per servire la comunità flamenca globale:

- **Inglese** (en-US) - Lingua predefinita
- **Francese** (Français) - Traduzione completa
- **Spagnolo** (Español) - Terminologia flamenca nativa
- **Tedesco** (Deutsch) - Localizzazione completa
- **Italiano** (Italiano) - Traduzione completa dell'interfaccia
- **Giapponese** (日本語) - Supporto mercato asiatico
- **Cinese** (中文) - Cinese semplificato
- **Arabo** (العربية) - Supporto da destra a sinistra
- **Persiano** (فارسی) - Localizzazione farsi

**Come cambiare lingua:**
Usa il selettore di lingua nel menu di navigazione sinistro per alternare tra lingue disponibili.`
        },
        visualization: {
          title: 'Modalità visualizzazione',
          content: `
**Tre opzioni di visualizzazione per i battiti**

Scegli la visualizzazione che si adatta meglio al tuo stile di pratica:

**1. Modalità Punti**
- Display pulito e minimalista con punti animati
- Ogni punto rappresenta un battito nel pattern
- I battiti attivi sono evidenziati con colore e animazione

**2. Modalità Contatore**
- Contatore digitale che mostra la posizione attuale
- Mostra il numero del battito attuale e totale battiti nel pattern
- Progressione numerica chiara attraverso il compás

**3. Modalità Orologio**
- Visualizzazione circolare tipo quadrante orologio
- Battiti disposti attorno a un orologio con lancetta animata
- Fornisce sensazione intuitiva del ritmo ciclico`
        },
        // Machine-translated and not yet reviewed by a speaker. The flamenco
        // vocabulary is deliberately left in Spanish.
        reading: {
          title: 'Leggere il display',
          content: `
**Due cose insieme**

Ogni visualizzazione mostra due cose sovrapposte, e non sono la stessa cosa:

- Il **compás** — la pulsazione del palo stesso. È lo schema astratto: dove
  cadono gli accenti nel ciclo, indipendentemente da chi suona.
- Le **palmas** — ciò che lo strumento che stai guardando colpisce davvero. Chi
  suona non si limita a marcare gli accenti; ogni strumento suona la propria
  figura contro di essi.

Gli abandolaos sono l'esempio più chiaro. La loro pulsazione cade su 6, 2 e 4,
mentre le palmas claras colpiscono su 1 e 3. Una visualizzazione che mostrasse
solo il compás contraddirebbe ciò che stai ascoltando.

**Il colore indica l'accento**

- Un punto **rosso** è un battito accentato del compás. I punti grigi sono
  quelli non accentati, e si rimpiccioliscono man mano che contano meno: un
  battito contato, poi una pulsazione non contata, poi una suddivisione in
  levare.
- Un anello **blu** è un colpo accentato dello strumento disegnato. Gli anelli
  più sottili, nel colore di primo piano, sono i suoi colpi più deboli.
  L'assenza di anello significa che quello strumento tace su quel battito.

L'anello è leggermente staccato dal punto, così da leggersi come un anello e non
come un punto più grande. Lo spessore porta la stessa informazione del colore,
quindi nulla dipende dal distinguere il rosso dal blu.

Il contatore e l'orologio dicono la stessa cosa con le loro forme: una barra
sotto il numero e una tacca fuori dal quadrante, più spessa o più lunga per un
colpo più forte, e colorata quando è quello accentato.

**Crome**

Uno strumento può suonare anche sui levare, non solo sui battiti. La colonna
**8ª** nel mixer degli strumenti la attiva per ciascuno strumento separatamente.

Quando è attiva, le posizioni in levare compaiono fra i battiti contati,
disegnate più piccole. Quando non lo è restano al loro posto ma invisibili, così
la spaziatura dei battiti non si sposta mai.

**Scegliere quale strumento viene disegnato**

Si può disegnare un solo strumento alla volta: due figure sovrapposte sarebbero
illeggibili. La colonna **Mostrato** nel mixer sceglie quale.

Non è mai uno strumento che non puoi sentire: la tua scelta vale finché quello
strumento resta attivo, altrimenti viene disegnato il primo strumento attivo.
Poiché il mixer non permette di spegnerli tutti, ce n'è sempre esattamente uno.`
        },
        muting: {
          title: 'Silenziare i tempi',
          content: `
Tocca un tempo per silenziarlo. Toccalo di nuovo per riportarlo.

Un tempo silenziato è barrato e su di esso non suona nulla: né le palmas, né il
cajón, né i jaleos. Il compás continua a mostrare dove cade il tempo, ed è
proprio questo il punto: continui a contare attraverso il vuoto. Silenzia il
tempo 10 e scopri se arrivi ancora sul 12.

Silenziane quanti vuoi, fino a tutti.

Finché qualcosa è silenziato, sotto il pattern compare un conteggio, e la sua ✕
ripristina tutti i tempi in una volta — la via d'uscita quando ne hai silenziati
più di quanti ne ricordi. I silenzi sono conservati per pattern e sono ancora lì
alla prossima apertura dell'applicazione. Le opzioni di ritmo mostrano lo stesso numero e li ripristinano anch'esse.

Si possono silenziare solo i tempi che si vedono. Quando lo strumento disegnato
non suona le crome, i controtempi sono nascosti e non rispondono.`
        },
        sync: {
          title: 'Ritardo audio/video',
          content: `
**Quando suono e animazione non coincidono**

Il battito che vedi e quello che senti dovrebbero arrivare insieme. Se il clic
arriva *dopo* che il punto si accende, è questa impostazione a correggerlo:
trattiene l'animazione finché il suono non la raggiunge.

Si misura in millisecondi, e il cursore mostra anche il ritardo come frazione di
un battito al tempo corrente: 120 ms fissi pesano molto di più a 200 bpm che a
60.

**Perché succede**

Ogni catena audio aggiunge ritardo: il buffering del browser, il sistema
operativo e poi tutto ciò che il suono attraversa. L'app chiede già al browser
quanta latenza sta aggiungendo e la compensa automaticamente. Ciò che non può
vedere è il resto.

**Il Bluetooth è di solito il colpevole.** Cuffie e altoparlanti senza fili
aggiungono all'incirca fra 100 e 300 millisecondi che nessuno dichiara, quindi
l'app non ha modo di saperlo. L'uscita via cavo raramente richiede una
regolazione.

**Come impostarlo**

Avvia il metronomo, osserva un battito facile da riconoscere — uno accentato — e
alza il cursore finché suono e animazione non coincidono. Fidati dell'orecchio
più che del numero: il valore giusto è quello in cui coincidono, e sarà diverso
con le cuffie rispetto agli altoparlanti.

L'impostazione viene salvata su questo dispositivo, quindi si conserva fra una
sessione e l'altra. Se passi da cavo a senza fili, aspettati di doverla
cambiare.`
        }
      }
    },
    mute: {
      hint: 'Tocca un tempo per silenziarlo',
      none: 'Nessuno',
      beat: 'Silenzia il tempo',
      count: '{count} tempi silenziati',
      clear: 'Ripristina tutti'
    },
    visualizationModes: {
      dots: 'Punti',
      counter: 'Contatore',
      clock: 'Orologio'
    },
    utils: {
      wikipediaUrl: 'Articolo Wikipedia:',
      videoExample: 'Esempio video:',
      openLink: 'Apri link',
      source: 'Fonte: Wikipedia',
      beats: '{count} tempi',
      disabled: 'Questa opzione è disabilitata per questo pattern.'
    },
    searchPattern: {
      title: 'Cerca un pattern',
      content: `
Molti **palos** flamenchi sono effettivamente derivati da altre strutture ritmiche.
Ad esempio, "farruca" deriva da "tientos", "columbiana" o "garrotín" sono tipi di "tangos".
Qui puoi inserire il nome di qualsiasi "palo" di cui hai mai sentito parlare e Palmas cercherà i pattern da cui deriva.
- Cerca un pattern digitando il suo nome o una parte di esso.
- La ricerca non fa distinzione tra maiuscole e minuscole.
- La ricerca viene eseguita sul nome del pattern e sui pattern collegati.
- La ricerca viene eseguita sull'intera stringa, non sulle parole.`
    },
    shortcuts: {
      title: 'Le seguenti scorciatoie sono disponibili per l\'uso con la tastiera:',
      space: 'Riproduci/Ferma il metronomo',
      up: 'Incrementa il tempo (mantieni premuto il tasto per incrementare più velocemente)',
      down: 'Decrementa il tempo (mantieni premuto il tasto per decrementare più velocemente)',
      left: 'Pattern precedente',
      right: 'Pattern successivo',
      esc: 'Chiudi la finestra modale',
      tab: 'Cambia il pulsante di focus'
    },
    reset: {
      title: 'Ripristina parametri predefiniti',
      warning: 'Attenzione! Questo cancellerà le impostazioni del tuo metronomo.',
      close: 'Chiudi',
      proceed: 'Procedi',
      success: 'Successo! Le impostazioni del tuo metronomo sono state ripristinate.',
      options: {
        pattern: 'Solo il pattern attuale',
        all: 'Tutti i pattern'
      },
    },
    context: {
      title: 'Seleziona un contesto',
    },
    reverb: {
      title: 'Decadimento riverbero',
      content: 'Imposta un decadimento per il riverbero dei suoni'
    },
    swing: {
      title: 'Swing',
      content: 'Imposta un valore di swing per il metronomo',
      caption: 'Se il suo valore è 0, la nota da un ottavo è esattamente la metà di una nota da un quarto. Quando si avvicina a 1, viene applicato un ritardo, per un sapore ritmico "jazz-like".'
    },
    startBeat: {
      title: 'Battito di inizio',
      content: 'Imposta il battito da cui il metronomo inizierà a suonare'
    },
    mixer: {
      title: 'Mixer strumenti',
      content: 'Seleziona gli strumenti che vuoi suonare',
      active: {
        title: 'Attivo',
        content: 'Suona questo strumento'
      },
      shown: {
        title: 'Mostrato',
        content: 'Rappresenta questo strumento nella visualizzazione'
      },
      eighth: {
        title: '8°',
        content: 'Attiva/disattiva note da un ottavo'
      },
      volume: {
        title: 'Volume (db)',
        content: 'Aumenta o diminuisci il volume dello strumento'
      }
    },
    pattern: {
      title: 'Seleziona un pattern',
      search: 'Cerca un pattern',
      searchSm: 'Cerca',
    },
    prestart: {
      title: 'Pre-inizio dal battito',
      content: 'Facoltativamente definisci un battito da cui inizierà un click di pre-conteggio prima che inizi il loop effettivo.'
    },
    privacy: {
      title: 'Politica sulla privacy',
      content: `
Non raccogliamo alcun dato personale.

Quando apri la guida di un palo, l'app chiede a Wikipedia il riassunto di quell'articolo per mostrartelo nella tua lingua. Wikipedia vede il tuo indirizzo IP e quale articolo è stato richiesto. Nient'altro lascia il tuo dispositivo.`
    },
    tempo: {
      title: 'Tempo',
      content: 'Imposta il tempo del metronomo',
      bpm: 'BPM'
    },
    update: {
      title: 'Inizializzazione app',
      content: `
Le impostazioni dell'app devono essere (ri-)inizializzate.

Se stavi usando una versione precedente di questa app, perderai tutte le tue impostazioni e pattern.
Ma questo è l'unico modo per ottenere le nuove funzionalità. Se è il tuo primo utilizzo, questo non cambierà nulla quindi procedi pure.`,
      button: 'Ricarica app'
    },
    tuning: {
      title: 'Diapason',
      content: 'Riproduci un suono di diapason',
      caption: 'tutto',
      play: 'Riproduci',
      stop: 'Ferma'
    },
    changelog: {
      title: 'Registro delle modifiche',
      description: 'Ultimi cambiamenti e aggiornamenti di Palmas',
        releases: {
          v1_0_0: [
            '**Palmas è una nuova applicazione**, derivata da [A Compás](https://gitlab.com/acompas/acompas) 4.2.4 di Olivier Ricordeau e Jérémie Sieffert, con la stessa licenza AGPL-3.0. Porta un nome proprio, identificatori applicativi propri e una propria numerazione di versione, perché le modifiche fatte qui non sono cosa loro. Segnala qualunque cosa riguardi Palmas [sul suo repository](https://github.com/dwsdolce/palmas/issues).',
            '**Silenzia singoli tempi.** Tocca un tempo per silenziarlo, toccalo di nuovo per riportarlo. Su un tempo silenziato non suona nulla — né le palmas, né il cajón, né i jaleos — mentre il compás continua a mostrare dove cade, così conti attraverso il vuoto. Silenziane quanti vuoi; sono conservati per pattern. Richiesto da un maestro di flamenco in Spagna, che voleva sentire se l\'allievo arrivava ancora sul 12.',
            'Nuova identità: una **P** corsiva dentro un anello di dodici punti — il compás che l\'applicazione disegna — e un logotipo composto in Playball, il carattere che la stessa A Compás usava nelle sue versioni 2.x.',
            '**La visualizzazione ora dice quali colpi sono accentati.** Il colore significa accento in entrambi gli strati: un disco rosso per un tempo accentato del compás, un anello blu per un colpo accentato dello strumento disegnato. Prima la forza di un colpo era uno, due o tre pixel di spessore della linea, che nessuno riusciva a vedere.',
            'I cinque contesti ritmici ora condividono un solo colore. Ridipingere tutta l\'applicazione a seconda del contesto spendeva l\'unico canale di colore libero per una modalità che l\'interfaccia nomina già due volte.',
            'Nuova guida su ciò che mostra il display, sulla colonna delle crome, sulla scelta dello strumento disegnato e sull\'impostazione del ritardo audio/video — tradotta in tutte e nove le lingue.',
            '**Le descrizioni dei palos sono tradotte.** Erano un estratto di Wikipedia in quattro lingue e in inglese nelle altre cinque — e in inglese per chiunque fosse offline, ogni volta che la richiesta falliva. Ora sono il testo dell\'applicazione stessa in tutte e nove le lingue, con Wikipedia come collegamento e non come corpo del testo.',
            '**Content Security Policy** in ogni build di produzione, che ha portato alla luce due difetti reali: vue-i18n compilava le traduzioni con `Function()` e Tone.js carica il suo audio worklet da una URL blob.',
            '**Rimossa ogni analitica.** Nessun account, nessun tracciamento, nessun cookie. L\'unica richiesta che l\'applicazione rivolge a terzi è una ricerca su Wikipedia quando apri la guida di un palo, e ora l\'informativa sulla privacy lo dice.',
            'La build web funziona da qualsiasi sottocartella, quindi può essere ospitata ovunque e non solo alla radice di un dominio.',
            'Le nove lingue sono di nuovo raggiungibili: arabo, persiano, giapponese e cinese erano presenti ma non venivano mai offerti. Le lingue si caricano su richiesta, il che ha portato il bundle principale da 230 KB a 190 KB compressi.',
            '**Python non serve più per compilare.** La catena audio, l\'installazione e il pacchetto desktop sono script Node che funzionano allo stesso modo su macOS, Windows e Linux; anche il passaggio delle risorse iOS non richiede più un Mac.',
            'L\'installazione sono due piccoli script — `setup.ps1` e `setup.sh` — che verificano la presenza di Node, lo installano se manca e passano la mano a uno script Node condiviso che fa il resto, chiedendo prima di cambiare qualsiasi cosa.',
            'Documentazione riscritta attorno agli obiettivi di compilazione anziché ai sistemi operativi ospiti, e verificata passo per passo su una macchina senza alcun toolchain installato.'
          ]
        }
    }
  },
  patterns: {
    alegria: {
      doc: '<p>Un compás è formato da 12 tempi, con accenti sui tempi 12, 3, 6, 8 e 10.</p><p>Si può sentire come «la prima metà del compás è ternaria» e «la seconda metà è binaria».</p><p>Questo ritmo è lo stesso per l\'alegría e per la soleá por bulería (che è un\'accelerazione della soleá tradizionale).</p><p>La differenza fra i due stili è che uno si suona in tonalità maggiori (alegría significa «gioia» in spagnolo) e l\'altro in minori (tonalità flamenca Am G F E).</p><p>Si adatta anche a molti altri stili delle stesse «famiglie», come cantiñas, caracoles o mirabrás (vicini all\'alegría), oppure caña, polo e bambera (più vicini alla soleá por bulería), e perfino alla guajira.</p>',
      places: 'Cádiz'
    },
    abandolaos: {
      doc: '<p>Una specie di pattern in 3/4. È usato per un\'ampia gamma di palos, come verdiales, fandangos abandolaos, jaleos extremeños e perfino alcuni pattern di bulería.</p>',
      places: 'Málaga, Huelva, Extremadura'
    },
    'buleria-6': {
      doc: '<p>Un compás è formato da 2 gruppi di 3 semiminime ternarie, quindi questo palo è puramente ternario.</p><p>Si può vedere come la prima metà di una bulería da 12 tempi.</p>',
      places: 'Jerez de la Frontera'
    },
    'buleria-12': {
      doc: '<p>Un compás è formato da 12 tempi, con accenti sui tempi 12, 3, 6, 8 e 10.</p><p>Si può sentire come «la prima metà del compás è ternaria (3 tempi + 3 tempi = 6 tempi)» e «la seconda metà è binaria (2 tempi + 2 tempi + 2 tempi = 6 tempi)».</p>',
      places: 'Jerez de la Frontera e altri'
    },
    'buleria-12-variation': {
      doc: '<p>In questa diffusa variante del compás di bulería da 12 tempi, l\'accento cade sul tempo 7 anziché sul 6.</p>',
      places: 'Jerez de la Frontera e altri'
    },
    fandangos: {
      doc: '<p>Questo palo da 12 tempi ha accenti sui tempi 12, 3, 6, 9 e 10.</p>',
      places: 'Huelva, Málaga e altri'
    },
    rumba: {
      doc: '<p>La rumba è un palo in 4/4; si conta 1, 2, 3, 4.</p><p>C\'è un accento sul primo tempo. Nota: il nostro pattern di esempio è composto da 2 battute.</p>',
      places: 'Barcelona e altri'
    },
    sevillana: {
      doc: '<p>La sevillana è un palo puramente ternario, con un accento sul tempo 1. È proprio come un valzer.</p><p>Nota: il nostro pattern di esempio è composto da 2 battute.</p>',
      places: 'Sevilla'
    },
    siguiriya: {
      doc: '<p>La siguiriya è un palo da 12 tempi, con accenti sui tempi 12, 2, 4, 7 e 10.</p>',
      places: 'Sevilla, Cádiz e altri'
    },
    solea: {
      doc: '<p>La soleá è un palo triste da 12 tempi, con accenti sui tempi 3, 6, 8, 10 e 12.</p>',
      places: 'Sevilla, Cádiz e altri'
    },
    tanguillos: {
      doc: '<p>I tanguillos sono una sorta di ritmo ibrido fra 3/4, 6/8 e 4/4; si contano 1, 2, 3.</p><p>C\'è un accento sul primo tempo e talvolta… sul due e mezzo.</p><p>Nota: il nostro pattern di esempio è composto da 2 battute.</p>',
      places: 'Cádiz e altri'
    },
    tangos: {
      doc: '<p>I tangos sono un palo in 4/4; si contano 1, 2, 3, 4. C\'è un accento sul primo tempo.</p><p>Nota: il nostro pattern di esempio è composto da 2 battute.</p>',
      places: 'Granada, Málaga, Extremadura'
    },
    tientos: {
      doc: '<p>I tientos sono un palo in 4/4; si contano 1, 2, 3, 4. C\'è un accento sul primo tempo.</p><p>Spesso finiscono «por tangos».</p><p>Nota: il nostro pattern di esempio è composto da 2 battute.</p>',
      places: 'Cádiz e altri luoghi dell\'Andalusia'
    }
  },
  buttons: {
    context : 'Seleziona contesto',
    pattern: 'Pattern',
    restore: 'Ripristina impostazioni',
    options: 'Opzioni ritmo',
    settings: 'Impostazioni app'
  },
  notify: {
    loading: 'Caricamento…',
    audioInit: 'Inizializzazione dell\'audio…',
    loadSamplesFailed: 'Impossibile caricare i campioni audio!',
    startSequencesFailed: 'Impossibile avviare le sequenze audio. Riprova.',
    fetchDataError: 'Errore nel recupero dei dati',
    oneInstrumentRequired: 'Deve essere selezionato almeno uno strumento!',
    tempo: {
      verySlow: 'Il tuo tempo è molto lento',
      veryFast: 'Il tuo tempo è molto veloce',
      rhythmVerySlow: 'Il tuo ritmo è molto lento',
      porTientos: 'Il tuo tempo è por tientos',
      verySlowTientos: 'Il tuo tempo è molto lento, anche per i tientos',
      tangosRumbas: 'Il tuo tempo è piuttosto da tangos o rumbas',
      porBuleria: 'Il tuo tempo è por bulería',
      porRumba: 'Il tuo tempo è por rumba',
      soleaBuleriaAlegria: 'Il tuo tempo è soleá por bulería o alegría'
    },
    browserUnsupported: {
      title: 'Aggiorna il tuo browser!',
      message: 'Il tuo browser non supporta una o più tecnologie utilizzate da questa app. Torna con un altro browser o un\'altra versione di questo.'
    }
  },
  sync: {
    title: 'Ritardo audio/visivo',
    caption: 'Sposta l\'animazione per farla coincidere con il suono. Aumenta il valore se il clic si sente dopo l\'animazione — tipicamente con le cuffie Bluetooth.'
  },
  contexts: {
    flamenco: 'Flamenco',
    afroCuban: 'Afro-cubano',
    afroBrazilian: 'Afro-brasiliano',
    fundamentalGlobal: 'Globale fondamentale',
    ternaryAfrican: 'Africano ternario'
  },
  aria: {
    menu: 'Menu',
    home: 'Palmas - torna al metronomo',
    lightMode: 'Passa alla modalità chiara',
    darkMode: 'Passa alla modalità scura'
  }
}