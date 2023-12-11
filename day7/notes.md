### ground rules:

hand = 5 cards\
each hand contains any of these cards:\
`A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2`\
strength is heighest to lowest

### hand types:

five of a kind: AAAAA
four of a kind: AA8AA
full house: 23332 - 3 of the same and 2 of the same, but 3 and 2 are different from each other
three of a kind: TTT98 - 3 of the same, and the other 2 are unique
two pair: 22334 - 2 same, 2 same, and 1, each group unique
1 pair: A23A4 - 2 same, 3 unique
high card: 5 unique

**note:**\
the strength of a hand is based on the overall type. not the sum of the indiviual cards.

### hand type tie ruling:

if a hand type is the same, compare the cards starting at 0. increment to 5 until one is considered stronger.
