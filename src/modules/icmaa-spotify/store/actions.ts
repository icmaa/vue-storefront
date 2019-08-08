import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState';
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import SpotifyState from '../types/SpotifyState'
import * as mutationTypes from './mutation-types'
import { cacheStorage as cache, storageKey } from '../'
import { isCategoryInWhitelist } from '../helpers'
import Axios from 'axios'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<SpotifyState, RootState> = {
  async fetchRelatedArtist (context, category: Category): Promise<any> {
    if (!isCategoryInWhitelist(category)) {
      Logger.log('Not a child of parent category whitelist', 'icmaaSpotify')()
      return
    }

    const { id, name } = category
    const { endpoint } = config.icmaa_spotify
    const state = context.state

    const cacheKey = storageKey + '/' + id

    if (!state.relatedArtists || Object.keys(state.relatedArtists).length === 0 || !state.relatedArtists[id]) {
      if (await cache.getItem(cacheKey).then(item => item !== null)) {
        return cache.getItem(cacheKey).then(result => {
          context.commit(mutationTypes.ICMAA_SPOTIFY_RELATEDARTIST_ADD, result)
          return result
        })
      }

      const apiUrl = endpoint + '/related-artists/' + encodeURIComponent(name)
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
        let result = state.relatedArtists[id]
        if (result) {
          cache.setItem(cacheKey, result)
            .catch(error => Logger.error(error, 'icmaa-spotify'))
          resolve(result)
        } else {
          reject('Error while fetching state for ' + name)
        }
      })
    }
  }
}

export default actions
