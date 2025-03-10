<template>
  <div class="layout">
    <v-btn color="#7678ed" @click="dialog = !dialog">Add User</v-btn>
    <v-data-table-server
      class="mt-5"
      :headers="headers"
      :items="paginatedData"
      :items-length="pagination.total"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
      @update:page="changeNewPage"
      @update:items-per-page="changeNewItems"
      :loading="loadingSave"
      :mobile="sm || xs"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="primary" @click="edit(item)"></v-btn>
        <v-btn icon="mdi-trash-can-outline" variant="text" color="#E74444" @click="deleteItem(item)"></v-btn> </template
    ></v-data-table-server>
    <div class="layout-title">
      <div class="title">Lucky Draw</div>
      <div><v-img width="60" src="../icon/medal.png"></v-img></div>
    </div>

    <div class="d-flex justify-center mt-12">
      <v-card @click="randomUser" class="card" color="#fa8612" width="600" height="200">
        <div class="dot d-flex justify-center">
          <v-card color="#E74444" class="card-in" width="550" height="150">
            <div v-if="!loadingDraw">
              <v-btn size="x-large" rounded="lg" color="#ffd23f">Draw</v-btn>
            </div>
            <div v-else>
              <v-progress-circular :size="100" :width="15" color="primary" indeterminate></v-progress-circular>
            </div>
          </v-card>
        </div>
      </v-card>
    </div>
    <div v-if="!loadingDraw && random.length > 0">
      <div class="title" style="margin-top: 120px; margin-bottom: 50px">Top 10 winners.</div>
      <div class="layout-card">
        <div class="layout-style" v-for="(i, index) in random" :key="index">
          <div class="card-wrapper">
            <div class="position">
              <v-avatar size="40">
                <v-img src="/icon/crown.png"></v-img>
              </v-avatar>
            </div>
            <v-card class="card-top10">
              <div class="text-top10">{{ i.first_name }} {{ i.last_name }}</div>
            </v-card>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-center mt-12">
      <v-btn @click="exportUserRandom" :disabled="loadingDraw || random.length == 0">Export</v-btn>
    </div>
  </div>
  <DialogsForm ref="form" v-model:dialog="dialog" :title="formTitle" :icon="formIconTitle" :subTitle="formTitle" width="1500">
    <template v-slot:form>
      <v-container class="pa-12">
        <v-row>
          <v-col cols="12">
            <div>ชื่อ</div>
            <v-text-field v-model="editedItem.first_name" placeholder="กรุณากรอกชื่อ"></v-text-field>
          </v-col>
          <v-col cols="12">
            <div>นามสกุล</div>
            <v-text-field v-model="editedItem.last_name" placeholder="กรุณากรอกนามสกุล"></v-text-field>
          </v-col>
          <v-col cols="12">
            <div>email</div>
            <v-text-field v-model="editedItem.email" placeholder="กรุณากรอก email"></v-text-field>
          </v-col>
          <v-col cols="12">
            <div>เพศ</div>
            <v-select v-model="editedItem.gender" :items="gender" label="กรุณาเลือกเพศ"> </v-select>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:actions="{ valid }">
      <v-row>
        <v-col>
          <v-btn variant="flat" @click="save" block color="primary" :disabled="!valid"> บันทึก </v-btn>
        </v-col>
        <v-col><v-btn variant="flat" block color="error" @click="close">ยกเลิก</v-btn></v-col>
      </v-row>
    </template>
  </DialogsForm>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid"
import file1 from "../dataUser/MOCK_DATA.json"
import { onMounted, reactive, ref, computed } from "vue"
import { useRandomUser } from "../../stores/randomUser"
import DialogsForm from "../../components/form/DialogsForm.vue"
import confetti from "canvas-confetti"
import { useDisplay } from "vuetify"

const { sm, xs } = useDisplay()
let store = useRandomUser()
const loadingDraw = ref(false)
const loadingSave = ref(false)
let dataAll = ref([])
let exportUser = ref([])
const random = reactive([])
const editedIndex = ref(-1)
const editedItem = reactive({
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  gender: "",
})
const defaultItem = reactive({
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  gender: "",
})
const gender = ["Female", "Male", "Agender", "Bigender", "Genderqueer", "Polygender", "Genderfluid"]
const headers = ref([
  { title: "name", align: "center", key: "first_name", sortable: false },
  { title: "lastname", align: "center", key: "last_name", sortable: false },
  { title: "email", align: "center", key: "email", sortable: false },
  { title: "gender", align: "center", key: "gender", sortable: false },
  { title: "actions", align: "center", key: "actions", sortable: false },
])
const pagination = reactive({
  page: 1,
  row: 10,
  total: 0,
})

