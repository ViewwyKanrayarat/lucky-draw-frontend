<template>
  <div class="d-flex justify-center align-center mt-10">
    <div class="title">Top Name Lucky Draw</div>
    <div><v-img width="60" src="../icon/medal.png"></v-img></div>
  </div>
  <div class="d-flex justify-center">
    <div class="layout-card" v-if="loadingDraw">
      <div class="layout-style" v-for="(i, index) in data" :key="index">
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
    <v-card v-else class="card-top10" color="#ea3546" width="500">
      <div class="text-center">Please wait admin random</div>
    </v-card>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRandomUser } from "../../stores/randomUser"
import confetti from "canvas-confetti"

let store = useRandomUser()
let data = reactive([])
const loadingDraw = ref(false)

const refresh = setInterval(() => {
  store.getRandomUser()
  if (store.Data.length) {
    launchConfetti()
    Object.assign(data, store.Data)
    loadingDraw.value = true
    clearInterval(refresh)
  }
}, 5000)

onMounted(() => {
  refresh
})

const launchConfetti = () => {
  confetti({
    particleCount: 1000,
    spread: 100,
    origin: { y: 0.6 },
  })
}
</script>

<style scoped>
.title {
  margin-top: 50px;
  color: #3d348b;
  text-shadow: 3px 2px #7678ed;
  font-size: 70px;
  font-weight: 600;
  padding-right: 20px;
  margin-bottom: 50px;
}

.text-top10 {
  font-size: 18px;
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
