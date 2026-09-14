import type { PatternState } from 'src/utils/types'

export default [
  {
    id: 1,
    label: 'Shuffle',
    name: 'shuffle',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 24,
    accents: [0, 4, 6, 10, 12, 16, 18, 22],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      sorda:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      pito:
		[ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      cajon:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      nudillo:
        [ 1,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      udu:
        [ 1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      click:
        [ 1,   null, null, null,  null, null, 2,   null, null, null, null, null,  2,   null, null, null, null, null,  2,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      beatLabels:
        [ 1,   null,  2,   null,  3,   null,  4,   null,  5,   null,  6,   null,  7,   null,  8,   null,  9,   null,  10,  null,  11,  null,  12,  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '12' },
      { value: 2, label: '11' },
      { value: 3, label: '10' },
      { value: 4, label: '9' },
      { value: 5, label: '8' },
      { value: 6, label: '7' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Shuffle',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 2,
    label: 'Abakwa',
    name: 'abakwa',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 24,
    accents: [0, 2, 4, 8, 10, 12, 16, 18, 20],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1, null,   null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      sorda:
        [ 1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1, null,   null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      pito:
		[ 1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1, null,   null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      cajon:
        [ 1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1, null,   null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      nudillo:
        [ 1,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      udu:
        [ 1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1,   null, null, null,  1,   null,  1,   null,  1, null,   null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      click:
        [ 1,   null, null, null,  null, null, 2,   null, null, null, null, null,  2,   null, null, null, null, null,  2,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      beatLabels:
        [ 1,   null,  2,   null,  3,   null,  4,   null,  5,   null,  6,   null,  7,   null,  8,   null,  9,   null,  10,  null,  11,  null,  12,  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '12' },
      { value: 2, label: '11' },
      { value: 3, label: '10' },
      { value: 4, label: '9' },
      { value: 5, label: '8' },
      { value: 6, label: '7' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Abakwa',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 3,
    label: '6/8 Clave -> Bell',
    name: '6-8-clave-bell',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 24,
    accents: [0, 4, 10, 14, 18],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ 1,   null, null, null,  1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      sorda:
        [ 1,   null, null, null,  1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      pito:
		[ 1,   null, null, null,  1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      cajon:
        [ 1,   null, null, null,  1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      nudillo:
        [ 1,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      udu:
        [ 1,   null, null, null,  1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      click:
        [ 1,   null, null, null,  null, null, 2,   null, null, null, null, null,  2,   null, null, null, null, null,  2,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      beatLabels:
        [ 1,   null,  2,   null,  3,   null,  4,   null,  5,   null,  6,   null,  7,   null,  8,   null,  9,   null,  10,  null,  11,  null,  12,  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '12' },
      { value: 2, label: '11' },
      { value: 3, label: '10' },
      { value: 4, label: '9' },
      { value: 5, label: '8' },
      { value: 6, label: '7' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: '6/8 Clave -> Bell',
    doc: '',
    places: '',
    videoExample: ''
  },
  {
    id: 4,
    label: 'Flamenco',
    name: 'flamenco',
    minTempo: 60,
    maxTempo: 400,
    defaultTempo: 160,
    slowTempo: 60,
    fastTempo: 400,
    nbBeatsInPattern: 24,
    accents: [4, 10, 14, 18, 22],
    sequences: {
      clara: //<[number, ...(number | null)[]]>
        [ null, null, null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      sorda:
        [ null, null, null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      pito:
		[ null, null, null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      cajon:
        [ null, null, null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      nudillo:
        [ 1,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null,  2,   null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      udu:
        [ null, null, null, null, 1,   null, null, null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null, null, null,  1,   null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12

      click:
        [ 1,   null, null, null,  null, null, 2,   null, null, null, null, null,  2,   null, null, null, null, null,  2,   null, null, null, null, null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
      beatLabels:
        [ 1,   null,  2,   null,  3,   null,  4,   null,  5,   null,  6,   null,  7,   null,  8,   null,  9,   null,  10,  null,  11,  null,  12,  null ],
      //  0     1     2     3     4     5     6     7     8     9     10    11    12    13    14    15    16    17    18    19    20    21    22    23
      //  1           2           3           4           5           6           7           8           9           10          11          12
    },
    prestartBeats: [
      { value: 0, label: 'Off' },
      { value: 1, label: '12' },
      { value: 2, label: '11' },
      { value: 3, label: '10' },
      { value: 4, label: '9' },
      { value: 5, label: '8' },
      { value: 6, label: '7' },
    ],
    slowMessage: '',
    fastMessage: '',
    longLabel: 'Flamenco',
    doc: '',
    places: '',
    videoExample: ''
  }
] as PatternState[]
