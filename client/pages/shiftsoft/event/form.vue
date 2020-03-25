<template>
  <div>
    <b-container>
      <b-form pt-50>
        <b-form-group id="input-group" label="Event Image " label-for="input-image">
          <div id="preview" v-if="form.url">
            <img :src="form.url" />
          </div>
          <div id="preview" v-else-if="item.Pic">
            <img :src="companyAsset(false, 'event', item.Pic)" />
          </div>
          <b-form-file
            placeholder="Choose a image or drop it here..."
            drop-placeholder="Drop image here..."
            accept="image/*"
            @change="imageChange"
          ></b-form-file>
        </b-form-group>

        <b-form-group id="input-group-1" label="Event Name " label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.name"
            placeholder="Your event name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Place " label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.place"
            placeholder="Place event will be held"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Start  " label-for="input-7">
          <b-form-input
            id="input-3-date"
            v-model="form.startDate"
            type="date"
            required
          ></b-form-input>
          <b-form-input
            id="input-3-time"
            v-model="form.startTime"
            type="time"
            required

          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="End " label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="form.endDate"
            type="date"
            required
          ></b-form-input>
          <b-form-input
            id="input-4-time"
            v-model="form.endTime"
            type="time"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-5" label="Description " label-for="input-5">
          <b-form-input
            id="input-5"
            v-model="form.description"
            required
            placeholder="Description of your event"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-6" label="Ask RSVP? " label-for="input-6">
          <b-form-checkbox
            id="input-6"
            v-model="form.rsvp"
            value="0"
            unchecked-value="1">
          </b-form-checkbox>
        </b-form-group>
        <b-button type="submit" variant="primary" @click="submit()">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
var pic = null;
var id = ""
export default {
  layout: "admin",
  data() {
    return {
        item:{},
        form:{
            name:"",
            place:"",
            startDate:"",
            startTime:"",
            endDate:"",
            endTime:"",
            description:"",
            rsvp:"",
            url: null,
            picFile: null
        }
    };
  },
  async created() {
    if(this.$route.params.id!=null){
      id = this.$route.params.id
      const res = await axios.get(
      this.apiUrl(
        "event/" + id + "/id-encrypt"
      )
    )
    this.item = res.data.data;
    this.form.name = this.item.Name,
    this.form.place = this.item.Place,
    this.form.description = this.item.Content,
    this.form.picFile = this.item.Pic,
    this.form.startDate = this.$moment(this.item.StartAt).format('YYYY-MM-DD')
    this.form.startTime = this.$moment(this.item.StartAt).format('HH:mm')
    this.form.endDate = this.$moment(this.item.EndAt).format('YYYY-MM-DD')
    this.form.endTime = this.$moment(this.item.EndAt).format('HH:mm')
    }
  },
  methods: {
    imageChange(e){
      this.form.picFile = e.target.files[0];
      this.form.url = URL.createObjectURL(this.form.picFile);

      var reader = new FileReader();
      reader.onload = function() {
        pic = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
        console.log(pic)
      }
      reader.readAsDataURL(this.form.picFile)
    },
    async submit(){
      if(this.$route.params.id!=null){
        const res = await axios.patch(
                this.apiUrl("event/"+ this.item.ID, 'GodMode=true'),
                {
                  "Name":this.form.name,
                  "Place": this.form.place,
                  "Content":this.form.description,
                  "StartAt": this.form.startDate+"T"+this.form.startTime+":00",
                  "EndAt": this.form.endDate+"T"+this.form.endTime+":00"
                }
            )
          if(pic!=null){
            const resp = axios.patch(
                this.apiUrl("changeEventImage/"+ id),
                {
                  "Pic": pic,
                  "PicName" : this.form.picFile.name
                }
            )
          }
          this.checkApiResponse(res.data, {
               onSuccess: () => {
                  this.$router.go(-2)
              }
          })
      }
      else{
        const res = await axios.post(
            this.apiUrl("event"),
            {
              "name": this.form.name,
              "place": this.form.place,
              "content":this.form.description,
              "CircleID":this.getConfiguration().user.CirclesID,
              "StartAt": this.form.startDate+"T"+this.form.startTime+":00",
              "EndAt": this.form.endDate+"T"+this.form.endTime+":00",
              "Pic": pic,
              "PicName" : this.form.picFile.name,
              "FileList": []
            }
        )
        this.checkApiResponse(res.data, {
          onSuccess: () => {
              this.$router.back()
            }
        })
      }
    }
  }
};
</script>
<style>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  height: 200px;
  object-fit: contain;
  padding:15px;
}
</style>
