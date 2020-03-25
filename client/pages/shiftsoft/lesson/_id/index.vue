<template>
    <div>
        <div style="margin: 2vh 4vw">
            <h1>{{lesson.Name}}</h1>
            <h4>Schedule : <b>{{lesson.StartTime}} - {{lesson.EndTime}}</b></h4>
            <h5>{{lesson.Description}}</h5>
        </div>
        <br>
        <div class="memberBar">
            <span v-for="(item, index) in lesson.Members" :key="index" v-b-tooltip.hover.bottom="item.Name" style="display: inline-block; text-align: center; width: 100px; overflow-wrap: break-word;">
                <div>
                    <b-img class="memberPic" :src="companyAsset(false, 'avatar', item.Pic)" :alt="item.Name"></b-img><br>
                </div>
                <div style="white-space: normal; overflow: hidden; height: 50px;">
                    <h5 style="line-height: 25px; color: #ccc">{{item.Name}}</h5>
                </div>
            </span>
        </div>
        <div style="margin: 5vh auto; max-width: 90%; width: 1500px">
            <b-list-group>
                <b-list-group-item @click="seeDetail(item.IDEncrypt)" v-for="(item, index) in itemList" :key="index" button>
                    <b-row align-v="center" style="min-height: 100px">
                        <b-col>
                            <h3>{{item.Name}}</h3>
                            {{compareDateBetween(item.StartAt, item.EndAt)}}
                            <br>
                            {{timeBetween(item.StartAt, item.EndAt)}}
                        </b-col>
                    </b-row>
                </b-list-group-item>
            </b-list-group>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    layout: 'admin',
    data() {
        return {
            lesson: {},
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
        const res1 = await axios.get(
            this.apiUrl("circle/"+this.$route.params.id+"/id", "&with[0]=Members"),
            config
        )
        this.lesson = res1.data.data
        const res = await axios.get(
            this.apiUrl("event/list", "&filtersArr[0][]=circle_id|=|"+this.$route.params.id+"|god&order=start_at-asc"),
            config
        )

        this.itemList = res.data.data
        this.itemLoading = false
    },
    methods: {
        seeDetail(idEncrypt){
            this.$router.push('/event/' + idEncrypt)
        }
    }
}
</script>

<style>
.memberBar{
    text-align: left;
    background-color: #35495e;
    margin: 0;
    width: 100%;
    height: auto;
    overflow: auto;
    white-space: nowrap;
    padding: 10px 10px;
}
.memberPic{
    display: inline-block;
    width: 75px;
    height: auto;
    border-radius: 50%;
    margin: 10px 10px;
    margin-bottom: 0;
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
