export {}

declare global {
  interface Window {
    UC_UI_SUPPRESS_CMP_DISPLAY: boolean,
    UC_UI: {
      acceptAllConsents(): Promise<any>,
      denyAllConsents(): Promise<any>
    }
  }
}
