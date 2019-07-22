import { mergeWithDefaults } from 'src/modules/icmaa-meta/helper'
import defaults from './head'

export default mergeWithDefaults(
  defaults,
  {
    // Add vue-meta typed overwrites here …
    //
    // If you like to update nested array values like in "meta" or "script" use the following syntax:
    // add: [
    //   {
    //     type: 'meta',
    //     data: { name: 'lorem-ipsum', content: 'Lorem ispum sit dolor.' }
    //   }
    // ],
    // update: [
    //   {
    //     type: 'meta',
    //     find: { name: 'description' },
    //     data: { vmid: 'description', name: 'description', content: 'Other description' }
    //   }
    // ],
    // remove: [
    //   {
    //     type: 'meta',
    //     find: { charset: 'utf-8' }
    //   }
    // ]
  }
)
