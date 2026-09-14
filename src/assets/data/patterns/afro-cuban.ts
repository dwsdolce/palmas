import type { PatternState } from 'src/utils/types'

export default [
  {
    id: 1,
    label: 'Son Clave',
    name: 'son-clave',
    minTempo: 60,
    maxTempo: 200,
    defaultTempo: 80,
    slowTempo: 60,
    fastTempo: 200,
    nbBeatsInPattern: 16,
    accents: [0, 4, 8, 12],
    sequences: {
      clave: //<[number, ...(number | null)[]]>
        [ null, null, 1,    null, 1,    null, null, null, 1,    null, null, 1,    null, null, 1, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           2           3           4           1           2           3           4

      click: //<[number, ...(number | null)[]]>
        [ 1,    null, 2,    null, 2,    null, 2,    null, 1,    null, 2,    null, 2,    null, 2,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           2           3           4           1           2           3           4

      conga: //<[number, ...(number | null)[]]>
        [ 14,   14,   13,   14,   14,   14,   6,    6,    14,   14,   13,   14,   14,   14,   9,    9 ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           2           3           4           1           2           3           4

      beatLabels:
        [ 1,    null, 2,    null, 3,    null, 4,    null, 1,    null, 2,    null, 3,    null, 4,    null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           2           3           4           1           2           3           4
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 2, label: '2' },
      { value: 4, label: '3' },
      { value: 6, label: '4' },
      { value: 8, label: '5' },
      { value: 10, label: '6' },
      { value: 12, label: '7' },
      { value: 14, label: '8' }
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Son Clave',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 2,
    label: 'Rumba Clave',
    name: 'rumba-clave',
    minTempo: 60,
    maxTempo: 250,
    defaultTempo: 120,
    slowTempo: 60,
    fastTempo: 180,
    nbBeatsInPattern: 16,
    accents: [0, 8],
    sequences: {
      clave: //<[number, ...(number | null)[]]>
        [ 1,    null, null, 1,    null, null, null, 1,    null, null, 1,    null, 1,    null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           &           2           &           3           &           4           &

      click:
        [ 1,    null, null, null, 2,    null, null, null, 2,    null, null, null, 2,    null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           &           2           &           3           &           4           &

      beatLabels:
        [ 1,    null, '&',  null, 2,    null, '&',  null, 3,    null, '&',  null,  4,   null, '&',  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15
      //  1           &           2           &           3           &           4           &
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 2, label: '2' },
      { value: 4, label: '3' },
      { value: 6, label: '4' },
      { value: 8, label: '5' },
      { value: 10, label: '6' },
      { value: 12, label: '7' },
      { value: 14, label: '8' }
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Rumba Clave',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 3,
    label: 'Cáscara',
    name: 'cascara',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [0, 4, 6, 10, 14, 16, 20, 24, 26, 30],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      sorda:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
		[ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
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
    longLabel: 'Cáscara',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 4,
    label: 'Mozambique',
    name: 'mozambique',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 32,
    accents: [2, 4, 8, 10, 14, 16, 20, 24, 26, 30],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      sorda:
        [ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      pito:
		[ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      cajon:
        [ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      nudillo:
        [ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23    24    25    26    27    28    29    30    31
      //  1           &           2           &           3           &           4           &           1           &           2           &           3           &           4           &

      udu:
        [ null, null, 1, null,    1,   null,  null, null, 1, null,    1,   null, null, null, 1,    null,  1,    null, null, null, 1,   null,  null, null, 1,   null,  1,   null, null, null,  1,   null ],
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
    longLabel: 'Mozambique',
    doc: '',
    places: '',
    videoExample: ''
  }
] as PatternState[]
