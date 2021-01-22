import OrgUserState from '@vue-storefront/core/modules/user/types/UserState'

export default interface UserState extends OrgUserState {
  sessionData: {
    cluster?: number|string,
    gender?: number|string,
    [key: string]: any
  }
}
