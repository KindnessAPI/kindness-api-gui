<template>
  <div class="bg-gray-300 full">
    <div class="bg-gray-100 flex">
      <div class="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:max-w-full lg:w-1/2 lg:py-24 lg:px-12">
        <div class="xl:max-w-lg xl:ml-auto">
          <img class="h-10" src="./img/logo.svg" alt="Workcation">
          <img class="mt-6 rounded-lg shadow-xl sm:mt-8 sm:h-64 sm:w-full sm:object-cover sm:object-center lg:hidden" src="./img/galaxy.jpg" alt="Woman workcationing on the beach">
          <h1 class="mt-6 text-2xl font-hairline leading-tight sm:mt-8 sm:text-4xl lg:text-3xl xl:text-4xl">
            <span class="text-gray-900">
              Praciting Coding Tailwindcss
            </span>
            <br class="hidden sm:hidden lg:inline"><span class="text-brand-blue">
              Coding is Practical.
            </span>
          </h1>
          <p class="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
            Best wishes.
          </p>
          <div class="mt-4 sm:mt-6 flex">
            <a href="/emoji" class="btn shadow-lg sm:text-base btn-indigo px-8">Emoji Lab</a>
            <a href="/flower" class="btn shadow-lg sm:text-base btn-gray px-8 ml-3">Flower Shader</a>
          </div>
        </div>
      </div>
      <div class="hidden sm:hidden lg:block lg:w-1/2">
        <div class="lg:relative h-full ddmax-w-4xl">
          <img class="absolute inset-0 h-full w-full object-cover object-center" src="./img/galaxy.jpg" alt="Woman workcationing on the beach">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="postcss">
</style>
