<script setup lang="ts">
import { ref, computed, watch, onUpdated } from 'vue'
import { openURL, Platform } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import CustomCard from 'src/components/CustomCard.vue'
import MarkdownRenderer from 'src/components/MarkdownRenderer.vue'
import { usePatternStore } from 'src/stores/patterns'
import { useSessionStore } from 'src/stores/session'
import { useWikipediaExtract } from 'src/composables/wikipedia'
import { isFocusableElement } from 'src/utils/utils'
import type { QBtn } from 'quasar'

const patternStore = usePatternStore()
const sessionStore = useSessionStore()
const { t, te, locale } = useI18n()

const { selectedData } = storeToRefs(patternStore)

/**
 * A pattern's description, or the places it comes from, from whichever of the
 * two channels has one.
 *
 * The catalogues hold the translated text, keyed by the pattern's `name`, for
 * the palos that ship with the app - thirteen of them, in nine languages. The
 * pattern's own `doc` / `places` hold text that is *not* translated: what a
 * contributor writes for a new rhythm before anyone has translated it, and what
 * a user writes for a pattern of their own, in whatever language they please.
 *
 * The catalogue wins where it has an entry. Without the fallback a contributed
 * pattern could not be described at all without editing nine locale files and
 * satisfying test/i18n.spec.ts, which is not a reasonable thing to ask of
 * someone submitting a rhythm.
 */
const patternText = (field: 'doc' | 'places') => {
  const name = selectedData.value?.name
  if (name === undefined) return ''
  const key = `patterns.${name}.${field}`
  if (te(key)) return t(key)
  return selectedData.value?.[field] ?? ''
}

const patternDoc = computed(() => patternText('doc'))
const patternPlaces = computed(() => patternText('places'))

const patternHelpDialog = ref(false)

// Only the resolved article URL is wanted now. The intro extract used to be the
// body of this dialog, which meant the description a reader saw depended on
// their language having a Wikipedia article and on there being a network: four
// locales were never mapped at all, and an offline or native launch fell back to
// English everywhere. The description is translated text now, and Wikipedia is
// a link out of it.
const { articleUrl: wikiUrl, load: loadWiki } = useWikipediaExtract()

// Prefer the localized Wikipedia article when we resolved one, else the
// English URL from the pattern data.
const wikipediaLink = computed(() => wikiUrl.value || selectedData.value?.wikipediaUrl)

// Beats per compás. `nbBeatsInPattern` counts subdivisions (2 per beat).
const beatCount = computed(() =>
  selectedData.value ? Math.round(selectedData.value.nbBeatsInPattern / 2) : 0
)

// Fetch the localized Wikipedia intro whenever the dialog is open and the
// pattern or locale changes. Refetches on locale switch so the text follows
// the chosen language.
watch(
  [patternHelpDialog, locale, () => selectedData.value?.wikipediaUrl],
  ([open, , url]) => {
    if (open) void loadWiki(url)
  }
)

const patternHelpBtn = ref<QBtn | null>(null)
const closeBtn = ref<QBtn | null>(null)

const launch = (url: string | undefined) => {
  if (url) {
    // if (Platform.is.cordova) {
    //   cordova.InAppBrowser.open(url, '_system')
    //   return
    // }
    openURL(url)
  }
}

onUpdated(() => {
  if (isFocusableElement(document.activeElement)) document.activeElement?.blur()
  if (isFocusableElement(patternHelpBtn.value?.$el)) patternHelpBtn.value?.$el.blur()
  if (isFocusableElement(closeBtn.value?.$el)) closeBtn.value?.$el.blur()
})
</script>

<template lang="pug">
span.q-ml-sm
  q-btn.help-btn(
    id="patternHelpBtn",
    ref="patternHelpBtn",
    dense,
    round,
    flat,
    size="10px",
    icon="mdi-help-circle",
    @click="patternHelpDialog = true"
  )
  q-dialog(
    id="patternHelpDialog",
    v-model="patternHelpDialog"
  )
    custom-card
      template(v-slot:title) {{ selectedData?.longLabel }}
      template(v-slot:content)
        //- Through MarkdownRenderer rather than v-html: this text can now come
          from the pattern itself, which means a contributor's file or - once
          patterns can be imported - a stranger's. The renderer runs it through
          marked and then DOMPurify, so the shipped descriptions render as the
          HTML they are while nothing else can smuggle a script in. There is
          deliberately no raw path kept for the trusted case.
        markdown-renderer(v-if="patternDoc", :content="patternDoc")
        h6.text-h6 {{ $t('doc.utils.beats', { count: beatCount }) }}
        p(v-if="patternPlaces") {{ patternPlaces }}
        p.text-caption.text-grey(v-if="wikipediaLink")
          | {{ $t('doc.utils.wikipediaUrl') }}
          q-btn(
            flat,
            round,
            size="sm",
            icon="mdi-open-in-new",
            :aria-label="$t('doc.utils.openLink')",
            @click="launch(wikipediaLink)"
          ).q-ml-sm
        //- p(v-if="wikipediaLink") {{ $t('doc.utils.wikipediaUrl') }}
        //-   q-btn(
        //-     outline,
        //-     size="sm",
        //-     icon="mdi-link-variant",
        //-     :label="$t('doc.utils.openLink')"
        //-     @click="launch(wikipediaLink)"
        //-   ).q-ml-md
        q-btn(
          v-if="selectedData?.videoExample",
          outline,
          size="sm",
          icon="mdi-link-variant",
          :label="$t('doc.utils.videoExample')"
          @click="launch(selectedData?.videoExample)"
        )
</template>
