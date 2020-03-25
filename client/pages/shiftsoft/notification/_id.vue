<template>
  <div>
    <br/>
    <b-container>
      <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Post Your Comment"
        @show="resetModal"
        @hidden="resetModal"
        @ok="clickedOk(getConfiguration().user.ID)">

      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Comment Here : "
          label-for="name-input"
          invalid-feedback="Comment is required">
        <b-form-input
          id="name-input"
          v-model="inputComment"
          :state="nameState"
          required
          placeholder="Write Your Comment Here"></b-form-input>
        <br/>
        <b-button size="lg" block variant="outline-dark" @click="clickedOk(getConfiguration().user.ID)">Post Your Comment</b-button>
        </b-form-group>
      </form>

      Comments :
      <br/>
      <br/>
      <b-row>
        <b-col
          v-for="comment in commentList"
          :key="comment.ID"
          cols="12">
          <b-card
            :img-src="companyAsset(false, 'avatar', comment.User.Pic)"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2">
          <b-card-text>
            {{comment.User.Name}}
            <br />
            {{moment(comment.CreatedAt).calendar()}}
            <br />
            {{comment.Content}}
            <br />
          </b-card-text>
          </b-card>
          <br/>
        </b-col>
      </b-row>
  </b-modal>

  <b-jumbotron class="justify-content-md-center" bg-variant="white" text-variant="black" border-variant="dark">
    <template v-slot:header>
      <b-img :src="companyAsset(false, 'notification', item.Pic)"></b-img>
    </template>
    <template v-slot:lead>
      {{item.Subject}}
      {{moment(item.Schedule).format("dddd , DD MMMM YYYY")}}
      <br />
      <p>
      <font-awesome-icon :icon="['fas', 'thumbs-up']" @click="onLike(getConfiguration().user.ID)"/> {{item.CountLikes}}
      <font-awesome-icon :icon="['fas', 'eye']"/> {{item.CountRecipients}}
      <font-awesome-icon :icon="['fas', 'comment-dots']" /> {{item.CountComments}}
      </p>
    </template>

    <hr class="my-4">
    <p>
      Oleh : {{item.CreatedBy}}
    </p>
    <p>
      {{item.Content}}
    </p>
    <hr class="my-4">
    <h2>Comments</h2>
      <b-row>
        <b-col
          v-for="(comment,index) in commentList"
          :key="comment.ID"
          cols="4">
          <b-card
            :img-src="companyAsset(false, 'avatar', comment.User.Pic)"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
            v-if="index < 3">
          <b-card-text>
            {{comment.User.Name}}
            <br />
            {{moment(comment.CreatedAt).format("DD MMMM YYYY")}}
            <br />
            {{comment.Content}}
            <br />
          </b-card-text>
          </b-card>
          <br/>
        </b-col>
      </b-row>
      <b-button size="lg" v-b-modal.modal-prevent-closing block variant="outline-dark">Write A Comment</b-button>
    </b-jumbotron>
  </b-container>
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
      inputComment:'',
      nameState:null,
      item: {},
      commentList: {},
      itemLoading: true,
    }
  },
  async created() {
    const res = await axios.get(
      this.apiUrl("notification/" + this.$route.params.id + "/id")
    );
    if (res.data.success == 0){}
    else {
      this.item = res.data.data
      this.itemLoading = false

    }

    const resComment = await axios.get(
      this.apiUrl("notificationcomment/list/1" , "filtersArr[0][]=notification_id|=|" + this.$route.params.id + "|god&order[0]=created_at-desc&with[0]=User")
    );
    if (resComment.data.success == 0) {}
    else {
      this.commentList = resComment.data.data
      this.itemLoading = false
    }
  },
  methods: {
    async onLike(userid) {
      const res = await axios.post(
        this.apiUrl("NotificationLike", "GodMode=true"),
        {
          "NotificationID": String(this.$route.params.id),
          "UserID": String(userid)
        }
      )

      this.checkApiResponse(res.data, {
        onSuccess: () => {
          this.item.CountLikes += 1
        }
      })
    },

    resetModal() {
      this.inputComment = ''
      this.nameState = null
    },

    async clickedOk(userid){
      const res = await axios.post(
        this.apiUrl("notificationcomment","GodMode=true"),
        {
          "NotificationID":String(this.$route.params.id),
          "UserID":String(userid),
          "Content":this.inputComment
        }
      )

      this.checkApiResponse(res.data, {
        onSuccess: () => {
          this.$bvModal.hide('modal-prevent-closing')
        }
      })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
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
