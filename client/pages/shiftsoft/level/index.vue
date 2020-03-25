<template>
    <div style="margin: 5vh auto; max-width: 90%; width: 800px">
        <div style="text-align: center">
            <h1>Level History</h1>
        </div>
        <br>
        <b-list-group>
            <b-list-group-item  v-for="(item, index) in levelHistoryList" :key="index">
                <b-row  v-if="item.BadgeID == 0" align-v="center" align-h="between" style="height: 100px">
                    <b-col>
                        <b >{{item.Name}}</b><br>
                        <span class="text-muted">{{item.Date}}</span><br>
                        {{item.Remark}}
                    </b-col>
                    <b-col cols=6 md=2 style="text-align: center">
                    </b-col>
                </b-row>
                <b-row  v-else align-v="center" align-h="between" style="height: 100px">
                    <b-col>
                        <b >{{item.Badge.Name}}</b><br>
                        <span class="text-muted">{{item.Date}}</span><br>
                        {{item.Remark}}
                    </b-col>
                    <b-col cols=6 md=2 style="text-align: center">
                        <b-img class="badgePic" :src="companyAsset(false, 'badge', item.Badge.Pic)"></b-img>
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>
        <div style="text-align: center">
            <b-button class="actionBtn" to="level/create" variant="primary">+ Create</b-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    layout: 'admin',
    data() {
        return {
            levelHistoryList: []
        }
    },
    created() {
        this.getLevelHistoryList()
    },
    methods: {
        async getLevelHistoryList(){
            const res = await axios.get(
                this.apiUrl(
                    "levelhistories/list",
                    "&order=created_at-desc&filtersArr[0][]=user_id|=|"+this.getConfiguration().user.ID+"|god&with[0]=Level&with[1]=Badge"
                )
            )
            this.levelHistoryList = res.data.data
            this.levelHistoryList.map((item) => {
                item.Date = this.compareDateBetween(item.CreatedAt, item.CreatedAt)
            })
        }
    }
}
</script>
<style>
    .badgePic{
        max-width: 100%;
        max-height: 100px;
        height: auto;
    }
    .actionBtn{
        width: 100px;
        margin: 5px 0;
    }
</style>
