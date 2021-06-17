export interface Apm {
  id: string,
  title: string
}
export interface CardState {
  token?: string,
  isValid: boolean,
  infoComponent: any
}

export interface ApmState {
  infoComponent: any,
  apmList: Apm[],
  apmMap: any,
  loading: boolean,
  selected: {
    apm: Apm,
    data: any
  },
  errorMsg?: string
}
