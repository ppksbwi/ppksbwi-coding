<template>
    <div class="container">
        <div class="row">
            <div class="col-sm" v-for="(table, index) in tableList">
                <button class="button--green" @click="getData(index, table.path)">{{table.name}}</button>
                <div class="col-sm" v-for="field in table.fieldList">
                    <b-badge pill variant="primary" @click="addToFieldList(field)">{{field}}</b-badge>
                </div>
            </div>
        </div>

        <div class="row" v-if="itemList.length > 0">
            <b-table striped hover :items="itemList" :fields="fieldList"></b-table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    layout: 'admin',
    data() {
        return {
            itemList: [],
            fieldList: [
                "ID"
            ],
            tableList: [
                {
                    name: "Transaction",
                    path: "productMasterTransaction",
                    fieldList: ["ID", "Quantity", "TotalPrice"]
                },
                {
                    name: "Event",
                    path: "event",
                    fieldList: ["ID", "Name", "StartAt"]
                },
                {
                    name: "User",
                    path: "user",
                    fieldList: ["ID", "Name", "Nickname"]
                },
                {
                    name: "Asset",
                    path: "asset",
                    fieldList: ["ID", "Name", "UserID"]
                }
            ],
            tableListActive: 0
        }
    },
    methods: {
        addToFieldList(field) {
            let tempIndexOf = this.fieldList.indexOf(field)
            // jila di array field list sudah ada, maka akan dihapus. jika tidak ada akan ditambahkan
            if (tempIndexOf == -1)
                this.fieldList.push(field)
            else this.fieldList.splice(tempIndexOf, 1)

            // rencana untuk join dengan table lain secara otomatis
            if (field.search("ID") != -1 && field.length > 2) {
                this.printHelp(field)
            }

            // jika fieldListnya kosong akan otomatis menampilkan semuanya kembali
            if (this.fieldList.length == 0) {
                this.fieldList = [...this.tableList[this.tableListActive].fieldList]
            }
        },
        async getData(index, tableName) {
            const config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            const res = await axios.get(
                this.apiUrl(tableName + "/list/1"),
                config
            );

            this.itemList = res.data.data
            this.tableListActive = index
            this.fieldList = [...this.tableList[this.tableListActive].fieldList]
            // if (this.itemList.length > 0) {
            //     for(var propName in this.itemList[0]) {
            //         this.fieldList.push(propName)
            //     }
            // }
        }
    },
}
</script>
