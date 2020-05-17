<template>
  <div class="flex" :class="{ 'justify-end': isMe, 'justify-start': !isMe }">
    <div
      class="mb-4 p-3 rounded-lg w-4/5 lg:w-2/5 shadow-md"
      :class="{ 'bg-green-200  rounded-br-none': isMe, 'bg-blue-200 rounded-bl-none': !isMe }"
    >
      <div class="text-xs text-gray-600" v-if="!isMe">
        @{{ msg.username }}
      </div>
      <div>
        {{ msg.value }}
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from '../../../../APIs/KA'
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
  }
}
</script>

<style>

</style>
