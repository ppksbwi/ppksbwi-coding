<template>
<div class="d-flex justify-content-center h-100">
    <b-card no-body class="col-md-11" title="Regist" style="height:100%">
        <b-card-body class="p-4 m-4">
            <form method="post" @submit.prevent="register">
              <h1 align="center">REGISTER</h1>
              <div style="padding-bottom: 2%;">
                <label class="input_label">Email</label>
                <input type="email"
                    class="form-control"
                    v-model="email"
                    required
                    placeholder="Masukkan alamat email">
              </div>

              <div style="padding-bottom: 2%;">
                <label class="input_label">Username</label>
                    <div v-if="username === ''">
                        <b-input v-model="username"
                        placeholder="Masukkan username"
                        required
                        id="feedback-user" />
                    </div>
                    <div v-else>
                        <b-input v-model="username"
                        placeholder="Masukkan username"
                        :state="validation"
                        required
                        id="feedback-user" />
                      <b-form-invalid-feedback :state="validation">
                          Your user ID must be 6-12 characters long.
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback :state="validation">
                          Looks Good.
                      </b-form-valid-feedback>
                    </div>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Password</label>
                  <b-form-group
                    id="fieldset-1"
                    label-for="input-1"
                    :invalid-feedback="invalidFeedback"
                    :valid-feedback="validFeedback"
                    :state="state">
                    <b-form-input 
                      type="password" 
                      id="input-1" 
                      v-model="pass" 
                      :state="state" 
                      placeholder="Masukkan password"
                      required>
                      </b-form-input>
                  </b-form-group>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Nama Pertama</label>
                  <input type="text"
                      class="form-control"
                      v-model="first_name"
                      required
                      placeholder="Masukkan nama lengkap"/>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Nama Keluarga</label>
                  <input type="text"
                      class="form-control"
                      v-model="last_name"
                      required
                      placeholder="Masukkan nama lengkap"/>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Alamat</label>
                  <input type="text"
                      class="form-control"
                      required
                      v-model="address"
                      placeholder="Masukkan alamat"/>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Peran</label>
                  <b-form-select
                    v-model="role"
                    :options="roles"
                    required
                  ></b-form-select>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Nomor Telepon</label>
                  <div class="input-group form-group">
                  <div class="input-group-prepend">
                      <span class="input-group-text bg-primary inverse">+62</span>
                  </div>
                  <input type="number"
                      class="form-control"
                      v-model="phone_number"
                      placeholder="8123456789"/>
                  </div>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Tanggal Lahir</label>
                  <input type="date"
                      class="form-control"
                      v-model="birthdate"/>
              </div>

              <div style="padding-bottom: 2%;">
                  <label class="input_label">Foto KTP</label>
              <b-form-group>
                <b-form-file id="file-default" required></b-form-file>
              </b-form-group>
              </div>

              <center>
                <div class="form-group">
                  <!-- <b-button type="submit" class="btn-lg btn-primary" style="position: absolute;" v-b-modal.modal-center>Register</b-button> -->
                    <input type="submit"
                        value="Register"
                        class="btn-lg btn-primary"
                        style="position: absolute;"/>
                </div>
              </center>
              <!-- modal -->
              <b-modal id="modal-center"
                  centered
                  title="Attention">
                  <p class="my-4">OTP code has been sent to your phone number</p>
              </b-modal>
            </form>
        </b-card-body>
    </b-card>
</div>
</template>
<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import CardTitle from '@/components/Base/Card/CardTitle'

export default {
  components: {
    CardTitle
  },
  layout: 'admin',
  meta: {

  },
  head: {
    bodyAttrs: {
    }
  },
  computed: {
    validation () {
      return this.username.length > 5 && this.username.length < 13
    },
    state() {
      if(this.pass.length>0){
        this.start = 1;
      }
      if (this.start > 0){
        var reg = /^(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,30}$/
        return reg.test(this.pass)
      }
    },
    invalidFeedback() {
      var reg = /^(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,30}$/
      if (reg.test(this.pass) == false && this.pass != '' && this.start>0) {
        return 'Min. 8 characters with at least one capital letter, a number and a special character.'
      } else if (this.start>0 && this.pass == ''){
        return 'Please enter something'
      }
    },
    validFeedback() {
      return this.state === true ? 'You have a strong password!' : ''
    }
  },
  data() {
      return {
        role: 2,
        username: 'XYZ',
        pass:'AFDFSFS!aaa24234',
        email: 'aa@aa.com',
        first_name: 'Abcascas',
        last_name: 'Babababa',
        address: "aaaaaa",
        phone_number: "971232131",
        birthdate: '2020-02-26',
        start: 0,
        roles: [
          { value: null, text: 'Pilih peran anda', disabled: 'disabled' },
          { value: 1, text: 'Petani'},
          { value: 2, text: 'Pengepul' },
          { value: 3, text: 'Penjual' }
        ],
        // rules: {
        //   required: value => !!value || "Required.",
        //   password: value => {
        //     const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        //     return (
        //       pattern.test(value) ||
        //       "Min. 8 characters with at least one capital letter, a number and a special character."
        //     );
        //   }
        // },
        value_eye:true,
        modalShow: false,
        show: false,
        variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        bodyBgVariant: 'light',
        bodyTextVariant: 'dark',
        footerBgVariant: 'warning',
        footerTextVariant: 'dark'
      }
    },
    methods: {
    async register(){
      const config ={
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        }
      }

      const res = await axios.post(
        "http://pp-ksbwi.com:8000/users/",
        {        
        "username": this.username,
        // "fullname": this.fullname,
        "first_name": this.first_name,
        "last_name": this.last_name,
        "password": this.pass,
        "address": this.address,
        "email": this.email,
        "phone_number": this.phone_number,
        "birthdate": this.birthdate,
        "active": 1,
        "ktp": "123456",
        "role": this.role
        },
          config
        );
        console.log(res)
        alert("Registration success!");
        this.$router.push('/registration')
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    hideModal () {
      this.$refs['my-modal'].hide()
    },

    toggleModal () {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['my-modal'].toggle('#toggle-btn')
    }
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
.card-body{
  display: hidden;
}

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
  height: 1100px;
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


