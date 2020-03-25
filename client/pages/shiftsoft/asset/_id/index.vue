<template>
    <div style="margin: 5vh auto">
        <div style="text-align: center">
            <h1>{{asset.Name}}</h1>
        </div>
        <br>
        <b-list-group>
            <b-list-group-item v-for="(item, index) in assetRequestList" :key="index">
                <b-row align-v="center" style="text-align: center">
                    <b-col>{{item.Date}}<br>{{item.Time}}</b-col>
                    <b-col>{{item.User.Name}}<br><b>{{item.User.Circles}}</b></b-col>
                    <b-col>{{item.Content}}</b-col>
                    <b-col>
                        <span class="text-secondary" v-if="item.Status == 0"> Waiting </span>
                        <span class="text-danger" v-else-if="item.Status == 1"> Cancelled </span>
                        <span class="text-success" v-else-if="item.Status == 2"> Accepted </span>
                    </b-col>
                    <b-col>
                        <div v-if="item.Status != 1 && item.UserID == userID">
                            <b-button class="actionBtn" :to="asset.ID + '/form/' + item.ID">Edit</b-button>
                            <b-button class="actionBtn" @click="deleteItem(item.ID)">Delete</b-button>
                        </div>
                        <div v-if="item.Status == 0 && asset.UserID == userID">
                            <b-button class="actionBtn" @click="approve(item.ID)" variant="success">Approve</b-button>
                            <b-button class="actionBtn" @click="disapprove(item.ID)" variant="danger">Disapprove</b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>
        <div style="text-align: center">
            <b-button class="actionBtn" :to="asset.ID + '/form/0'" variant="primary">+ Create</b-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    layout: 'admin',
    data() {
        return {
            userID: null,
            asset: {},
            assetRequestList: []
        }
    },
    created() {
        this.getAsset()
    },
    methods: {
        async getAsset(){
            const res = await axios.get(
                this.apiUrl(
                    "asset/list",
                    "&filtersArr[0][]=id|=|"+this.$route.params.id+"|god"
                )
            )
            this.asset = res.data.data[0]
            this.getAssetRequestList()
        },
        async getAssetRequestList(){
            const res = await axios.get(
                this.apiUrl(
                    "assetrequest/list",
                    "with[0]=Asset&with[1]=User.Circles&with[2]=Company&order=start_at-asc&filtersArr[0][]=asset_id|=|"
                        + this.asset.ID + "|god&inactive=true&filtersArr[0][]=status|<>|-1"
                )
            )
            this.assetRequestList = res.data.data
            this.userID = this.getConfiguration().user.ID
            this.assetRequestList.map((item) => {
                item.Date = this.compareDateBetween(item.StartAt, item.EndAt)
                item.Time = this.timeBetween(item.StartAt, item.EndAt)
            })
        },
        async deleteItem(id){
            const res = await axios.delete(
                this.apiUrl("assetrequest/" + id)
            )
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.getAssetRequestList()
                }
            })
        },
        async approve(id){
            const res = await axios.patch(
                this.apiUrl("assetrequest/" + id, "GodMode=true")
            )
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.getAssetRequestList()
                }
            })
        },
        async disapprove(id){
            const res = await axios.patch(
                this.apiUrl("disapproveassetrequest/" + id, "GodMode=true")
            )
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.getAssetRequestList()
                }
            })
        }
    }
}
</script>
<style>
    .actionBtn{
        width: 100px;
        margin: 5px 0;
    }
</style>
