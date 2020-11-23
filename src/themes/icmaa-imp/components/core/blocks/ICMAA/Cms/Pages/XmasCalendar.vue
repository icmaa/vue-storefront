<template>
  <div class="xmas-calendar t-container">
    <div class="lg:t-p-4">
      <div class="wrapper t-p-4">
        <div class="t-grid t-grid-cols-2 sm:t-grid-cols-6 t-gap-4">
          <template v-for="(day, i) in daysOrdered">
            <div v-if="day === 'title'" :key="'title-' + i" class="t-col-span-2 sm:t-order-none t-flex t-items-center t-justify-center">
              <picture-component
                class="t-w-full"
                :src="`${imgPath}/${title.imagePath}`"
                :title="title.title"
                :placeholder="true"
                :width="getSizeBySpan(2)"
                :height="getSizeBySpan(1)"
                :sizes="getSizes(2)"
                ratio="2:1"
              />
            </div>
            <div v-else-if="day === 'ad'" :key="'ad-' + i" class="t-col-span-2 t-row-span-2 t-flex t-items-center t-justify-center">
              <router-link :to="localizedRoute(ad.link)" :title="ad.title" class="t-w-full">
                <picture-component
                  class="t-w-full"
                  :src="ad.imagePath"
                  :alt="ad.title"
                  :placeholder="true"
                  :width="getSizeBySpan(2)"
                  :height="getSizeBySpan(2)"
                  :sizes="getSizes(2)"
                  ratio="1:1"
                />
              </router-link>
            </div>
            <div
              v-else
              :key="day.int + '-' + i"
              :class="{
                [`t-col-span-${day.colSpan}`]: day.colSpan > 1,
                [`t-row-span-${day.rowSpan}`]: day.rowSpan > 1,
                't-cursor-pointer': day.status === 'open',
                '': day.status === 'closed',
                '': day.status === 'done'
              }"
              class="t-flex t-items-center t-justify-center"
            >
              <router-link :to="localizedRoute(day.link)" class="t-w-full" v-if="day.status === 'open'">
                <picture-component
                  class="t-w-full"
                  :src="`${imgPath}/opened/${day.imagePath}`"
                  :alt="`Door # ${day.int}`"
                  :placeholder="true"
                  :width="day.width"
                  :height="day.height"
                  :sizes="day.sizes"
                  :ratio="`${day.colSpan}:${day.rowSpan}`"
                />
              </router-link>
              <template v-else-if="day.status === 'done'">
                <picture-component
                  class="t-w-full t-opacity-75"
                  style="filter: grayscale(1)"
                  :src="`${imgPath}/opened/${day.imagePath}`"
                  :alt="`Door # ${day.int}`"
                  :placeholder="true"
                  :width="day.width"
                  :height="day.height"
                  :sizes="day.sizes"
                  :ratio="`${day.colSpan}:${day.rowSpan}`"
                />
              </template>
              <template v-else>
                <picture-component
                  class="t-w-full"
                  :src="`${imgPath}/closed/${day.prefixInt}.jpg`"
                  :alt="`Door # ${day.int}`"
                  :placeholder="true"
                  :width="day.width"
                  :height="day.height"
                  :sizes="day.sizes"
                  :ratio="`${day.colSpan}:${day.rowSpan}`"
                />
              </template>
            </div>
          </template>
        </div>
        <div class="t-mt-4 t-grid t-grid-cols-4 sm:t-grid-cols-9 t-gap-4" v-if="sponsoreLogos && sponsoreLogos.length > 0">
          <div class="t-col-span-2 sm:t-col-span-9 t-flex t-font-bold t-italic t-items-center t-text-white sm:t-pt-4 sm:t-pl-4">
            Sponsored by
          </div>
          <div v-for="(logo, i) in sponsoreLogos" :key="`logo-${i}`" class="t-flex t-items-center t-justify-center">
            <picture-component
              :img-full-size="false"
              :src="`${imgPath}/logos/${logo.imagePath}`"
              :alt="logo.title"
              :placeholder="true"
              :width="80"
              :height="50"
              :sizes="[ { media: '(min-width: 0px)', width: 80 } ]"
              ratio="8:5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Page from 'icmaa-cms/mixins/Page'
import PictureComponent from 'theme/components/core/blocks/Picture'

import { mapGetters } from 'vuex'
import { toDayjsDate, getCurrentStoreviewDayjsDatetime } from 'icmaa-config/helpers/datetime'

export default {
  name: 'XmasCalendar',
  mixins: [ Page ],
  components: {
    PictureComponent
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport'
    }),
    currentDate () {
      return getCurrentStoreviewDayjsDatetime()
    },
    startDate () {
      return toDayjsDate(this.content.startDay + ' 00:00')
    },
    endDate () {
      return this.startDate.add(this.content.days.length - 1, 'day')
    },
    daysOrder () {
      if (['xs', 'sm'].includes(this.viewport)) {
        return [].concat(...this.content.orderMobile || [])
      }
      return [].concat(...this.content.orderDesktop || [])
    },
    daysOrdered () {
      return this.daysOrder.map(d => this.days.find(day => day.int === d) || d)
    },
    days () {
      const currDate = this.currentDate
      const startDate = this.startDate
      const endDate = this.endDate

      const dayDefaults = {
        int: 0,
        imagePath: '',
        link: '',
        colSpan: 1,
        rowSpan: 1,
        stay: false
      }

      return this.content.days
        .map((d, i) => {
          const { int, link, imagePath, colSpan, rowSpan, stay } = Object.assign({}, dayDefaults, d)
          const dayDate = startDate.add(i, 'day')
          const prefixInt = String(int).padStart(2, '0')

          const sizes = this.getSizes(colSpan)
          const width = this.getSizeBySpan(colSpan)
          const height = this.getSizeBySpan(rowSpan)

          let status = 'closed'
          if ((currDate.isSame(dayDate, 'day') || stay === true) &&
            !currDate.isAfter(endDate, 'day')
          ) {
            status = 'open'
          } else if (currDate.isAfter(dayDate, 'day') || currDate.isAfter(endDate, 'day')) {
            status = 'done'
          }

          return { int, prefixInt, status, link, imagePath, colSpan, rowSpan, width, height, sizes }
        })
    },
    imgPath () {
      return this.content.imgPath
    },
    title () {
      return this.content.title
    },
    ad () {
      return this.content.ad
    },
    sponsoreLogos () {
      return this.content.sponsorLogos || []
    }
  },
  methods: {
    getSizeBySpan (colSpan) {
      return (200 * colSpan) + ((colSpan - 1) * 16)
    },
    getSizes (colSpan) {
      return [
        { media: '(min-width: 0px)', width: this.getSizeBySpan(colSpan) }
      ]
    }
  }
}
</script>

<style lang="scss">

$alt-xmas-color: #073630;

.xmas-calendar .wrapper {
  background-color: $alt-xmas-color;
}

</style>
