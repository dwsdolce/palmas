import * as Tone from 'tone'
import { ref, onMounted, onUpdated, onUnmounted, onBeforeUnmount } from 'vue'
import { Loading } from 'quasar'
import { useTuningForkStore } from 'src/stores/tuning-fork'
import { t } from 'src/boot/i18n'
import type { Synth, Reverb, Volume, Sequence } from 'tone'
import { on } from 'events'

// interface Data {
//   reverb: any
//   synth: any
//   sequence: any
// }

let reverb: Reverb = {} as Reverb
let synth: Synth = {} as Synth
let sequence: Sequence = {} as Sequence

export const useTuningFork = () => {
  const store = useTuningForkStore()

  const activeNote = ref<string | null>(null)

  const initReverb = () => {
    return new Tone.Reverb({
      wet: 1,
      decay: 1.5,
      preDelay: 0.01
    }).toDestination()
  }

  const initSynth = () => {
    return new Tone.Synth().connect(reverb).set({
      envelope: {
        attack: 0.01,
        decay: 1,
        sustain: 1,
        release: 10
      },
      volume: 5
    })
  }

  const changeNote = (payload: string | null) => {
    activeNote.value = payload
  }

  const initSequence = () => {
    const seq = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, 1, time)
      // getDraw() and getTransport() below, never Tone.Draw or Tone.Transport:
      // those exports are fixed at import to the first audio context, and the
      // metronome replaces the context when its clock dies. Bound to the old
      // one, the tuning fork would schedule against a clock that never moves.
      Tone.getDraw().schedule(() => {
        // trigger animation eventually by store
        changeNote(note)
      }, time)
    }, store.notes)
    seq.loop = true

    return seq
  }

  const initTuningFork = () => {
    reverb = initReverb()
    synth = initSynth()
    sequence = initSequence()
  }

  const playNote = async (note: string) => {
    await Tone.start()
    synth.triggerAttackRelease(note, 1)
  }

  const startSequence = async () => {
    Loading.show({
      delay: 50,
      message: t('notify.loading'),
    })
    await Tone.start()
    initTuningFork()
    await Tone.start()
    Tone.getTransport().bpm.value = 20
    await Tone.getTransport().start('+0.1')
    Loading.hide()
    sequence.start()
  }

  const stopSequence = async () => {
    sequence.stop()
    Tone.getTransport().stop()
    store.changeNote(null)
  }

  return {
    activeNote,
    initTuningFork,
    playNote,
    startSequence,
    stopSequence,
    changeNote
  }
}