// Form
const dialog = ref(false)
const formIconTitle = computed(() => (editedIndex.value === -1 ? "mdi-plus-circle" : "mdi-pencil"))
const formTitle = computed(() => (editedIndex.value === -1 ? "เพิ่มข้อมูล user" : "แก้ไขข้อมูล user"))

const paginatedData = computed(() => {
  const start = (pagination.page - 1) * pagination.row
  const end = start + pagination.row
  return dataAll.value.slice(start, end)
})

function changeNewPage(page) {
  loadingSave.value = true
  pagination.page = page
  loadingSave.value = false
}

function changeNewItems(itemsPerPage) {
  loadingSave.value = true
  pagination.row = itemsPerPage
  pagination.page = 1
  loadingSave.value = false
}

onMounted(() => {
  store.clearRandom()
  let data = [...file1]
  dataAll.value = data.map((item) => ({
    ...item,
    id: uuidv4(),
  }))
  pagination.total = dataAll.value.length
})

// Edit
function edit(item) {
  editedIndex.value = dataAll.value.indexOf(item)
  Object.assign(editedItem, item)
  dialog.value = true
}

function save() {
  if (editedIndex.value > -1) {
    const index = dataAll.value.findIndex((item) => item.id === editedItem.id)
    dataAll.value[index] = { ...editedItem }
    close()
  } else {
    const newUser = Object.assign({}, editedItem)
    newUser.id = uuidv4()
    dataAll.value = [...dataAll.value, newUser]
    pagination.total = dataAll.value.length
    close()
  }
}

function close() {
  dialog.value = false
  editedIndex.value = -1
  Object.assign(editedItem, defaultItem)
}

function deleteItem(items) {
  dataAll.value = dataAll.value.filter((item) => item.id !== items.id)
}

function randomUser() {
  loadingDraw.value = true
  random.splice(0, random.length)
  store.data.splice(0, store.data.length)
  for (let i = 0; i < 10; i++) {
    const randomData = dataAll.value[Math.floor(Math.random() * dataAll.value.length)]
    random.push(randomData)
  }
  store.sendRandom(random)

  setTimeout(() => {
    loadingDraw.value = false
    launchConfetti()
  }, 5000)
}

const launchConfetti = () => {
  confetti({
    particleCount: 1000,
    spread: 100,
    origin: { y: 0.6 },
  })
}

function exportFile(filename, arr) {
  const text = arr.join("\n")
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportUserRandom() {
  exportUser.value.splice(0, exportUser.value.length)
  for (let i = 0; i < random.length; i++) {
    exportUser.value.push(`${random[i].first_name} ${random[i].last_name}`)
  }
  exportFile("userName.txt", exportUser.value)
}
</script>

<style scoped>
:deep .v-table {
  /* background-color: rgb(226, 231, 236) !important; */
  border-radius: 20px !important;
}

.layout {
  background-color: #12befa;
  padding: 60px;
}

.layout-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.title {
  color: #3d348b;
  text-shadow: 3px 2px #7678ed;
  font-size: 70px;
  font-weight: 600;
  padding-right: 20px;
  text-align: center;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
}

.card-in {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  background-image: url("/background/bg.jpg");
}

.card-in:hover {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  background-image: url("/background/bg1.jpg");
}

.dot {
  border-style: dotted;
  border-radius: 30px;
  border-width: 10px; /* เพิ่มความหนาของขอบ */
  width: 580px;
  color: #f6ff3d;
}

.text {
  color: #3d348b;
  text-shadow: 3px 2px #7678ed;
  font-size: 50px;
}

.layout-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}

.layout-style {
  display: flex;
  justify-content: center;
  width: 20%;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.position {
  position: absolute;
  top: 0px;
  left: 10%;
  transform: translateX(-50%) rotate(3200deg);
  z-index: 1;
}

.card-top10 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 200px;
  padding: 40px;
  border-radius: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: white;
  font-size: 20px;
  font-weight: 600;
  box-shadow: 10px 10px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to bottom right, #e74444, rgb(233, 120, 120));
}

.text-top10 {
  font-size: 18px;
}

@media only screen and (max-width: 1250px) {
  .layout-style {
    width: 33%;
  }
}

@media only screen and (max-width: 850px) {
  .layout-style {
    width: 45%;
  }

  .title {
    font-size: 50px;
  }
}

@media only screen and (max-width: 600px) {
  .layout-style {
    width: 90%;
  }

  .layout {
    padding: 20px;
  }

  .title {
    font-size: 30px;
  }
}
</style>
