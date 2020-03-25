<template>
  <div>
    <notifications group="foo" />
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="'/'">Home</b-nav-item>
          <b-nav-item-dropdown text="Menu" left>
            <b-dropdown-item
              v-for="(menu, index) in menuList"
              :key="index"
              :to="menu.Path">
                {{menu.Title}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
          <b-button id="popover-target-1" class="but_hover" >
            <font-awesome-icon :icon="['fas', 'bell']"/>
          </b-button>
          <b-badge class="badge_notif" variant="danger">{{shoutCount.data}}</b-badge>
          <b-popover target="popover-target-1" triggers="hover" placement="top">
            <template v-slot:title>Notification List  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <a href="shout"> See All </a></template>
            <div
              v-for="item in shoutList"
              :key="item.ID"
            >
              <b-col v-if="item.Status != 3">
                <b-card @click="onRead(item.ID)">
                  <b-card-text>
                    <h6>{{item.Title}}</h6>
                    {{item.Content}}
                  </b-card-text>
                </b-card>
                <br/>
              </b-col>
            </div>
          </b-popover>
          &nbsp
          
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
          <ul class="dropdown_menu">
            <li>
                <a href="#" v-bind:style="{ color: activecolor}" @mouseover="activecolor='green'" @mouseleave="activecolor='red'"><font-awesome-icon :icon="['fa', 'shopping-cart']" class="cart_icon"/><b-badge variant="danger">{{itemList.length}}</b-badge>{{ tes }}</a>
                <ul class="dropdown">
                    <li v-for="item in itemList" :key="item.ID">
                      <div @click="$router.push(item.IDEncrypt)">
                        <img :img-src="companyAsset(false, 'product', item.Pic)" width="42" height="42" class="dropdown_image">
                        {{item.Name}}
                        <span class="dropdown_price">{{numberFormat(item.Price,'Rp')}}</span> 
                      </div>
                    </li>
                    <li><div @click="$router.push('/cart')">Show All Cart</div></li>
                </ul>
            </li>
          </ul>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item :to="'editProfile'">Profile</b-dropdown-item>
          <b-dropdown-item :to="'changePassword'">Change Password</b-dropdown-item>
          <b-dropdown-item :to="'/wishlist'">Wishlist</b-dropdown-item>
          <b-dropdown-item @click="logOut()" href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt />
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue'
  export default {
    data() {
      return {
        shoutList: {},
        shoutCount: {},
        menuList: [],
        cartList: [],
        itemList: [],
        activecolor: 'red'
      }
    },
    mounted(){
      //this.update()
    },
    methods: {
      logOut() {
        this.$swal({
          title: "Do you want to log out?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            swal("Log out success", {
              icon: "success",
            });
            this.removeUser()
            this.$router.push('/shiftsoft/login')
          }
        });
      },
      async onRead(shoutid) {
        const res = await axios.patch(
          this.apiUrl("shout/" + shoutid , "GodMode=true"),
          {
            "Status" : 3
          }
        )

        this.checkApiResponse(res.data, {
          onSuccess: () => {
            this.shoutCount.data -= 1
          }
        })
      },
    },
    async created() {
      if (this.getConfiguration().isLogin) {
        this.menuList = JSON.parse(localStorage.getItem('moduleList'))

        const resShout = await axios.get(
          this.apiUrl("shout/list/1" , "&filters[]=user_id|=|" + this.getConfiguration().user.ID + "|and|god")
        );
        if (resShout.data.success == 0) {} 
        else {
          this.shoutList = resShout.data.data
        }

        const resCount = await axios.get(
          this.apiUrl("shout/newcount" , "filtersArr[0][]=user_id|=|" + this.getConfiguration().user.ID + "|god&filtersArr[0][]=status|=|2|god")
        );
        if (resCount.data.success == 0) {} 
        else {
          this.shoutCount = resCount.data
        }
      } 
      else {
        this.$router.push('/shiftsoft/login')
      }
      const res = await axios.get(
        this.apiUrl("product/list", "filters[]=name|like|**|and&with[0]=Category"),
      );
      this.itemList = res.data.data
      const cart = await axios.get(
        this.apiUrl("productcart/list", "filters[]=user_id|=|"+this.getConfiguration().user.ID+"|and|god")
      );
      this.cartList = cart.data.data
      for(var item in this.itemList){
        this.itemList.map((_item,key) => {
          var del = true
          this.cartList.map((cart_item) => {
            if(cart_item.ProductID == _item.ID){
              del = false
            }
          })
          if(del == true){
              Vue.delete(this.itemList,key)
          }
        })
      }
      this.itemList.map((_item,key) => {
        var del = true
        this.cartList.map((cart_item) => {
          if(cart_item.ProductID == _item.ID){
            del = false
          }
        })
        if(del == true){
            Vue.delete(this.itemList,key)
        }
      })
    }
  }
</script>

<style>
  .swal-overlay {
    background-color: rgba(43, 165, 137, 0.45);
  }
  .card:hover{
    background-color: grey;
    opacity:0,9;
  }
  .badge_notif{
    display: block;
    position: absolute;
    top: 8px;
    right: 405px;
    line-height: 16px;
    height: 20px;
    padding: 0 6px;
    font-family: Arial, sans-serif;
    color: white;
    text-shadow: 0 1px rgba(0, 0, 0, 0.25);
    border: 1px solid;
    border-radius: 10px;
    -webkit-box-shadow: inset 0 1px rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.08);
    box-shadow: inset 0 1px rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.08);
  }
  ul{
      padding: 0;
      list-style: none;
  }
  ul li{
      display: inline-block;
      position: relative;
      line-height: 21px;
      text-align: left;
  }
  ul.dropdown_menu li a{
      display: block;
      padding: 8px 25px;
      color: #333;
      text-decoration: none;
  }
  ul.dropdown_menu li a:hover{
      color: rgb(71, 66, 66);
      background: #939393;
  }
  ul li ul.dropdown li div{
      display: block;
      padding: 8px 5px;
      color: #222;
      text-decoration: none;
  }
  ul li ul.dropdown li div:hover{
      color: rgb(1, 66, 66);
      background: #931193;
  }
  ul li ul.dropdown{
      min-width: 100%; /* Set width of the dropdown */
      width: 250px;
      background: #f2f2f2;
      display: none;
      position: absolute;
      z-index: 999;
      left: -100px;
  }
  ul li:hover ul.dropdown{
      display: block; /* Display the dropdown */
  }
  ul li ul.dropdown li{
      display: block;
  }
  .dropdown_image{
    padding-right: 5px;
  }
  .badge {
      display: block;
      position: absolute;
      top: -2px;
      right: 0.01px;
      line-height: 16px;
      height: 16px;
      padding: 0 5px;
      font-family: Arial, sans-serif;
      color: white;
      text-shadow: 0 1px rgba(0, 0, 0, 0.25);
      border: 1px solid;
      border-radius: 10px;
      -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.08);
      box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.08);
  }
  .cart_icon{
    color: darkgray;
  }
</style>
