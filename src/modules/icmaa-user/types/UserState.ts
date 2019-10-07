import { UserProfile as OrgUserProfile } from '@vue-storefront/core/modules/user/types/UserProfile'

export default interface UserProfile extends OrgUserProfile {
  customer: OrgUserProfile['customer'] & {
    cluster: false
  }
}
