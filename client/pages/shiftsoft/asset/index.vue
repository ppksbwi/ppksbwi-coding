<template>
    <div style="margin: 5vh auto; max-width: 90%; width: 1500px">
        <div style="text-align: center">
            <h1>Asset</h1>
        </div>
        <br>
        <div v-for="(category, index) in assetCategoryList" :key="index">
            <b-button block v-b-toggle="'accordion-'+index">{{category.Name}}</b-button>
            <b-collapse :id="'accordion-'+index" accordion="category-accordion" role="tabpanel">
                <b-list-group>
                    <b-list-group-item @click="seeRequest(item.ID)" v-for="(item, index) in category.Assets" :key="index" button>
                        <b-row align-v="center" style="height: 100px">
                            <b-col cols=6 md=2>
                                <b-img class="assetPic" :src="companyAsset(false, 'asset', item.Pic)"></b-img>
                            </b-col>
                            <b-col>{{item.Name}}</b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
            </b-collapse>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    layout: 'admin',
    data() {
        return {
            assetCategoryList: []
        }
    },
    created() {
        this.getCategoryRequest()
    },
    methods: {
        async getCategoryRequest(){
            const res = await axios.get(
                this.apiUrl(
                    "assetcategory/list",
                    "&with[0]=Assets"
                )
            )
            this.assetCategoryList = res.data.data
        },
        seeRequest(id){
            this.$router.push('/asset/'+id)
        }
    }
}
</script>
<style>
    .assetPic{
        max-width: 100%;
        max-height: 100px;
        height: auto;
    }
</style>
