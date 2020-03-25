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
        <b-list-group
            v-else>
            <b-row>
                <b-col
                    v-for="item in shoutList"
                    :key="item.ID"
                    cols="12">
                    <b-list-group-item v-if="item.Status == 3" button variant="light">{{item.Title}} <br/> {{item.Content}}</b-list-group-item>
                    <b-list-group-item v-else button variant="dark" @click="readNotif(item.ID)">{{item.Title}} <br/> {{item.Content}}</b-list-group-item>
                </b-col>
            </b-row>
        </b-list-group>
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
            shoutList: [],
            itemLoading: true,
        }
    },
    async created() {
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        const resShout = await axios.get(
          this.apiUrl("shout/list/1" , "&filters[]=user_id|=|" + this.getConfiguration().user.ID + "|and|god")
        );
        if (resShout.data.success == 0) {}
        else {
            this.shoutList = resShout.data.data
            this.itemLoading = false
        }
    },
    methods: {
        async readNotif(shoutid) {
        const res = await axios.patch(
          this.apiUrl("shout/" + shoutid , "GodMode=true"),
          {
            "Status" : 3
          }
        )

        this.checkApiResponse(res.data, {
          onSuccess: () => {

          }
        })
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
