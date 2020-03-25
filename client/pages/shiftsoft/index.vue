<template>
  <div class="container">
    <div>
      <content-loader
          v-if="bannerListLoading"
          :width="1024"
          :height="768"
          :speed="2"
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
      >
        <rect x="-2" y="-2" rx="5" ry="5" width="1024" height="580" />
      </content-loader>
      <div v-else>
        <b-carousel
          v-if="checkPermission('master.notification.banner', 'BackendBanner.Index')"

          id="carousel-1"
          v-model="slide"
          :interval="4000"
          controls
          indicators
          background="#ababab"
          img-width="1024"
          img-height="768"
          style="text-shadow: 1px 1px 2px #333;"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <b-carousel-slide
            v-for="item in bannerList"
            :key="item.ID"
            :caption="item.Name"
            :text="item.Content"
            :img-src="companyAsset(false, 'banner', item.Pic)"
          ></b-carousel-slide>
        </b-carousel>
      </div>
      <button class="button--green" @click="testing">
        testing
      </button>
      <h2 class="subtitle mt-5">
        My smashing Nuxt.js project with {{ getConfiguration().user.Name }}
      </h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  layout: 'admin',
  components: {
  },
  data() {
      return {
        show: true,
        bannerList: [],
        bannerListLoading: true,
        slide: 0,
        sliding: null
      }
  },
  async created(ctx) {
    const res = await axios.get(
      this.apiUrl("banner/list")
    )

    // this.checkApiResponse(res.data)

    this.bannerListLoading = false
    this.bannerList = res.data.data
  },
  methods: {
    testing() {
      this.printHelp(this.getConfiguration())
      this.setConfiguration("smcc", "smcchash")
    },
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  padding-top: 5vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
