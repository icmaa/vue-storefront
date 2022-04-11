export {}

declare global {
  interface Window {
    UC_UI: {
      acceptAllConsents(): Promise<any>
    }
  }
}
