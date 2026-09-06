// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  welcome: 'Welcome to Palmas app',
  notFound: {
    header: 'Sorry, this page doesn\'t exist.',
    btn: 'Go back to patterns'
  },
  help: 'Help',
  tuning: 'Tuning fork',
  shortcuts: 'Shortcuts',
  privacy: 'Privacy policy',
  source: 'Source code',
  issues: 'Issues',
  doc: {
    welcome: {
      title: 'Welcome to the Palmas app',
      content: `
This app is designed to help you learn and practice your musical instrument.
It is a work in progress, so please be patient with us as we continue to improve it.
If you have any questions or suggestions, please contact us.`
    },
    getStarted: {
      title: 'Get started',
      content: `
- Select a **pattern** from the list. A pattern (also called "palo" in flamenco) is a rhythmic style.
- Adjust the **tempo** (speed) of the pattern.
- Select **instruments** in the mixer.
- **Start** playing the metronome.`
    },
    options: {
      title: 'List of options',
      content: {
        theme: {
          title: 'Theme',
          content: `
You can choose between light and dark themes.
The dark theme is more suitable for low-light environments, while the light theme is more suitable for bright environments.`,
        },
        lang: {
          title: 'Language',
          content: `
Choose the interface language of the application.
The change is applied immediately to all texts.
Your selection is stored locally (in the browser / device) so it will be kept next time you open the app.`,
        },
        tempo: {
          title: 'Tempo',
          content: `
There are 2 ways to define the tempo: the knob circle, and you can decrement/increment the bpm with the + and - buttons.
You can also type the tempo directly in the input field, use the mouse wheel, or the up and down arrow keys.
The tempo is the speed of the metronome, measured in beats per minute.`,
        },
        mixer: {
          title: 'Instruments mixer',
          content: `
Select playing instruments (make sure to have at least one active instrument),
set the relative volume of each, choose whether it plays eighth notes as well as
beats, and pick which one is drawn in the visualization.`,
        },
        muted: {
          title: 'Silenced beats',
          content: 'Tap a beat in the compás to silence it, and tap it again to bring it back. Nothing sounds on a silenced beat, while the compás goes on showing where it falls. Silences are kept per pattern.',
        },
        improvise: {
          title: 'Improvise',
          content: `
If it is on, then sometimes the metronome will stop sticking to the pre-programmed pattern and play random beats for one or more instrument(s).
This produces some "surprise" in the pattern.`,
        },
        humanize: {
          title: 'Humanize',
          content: 'If it is on, then the metronome will play the beats with a little random deviation, simulating the human touch.',
        },
        swing: {
          title: 'Swing',
          content: 'If its value is 0, the eighth note is exactly half a quarter note. When it approaches to 1, a lag is applied, for a "jazz-like" rhythm feel.',
        },
        reverb: {
          title: 'Reverb',
          content: 'Adjust the reverb of the sound. It simulates a room or a hall effect.',
        },
        startBeat: {
          title: 'Start beat',
          content: `
Change the start beat (which beat selected the pattern starts on).
This is useful if you want to start the pattern on a different beat.
For example, if you want to start on the 2nd beat of the pattern, set the start beat to 2.
The start beat is also useful if you want to practice a particular part of the pattern.
The notes between the start beat and the begining of the pattern will be played as a click sound.`,
        },
        viewMode: {
          title: 'View mode',
          content: 'Choose between dots, counter and clock visualisations.',
        },
        reset: {
          title: 'Reset',
          content: 'Reset the metronome\'s settings to the default values. You can reset all settings or reset settings for the current pattern.',
        }
      }
    },
    appSettings: {
      title: 'Application Settings',
      content: {
        theme: {
          title: 'Theme Mode',
          content: `
**Light and Dark Theme Options**

Palmas offers both light and dark themes to provide the best visual experience:

- **Light Theme**: Clean, bright interface ideal for well-lit environments. Features white backgrounds with dark text for maximum readability in daylight.
- **Dark Theme**: Easy on the eyes with dark backgrounds and light text. Perfect for low-light conditions, reduces eye strain during extended practice sessions, and saves battery on OLED screens.

**How to Switch:**
- Use the theme toggle button in the left navigation menu
- Changes apply immediately across the entire application
- Your preference is automatically saved and restored on app restart

**Automatic Detection:**
The app respects your device's system theme preference by default, but you can override this setting at any time.`
        },
        language: {
          title: 'Language Selection',
          content: `
**Multi-language Support**

Palmas is available in 9 languages to serve the global flamenco community:

- **English** (en-US) - Default language
- **Spanish** (Español) - Native flamenco terminology
- **French** (Français) - Full translation
- **German** (Deutsch) - Complete localization
- **Italian** (Italiano) - Full interface translation
- **Japanese** (日本語)
- **Chinese** (简体中文) - Simplified
- **Arabic** (العربية) - Right to left
- **Persian** (فارسی) - Right to left

**Features:**
- All menus, buttons, and help text are translated
- Flamenco pattern names remain in Spanish for authenticity
- Language changes apply instantly without app restart
- Settings are saved locally on your device

**How to Change Language:**
Use the language selector in the left navigation menu to switch between available languages.`
        },
        visualization: {
          title: 'Visualization Modes',
          content: `
**Three Display Options for Beat Visualization**

Choose the visualization that best suits your practice style:

**1. Dots Mode**
- Clean, minimalist display with animated dots
- Each dot represents a beat in the pattern
- Active beats are highlighted with color and animation
- Perfect for visual learners who prefer simple, uncluttered displays
- Excellent for focusing on pattern structure

**2. Counter Mode**
- Digital beat counter showing current position
- Displays current beat number and total beats in pattern
- Clear numerical progression through the compás
- Ideal for musicians who think in numbers
- Helpful for learning complex pattern structures and timing

**3. Clock Mode**
- Circular clock-face visualization
- Beats arranged around a clock with animated hand
- Provides intuitive sense of cyclical rhythm
- Great for understanding the circular nature of flamenco compás
- Visual representation matches traditional flamenco counting methods

**How to Switch:**
Access visualization options through the settings menu. Changes apply immediately, and your preference is saved automatically.

**Tips:**
- Try different modes during practice to find what works best for you
- Clock mode is particularly effective for 12-beat patterns like Soleá
- Counter mode helps when learning to count complex rhythms
- Dots mode minimizes distractions for advanced practitioners`
        },
        reading: {
          title: 'Reading the display',
          content: `
**Two things at once**

Every visualization shows two different things layered together, and they are
not the same thing:

- The **compás** — the pulse of the palo itself. This is the abstract pattern: where the
  accents fall in the cycle, regardless of who is playing.
- The **palmas** — what the instrument you are watching actually strikes. A
  player does not simply hit the accents; each instrument plays its own figure
  against them.

Abandolaos is the clearest example. Its pulse falls on 6, 2 and 4, while the
palmas claras strike on 1 and 3. A display showing only the compás would
contradict what you are hearing.

**Colour means accented**

- A **red** dot is an accented beat of the compás. Grey dots are the
  unaccented ones, and they shrink as they matter less — a counted beat, then
  an uncounted pulse, then an off-beat subdivision.
- A **blue** ring is an accented strike by the instrument being drawn. Thinner
  rings in the foreground colour are its softer strikes. No ring at all means
  that instrument is silent on that beat.

The ring is set slightly off the dot so it reads as a ring rather than a
larger dot. Thickness carries the same information as the colour, so nothing
depends on telling red from blue.

The counter and the clock say the same thing in their own shapes: a bar under
the number, and a tick outside the dial, thicker or longer for a harder strike
and coloured when it is the accented one.

**Eighth notes**

An instrument can play on the half-beats as well as the beats. The **8th**
column in the instruments mixer turns that on for each instrument separately.

When it is on, the off-beat positions appear between the counted beats, drawn
smaller. When it is off they are still there but invisible, so the spacing of
the beats never shifts as you toggle it.

**Choosing which instrument is drawn**

Only one instrument can be drawn at a time — two figures overlaid would be
unreadable. The **Shown** column in the mixer chooses which one.

It is never an instrument you cannot hear: your choice holds for as long as
that instrument stays active, and otherwise the first active instrument is
drawn. Since the mixer will not let you switch everything off, there is always
exactly one.`
        },
        muting: {
          title: 'Silencing beats',
          content: `
Tap a beat to silence it. Tap it again to bring it back.

A silenced beat is struck through, and nothing sounds on it — not the palmas,
not the cajón, not the jaleos. The compás still shows where the beat is, which
is the whole point: you keep counting through the gap. Silence beat 10 and find
out whether you still arrive on 12.

Silence as many as you like, up to all of them.

While anything is silenced a count appears below the pattern, and its ✕ restores
every beat at once — the way back when you have silenced more than you can
remember. Silences are kept per pattern and are still there next time you open
the app. Rhythm options shows the same count, and clears them from there.

Only beats you can see can be silenced. Where the instrument being drawn is not
playing eighth notes, the off-beats are hidden and cannot be tapped.`
        },
        sync: {
          title: 'Audio/visual delay',
          content: `
**When the sound and the animation disagree**

The beat you see and the beat you hear should land together. If the click
arrives *after* the dot lights up, this setting is the fix: it holds the
animation back until the sound catches up.

It is measured in milliseconds, and the slider also shows the delay as a
fraction of a beat at your current tempo — a fixed 120 ms matters far more at
200 bpm than at 60.

**Why it happens**

Every audio path adds delay: the browser's own buffering, the operating
system, and then whatever the sound travels through. The app already asks the
browser how much latency it is adding and compensates for that automatically.
What it cannot see is the rest.

**Bluetooth is the usual culprit.** Wireless headphones and speakers add
between roughly 100 and 300 milliseconds that nothing reports, so the app has
no way to know about it. Wired output rarely needs any adjustment at all.

**How to set it**

Start the metronome, watch a beat you can pick out easily — an accented one —
and raise the slider until the sound and the animation land together. Trust
your ear rather than the number: the right value is the one where they agree,
and it will differ between your headphones and your speakers.

The setting is saved on this device, so it persists between sessions. If you
switch between wired and wireless, expect to change it back.`
        }
      }
    },
    mute: {
      hint: 'Tap a beat to silence it',
      none: 'None',
      beat: 'Silence beat',
      count: '{count} beats silenced',
      clear: 'Clear'
    },
    visualizationModes: {
      dots: 'Dots',
      counter: 'Counter',
      clock: 'Clock'
    },
    utils: {
      wikipediaUrl: 'Wikipedia article:',
      videoExample: 'Video example:',
      openLink: 'Open link',
      source: 'Source: Wikipedia',
      beats: '{count} beats',
      disabled: 'This option is disabled for this pattern.'
    },
    searchPattern: {
      title: 'Search for a pattern',
      content: `
Many flamenco **palos** are actually derived from other rhythmical structures.
For example, "farruca" is derived from "tientos", "columbiana" or "garrotín" are kinds of "tangos".
Here you can input the name of any "palo" you ever heard of and Palmas will search for the patterns which it is derived from.
- Search for a pattern by typing its name or a part of it.
- The search is case insensitive.
- The search is performed on the pattern name and on the linked patterns.
- The search is performed on the whole string, not on the words.`
    },
    shortcuts: {
      title: 'The following shortcuts are available for usage with the keyboard:',
      space: 'Play/Stop the metronome',
      up: 'Increment the tempo (maintain key pressed to increment faster)',
      down: 'Decrement the tempo (maintain key pressed to decrement faster)',
      left: 'Previous pattern',
      right: 'Next pattern',
      esc: 'Close the modal window',
      tab: 'Change focus button'
    },
    reset: {
      title: 'Restore default parameters',
      warning: 'Warning! This will delete your metronome settings.',
      close: 'Close',
      proceed: 'Proceed',
      success: 'Success! Your metronome setting has been reset.',
    },
    context: {
      title: 'Select a context',
    },
    reverb: {
      title: 'Reverb decay',
      content: 'Set a decay for sounds reverb'
    },
    swing: {
      title: 'Swing',
      content: 'Set a swing value for the metronome',
      caption: 'If its value is 0, the eighth note is exactly half a quarter note. When it approaches to 1, a lag is applied, for a "jazz-like" rythm flavour.'
    },
    startBeat: {
      title: 'Start beat',
      content: 'Set the beat where the metronome will start playing'
    },
    mixer: {
      title: 'Instruments mixer',
      content: 'Select the instruments you want to play',
      active: {
        title: 'Active',
        content: 'Play this instrument'
      },
      shown: {
        title: 'Shown',
        content: 'Draw this instrument in the visualization'
      },
      eighth: {
        title: '8th',
        content: 'Toggle eighth notes'
      },
      volume: {
        title: 'Volume (db)',
        content: 'Increase or decrease instrument volume'
      }
    },
    pattern: {
      title: 'Select a pattern',
      search: 'Search for a pattern',
      searchSm: 'Search',
    },
    prestart: {
      title: 'Prestart from beat',
      content: 'Optionaly define a beat from which a precount click will start before the actual loop starts.'
    },
    privacy: {
      title: 'Privacy policy',
      content: `
We don't collect any personal data.

When you open the help for a rhythm, the app asks Wikipedia for that article's summary, so it can show it in your language. Wikipedia sees your IP address and which article was requested. Nothing else leaves your device.`
    },
    tempo: {
      title: 'Tempo',
      content: 'Set the tempo of the metronome',
      bpm: 'BPM'
    },
    update: {
      title: 'App initialization',
      content: `
The settings of the app have to be (re-)initialized.

If you were using a previous version of this app, you will lose all your settings and patterns.
But this is the only way to get the new features. If it is your first use, this will change nothing so go ahead.`,
      button: 'Reload app'
    },
    tuning: {
      title: 'Tuning fork',
      content: 'Play a tuning fork sound',
      caption: 'all',
      play: 'Play',
      stop: 'Stop'
    },
    changelog: {
      title: 'Changelog',
      description: 'Latest changes and updates to Palmas',
        releases: {
          v1_0_0: [
            '**Palmas is a new app**, derived from [A Compás](https://gitlab.com/acompas/acompas) 4.2.4 by Olivier Ricordeau and Jérémie Sieffert, under the same AGPL-3.0 licence. It carries its own name, its own application identifiers and its own version numbering, because the changes here are not theirs to answer for. Report anything about Palmas [on its own repository](https://github.com/dwsdolce/palmas/issues).',
            '**Silence individual beats.** Tap a beat to silence it, tap it again to bring it back. Nothing sounds on a silenced beat — not the palmas, not the cajón, not the jaleos — while the compás goes on showing where it falls, so you count through the gap. Silence as many as you like; they are kept per pattern. Asked for by a flamenco master in Spain, who wanted to hear whether a student still arrives on 12.',
            'New identity: a script **P** inside a ring of twelve dots — the compás the app draws — and a wordmark set in Playball, the face A Compás itself used through its 2.x releases.',
            '**The visualization now says which strikes are accented.** Colour means accent in both layers: a red disc for an accented beat of the compás, a blue ring for an accented strike by the instrument being drawn. The strength of a strike used to be one, two or three pixels of line weight, which nobody could see.',
            'The five rhythm contexts now share one colour. Repainting the whole app per context spent the only free colour channel on a mode the interface already names twice.',
            'New help covering what the display is showing, the eighth-note column, choosing which instrument is drawn, and the audio/visual delay setting — translated into all nine languages.',
            '**The palo descriptions are translated.** They were a Wikipedia extract in four languages and English in the other five — and English for anyone offline, whenever the lookup failed. They are now the app\'s own text in all nine, with Wikipedia as a link rather than the body.',
            '**Content Security Policy** on every production build, which turned up two real defects: vue-i18n compiled translations with `Function()`, and Tone.js loads its audio worklet from a blob URL.',
            '**All analytics removed.** No accounts, no tracking, no cookies. The one request the app makes to anyone else is a Wikipedia lookup when you open the help for a palo, and the privacy policy now says so.',
            'The web build runs from any subfolder, so it can be hosted anywhere rather than only at a domain root.',
            'Nine languages are reachable again: Arabic, Persian, Japanese and Chinese were present but never offered. Locales load on demand, which took the main bundle from 230 KB to 190 KB gzipped.',
            '**Python is no longer needed to build.** The audio pipeline, the setup and the desktop packaging are Node scripts that run on macOS, Windows and Linux alike; the iOS asset step no longer needs a Mac either.',
            'Setup is two small scripts — `setup.ps1` and `setup.sh` — that check for Node, install it if missing, and hand over to a shared Node script that does the rest, asking before it changes anything.',
            'Documentation rewritten around build targets rather than host operating systems, and verified step by step on a machine with no toolchain installed.'
          ]
        }
    }
  },
  patterns: {
    alegria: {
      doc: '<p>One compás is made of 12 beats, and an emphasis is put on beats 12, 3, 6, 8 and 10.</p><p>It can be seen as "the first half of the compás is ternary", and "the second half is binary".</p><p>This rhythm is the same for both alegría and soleá por bulería (which is an acceleration of traditional soleá).</p><p>The difference between the two styles is that the one is played in major tones (alegría means "joy" in Spanish) and the other is played in minor (flamenco tune Am G F E).</p><p>It can also fit for many other styles from the same "families" like cantiñas, caracoles, mirabras (alegría-like) or caña, polo, bambera (more soleá por bulería styled), and even for guajira</p>',
      places: 'Cádiz'
    },
    abandolaos: {
      doc: '<p>A kind of 3/4 pattern. It is used for a wide range of different palos, like Verdiales, Fandangos abandolaos, Jaleos extremeños and even some Bulería patterns.</p>',
      places: 'Málaga, Huelva, Extremadura'
    },
    'buleria-6': {
      doc: '<p>One compás is made of 2 groups of 3 ternary quarter notes, so this palo is purely ternary.</p><p>It can be seen as the first half of a 12 beats bulería.</p>',
      places: 'Jerez de la Frontera'
    },
    'buleria-12': {
      doc: '<p>One compás is made of 12 beats, and an emphasis is put on beats 12, 3, 6, 8 and 10.</p><p>It can be seen as "the first half of the compás is ternary (3 beats + 3 beats = 6 beats)", and "the second half is binary (2 beats + 2 beats + 2 beats = 6 beats)".</p>',
      places: 'Jerez de la Frontera and others'
    },
    'buleria-12-variation': {
      doc: '<p>In this popular variation of the 12 beats bulería compás, an accent is put on beat 7 instead of beat 6.</p>',
      places: 'Jerez de la Frontera and others'
    },
    fandangos: {
      doc: '<p>This 12 beats-based palo has accents on beats 12, 3, 6, 9 and 10.</p>',
      places: 'Huelva, Málaga, and others'
    },
    rumba: {
      doc: '<p>Rumba is a 4/4 palo, it can be counted as 1, 2, 3, 4.</p><p>There is an accent on the first beat. Remark : our example pattern is made of 2 bars.</p>',
      places: 'Barcelona and others'
    },
    sevillana: {
      doc: '<p>Sevillanas is a purely ternary palo, with an accent on beat 1. It is just like a waltz.</p><p>Remark : our example pattern is made of 2 bars.</p>',
      places: 'Sevilla'
    },
    siguiriya: {
      doc: '<p>Siguiriya is a 12 beats-based palo, with accents on beats 12, 2, 4, 7 and 10.</p>',
      places: 'Sevilla, Cádiz and others'
    },
    solea: {
      doc: '<p>Soleá is a sad 12 beats-based palo, with accents on beats 3, 6, 8, 10 and 12.</p>',
      places: 'Sevilla, Cádiz and others'
    },
    tanguillos: {
      doc: '<p>Tanguillos are a kind of hybrid rhythm between 3/4, 6/8 and 4/4, it can be counted as 1, 2, 3.</p><p>There is an accent on the first beat and sometimes… on the 2 and a half.</p><p>Remark : our example pattern is made of 2 bars.</p>',
      places: 'Cádiz and others'
    },
    tangos: {
      doc: '<p>Tangos is a 4/4 palo, it can be counted as 1, 2, 3, 4. There is an accent on the first beat.</p><p>Remark : our example pattern is made of 2 bars.</p>',
      places: 'Granada, Málaga, Extremadura'
    },
    tientos: {
      doc: '<p>Tientos is a 4/4 palo, it can be counted as 1, 2, 3, 4. There is an accent on the first beat.</p><p>It often ends "por tangos".</p><p>Remark : our example pattern is made of 2 bars.</p>',
      places: 'Cádiz and other places in Andalusia'
    }
  },
  buttons: {
    context : 'Select context',
    pattern: 'Pattern',
    restore: 'Restore settings',
    options: 'Rhythm options',
    settings: 'App settings'
  },
  notify: {
    loading: 'Loading…',
    audioInit: 'Initializing audio…',
    loadSamplesFailed: 'Failed to load the audio samples!',
    startSequencesFailed: 'Failed to start audio sequences. Please try again.',
    fetchDataError: 'Error fetching data',
    oneInstrumentRequired: 'At least one instrument must be selected!',
    tempo: {
      verySlow: 'Your tempo is very slow',
      veryFast: 'Your tempo is very fast',
      rhythmVerySlow: 'Your rhythm is very slow',
      porTientos: 'Your tempo is por tientos',
      verySlowTientos: 'Your tempo is very slow, even for tientos',
      tangosRumbas: 'Your tempo is more like tangos or rumbas',
      porBuleria: 'Your tempo is por bulería',
      porRumba: 'Your tempo is por rumba',
      soleaBuleriaAlegria: 'Your tempo is solea por bulería or alegría'
    },
    browserUnsupported: {
      title: 'Update your browser!',
      message: 'Your browser doesn\'t support one or more technologies used by this app. Please come back with another one or another version of this one.'
    }
  },
  sync: {
    title: 'Audio/visual delay',
    caption: 'Shift the on-screen beat to match the sound. Increase it if the click is heard after the animation — typically with Bluetooth headphones.'
  }
}
