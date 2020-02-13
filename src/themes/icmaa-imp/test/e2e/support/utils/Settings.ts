class SettingsClass {
  public get availableStoreViews (): string[] {
    return Cypress.env('store_codes')
  }
}

export default new SettingsClass()
