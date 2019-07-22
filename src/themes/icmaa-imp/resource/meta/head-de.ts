import { mergeWithDefaults } from 'src/modules/icmaa-meta/helper'
import defaults from './head'

export default mergeWithDefaults(
  defaults,
  {
    // Add vue-meta typed overwrites here …
    // See more information in src/modules/icmaa-meta/README.md
  }
)
