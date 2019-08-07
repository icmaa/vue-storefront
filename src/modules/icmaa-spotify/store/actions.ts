import { ActionTree } from 'vuex'
import rootStore from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState';
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import SpotifyState, { RelatedArtistsStateListItem } from '../types/SpotifyState'
import * as mutationTypes from './mutation-types'
import { cacheStorage as cache, storageKey } from '../'

import Axios from 'axios'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<SpotifyState, RootState> = {
  async fetchRelatedArtist (context, category: Category): Promise<any> {
    const { id, name } = category
    const state = context.state

    const cacheKey = storageKey + '/' + id

    if (!state.relatedArtists || state.relatedArtists.length === 0 || !state.relatedArtists.find(itm => itm.categoryId === id)) {
      if (await cache.getItem(cacheKey).then(item => item !== null)) {
        return cache.getItem(cacheKey).then(result => {
          context.commit(mutationTypes.ICMAA_SPOTIFY_RELATEDARTIST_ADD, result)
          return result
        })
      }

      const apiUrl = config.icmaa_spotify.endpoint + '/related-bands/' + encodeURIComponent(name)
      const relatedArtists = await Axios.get(processURLAddress(apiUrl))
        .then(resp => resp.data.result)
        .catch(() => [])

      if (relatedArtists.length > 0) {
        const result = { categoryId: id, relatedArtists }
        context.commit(mutationTypes.ICMAA_SPOTIFY_RELATEDARTIST_ADD, result)
        cache.setItem(cacheKey, result)
          .catch(error => Logger.error(error, 'icmaa-spotify'))
      }
    } else {
      return new Promise((resolve, reject) => {
        let result = state.relatedArtists.find(itm => itm.categoryId === id)
        if (result) {
          cache.setItem(cacheKey, result)
            .catch(error => Logger.error(error, 'icmaa-spotify'))

          resolve(result)
        } else {
          reject(new Error('Error while fetching state for ' + name))
        }
      })
    }
  }
}

export default actions
