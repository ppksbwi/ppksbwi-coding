<template>
    <div class="container">
        <br>
        <b-jumbotron class="justify-content-md-center" bg-variant="info" text-variant="white" border-variant="dark">
            <template v-slot:header>{{item.Name}}</template>
            <template v-slot:lead class="Rating">
                <b-row>
                <b-col>
                    <b-img :src="companyAsset(false, 'product', item.Pic)" fluid alt="Responsive image"></b-img>
                </b-col>
                <b-col>
                    {{item.Rating}}
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
                    Terjual {{ item.Sent }} Produk
                    <hr class="my-4">
                    <h4 style="float:left">Harga</h4>
                    <h2>
                    {{numberFormat(Number(item.Price),"Rp")}}
                    </h2>
                    <hr class="my-4">
                    <h4 style="float:left">Jumlah</h4>
                    <b-button pill variant="success" @click="minus()">-</b-button>
                    <span>{{Quantity}}</span>
                    <b-button pill variant="success" @click="plus()">+</b-button>
                    (Tersedia {{item.Quantity}} barang)
                    <b-form-input v-model="Note" placeholder="Catatan Penjual"></b-form-input>
                    <hr class="my-4">
                    <h4 style="float:left">Berat</h4>
                    <h2>
                    {{item.Weight}}
                    </h2>
                    <hr class="my-4">
                </b-col>
                </b-row>
                <div class="Description">
                    <h4>Deskripsi</h4>
                    <h2>
                    {{item.Description}}
                    </h2>
                </div>
            </template>
            <span class="total"> Total {{ numberFormat(Number(Price),"Rp") }} </span>
            <b-button variant="outline-light" @click="addWishlist"><font-awesome-icon :icon="['fas', 'heart']" :class="wishlist"/> </b-button>
            <b-button variant="outline-light" @click="addCart">Add To Cart</b-button>
        </b-jumbotron>
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
            item: {},
            itemLoading: true,
            wishlist: "",
            deletewish: false,
            Quantity: 0,
            Price: 0,
            Note: "",
            IDWishlist: ""
        }
    },
    methods:{
        minus(){
            if(this.Quantity != 1){
            this.Quantity = this.Quantity - 1;
            this.Price = this.Price - this.item.Price
            }
        },
        plus(){
            this.Quantity = this.Quantity + 1;
            this.Price = this.Price + this.item.Price
        },
        async addWishlist(){
            if(this.deletewish == true){
                const res = await axios.delete(
                     this.apiUrl("productwishlist/"+this.IDWishlist,"GodMode=true")
                )
                if (res.data.success == 0) {
                    console.log(res.data.message)
                } else {
                    console.log(res.data.message)
                    this.wishlist = ""
                    this.deletewish = false
                }
            }
            else{
                const res = await axios.post(
                    this.apiUrl("productwishlist","GodMode=true"),
                    {
                        "ProductID": String(this.item.ID),
                        "UserID": String(this.getConfiguration().user.ID)
                    }
                )
                if (res.data.success == 0) {
                    console.log(res.data.message)
                } else {
                    console.log(res.data.message)
                    this.wishlist = "wished"
                    this.deletewish = true
                }
            }
        },
        async addCart(){
            const res = await axios.post(
                this.apiUrl("productcart","GodMode=true"),
                {
                    "ProductID":String(this.item.ID),
                    "UserID":String(this.getConfiguration().user.ID),
                    "Quantity":this.Quantity,
                    "Description":String(this.Note)
                }
            )
            if (res.data.success == 0) {
                console.log(res.data.message)
            } else {
                console.log(res.data.message)
            }
        }
    },
    async created() {
        const res = await axios.get(
          this.apiUrl("product/" + this.$route.params.id + "/id-encrypt")
        );
        this.item = res.data.data
        this.Quantity = 1
        this.Price = this.item.Price
        this.itemLoading = false
        const wish = await axios.get(
            this.apiUrl("productwishlist/list", "filters[]=user_id|=|"+this.getConfiguration().user.ID+"|and|god")
        );
        var wish_data = wish.data.data
        wish_data.map((wish_item) => {
            if(wish_item.ProductID == this.item.ID){
                this.wishlist = "wished"
                this.deletewish = true
                this.IDWishlist = wish_item.ID
            }
        })
        const cart = await axios.get(
            this.apiUrl("productcart/list", "filters[]=user_id|=|"+this.getConfiguration().user.ID+"|and|god")
        );
        var cart_data = cart.data.data
        cart_data.map((cart_item) => {
            if(cart_item.ProductID == this.item.ID){
                this.Quantity = cart_item.Quantity
                this.Note = cart_item.Description
                this.Price = this.item.Price * this.Quantity
            }
        })
        //console.log(wish.data.data)
    },
}
</script>

<style>
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

.image{
    float: left;
    padding-right: 10px;
    height: 500px;
}
.checked {
  color: orange;
}
.wished{
    color: red;
}
.Description{
    text-align: left;
}
.Rating{
    text-align: left;
}
.total{
    font-size: 30px;
    vertical-align: middle;
}
</style>
