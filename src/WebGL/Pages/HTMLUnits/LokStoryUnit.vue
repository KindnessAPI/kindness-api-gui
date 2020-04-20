<template>
  <div>

    <div class="relative lg:border-b lg:border-black lg:border-t">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">

        </div>
        <GospelScene slot="o3d"></GospelScene>
      </ScissorArea>

      <div class="scissor-left scissor-text py-8 lg:py-24">
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">
          <ThankYouGospelFragment></ThankYouGospelFragment>
        </div>
      </div>
    </div>

    <div class="relative lg:border-b lg:border-black">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <FallScene slot="o3d"></FallScene>
      </ScissorArea>

      <div class="scissor-left scissor-text py-8 lg:py-24">
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">

          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            The Fall
          </div>

          <div class="px-3 pb-2 text-3xl lg:text-xl font-bold">
            2014-08 to 2014-10
          </div>

          <div class="px-3 text-lg pb-3">
            Lok Lok got diagnosed mania mental illness because he talked too much about <strong>World Peace</strong> and <strong>Inner Peace</strong>. They said he got delusion and gradiose thinking.
            He lost almost all of his friends. It was his lowest point of his life.
            Thank God, he got discharged two months after the hospitalization.
            Some people never made it out there but thank you Dear God, I can come back home.
          </div>

        </div>

      </div>
    </div>

    <div class="relative lg:border-b lg:border-black">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <ResetScene slot="o3d"></ResetScene>
      </ScissorArea>

      <div class="scissor-left scissor-text py-8 lg:py-24">
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">

          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            The Reset
          </div>
          <div class="px-3 pb-2 text-3xl lg:text-xl font-bold">
            2014-10 to 2015-12
          </div>

          <div class="px-3 text-lg pb-3">
            Lok Lok was resting at home for like a year. Dear mom and his brother bring him to differnet plaes to travel.
            However the brain chemical medicine is too strong, he was unable to be functional at a normal level.
            He had anxiety constantly. Mom worried sick about his life. So she forced him to study a Computer Science masters degree.
            But the chemical is too strong and Lok hates exam too much, he couldn't take it anymore.
            He decided to quit the Masters Degree and believe in himself.
            Meanwhile, after telling the depression to the doctor. She gave me a new type of medicine, which is way better than the previous one and had way less side effects.
          </div>

        </div>

      </div>
    </div>

    <div class="relative lg:border-b lg:border-black">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <RiseScene slot="o3d"></RiseScene>
      </ScissorArea>

      <div class="scissor-left scissor-text py-8 lg:py-24">
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">

          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Rise Back Up!
          </div>
          <div class="px-3 pb-2 text-3xl lg:text-xl font-bold">
            2015-12 to Present
          </div>

          <div class="px-3 text-lg pb-3">
            <p class="pb-3">Thank you Dear God for all your blessings that are overflowing the cup. I'm indeed very Loved. </p>
            <ul class="pl-5 list-disc">
              <li class="pb-1">Lok met Bryant McGill and Jenni Young McGill and joined their Royal community</li>
              <li class="pb-1">Lok met a ton of new, close and dear friends wihtin the community.</li>
              <li class="pb-1">Bryant removed a lot of BS mindset within Lok.</li>
              <li class="pb-1">Lok and Bryant became best coding buddies.</li>
              <li class="pb-1">Bryant invited Lok to be an ambassador of PeacePrzie.org</li>
              <li class="pb-1">Lok practiced a lot of creative computer graphics coding.</li>
              <li class="pb-1">Lok's dear friend, John, come back to HK from Germany.</li>
              <li class="pb-1">Lok worked for free at K2 to learn design for free and got a NIKE & Cle De Peau freelance project.</li>
              <li class="pb-1">Lok joined a PolyU Hackathon and won it using Effect Node prototype version 2.</li>
              <li class="pb-1">Lok won $300K grant of PolyU startup fund.</li>
              <li class="pb-1">Lok got discovered by PolyU Educational Development Centre.</li>
              <li class="pb-1">Lok joined the PolyU PALMS Team in early 2018 and the salary is very good.</li>
              <li class="pb-1">Lok applied Webbys Awards and got a nomination in 2019 for his Effect Node version 3.</li>
              <li class="pb-1">Lok got invited to become a Judge at Webbys Awards.</li>
              <li class="pb-1">Lok saved a lot of cash for his dream projects.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  components: {
    ...require('../../webgl').default
  }
}
</script>

<style scoped lang="postcss">
.scissor-text{
}
.scissor-right{
  width: 100vmin;
  height: 100vmin;
}
.scissor-left{
  width: 100%;
  height: 100%;
}

@screen lg {
  .scissor-text{
    color: black;
  }
  .scissor-right{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: 100%;
    margin-left: 50%;
  }
  .scissor-left{
    /* position: absolute;
    top: 0px;
    left: 0px; */
    width: 50%;
    height: 100%;
  }
}
</style>
