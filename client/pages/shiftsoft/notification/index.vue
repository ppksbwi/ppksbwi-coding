<template>
    <div>
        <content-loader
            v-if="itemLoading"
            :height="160"
            :width="400"
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
        >
            <rect x="2.59" y="1.67" rx="0" ry="0" width="99.15" height="73.72" />
            <rect x="149.59" y="0.67" rx="0" ry="0" width="100.95" height="74.69" />
            <rect x="296.59" y="1.67" rx="0" ry="0" width="100.95" height="74.69" />
        </content-loader>
        <b-container
            v-else
            Fluid class="bv-example-row">
            <b-row>
                <b-col
                    v-for="item in itemList"
                    :key="item.ID"
                    cols="4">
                    <b-card
                        :title="item.Subject"
                        :img-src="companyAsset(false, 'notification', item.Pic)"
                        img-alt="Image"
                        img-top
                        tag="article"
                        style="max-width: 20rem;"
                        class="mb-2"
                    >
                    <b-card-text>
                        {{item.Subject}}
                        <br />
                        {{moment(item.Schedule).format("DD MMMM YYYY")}}
                        </b-card-text>
                        <!-- href="/notification/newsdetail" -->
                        <b-button  variant="primary" @click="newsDetail(item.ID, getConfiguration().user.IDEncrypt )">Go News Detail</b-button>
                    </b-card>
                </b-col>
            </b-row>
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
            NotificationID: '',
            UserID: '',
            username:'',
            password:'',
            itemList: [],
            itemLoading: true,
        }
    },
    async created() {
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        const res = await axios.get(
            this.apiUrl("notification/list"),
            config
        );
        this.itemList = res.data.data
        this.itemLoading = false
    },
    methods: {
        async newsDetail(id,userid){
            const res = await axios.post(
                this.apiUrl("notificationrecipient", "GodMode=true"),
                {
                    "NotificationID": String(id),
                    "UserID": String(userid)
                }
            )
            if (res.data.success == 0) {
                alert(res.data.message)
            } else {
                this.$router.push('notification/' + id)
            }
        },
    }
}
</script>

<style>
.card:hover{
    background-color: grey;
    opacity:0,9;
}
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
