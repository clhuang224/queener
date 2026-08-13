import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ReplayPanel from './ReplayPanel.vue'
import { ActionType } from '@/modules/enums/ActionType'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'

const mountReplayPanel = (replayRunTimeMs: number) => {
  return mount(ReplayPanel, {
    props: {
      replayData: {
        level: 1,
        puzzle: {
          id: 'test-puzzle',
          rules: {
            size: 2,
            allowDisconnectedRegions: false,
            queensPerUnit: 1,
          },
          regions: [
            [0, 0],
            [1, 1],
          ],
          queens: [
            [0, 0],
            [1, 1],
          ],
        },
        puzzleVariantMetadata: {
          direction: 0,
          regionMap: {
            0: 0,
            1: 1,
          },
        },
        record: [
          {
            action: ActionType.MARK_QUEEN,
            actionAtMillisecond: 6500,
            position: [0, 0],
          },
        ],
      },
      replayRunTimeMs,
      queenSkin: QueenSkinType.PINK_CROWN,
      boardSkin: BoardSkinType.LAKE,
      boardTextureEnabled: false,
    },
    global: {
      stubs: ['GameRunReplayBoard'],
    },
  })
}

describe('ReplayPanel', () => {
  it('shows the current replay time and total duration', async () => {
    const wrapper = mountReplayPanel(1234)

    expect(wrapper.findAll('.replay-time').map((time) => time.text())).toEqual([
      '00:01.234',
      '00:06.500',
    ])

    await wrapper.setProps({ replayRunTimeMs: 8000 })

    expect(wrapper.findAll('.replay-time').map((time) => time.text())).toEqual([
      '00:06.500',
      '00:06.500',
    ])
  })

  it('emits skip from the replay control', async () => {
    const wrapper = mountReplayPanel(1234)

    await wrapper.get('button[aria-label="Skip replay"]').trigger('click')

    expect(wrapper.emitted('skip')).toHaveLength(1)
  })
})
