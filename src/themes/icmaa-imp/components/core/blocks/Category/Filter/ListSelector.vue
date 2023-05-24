<template>
  <ul>
    <li v-if="searchable">
      <base-input
        v-model="filterString"
        :placeholder="$t('Filter {label}', { label: attributeLabel }) + ' ...'"
        icon="search"
      />
    </li>
    <li
      v-for="(option, index) in filteredOptions"
      :key="index"
      class="t-border-b t-border-base-lighter t-px-2 t-py-3"
    >
      <router-link
        v-if="useLinks"
        :to="localizedRoute(option.url_path)"
        :aria-label="option.label"
        class="t-flex t-w-full t-items-center t-justify-between t-text-sm"
        @click.native="$store.dispatch('ui/closeAll')"
      >
        {{ option.label }}
      </router-link>
      <button
        v-else
        :aria-label="option.label"
        class="t-flex t-w-full t-items-center t-justify-between t-text-sm"
        @click="$emit('change', option)"
      >
        {{ option.label }}
        <material-icon
          v-if="isActiveOption(option)"
          icon="check"
          class="t-leading-1-rem"
        />
      </button>
    </li>
    <li
      v-if="filteredOptions.length === 0"
      class="t-px-2 t-py-3 t-text-sm t-text-base-light"
    >
      {{ $t('No results found') }}
    </li>
  </ul>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'

export default {
  name: 'ListSelector',
  components: {
    BaseInput,
    MaterialIcon
  },
  mixins: [ filterMixin ],
  props: {
    options: {
      type: Array,
      required: true
    },
    attributeKey: {
      type: String,
      default: ''
    },
    attributeLabel: {
      type: String,
      default: ''
    },
    searchable: {
      type: Boolean,
      default: false
    },
    useLinks: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterString: '',
      filteredOptions: this.options
    }
  },
  watch: {
    filterString (s) {
      if (s.length >= 3) {
        const regex = RegExp(s, 'i')
        this.filteredOptions = this.options.filter(f => regex.test(f.label) || this.isActiveOption(f))
      } else {
        this.filteredOptions = this.options
      }
    }
  }
}
</script>
