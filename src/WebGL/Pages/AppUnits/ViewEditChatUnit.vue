<template>
  <div class="h-full w-full">
    <div class="msg-header text-lg py-3 text-center bg-yellow-500 flex justify-between">
      <div class="w-1/3 text-left pl-3 flex items-center justify-start">
        <!-- <img src="./icon/left.svg" class="inline-block" @click="$emit('view', 'chat')" alt=""> -->
      </div>
      <div class="w-1/3">Settings</div>
      <div class="w-1/3 text-right pr-3 flex items-center justify-end">
        <img class="inline-block cursor-pointer" src="./icon/check.svg" @click="onUpdateChat()" alt="">
      </div>
    </div>
    <div class="msg-body-list remain-height bg-white  overflow-x-hidden overflow-y-auto">
      <div>
        <div class="px-3 py-2 text-xl">
          Room Title
        </div>
        <div class="flex justify-start pb-3">
          <input type="text" v-if="isAdmin || isOwner" placeholder="New Title" v-model="channel.title" class="py-3 px-3 text-lg shadow-none appearance-none border-yellow-700 border w-3/6 h-full mx-3 rounded-lg" />
          <div v-else class="pl-3">
            {{ channel.title }}
          </div>
        </div>
      </div>

      <div>
        <div class="px-3 py-2 text-xl">
          Room Picture
        </div>
        <div class="flex justify-start pb-3">
          <GEImageUpload v-if="isAdmin || isOwner" class="inline-block mx-1" @url="channel.img = $event; run()" :label="'Select and Upload Photo'"></GEImageUpload>
          <div class="pl-3" v-else>
            <img :src="channel.img" class="h-16 w-16 rounded-full object-cover object-center" alt="">
          </div>
        </div>
      </div>

      <div>
        <div class="px-3 py-2 text-xl">
          Room Members <span class="inline-block ml-3" v-if="isOwner">
            <img src="./icon/add.svg" @click="addBox = !addBox" :class="{ ' transform rotate-45 shadow-2xl': addBox }" class=" transition-all shadow-lg duration-500 inline-block cursor-pointer rounded-full border-black border p-2" alt="Add">
          </span>
        </div>
        <div class="border-t border-b border-blue-500 bg-gray-200" v-if="addBox === true">
          <div class="px-3 py-2 text-xl">
            Add Member
          </div>
          <div class="flex justify-start pb-3">
            <input type="text" placeholder="New Title" v-model="query" class="py-3 px-3 text-lg shadow-none appearance-none border-blue-500 border w-3/6 h-full mx-3 rounded-lg" @input="tryLoad" />
          </div>
          <div class="pl-3 py-3 flex" :key="rec._id" v-for="rec in profiles">
            <div>
              <div class="">
                {{ rec.displayName }}
              </div>
              <div class="text-sm text-gray-500">
                @{{ rec.username }}
              </div>
            </div>
            <div class="ml-3">
              <ReButton :color="'green'" v-if="!channel.members.map(e => e.profile.userID).includes(rec.userID)" @click="addToParticipant(rec)">Add</ReButton>
            </div>
          </div>
        </div>
        <table class="">
          <tr :key="member._id" v-for="member in channel.members" class="flex pb-3 pl-3 list-inside list-disc">
            <td class="flex justify-start flex-col mr-4">
              <div class="text-lg w-40">{{ member.profile.displayName }}</div>
              <div class="text-sm text-gray-500" :class="{ 'text-blue-500': member.isAdmin || member.roomOwnerRow }">
                {{ member.isAdmin ? 'Admin' : 'Member' }}
              </div>
            </td>
            <td v-if="isOwner">
              <ReButton :key="member._id + 'yes'" v-if="!member.isAdmin" :color="'green'" class="mr-3" @click="member.isAdmin = !member.isAdmin">Set to Admin</ReButton>
              <ReButton :key="member._id + 'no'" v-if="member.isAdmin" :color="'green'" class="mr-3" @click="member.isAdmin = !member.isAdmin">Set to Member</ReButton>
            </td>
            <td v-if="isOwner">
              <ReButton :key="member._id + 'remove'" v-if="channel.members.length > 1" :color="'red'" class="mr-3" @click="removeMember(member)">Remove</ReButton>
            </td>
          </tr>
        </table>
      </div>

      <!--
      <div class="border-t border-gray-500">
        <ContactListUnit ref="contact" :checkbox="true" v-if="items" :items="items" @item="onPersonSelect"></ContactListUnit>
      </div>
      -->
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
      profiles: false,
      addBox: false,
      isAdmin: this.channel.members.filter(e => e.isAdmin).map(e => e.userID).includes(Auth.currentProfile.user.userID),
      isOwner: this.channel.userID === Auth.currentProfile.user.userID,
      selectedItems: false,
      query: ''
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    async addToParticipant (profile) {
      this.channel.members.push({
        profile,
        isAdmin: false
      })
      await this.run()
    },
    removeMember (member) {
      if (window.confirm('remove member?')) {
        let members = this.channel.members
        members.splice(members.findIndex(e => e.profile.userID === member.profile.userID), 1)
        this.run()
      }
    },
    async onUpdateChat () {
      this.$emit('view', 'chat')
      await this.run()
    },
    async run () {
      if (this.channel && (this.isAdmin || this.isOwner)) {
        await Channel.updateChannelByMembers({ edit: this.channel })
      }
    },
    async load () {
      let data = await Profile.getProfilesByQuery({ query: this.query })
      this.profiles = data
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
