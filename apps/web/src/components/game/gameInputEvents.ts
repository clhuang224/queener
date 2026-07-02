import type { Position } from '@/modules/types/board'

export type CellPressIntent =
  | 'pressStart'
  | 'pressEnter'
  | 'pressClick'
  | 'pressDoubleClick'
  | 'pressEnd'

export type CellFocusDirection = 'up' | 'down' | 'left' | 'right'

export const CELL_INPUT_EVENT_NAMES = [
  'pressStart',
  'pressEnter',
  'pressClick',
  'pressDoubleClick',
  'pressEnd',
  'moveFocus',
]

export type CellInputEmit = {
  (event: CellPressIntent, position: Position): void
  (event: 'moveFocus', position: Position, direction: CellFocusDirection): void
}
