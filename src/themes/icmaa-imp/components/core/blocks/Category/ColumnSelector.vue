<template>
  <div class="columns">
    <select
      v-model="column"
      name="column"
      class="cl-secondary"
      @change="changeColumn"
    >
      <option
        v-for="(option) in productsColumns"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'ColumnSelector',
  props: {
    defaultColumn: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      column: this.defaultColumn,
      productsColumns: [3, 4, 6]
    }
  },
  methods: {
    changeColumn () {
      this.$emit('change-column', this.column)
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '~theme/css/base/text';
    @import '~theme/css/variables/colors';
    @import '~theme/css/helpers/functions/color';
    $color-tertiary: color(tertiary);
    .columns {
        display: inline-flex;
        position: relative;
        border-bottom: 1px solid $color-tertiary;
        select {
            @extend .h4;
            font-size: 14px;
            border: none;
            width: 100%;
            border-radius: 0;
            background-color: transparent;
            margin-right: 0;
            &:focus {
                outline: none;
            }
        }
        &__icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
    @media (max-width: 770px) {
      .columns {
        width: 100%;
      }
    }
</style>
