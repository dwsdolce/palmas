<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomCard from 'src/components/CustomCard.vue'
import MarkdownRenderer from 'src/components/MarkdownRenderer.vue'
// Metadata only - version, date and build. The notes for each release are
// translated, and live in the catalogues under doc.changelog.releases.<id>.
import changelogEntries from 'src/assets/data/changelog'

const { tm } = useI18n()

// tm() rather than t(): the notes are an array, and it returns the whole list.
// It resolves against the current locale with no per-key fallback, which is safe
// here only because test/i18n.spec.ts requires every locale to carry every key.
const notesFor = (id: string) => tm(`doc.changelog.releases.${id}`) as unknown as string[]

// A release in progress has an entry before it has notes: the version moves
// on the moment the previous one ships. Until its notes are written it is not
// shown, rather than appearing as a version with nothing under it.
const shownEntries = computed(() => changelogEntries.filter(entry => notesFor(entry.id).length > 0))

// Split rather than `new Date(dateStr)`. A bare "2026-09-03" is parsed as UTC
// midnight and then rendered in local time, so everywhere west of Greenwich the
// date shows a day early — a release dated the 3rd appeared as the 2nd.
// Building from the parts gives local midnight, which is the day that was meant.
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template lang="pug">
q-page.text-grey-1.q-pa-sm.flex.justify-center.items-center
  custom-card(:popup="false")
    template(v-slot:title) {{ $t('doc.changelog.title') }}
    template(v-slot:content)
      q-list.bg-transparent
        template(v-for="(entry, index) in shownEntries" :key="entry.version")
          q-item.q-pa-md
            q-item-section
              .row.items-center.q-mb-sm
                q-chip.text-weight-bold.bg-primary.text-white {{ entry.version }}
                //- The build number beside the version, matching the header and
                  what the stores carry, so a report naming one is unambiguous.
                .text-caption.text-grey-8.q-ml-sm(v-if="entry.build") ({{ entry.build }})
                q-space
                .text-caption.text-grey-8 {{ formatDate(entry.date) }}

              q-list.bg-transparent.q-ml-none
                q-item(
                  v-for="(change, i) in notesFor(entry.id)",
                  :key="i",
                  dense
                )
                  q-item-section(side, center)
                    q-icon(name="mdi-circle", size="10px")
                  q-item-section
                    markdown-renderer(:content="change")

          q-separator.bg-grey-8(v-if="index < shownEntries.length - 1")
</template>
