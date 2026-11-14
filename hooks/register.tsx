import type { EngineInterface, Register } from 'claude-code'

import { THEMES, findTheme, lookFor } from './themes.js'

const PANE = 'theme-picker'
const OFF = 'off'
const DEFAULT = 'cyberpunk'
const CURRENT = { plugin: 'themes', key: 'current' } as const
const BAR_HIDDEN = { plugin: 'themes', key: 'barHidden' } as const

const nameOf = (id: string): string => findTheme(id)?.name ?? 'App default'

const why = (err: unknown): string => (err instanceof Error ? err.message : String(err))

/**
 * Paints a theme in this session, without saving it, and says why when the
 * app did not draw it. The bar's selection moves first, so a paint that fails
 * never leaves the bar stuck on the old theme.
 */
const paint = async ($: EngineInterface, id: string): Promise<string | undefined> => {
  const theme = findTheme(id)

  await $.state.set(CURRENT, theme?.id ?? OFF)
  $.ui.status(undefined)

  if (theme === undefined) {
    await $.theme.clear()

    return undefined
  }
  const { look, unpainted } = lookFor(theme)

  if (unpainted !== undefined) {
    $.ui.toast(unpainted)
  }
  // Before the window attaches this reports isDrawn: false, yet the theme
  // stands and is drawn on attach (and session.attach repaints it anyway).
  const result = await $.theme.set(look)

  return result.isDrawn ? undefined : result.reason
}

/** Paints a theme and saves it, so every chat (open or new) follows. */
const choose = async ($: EngineInterface, id: string): Promise<void> => {
  try {
    await $.store.set('current', id)
  } catch (err) {
    $.ui.toast(`Themes: couldn't save your choice (${why(err)})`)
  }
  try {
    const notDrawn = await paint($, id)

    $.ui.toast(notDrawn === undefined ? `Theme: ${nameOf(id)}` : `Theme: ${nameOf(id)}, but the app didn't draw it: ${notDrawn}`)
  } catch (err) {
    $.ui.toast(`Themes: couldn't apply ${nameOf(id)} (${why(err)})`)
  }
}

const saved = async ($: EngineInterface): Promise<string> => {
  const value = await $.store.get('current')

  return typeof value === 'string' && (value === OFF || findTheme(value)) ? value : DEFAULT
}

/** Shows or hides the theme bar, remembered for every chat. */
const setBar = async ($: EngineInterface, isHidden: boolean): Promise<void> => {
  await $.store.set('barHidden', isHidden)
  await $.state.set(BAR_HIDDEN, isHidden)

  if (isHidden) {
    $.ui.toast('Theme bar hidden. Type /themes bar to bring it back.')
  }
}

const usage = [
  'Themes: ' + [...THEMES.map(t => t.id), OFF].join(', '),
  '/themes opens the picker, /themes <name> switches, /themes next cycles, /themes off restores the app look, /themes bar shows or hides the theme bar.',
].join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'themes',
      description: 'Pick an animated theme, or switch with /themes <name>',
      argumentHint: '[name|next|off|bar]',
    })
    await paint($, await saved($))
    await $.state.set(BAR_HIDDEN, (await $.store.get('barHidden')) === true)

    // Another chat switched the theme: follow it here too.
    $.clock.every(3000, () => {
      void (async () => {
        const want = await saved($)
        const { value } = await $.state.get(CURRENT)

        if (want !== value) {
          await paint($, want)
        }
      })()
    })

    return next(e)
  })

  // A new chat starts before its window attaches: paint again once it does.
  on('session.attach', async ($, e, next) => {
    const attached = await next(e)

    if (e.surface === 'desktop' || e.surface === 'mobile') {
      await paint($, await saved($))
    }

    return attached
  })

  on('command.run', { command: 'themes' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()

    if (arg === '' || arg === 'pick' || arg === 'list') {
      const { isPlaced } = await $.ui.open({ id: PANE, title: 'Themes', focus: true })

      return { text: isPlaced ? 'Theme picker opened.' : usage }
    }
    if (arg === 'bar') {
      const { value: isBarHidden = false } = await $.state.get(BAR_HIDDEN)
      await setBar($, !isBarHidden)

      return { text: isBarHidden ? 'Theme bar shown above the message box.' : 'Theme bar hidden. /themes bar brings it back.' }
    }
    if (arg === 'next') {
      const ids = [...THEMES.map(t => t.id), OFF]
      const { value = DEFAULT } = await $.state.get(CURRENT)
      const id = ids[(ids.indexOf(value) + 1) % ids.length] ?? DEFAULT
      await choose($, id)

      return { text: `Theme: ${nameOf(id)}` }
    }
    if (arg === OFF || arg === 'default' || arg === 'none') {
      await choose($, OFF)

      return { text: 'Theme off: back to the app look.' }
    }
    const theme = findTheme(arg)

    if (theme === undefined) {
      return { text: `No theme named "${arg}".\n${usage}` }
    }
    await choose($, theme.id)

    return { text: `Theme: ${theme.name}` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const { value: current = DEFAULT } = await $.state.get(CURRENT)

    return (
      <Box flexDirection="column" gap={1}>
        <Text dimColor>Pick a look. It applies to every chat and is remembered.</Text>
        {THEMES.map(t => (
          <Box key={t.id} flexDirection="column">
            <Button
              key={`pick-${t.id}`}
              variant={t.id === current ? 'primary' : 'secondary'}
              onPress={() => void choose($, t.id)}
            >
              <Text color={t.swatch[0]}>■</Text>
              <Text color={t.swatch[1]}>■</Text>
              <Text color={t.swatch[2]}>■</Text> {t.name}
              {t.id === current ? ' ✓' : ''}
            </Button>
            <Text dimColor>{t.blurb}</Text>
          </Box>
        ))}
        <Button
          key="pick-off"
          variant={current === OFF ? 'primary' : 'secondary'}
          onPress={() => void choose($, OFF)}
        >
          {current === OFF ? 'App default ✓' : 'App default'}
        </Button>
        <Text dimColor>Tip: /themes next cycles, /themes sakura jumps straight there.</Text>
      </Box>
    )
  })

  // One-click switcher in the band above the message box.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const { value: isBarHidden = false } = await $.state.get(BAR_HIDDEN)

    if (isBarHidden || e.props.hasSurvey) {
      return next(e)
    }
    const { Box, Text, Button } = $.ui.resolve(e)
    const { value: current = DEFAULT } = await $.state.get(CURRENT)

    return (
      <Box flexDirection="row" flexWrap="wrap" columnGap={1}>
        <Text dimColor>Theme</Text>
        {THEMES.map(t => (
          <Button
            key={`bar-${t.id}`}
            variant={t.id === current ? 'primary' : 'secondary'}
            onPress={() => void choose($, t.id)}
          >
            <Text color={t.swatch[0]}>●</Text> {t.name}
          </Button>
        ))}
        <Button key="bar-off" variant={current === OFF ? 'primary' : 'secondary'} onPress={() => void choose($, OFF)}>
          Off
        </Button>
        <Button key="bar-hide" dimColor plain label="Hide" onPress={() => void setBar($, true)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const theme = findTheme(e.props.scene)

    if (theme === undefined || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={theme.scene} alt={theme.sceneAlt} isInteractive />
  })
}
