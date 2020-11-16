<template>
  <div class="xmas-calendar t-container">
    <div class="lg:t-p-4">
      <div class="wrapper t-p-4 t-grid t-grid-cols-2 sm:t-grid-cols-6 t-gap-4">
        <template v-for="(day, i) in daysOrdered">
          <div v-if="day === 'title'" :key="'title-' + i" class="t-col-span-2 t-order-first sm:t-order-none t-flex t-items-center t-justify-center">
            <picture-component
              class="t-w-full"
              src="impericon/xmas/calendar/doors/2020/closed/headline@2x.png"
              alt="Title"
              :placeholder="true"
              :width="400"
              :height="200"
              :sizes="[ { media: '(min-width: 0px)', width: 400 } ]"
              ratio="2:1"
            />
          </div>
          <div v-else-if="day === 'ad'" :key="'ad-' + i" class="t-col-span-2 t-row-span-2 t-flex t-items-center t-justify-center t-p-8">
            <picture-component
              class="t-w-full"
              :src="ad.imagePath"
              :alt="ad.title"
              :placeholder="true"
              :width="400"
              :height="400"
              :sizes="[ { media: '(min-width: 0px)', width: 400 } ]"
              ratio="1:1"
            />
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
            <router-link :to="localizedRoute(day.link)" v-if="day.status === 'open'">
              {{ day.int }}
            </router-link>
            <div v-else>
              <picture-component
                class="t-w-full"
                :src="`impericon/xmas/calendar/doors/2020/closed/${day.prefixInt}@2x.png`"
                :alt="`Door # ${day.int}`"
                :placeholder="true"
                :width="200 * day.colSpan"
                :height="200 * day.rowSpan"
                :sizes="[ { media: '(min-width: 0px)', width: (200 * day.colSpan) } ]"
                :ratio="`${day.colSpan}:${day.rowSpan}`"
              />
            </div>
          </div>
        </template>
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

          let status = 'closed'
          if ((currDate.isSame(dayDate, 'day') || stay === true) &&
            !currDate.isAfter(endDate, 'day')
          ) {
            status = 'open'
          } else if (currDate.isAfter(dayDate, 'day') || currDate.isAfter(endDate, 'day')) {
            status = 'done'
          }

          return { int, prefixInt, status, link, imagePath, colSpan, rowSpan }
        })
    },
    imgPath () {
      return this.content.imgPath
    },
    ad () {
      return this.content.ad
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
