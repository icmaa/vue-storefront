import { ActionTree } from 'vuex'
import { list as listAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'
import { Logger } from '@vue-storefront/core/lib/logger'

import { stateKey } from './'
import * as types from './mutation-types'
import SearchAliasState, { SearchAliasStateItem } from '../../types/SearchAliasState'
import RootState from '@vue-storefront/core/types/RootState'

const documentType = 'search-alias'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_SEARCHALIAS_ADD,
  upd: types.ICMAA_SEARCHALIAS_UPD,
  rmv: types.ICMAA_SEARCHALIAS_RMV
}

const actions: ActionTree<SearchAliasState, RootState> = {
  list: async (context, params: { words: string[], translate: boolean }): Promise<SearchAliasStateItem[]> => {
    let options: string | object = params.words.join(',').toLowerCase()
    if (params.translate === true) {
      options = {
        'i18n_identifier': { 'in': params.words.join(',').toLowerCase() }
      }
    }

    return listAbstract<SearchAliasStateItem>({
      documentType,
      mutationTypes,
      stateKey,
      context,
      options
    })
  },
  getAliasesBySearchString: async ({ dispatch, getters }, { searchString }): Promise<string> => {
    let wordResult
    let replaces: any = []

    const wordsRegexp = /([^\s_\-."']+)/giu
    const words = searchString.match(wordsRegexp)

    await dispatch('list', { words, translate: true })
    let alias: any = getters.getMap

    while ((wordResult = wordsRegexp.exec(searchString)) !== null) {
      const word = wordResult[0]
      const aliasKey = Object.keys(alias).find(k => RegExp(`^${word}$`, 'giu').test(k))
      if (aliasKey) {
        const replace = alias[aliasKey]
        replaces.push({ word, replace })
      }
    }

    replaces.forEach(r => {
      searchString = searchString.replace(RegExp(r.word, 'i'), r.replace)
    })

    Logger.error('Search for:', 'search', searchString)()

    return searchString
  },
  setCurrentTerm: ({ commit }, term: string) => {
    commit(types.ICMAA_SEARCHALIAS_SET_CURRENT_TERM, term)
  },
  setCurrentResultAlias: async ({ dispatch, commit }, searchString: string) => {
    const alias = await dispatch('getAliasesBySearchString', { searchString })
    commit(types.ICMAA_SEARCHALIAS_SET_CURRENT_RESULT_ALIAS, alias)
  }
}

export default actions
