<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePatternStore } from 'src/stores/patterns'
import HelpTooltip from 'src/components/HelpTooltip.vue'

const patternStore = usePatternStore()
const { mutedCount } = storeToRefs(patternStore)
const { clearMutes } = patternStore
</script>

<template lang="pug">
.text-center.q-mx-md.muted-beats
  p.caption {{ $t('doc.options.content.muted.title') }}
    span.q-ml-sm
      help-tooltip(:text="$t('doc.options.content.muted.content')")

  //- The count is the whole of the state, so it is shown rather than described.
    This row exists to give muting a home someone can find by looking, rather
    than only by having already used it: the chip on the page appears when there
    is something to clear, and until then nothing says the feature is there.
  .row.items-center.justify-center.q-gutter-sm
    .text-body1.muted-count {{ mutedCount > 0 ? mutedCount : $t('doc.mute.none') }}
    q-btn.clear-mutes(
      outline,
      dense,
      no-caps,
      color="primary",
      :disable="mutedCount === 0",
      :label="$t('doc.mute.clear')",
      @click="clearMutes"
    )
</template>
