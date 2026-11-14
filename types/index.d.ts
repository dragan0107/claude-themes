declare module 'claude-code' {
  interface PluginState {
    themes: {
      /** The id of the theme this session shows, or 'off' for the app's own look. */
      current: string
      /** Whether the theme bar above the message box is hidden. */
      barHidden: boolean
    }
  }
}

