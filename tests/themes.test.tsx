import { expect, test } from 'claude-code/testing'
import type { CommandRunInput } from 'claude-code'

const run = (args: string) => ({ command: 'themes', args }) as unknown as CommandRunInput

const PICKER = {
  plugin: 'themes',
  component: 'Pane',
  requestId: 'theme-picker',
  props: {
    title: 'Themes',
    isFocused: false,
    bodyColumns: 40,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

test('a saved theme comes back, /themes switches and saves, the picker marks it', async ($, on) => {
  const store = new Map<string, unknown>([['current', 'abyss']])
  const painted: string[] = []

  on('command.register', () => ({ value: { command: 'themes' } }))
  on('clock.every', () => ({ value: undefined }))
  on('store.get', (_, e) => ({ value: store.get(e.key) }))
  on('store.set', (_, e) => {
    store.set(e.key, e.value)

    return { value: undefined }
  })
  on('theme.set', (_, e) => {
    const backdrop = e.backdrop as { scene?: string } | undefined
    painted.push(backdrop?.scene ?? '?')

    return { value: { isDrawn: true as const, requestId: 'r' } }
  })
  on('theme.clear', () => {
    painted.push('off')

    return { value: { isDrawn: true as const, requestId: 'r' } }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('ui.status', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.attach', (_, e) => ({ clientId: e.clientId }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(painted).toEqual(['abyss'])

  // The window attaches after the chat starts: the theme is painted again.
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  expect(painted).toEqual(['abyss', 'abyss'])

  const switched = await $.command.run(run('Sakura'))
  expect(switched.text).toBe('Theme: Sakura')
  expect(store.get('current')).toBe('sakura')

  const cycled = await $.command.run(run('next'))
  expect(cycled.text).toBe('Theme: Aurora')
  expect(painted).toEqual(['abyss', 'abyss', 'sakura', 'aurora'])

  for (const id of ['firefly', 'dunes', 'phosphor', 'off']) {
    await $.command.run(run(id))
    expect(store.get('current')).toBe(id)
  }
  expect(painted.slice(-4)).toEqual(['firefly', 'dunes', 'phosphor', 'off'])

  const unknown = await $.command.run(run('vaporwave'))
  expect(unknown.text).toMatch(/No theme named "vaporwave"/)

  await $.command.run(run('cyberpunk'))
  const ui = await $.ui.mount({ ...PICKER, surface: 'desktop' })
  const mark = await ui.find({ type: 'Button', key: 'pick-cyberpunk' })
  expect(mark?.text).toMatch(/Cyberpunk ✓/)
  await ui.unmount()

  // The bar above the message box: one click switches, Hide hides it for good.
  const BAR = {
    plugin: 'themes',
    component: 'AbovePrompt',
    props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, bodyColumns: 100, scroll: { offset: 0, bodyRows: 10 }, view: {} },
  } as const
  const bar = await $.ui.mount({ ...BAR, surface: 'desktop' })
  expect((await bar.find({ type: 'Button', key: 'bar-abyss' }))?.text).toMatch(/Abyss/)
  await bar.press({ key: 'bar-abyss' })
  expect(store.get('current')).toBe('abyss')
  expect(painted.at(-1)).toBe('abyss')

  await bar.press({ key: 'bar-hide' })
  expect(store.get('barHidden')).toBe(true)
  expect(await bar.find({ type: 'Button', key: 'bar-abyss' })).toBeUndefined()
  await bar.unmount()

  const shown = await $.command.run(run('bar'))
  expect(shown.text).toMatch(/shown/)
  expect(store.get('barHidden')).toBe(false)
})
