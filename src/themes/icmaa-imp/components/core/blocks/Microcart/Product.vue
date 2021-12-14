<template>
  <li class="t-flex t-py-2 t-border-b t-border-base-lightest" :class="{ 't-opacity-75': loading }" data-test-id="MicroCartProduct">
    <div class="t-w-1/3 t-mr-4">
      <router-link :to="productLink" @click.native="$store.dispatch('ui/setSidebar', { key: 'microcart', status: false })">
        <product-image :image="thumbnail" :alt="product.name | htmlDecode" />
      </router-link>
    </div>

    <div class="t-w-2/3 t-flex t-flex-col t-py-2">
      <div class="t-mb-4 t-leading-tight">
        <router-link class="t-text-primary t-text-sm" :to="productLink" data-test-id="productLink" @click.native="$store.dispatch('ui/setSidebar', { key: 'microcart', status: false })">
          {{ translatedProductName | htmlDecode }}
        </router-link>
      </div>

      <div class="t-flex-grow">
        <div class="t-flex t-w-full t-flex-wrap t-items-center t-mb-2" v-if="totals.length > 0 || isFree">
          <button-component class="t-mr-2 t-mb-2" type="tag" size="xs" :cursor-pointer="false" v-for="opt in totals" :key="opt.label">
            {{ opt.value }}
          </button-component>
          <div class="t-text-xs t-text-sale t-font-bold t-uppercase t-mb-2" v-if="isFree">
            {{ $t('Free') }}
          </div>
        </div>

        <div class="t-text-sm" v-if="hasProductErrors">
          {{ product.errors | formatProductMessages }}
        </div>
      </div>

      <product-price :product="product" class="t-w-full t-mb-4" />

      <div class="t-flex t-items-center t-flex-wrap t-justify-between t-text-base-light" v-if="!isFree">
        <div class="t-flex t-items-center">
          <base-select
            class="t-w-16 t-text-base-tone"
            size="sm"
            name="qty"
            :id="`qty-${product.id}`"
            :options="qtyOptions"
            :value="productQty"
            :disabled="loading || isAddingToCart"
            :loading="loading || isAddingToCart"
            :hide-label="true"
            @change="updateQty"
            v-if="!isFree"
          />
          <label :for="`#qty-${product.id}`" class="t-ml-2 t-text-sm t-text-base-tone">{{ $t('Pcs.') }}</label>
        </div>
        <button-component type="transparent" :size="'sm'" :icon="'remove_shopping_cart'" :icon-only="true" @click="removeItem">
          {{ $t('Delete') }}
        </button-component>
      </div>
    </div>
  </li>
</template>

<script>

import i18n from '@vue-storefront/i18n'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import ProductMixin from 'theme/mixins/cart/productMixin'
import ProductPrice from 'theme/components/core/blocks/Microcart/Product/Price'
import ProductImage from 'theme/components/core/ProductImage'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MicroCartProduct',
  components: {
    ButtonComponent,
    BaseSelect,
    ProductImage,
    ProductPrice
  },
  mixins: [ ProductMixin ],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async updateQty (qty) {
      this.loading = true
      return this.$store.dispatch('cart/updateQuantity', { product: this.product, qty })
        .then((diffLog) => {
          diffLog.clientNotifications.forEach(notification => {
            if (notification.type === 'error') {
              this.notifyUser(notification)
            }
          })

          this.loading = false
        })
    },
    removeItem () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        item: this.product,
        message: i18n.t('Are you sure you would like to remove this item from the shopping cart?'),
        action2: { label: i18n.t('OK'), action: this.removeFromCart },
        action1: { label: i18n.t('Cancel'), action: 'close' },
        hasNoTimeout: true
      })
    },
    async removeFromCart () {
      await this.$store.dispatch('cart/removeItem', { product: this.product })
      IcmaaGoogleTagManagerExecutors.removeProductFromCart({ product: this.product })
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData)
    }
  }
}
</script>
