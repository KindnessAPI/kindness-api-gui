<template>
  <div class="h-full w-full">
    <div class="msg-header text-lg py-3 text-center bg-yellow-500 flex justify-between">
      <div class="w-1/3 text-left pl-3 flex items-center justify-start">
        <!-- <img src="./icon/left.svg" class="inline-block" @click="$emit('view', 'chat')" alt=""> -->
      </div>
      <div class="w-1/3">Edit Channel Details</div>
      <div class="w-1/3 text-right pr-3 flex items-center justify-end">
        <img class="inline-block cursor-pointer" src="./icon/check.svg" @click="onUpdateChat()" alt="">
      </div>
    </div>
    <div class="msg-body-list remain-height bg-white  overflow-x-hidden overflow-y-auto">
      <div>
        <div class="bg-gray-200 px-3 py-2 text-xl">
          Edit Room Title
        </div>
        <div class="flex justify-start bg-gray-200 pb-3">
          <input type="text" v-if="isAdmin || isOwner" placeholder="New Title" v-model="channel.title" class="py-3 px-3 text-sm shadow-none appearance-none border-yellow-700 border w-3/6 h-full mx-3 rounded-lg" />
          <div v-else class="pl-3">
            {{ channel.title }}
          </div>
        </div>
      </div>

      <div>
        <div class="bg-gray-200 px-3 py-2 text-xl">
          Room Members <span class="inline-block ml-3" v-if="isOwner">
            <img src="./icon/add.svg" @click="addBox = !addBox" :class="{ ' transform rotate-45 shadow-2xl': addBox }" class=" transition-all shadow-lg duration-500 inline-block cursor-pointer rounded-full border-black border p-2" alt="Add">
          </span>
        </div>
        <div class="bg-gray-200 border-t border-b border-blue-500" v-if="addBox === true">
          <div class="px-3 py-2 text-xl">
            Add Member
          </div>
          <div class="flex justify-start bg-gray-200 pb-3">
            <input type="text" placeholder="New Title" v-model="query" class="py-3 px-3 text-sm shadow-none appearance-none border-blue-500 border w-3/6 h-full mx-3 rounded-lg" @input="tryLoad" />
          </div>
          <div class="pl-3 py-3 flex" :key="rec._id" v-for="rec in result">
            <div>
              <div class="">
                {{ rec.displayName }}
              </div>
              <div class="text-sm text-gray-500">
                @{{ rec.username }}
              </div>
            </div>
            <div class="ml-3">
              <ReButton :color="'green'" @click="addToParticipant(rec)">Add</ReButton>
            </div>
          </div>
        </div>
        <ul class="">
          <li :key="item._id" v-for="item in items" class="flex bg-gray-200 pb-3 pl-3 list-inside list-disc">
            <div class="flex justify-start flex-col mr-4">
              <div class="text-lg w-40">{{ item.username }}</div>
              <div class="text-sm text-gray-500" :class="{ 'text-blue-500': item.isAdmin || item.roomOwnerRow }">{{ item.roomOwnerRow ? 'Owner' : item.isAdmin ? 'Admin' : 'Member' }}</div>
            </div>
            <div class="" v-if="isOwner && !item.roomOwnerRow">
              <ReButton :key="item._id + 'yes'" v-if="!item.isAdmin" :color="'green'" class="mr-3" @click="item.isAdmin = !item.isAdmin">Set to Admin</ReButton>
              <ReButton :key="item._id + 'no'" v-if="item.isAdmin" :color="'green'" class="mr-3" @click="item.isAdmin = !item.isAdmin">Set to Member</ReButton>
              <ReButton :key="item._id + 'remove'" :color="'red'" class="mr-3" @click="removeMember(item)">Remove</ReButton>
            </div>
          </li>
        </ul>
      </div>

      <!--
      <div class="border-t border-gray-500">
        <ContactListUnit ref="contact" :checkbox="true" v-if="items" :items="items" @item="onPersonSelect"></ContactListUnit>
      </div> -->
    </div>
  </div>
</template>

<script>
import { Channel, Profile, Auth } from '../../../APIs/KA'
import _ from 'lodash'
export default {
  props: {
    channel: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      result: false,
      addBox: false,
      isAdmin: this.channel.participants.filter(e => e.isAdmin).map(e => e.userID).includes(Auth.currentProfile.user.userID),
      isOwner: this.channel.userID === Auth.currentProfile.user.userID,
      selectedItems: false,
      query: ''
    }
  },
  computed: {
    items () {
      if (!this.channel) {
        return false
      }
      let list = []
      list.push({
        _id: Math.random(),
        username: this.channel.username,
        userID: this.channel.userID,
        roomOwnerRow: true,
        isAdmin: false
      })
      let members = this.channel.participants
      list = [
        ...list,
        ...members
      ]
      return list
    }
  },
  mounted () {

  },
  methods: {
    async addToParticipant (profile) {
      this.channel.participants.push({
        username: profile.username,
        userID: profile.userID,
        isAdmin: false
      })
      await this.run()
    },
    removeMember (item) {
      if (window.confirm('remove member?')) {
        let members = this.channel.participants
        members.splice(members.findIndex(e => e._id === item._id), 1)
        this.run()
      }
    },
    async onUpdateChat () {
      this.$emit('view', 'chat')
      await this.run()
    },
    async run () {
      if (this.channel && (this.isAdmin || this.isOwner)) {
        await Channel.updateChannelByParticipants({ edit: this.channel })
      }
    },
    async load () {
      let data = await Profile.getProfilesByQuery({ query: this.query })
      this.result = data
    },
    tryLoad: _.debounce(function () {
      this.load()
    }, 250)
    // tryRun: _.debounce(function () {
    //   this.run()
    // }, 250)
  }
}
</script>

<style lang="postcss">
.special-icon-negative-margin-bottom{
  height: 24px;
  margin-bottom: -4px;
}
</style>
