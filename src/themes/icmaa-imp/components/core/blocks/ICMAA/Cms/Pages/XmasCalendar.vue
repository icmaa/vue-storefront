<template>
  <div class="t-container">
    <div class="t-p-4">
      {{ currentDate.format('DD.MM.YYYY') }} || {{ startDate.format('DD.MM.YYYY') }} - {{ endDate.format('DD.MM.YYYY') }}
      <div class="t-grid t-grid-cols-2 sm:t-grid-cols-4 lg:t-grid-cols-6 t-gap-2">
        <div v-for="(day, i) in days"
             :key="day.int + '-' + i"
             :class="{
               't-row-span-2': isBigDay(day.int),
               't-bg-alt-3': day.status === 'open',
               't-bg-alt-2': day.status === 'closed',
               't-bg-white': day.status === 'done'
             }"
        >
          <router-link :to="localizedRoute(day.link)" v-if="day.status === 'open'">
            {{ day.int }}
          </router-link>
          <template v-else>
            {{ day.int }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Page from 'icmaa-cms/mixins/Page'
import { toDayjsDate, getCurrentStoreviewDayjsDatetime } from 'icmaa-config/helpers/datetime'

export default {
  name: 'XmasCalendar',
  mixins: [ Page ],
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    currentDate () {
      return getCurrentStoreviewDayjsDatetime()
    },
    startDate () {
      return toDayjsDate(this.content.startDay + ' 00:00')
    },
    endDate () {
      return this.startDate.add(this.content.days.length - 1, 'day')
    },
    days () {
      const currDate = this.currentDate
      const startDate = this.startDate
      const endDate = this.endDate

      return this.content.days
        .map((d, i) => {
          const dayDate = startDate.add(i, 'day')
          const { int, link, imagePath } = d

          let status = 'closed'
          if ((currDate.isSame(dayDate, 'day') || this.content.daysToStay.includes(int)) &&
            !currDate.isAfter(endDate, 'day')
          ) {
            status = 'open'
          } else if (currDate.isAfter(dayDate, 'day') || currDate.isAfter(endDate, 'day')) {
            status = 'done'
          }

          return { int, status, link, imagePath }
        })
    }
  },
  methods: {
    isBigDay (day) {
      return this.content.bigDays.includes(day)
    }
  }
}
</script>
