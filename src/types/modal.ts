export interface ModalAction {
  label: string
  payload: unknown
  settle?: 'resolve' | 'reject'
}
