<template>
<div class="d-flex justify-content-center h-100">
    <b-card no-body class="col-md-11" title="Regist">
        <b-card-body class="p-4 m-4">
            <b-form >
              <h1 align="center">LOGIN</h1>
                <div style="padding-bottom: 2%;">
                    <label class="input_label">Email</label>
                    <input type="text"
                        class="form-control"
                        v-model="auth.email"
                        placeholder="Masukkan email anda"/>
                  </div>

                  <div style="padding-bottom: 2%;">
                    <label class="input_label">Password</label>
                    <input type="password"
                        class="form-control"
                        v-model="auth.password"
                        placeholder="Masukkan password anda"/>
                </div>

                <center>
                  <div class="form-group">
                      <input type="submit"
                          value="Login"
                          @click="submit"
                          class="btn-lg btn-primary"
                          style="position: absolute;"/>
                  </div>
                </center>
            </b-form>
        </b-card-body>
    </b-card>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapMutations } from 'vuex'
import CardTitle from '@/components/Base/Card/CardTitle'

export default {
    auth: false, //JADI KITA SET FALSE AGAR MIDDLEWARE TIDAK DITERAPKAN PADA HALAMAN INI
    data() {
        return {
            //VARIABLE UNTUK MENAMPUNG INPUTAN USER
            auth: {
                email: null,
                password: null
            }
        }
    },
    components: {
        CardTitle
    },
    layout: 'admin',
    mounted() {
        //KITA LAKUKAN PENGECEK, JIKA SUDAH LOGIN
        if (this.$auth.loggedIn) {
            //MAKA REDIRECT KE HALAMAN UTAMA ATAU DASHBOARD
            this.$router.push('/registration')
        }
    },
    methods: {
        ...mapMutations(['SET_IS_AUTH']), //LOAD MUTATIONS DARI ROOT VUEX (STORE/INDEX.JS)
        async submit() {
            try {
                await this.$auth.loginWith('local', {
                data: {
                    email: this.auth.email,
                    password: this.auth.password
                }
                }).then(() => {
                //JIKA BERHASIL, KITA SET TRUE IS AUTH-NYA
                this.SET_IS_AUTH(true)
                //LALU REDIRECT KE HALAMAN UTAMA / DAHSBOARD dimana ya ce wkwkwkw wlwlwl aku ya lupa
                this.$router.push('/') 
            })

               // // this.$router.push('/')
            } catch (e) {
                this.error = e.response.data.message
            }
        }
        
        
        //JIKA TOMBOL LOGIN DITEKAN, MAKA METHOD INI AKAN DIJALANKAN
        // submit() {
        //     //MELAKUKAN PROSES LOGIN, DENGAN MENGGUNAKAN STRATEGIES LOCAL YANG ADA DI NUXT CONFIG
        //     //DAN MENGIRIMKAN DATA BERUPA EMAIL DAN PASSWORD
        //     this.$auth.loginWith('local', {
        //         data: {
        //             email: this.auth.email,
        //             password: this.auth.password
        //         }
        //     }).then(() => {
        //         //JIKA BERHASIL, KITA SET TRUE IS AUTH-NYA
        //         this.SET_IS_AUTH(true)
        //         //LALU REDIRECT KE HALAMAN UTAMA / DAHSBOARD dimana ya ce wkwkwkw wlwlwl aku ya lupa
        //         this.$router.push('/registration') 
        //     })
        // }
    }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body.bg-image1 > div,
body.bg-image1 > div > div {
  height: 100%;
}

</style>

<style lang="scss" scoped>
.input_label {
  font-size: 120%;
}

::v-deep .ig-page-wrapper {
  height: 100%;
}

.container {
  height: 100%;
  align-content: center;
}

.card {
  height: 400px;
  margin-top: 5%;
  width: 430px;
  margin-bottom: 5%;
}

.card-footer {
  font-size: 0.75rem;
}

.social_icon span {
  font-size: 40px;
  margin-left: 10px;
}

.social_icon span:hover {
  cursor: pointer;
}

.card-header h3 {
  color: rgb(40, 40, 40);
}

.input-group-prepend span {
  width: 40px;
  color: rgb(255, 255, 255);
  border: 0 !important;
}

input:focus {
  outline: 0 0 0 0 !important;
  box-shadow: 0 0 0 0 !important;
}

.remember {
  color: rgb(43, 43, 43);
}

.remember input {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  margin-right: 5px;
}

.login_btn {
  color: #ffffff;
  width: 100px;
}

.links {
  color: rgb(0, 0, 0);
}

.links a {
  margin-left: 4px;
}

.right-bar i {
  color: var(--theme1-mixed-1);
  font-size: 30px;
}

</style>


