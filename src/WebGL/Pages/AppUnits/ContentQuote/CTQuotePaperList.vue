<template>
  <div class="w-full mt-6">
      <p class="text-2xl pb-3 flex items-center">
        Quotes Categories
      </p>
      <div class="pb-3 inline-block underline cursor-pointer">
        <div @click="$emit('create')">Create a New Quote Category</div>
      </div>
      <div class="bg-white overflow-auto">
          <table class="min-w-full leading-normal">
              <thead>
                  <tr>
                      <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                      </th>
                      <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Category
                      </th>
                      <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Published
                      </th>
                      <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created at
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="quoteDoc in list" :key="quoteDoc._id">
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            @click="$emit('edit', quoteDoc)"
                              class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                              <span class="relative">Edit</span>
                          </span>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {{ quoteDoc.title }}
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            @click="$emit('togglePublished', { paper: quoteDoc })"
                            v-if="quoteDoc.published"
                              class="cursor-pointer relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                              <span class="relative">Published</span>
                          </span>
                          <span
                            @click="$emit('togglePublished', { paper: quoteDoc })"
                            v-if="!quoteDoc.published"
                              class="cursor-pointer relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                              <span class="relative">Private</span>
                          </span>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">
                              {{ getMoment(quoteDoc.created_at) }}
                          </p>
                      </td>
                  </tr>
                  <!-- <tr>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                  <img class="w-full h-full rounded-full"
                                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                      alt="" />
                              </div>
                              <div class="ml-3">
                                  <p class="text-gray-900 whitespace-no-wrap">
                                      Blake Bowman
                                  </p>
                              </div>
                          </div>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">Editor</p>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">
                              Jan 01, 2020
                          </p>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                              class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                              <span class="relative">Activo</span>
                          </span>
                      </td>
                  </tr>
                  <tr>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                  <img class="w-full h-full rounded-full"
                                      src="https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                      alt="" />
                              </div>
                              <div class="ml-3">
                                  <p class="text-gray-900 whitespace-no-wrap">
                                      Dana Moore
                                  </p>
                              </div>
                          </div>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">Editor</p>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">
                              Jan 10, 2020
                          </p>
                      </td>
                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                              class="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                              <span class="relative">Suspended</span>
                          </span>
                      </td>
                  </tr>
                  <tr>
                      <td class="px-5 py-5 bg-white text-sm">
                          <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                  <img class="w-full h-full rounded-full"
                                      src="https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80"
                                      alt="" />
                              </div>
                              <div class="ml-3">
                                  <p class="text-gray-900 whitespace-no-wrap">
                                      Alonzo Cox
                                  </p>
                              </div>
                          </div>
                      </td>
                      <td class="px-5 py-5 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">Admin</p>
                      </td>
                      <td class="px-5 py-5 bg-white text-sm">
                          <p class="text-gray-900 whitespace-no-wrap">Jan 18, 2020</p>
                      </td>
                      <td class="px-5 py-5 bg-white text-sm">
                          <span
                              class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                              <span aria-hidden
                                  class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                              <span class="relative">Inactive</span>
                          </span>
                      </td>
                  </tr> -->
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    list: {}
  },
  methods: {
    getMoment (str) {
      return moment(str).calendar()
    }
  }
}
</script>

<style>

</style>
