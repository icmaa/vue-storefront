
export default interface State {
  registeredMethods: string[],
  methodsFactories: {
    [code: string]: () => Promise<any>
  }
}
