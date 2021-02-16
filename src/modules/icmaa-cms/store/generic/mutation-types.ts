export default (stateKey: string) => {
  stateKey = stateKey.toUpperCase()
  return {
    [`${stateKey}_ADD`]: `ADD`,
    [`${stateKey}_UPD`]: `UPD`,
    [`${stateKey}_RMV`]: `RMV`
  }
}
