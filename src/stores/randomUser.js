import axios from "axios"
import { defineStore } from "pinia"

export const useRandomUser = defineStore("randomUser", {
  state: () => ({
    data: [],
  }),
  getters: {
    Data(state) {
      return state.data
    },
  },
  actions: {
    async getRandomUser() {
      try {
        const response = await axios.get(`http://127.0.0.1:3000`)
        this.data = response.data
      } catch (error) {
        console.error("Fetch error:", error)
      }
    },
    async sendRandom(data) {
      try {
        const response = await axios.post(`http://127.0.0.1:3000`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        return { status: response.status, data: response.data }
      } catch (error) {
        console.error("Fetch error:", error)
      }
    },
    async clearRandom() {
      try {
        const response = await axios.delete(`http://127.0.0.1:3000`)
        return { status: response.status, data: response.data }
      } catch (error) {
        console.error("Fetch error:", error)
      }
    },
  },
})
