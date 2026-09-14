import type { PatternState } from 'src/utils/types'

export default [
  {
    id: 1,
    label: 'Bossa Nova',
    name: 'bossa-nova',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [0, 6, 12, 20, 26],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      sorda:
        [ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
		[ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ 1,   null, null, null, null, null,  1,   null, null, null, null, null, 1,    null, null, null,  null, null, null, null, 1,   null,  null, null, null, null, 1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      click:
        [ 1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null,  1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      beatLabels:
        [ 1,    null,'&',   null,  2,   null, '&',  null, 3,    null, '&',  null, 4,    null, '&',  null, 1,    null, '&',  null, 2,    null, '&',  null, 3,    null, '&',  null, 4,    null, '&',  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '4&' },
      { value: 2, label: '4' },
      { value: 3, label: '3&' },
      { value: 4, label: '3' },
      { value: 5, label: '2&' },
      { value: 6, label: '2' },
      { value: 7, label: '1&' },
      { value: 8, label: '1' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Bossa Nova',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 2,
    label: 'Samba (Underframe at Caixa & Surdo)',
    name: 'samba-underframe',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [0, 6, 8, 14, 16, 22, 24, 30],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,    null, null, null, null, null, 1,   null,  1,    null, null, null, null, null, 1,    null, 1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      sorda:
        [ 1,    null, null, null, null, null,  1,   null,  1,   null, null, null, null,  null, 1,   null,  1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
        [ 1,    null, null, null, null, null,  1,   null,  1,   null, null, null, null,  null, 1,   null,  1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ 1,    null, null, null, null, null,  1,   null,  1,   null, null, null, null,  null, 1,   null,  1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ 1,    null, null, null, null, null,  1,   null,  1,   null, null, null, null,  null, 1,   null,  1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ 1,    null, null, null, null, null,  1,   null,  1,   null, null, null, null,  null, 1,   null,  1,   null, null, null, null, null,  1,   null,  1,   null, null, null, null, null, 1,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      click:
        [ 1,    null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null,  1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      beatLabels:
        [ 1,    null, '&',  null, 2,    null, '&',  null, 3,    null, '&',  null, 4,    null, '&',  null, 1,    null, '&',    null, 2,   null, '&',   null,    3, null,    '&', null,    4, null,    '&',    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '4&' },
      { value: 2, label: '4' },
      { value: 3, label: '3&' },
      { value: 4, label: '3' },
      { value: 5, label: '2&' },
      { value: 6, label: '2' },
      { value: 7, label: '1&' },
      { value: 8, label: '1' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Samba (Underframe)',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 3,
    label: 'Samba (Layer example)',
    name: 'samba-layer',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [0, 4, 8, 10, 14, 18, 22, 26, 28],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &
      sorda:
        [ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
		[ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ 1,   null, null, null, 1,    null, null, null,  1,   null,  1,   null, null,  null, 1,   null,  null, null, 1,   null, null, null,  1,   null,  null, null, 1,   null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      click:
        [ 1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null,  1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      beatLabels:
        [ 1,   null, '&', null,    2, null,    '&', null,    3, null,    '&', null,    4, null,    '&',    null, 1,    null, '&',    null, 2,   null, '&',   null,    3, null,    '&', null,    4, null,    '&',    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '4&' },
      { value: 2, label: '4' },
      { value: 3, label: '3&' },
      { value: 4, label: '3' },
      { value: 5, label: '2&' },
      { value: 6, label: '2' },
      { value: 7, label: '1&' },
      { value: 8, label: '1' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Samba (Layer)',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 4,
    label: 'Partido Alto',
    name: 'partido-alto',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [0, 4, 10, 14, 18, 24, 28],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      sorda:
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ 1,    null, null, null,  1,   null,  null, null, null, null, 1,   null, null, null, 1,    null,  null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      click:
        [ 1,    null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null,  1,   null, null, null, null, null, null, null,  2,   null, null, null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      beatLabels:
        [ 1,    null, '&', null,    2, null,    '&', null,    3, null,    '&', null,    4, null,    '&',    null, 1,    null, '&',    null, 2,   null, '&',   null,    3, null,    '&', null,    4, null,    '&',    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '4&' },
      { value: 2, label: '4' },
      { value: 3, label: '3&' },
      { value: 4, label: '3' },
      { value: 5, label: '2&' },
      { value: 6, label: '2' },
      { value: 7, label: '1&' },
      { value: 8, label: '1' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Partido Alto',
    doc: '',
    places: '',
    videoExample: ''
  }
] as PatternState[]
