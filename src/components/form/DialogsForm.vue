<script setup>
import { computed, defineEmits, defineExpose, defineProps, ref } from 'vue'
const valid = ref(false)
const form = ref(null)
const validate = () => {
  form.value?.validate()
}

defineExpose({
  validate,
  valid,
})
// กำหนด props
const props = defineProps({
  dialog: Boolean,
  icon: {
    type: String,
    default: 'mdi-cog',
  },
  title: {
    type: String,
    default: 'untitled',
  },
  subTitle: {
    type: String,
    default: 'กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งาน',
  },
  width: {
    type: String,
    default: '500',
  },
})

// ประกาศตัวแปร emit
const emit = defineEmits(['update:dialog'])

// Computed property for dialog
const dialog = computed({
  get: () => props.dialog,
  set: value => emit('update:dialog', value),
})
</script>

<template>
  <div>
    <div class="text-center mt-6">
      <v-dialog
        v-model="dialog"
        :max-width="props.width"
      >
        <v-card class="overflow-auto">
          <v-card-title>
              <div class="title-card">
                <v-icon
                  :icon="props.icon"
                  color="#8C57FF"
                  size="24"
                ></v-icon>
                <div class="title-form-style">{{ props.title }}</div>
              </div>
              <div class="detail-form-style">กรอกข้อมูลเพื่อ{{ props.subTitle }}</div>
            
          </v-card-title>
          <hr class="line" />
          <v-card-text class="pt-4 main-card">
            <v-form
              ref="form"
              v-model="valid"
            >
              <slot name="form"> </slot>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <slot
              name="actions"
              :valid="valid"
            >
            </slot>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';


.title-card {
  display: flex;
  align-items: center;
  padding-inline: 20px;
}

.title-form-style {
  color: #8c57ff;
  font-family: Prompt, sans-serif !important;
  font-size: 24px;
  font-weight: 500;
  padding-inline-start: 10px;
}

.detail-form-style {
  color: gray;
  font-family: Prompt, sans-serif !important;
  font-size: 16px;
  font-weight: 300;
  padding-inline: 20px;
}

.line {
  border: 1px solid gray;
}
</style>
