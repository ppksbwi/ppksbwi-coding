<template>
  <div>
    <b-img
      :src="companyAsset(false, 'event', item.Pic)"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem;"
      class="mb-2"
    ></b-img>
    <br />
    <b> {{ item.Name }} </b> <br />
    Date : {{ compareDateBetween(item.StartAt, item.EndAt) }} <br />
    Time : {{ timeBetween(item.StartAt, item.EndAt) }} <br />
    Place : {{ item.Place }} <br />
    Description : {{ item.Content }} <br />
    Will you join this event?
    <b-button pill variant="outline-secondary" @click="addAttendance(getConfiguration().user, 1, 1)">Yes</b-button>
    <b-button pill variant="outline-secondary" @click="addAttendance(getConfiguration().user, 0, 1)">No</b-button>
    <b-button pill variant="outline-secondary" @click="addAttendance(getConfiguration().user, -1, 1)">Maybe</b-button>
    <br />

    Attendance :
    <span v-if="item.AttendeeCount > 0">{{ item.AttendeeCount }}
      <b-button pill variant="outline-secondary" v-b-modal.attendance>Show</b-button></span>
    <span v-else>0</span>
    <b-button pill variant="outline-secondary" v-b-modal.addAttendance>Add Attendance</b-button>
    <br />

    Services :
    <span v-if="item.Services">{{ item.Services }}</span>
    <span v-else>0</span><br>
    <b-button variant="warning" @click="edit()">Edit</b-button>

    <b-modal id="attendance" title="Attendance List">
      <li v-for="att in attendanceList" :key="att.ID">
        <span v-if="att.Status = 1">
          <b>{{ att.Name }} </b>
        </span>
      </li>
    </b-modal>

    <b-modal id="addAttendance" title="Add Attendance">
      <v-app>
        <v-card>
          <v-card-text>
            <v-autocomplete
              v-model="model"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              cache-items
              hide-selected
              item-text="Name"
              item-value="Member"
              label="Search Member"
              placeholder="Start typing to Search"
              prepend-icon="mdi-magnify"
              return-object
            >
            <template v-slot:no-data v-if="search != null">
                No User Found <br />
                <b-button pill variant="outline-primary" @click="addGuest()">Add {{search}} as Guest</b-button>
            </template>
            </v-autocomplete>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <div v-if="!model">
          <li v-for="att in circleList" :key="att.ID" >
            <span v-if="checkAttendance(att.ID)">
                <b>{{ att.Name }} </b>
            </span>
            <span v-else>
                {{ att.Name }}
            </span>
            <v-switch :input-value="checkAttendance(att.ID)" @change="addAttendance(att,-1,0)"></v-switch>
          </li>
        </div>
        <div v-else>
            {{ model.Name }}
            <v-switch :input-value="checkAttendance(model.ID)" @change="addAttendance(model,-1,0)"></v-switch>
        </div>
      </v-app>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  layout: "admin",
  components: {
  },
  data() {
    return {
      item: {},
      attendanceList: [],
      circleList: [],
      items: [],
      isLoading: false,
      model: null,
      search: null,
    };
  },
  async created() {
    const res = await axios.get(
      this.apiUrl(
        "event/" + this.$route.params.id + "/id-encrypt"
      )
    );
    this.item = res.data.data;
    this.getAttendanceList();
    if(this.checkAttendance(this.getConfiguration().user.ID)){
      alert("You're going to attend this Event");
    }
    const response = await axios.get(
      this.apiUrl(
        "event/" + this.$route.params.id + "/id-encrypt",
        "&with[0]=Circle.Childs.Members&with[1]=Circle.Members"
      )
    );
    this.circleList = response.data.data.Circle.Members;
  },
  methods: {
    async getAttendanceList(){
      this.attendanceList = []
      const resp = await axios.get(
        this.apiUrl(
          "attendance/list",
          "with[0]=User&filters[]=event_id|=|" + this.item.ID + "|and|god"
        )
      );
      this.attendanceList = resp.data.data;
      console.log(this.attendanceList)
    },
    checkAttendance(ID) {
      var x;
      for (x of this.attendanceList) {
        console.log(x.UserID + " = " + x.Status)
        if (ID == x.UserID) {
          if(x.Status == 1)
            return true;
        }
      }
      return false;
    },
    async addAttendance(user, co, cek) {
      if(cek==0){
        if(this.checkAttendance(user.ID)==false){
          co = 2
        }
        else{
          co = -2
          const res = await axios.patch(
            this.apiUrl("attendance/"+user.IDEncrypt, "delete=1"),
            {
              "eventID": this.item.IDEncrypt,
              "userID": user.IDEncrypt,
            }
          );
          this.checkApiResponse(res.data)
        }
      }
      if(co!=-2){
        const res = await axios.post(
          this.apiUrl("attendance"),
          {
            "eventID": this.item.IDEncrypt,
            "userID": user.IDEncrypt,
            "status": co
          }
        );
        this.checkApiResponse(res.data)
      }
      this.getAttendanceList();
      if(cek==0){
        this.model=null
        this.$bvModal.hide("addAttendance")
      }
    },
    edit(){
      this.$router.push({name:'event-form',params:{id:this.$route.params.id}})
    },
    async addGuest(){
      const response = await axios.post(
        this.apiUrl("user", "guest=true"),{
          "Name":this.search,
          "CircleID": this.getConfiguration().user.CircleID
        }
      );
      this.checkApiResponse(response.data)
      this.$bvModal.hide("addAttendance")
    }
  },
  watch: {
    async search (val) {
      // Items have already been loaded
      if (this.items.length > 0)
        this.items=null
      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      const res = await axios.get(
        this.apiUrl(
          "user/list", "/&guest=true&key=" + val + "&with[0]=Circles"
        )
      );
      console.log(res.data.data)
      this.items = res.data.data

      this.isLoading = false
    }
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
