<template>
    <div>
        <br>
        <content-loader
            v-if="itemLoading"
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
            FLUID class="bv-example-row">
            <b-row>
                <b-col
                    v-for="item in itemList"
                    :key="item.ID"
                    cols="3"
                    >
                    <b-card
                        :title="item.Name"
                        :img-src="companyAsset(false, 'product', item.Pic)"
                        img-alt="Image"
                        img-top
                        tag="article"
                        style="max-width: 20rem;"
                        class="mb-2 card"
                        @click="detail(item.IDEncrypt)"
                    >
                        <b-card-text class="text-left">
                            {{numberFormat(item.Price,'Rp')}}
                            <br/>
                            {{item.Company.ID}}
                        </b-card-text>
                        <span class="text-left">
                            <font-awesome-icon :icon="['fa', 'star']" class="checked" v-if="item.Rating>=1"/>
                            <font-awesome-icon :icon="['fa', 'star']" v-else/>
                            <font-awesome-icon :icon="['fa', 'star']" class="checked" v-if="item.Rating>=2"/>
                            <font-awesome-icon :icon="['fa', 'star']" v-else/>
                            <font-awesome-icon :icon="['fa', 'star']" class="checked" v-if="item.Rating>=3"/>
                            <font-awesome-icon :icon="['fa', 'star']" v-else/>
                            <font-awesome-icon :icon="['fa', 'star']" class="checked" v-if="item.Rating>=4"/>
                            <font-awesome-icon :icon="['fa', 'star']" v-else/>
                            <font-awesome-icon :icon="['fa', 'star']" class="checked" v-if="item.Rating==5"/>
                            <font-awesome-icon :icon="['fa', 'star']" v-else/>
                        </span>
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
            this.apiUrl("product/list", "filters[]=name|like|**|and&with[0]=Category"),
            config
        );
        this.itemList = res.data.data
        this.itemLoading = false
    },
    methods:{
        detail(IDEncrypt){
            this.$router.push('product/'+IDEncrypt)
            //this.$router.push(IDEncrypt)
        },
    }
}
</script>

<style>
.card:hover{
    background-color: grey;
    opacity: 0.9;
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
.checked {
  color: orange;
}
</style>
