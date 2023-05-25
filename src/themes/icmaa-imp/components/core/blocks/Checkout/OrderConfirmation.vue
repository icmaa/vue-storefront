<template>
  <Modal
    name="modal-order-confirmation"
    :width="640"
  >
    <p slot="header">
      {{ $t('Confirm your order') }}
    </p>
    <div slot="content">
      <p>{{ $t('Please confirm order you placed when you was offline') }}</p>
      <div
        v-for="(order, key) in ordersData"
        :key="key"
        class="mb40"
      >
        <h3>{{ $t('Order #{id}', { id: key + 1}) }}</h3>
        <h4>{{ $t('Items ordered') }}</h4>
        <table class="brdr-1 brdr-cl-bg-secondary">
          <thead>
            <tr>
              <th class="serif lh20">
                {{ $t('Product Name') }}
              </th>
              <th class="serif lh20">
                {{ $t('Price') }}
              </th>
              <th class="serif lh20">
                {{ $t('Qty') }}
              </th>
              <th class="serif lh20">
                {{ $t('Subtotal') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, productKey) in order.products"
              :key="productKey"
              class="brdr-top-1 brdr-cl-bg-secondary"
            >
              <td
                class="fs-medium lh25"
                :data-th="$t('Product Name')"
              >
                {{ product.name }}
                <span
                  v-for="(option, optionKey) in product.options"
                  :key="optionKey"
                  class="block mt5 lh16 fs-medium-small"
                >
                  <strong>{{ option.label }}: </strong> {{ option.value }}
                </span>
              </td>
              <td
                class="fs-medium lh25"
                :data-th="$t('Price')"
              >
                {{ product.price_incl_tax | price }}
              </td>
              <td
                class="fs-medium lh25 align-right"
                :data-th="$t('Qty')"
              >
                {{ product.qty }}
              </td>
              <td
                class="fs-medium lh25"
                :data-th="$t('Subtotal')"
              >
                {{ product.price_incl_tax * product.qty | price }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row between-xs middle-xs mt40">
        <div class="col-xs-12 col-sm-6 cancel-order">
          <a
            href="#"
            @click.prevent="cancelOrders()"
          >{{ $t('Cancel') }}</a>
        </div>
        <div class="col-xs-12 col-sm-6">
          <ButtonComponent @click="confirmOrders()">
            {{ $t('Confirm your order') }}
          </ButtonComponent>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from 'theme/components/core/Modal'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    Modal,
    ButtonComponent
  },
  props: {
    ordersData: {
      required: false,
      type: Array,
      default: () => []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('ui/showModal', 'modal-order-confirmation')
    })
  }
}
</script>
