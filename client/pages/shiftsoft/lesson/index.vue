<template>
    <div style="margin: 5vh auto; max-width: 90%; width: 800px">
        <div style="text-align: center">
            <h1>Lesson</h1>
        </div>
        <br>
        <b-list-group>
            <b-list-group-item @click="seeSchedule(item.ID)" v-for="(item, index) in circleList" :key="index" button>
                <b-row align-v="center" style="height: 100px">
                    <b-col cols=6 md=2>
                        <b-img class="circlePic" :src="companyAsset(false, 'circle', item.Pic)"></b-img>
                    </b-col>
                    <b-col>
                        <h3>{{item.Name}}</h3>
                        {{item.StartTime}} - {{item.EndTime}}
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    layout: 'admin',
    data() {
        return {
            circleList: []
        }
    },
    created() {
        this.getCircleList()
    },
    methods: {
        async getCircleList(){
            const res = await axios.get(
                this.apiUrl(
                    "circle/list",
                    "&filtersArr[0][]=is_lesson|=|2"
                )
            )
            this.circleList = res.data.data
        },
        seeSchedule(id){
            this.$router.push('/lesson/'+id)
        }
    }
}
</script>
<style>
    .circlePic{
        max-width: 100%;
        max-height: 100px;
        height: auto;
    }
    .actionBtn{
        width: 100px;
        margin: 5px 0;
    }
</style>
