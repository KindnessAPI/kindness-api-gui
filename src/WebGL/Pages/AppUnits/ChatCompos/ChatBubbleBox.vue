<template>
  <div class="flex" :class="{ 'justify-end': isMe, 'justify-start': !isMe }">
    <div
      class="mb-4 p-3 px-5 rounded-full w-4/5 lg:w-2/5 border"
      :class="{ 'bg-green-200  rounded-br-none': isMe, 'bg-blue-200 rounded-bl-none': !isMe }"
    >
      <div class="text-xs text-gray-600">
      <span v-if="!isMe">
          @{{ msg.username }} |
      </span>
      {{ ago(msg.date) }}
      </div>
      <div v-if="msg.type === 'text'" class="whitespace-pre-wrap">
        {{ msg.value || ' ' }}
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from '../../../../APIs/KA'
import moment from 'moment'
export default {
  components: {
    ...require('../../../webgl').default
  },
  props: {
    msg: {}
  },
  data () {
    return {
      isMe: this.msg.userID === Auth.currentProfile.user.userID,
      me: Auth.currentProfile.user
    }
  },
  methods: {
    ago (v) {
      return moment(v).calendar()
    }
  }
}
</script>

<style>

</style>
