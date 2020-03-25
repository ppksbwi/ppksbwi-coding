<template>
    <div>
        <!-- <b-button @click=getDownloadList() variant="primary">Refresh</b-button> -->
        <!-- <a href="asd.vue" target="_blank" download>
                <b-button>test</b-button>
        </a> -->
        <div v-for="(item, index) in downloadList" :key="index">
            {{item.Name}}
            <b-button @click=downloadItem(item.File)>Download</b-button>
            <br><br>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    created() {
        this.getDownloadList()
    },
    data() {
        return {
            user: {},
            downloadList: []
        }
    },
    methods: {
        // handle(evt){
        //     evt.preventDefault()
        // },
        async getDownloadList(){
            //downloadList -> array berisi item-item yang available untuk didownload user
            const res = await axios.get(this.apiUrl("download/list", "with[0]=Filetype"))
            let itemList = res.data.data
            //Melakukan pengecekan untuk masing-masing item
                
            itemList.map((item) => {
                let available = true
                //Pengecekan level item.
                //Jika item memiliki list level, maka item akan available jika level user terdapat didalam list level item.
                //Jika item tidak memiliki list level, maka item langsung available
                if(item.Levels != null){
                    available = false
                    item.Levels.map((itemLevel) => {
                        if (this.getConfiguration().user.LevelID == itemLevel.ID) {
                            available = true
                        }
                    })
                }
                //Pengecekan belong item. (hanya jika item tidak available setelah pengecekan level)
                //Jika item memiliki list belong, maka item akan available jika id user terdapat didalam list belong item.
                //Jika item tidak memiliki list belong, maka item langsung available
                if(item.Belongs != null && !available){
                    available = false
                    item.Belongs.map((itemBelong) => {
                        if (this.getConfiguration().user.ID == itemBelong.ID) {
                            available = true
                        }
                    })
                }
                //Jika lolos pengecekan, item dimasukkan ke downloadList
                if(available) {
                    this.downloadList.push(item)
                }
            })
        },
        downloadItem(file){
            this.printHelp(this.companyAsset(false, 'download', file))
            //Meng-prompt proses download via anchor(a) tag di new tab (HANYA UNTUK LOCAL FILES)
            let bufferElement = document.createElement('a')
            bufferElement.setAttribute('href', this.companyAsset(false, 'download', file))
            bufferElement.setAttribute('target', '_blank')
            bufferElement.setAttribute('download', true)
            bufferElement.style.display = 'none';
            document.body.appendChild(bufferElement);
            bufferElement.click();
            document.body.removeChild(bufferElement);

            // function onStartedDownload(id) {
            //     console.log(`Started downloading: ${id}`);
            // }
            // function onFailed(error) {
            //     console.log(`Download failed: ${error}`);
            // }
            // var downloadUrl = "https://example.org/image.png";
            // var downloading = this.browser.downloads.download({
            //     url : downloadUrl,
            //     filename : 'my-image-again.png',
            //     conflictAction : 'uniquify'
            // });
            // downloading.then(onStartedDownload, onFailed);
        },
        created() {
            // document.getElementsByTagName("a").addEventListener("click", handle());
        }
    }
}
</script>