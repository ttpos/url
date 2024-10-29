<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'

import type { Form, FormSubmitEvent } from '#ui/types'
import type { ImageSettings } from 'qrcode.vue'

definePageMeta({
  middleware: ['protected'],
})

const requestURL = useRequestURL()
const { t } = useI18n()

const fileRef = ref<HTMLInputElement>()

// 'L' | 'M' | 'Q' | 'H'
const styleList = [
  {
    name: 'L',
    icon: 'i-mynaui:letter-l',
  },
  {
    name: 'Q',
    icon: 'i-mynaui:letter-q',
  },
  {
    name: 'M',
    icon: 'i-mynaui:letter-m',
  },
  {
    name: 'H',
    icon: 'i-mynaui:letter-h',
  },
]

const colorList = [
  '#000000',
  '#DE3121',
  '#EF8000',
  '#198639',
  '#229CE0',
  '#2A5BD7',
  '#6B52D1',
  '#D84280',
]

// Variables
const state = reactive({
  longUrl: '',
  title: '',
  domain: '',
  customSuffix: '',
  generateQrCode: false,
  avatar: '',
  group: '',
  selectedLevel: 'L',
  selectedColor: '#000000',
}) as any

const schema = z.object({
  longUrl: z
    .string()
    .url(t('qrc.create.validUrl'))
    .min(1, t('qrc.create.requiredField')),
  title: z.string().optional(),
  domain: z.string().min(1, t('qrc.create.requiredField')),
  customSuffix: z.string().optional(),
  generateQrCode: z.boolean(),
  group: z.string().optional(),
})

type Schema = z.infer<typeof schema>

const formRef = ref<Form<Schema> | null>(null)

// Computed
const groupOptions = computed(() => [
  { label: t('qrc.create.group1'), value: 'group-1' },
  { label: t('qrc.create.group2'), value: 'group-2' },
  { label: t('qrc.create.group3'), value: 'group-3' },
])

const qrcodePreviewUrl = computed(() => {
  const baseUrl = `${requestURL.protocol}//${requestURL.host}`
  return `${baseUrl}/qrc/preview/${encodeURIComponent(state.longUrl)}`
})

const imageSettings = computed<ImageSettings>(() => ({
  src: state.avatar || 'i-mynaui:letter-h',
  width: 30,
  height: 30,
  excavate: true,
}))

// Functions
function resetQrcode() {
  state.avatar = ''
  state.selectedLevel = 'L'
  state.selectedColor = '#000000'
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // eslint-disable-next-line no-console
    console.log(event.data)
    // TODO: Implement API call to create short link and show feedback to user
  }
  catch (error) {
    console.error(error)
    // TODO: Show error feedback to user
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  state.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <SubPage :title="$t('qrc.create.title')">
    <UForm
      ref="formRef"
      :schema="schema"
      :state="state"
      class="w-full lg:w-4/5 2xl:w-3/5 space-y-6"
      @submit="onSubmit"
    >
      <UFormGroup
        :name="$t('qrc.create.redirectUrl')"
        :label="$t('qrc.create.redirectUrl')"
        :help="$t('qrc.create.remainingLinks', { count: 10 })"
      >
        <UInput
          v-model="state.longUrl"
          :placeholder="$t('qrc.create.singleUrlPlaceholder')"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('qrc.create.linkTitle')"
        name="title"
        :hint="$t('common.operation.optional')"
      >
        <UInput
          v-model="state.title"
          :placeholder="$t('qrc.create.singleTitlePlaceholder')"
        />
      </UFormGroup>

      <UFormGroup name="group" :label="$t('qrc.create.group')">
        <USelect
          v-model="state.group"
          :placeholder="$t('qrc.create.selectPlaceholder')"
          :options="groupOptions"
        />
      </UFormGroup>

      <div class="flex flex-col lg:flex-row lg:content-center lg:items-center lg:justify-between gap-6 lg:gap-4 text-sm">
        <div>
          <UFormGroup
            :label="$t('qrc.create.style')"
            class="flex-1 mt-5"
            :ui="{ label: { wrapper: 'mb-4' } }"
          >
            <!-- <div class="mx-auto flex flex-wrap items-center justify-between gap-4"> -->
            <div class="mx-auto flex flex-wrap justify-start gap-4">
              <span
                v-for="style in styleList"
                :key="style.name"
                class="relative w-12 h-12 flex-shrink-0 rounded-full cursor-pointer transition-transform duration-200 flex items-center justify-center bg-black"
                :class="[
                  state.selectedLevel === style.name
                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-primary-500 dark:ring-offset-gray-900'
                    : 'hover:scale-110 hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 dark:hover:ring-gray-600',
                ]"
                @click="() => (state.selectedLevel = style.name)"
              >
                <UIcon :name="style.icon" class="w-10 h-10 flex-shrink-0" />
              </span>
            </div>
          </UFormGroup>
          <UFormGroup
            :label="$t('qrc.create.color')"
            class="flex-1 mt-5"
            :ui="{ label: { wrapper: 'mb-4' } }"
          >
            <div class="mx-auto flex flex-wrap justify-start gap-4">
              <span
                v-for="color in colorList"
                :key="color"
                :style="{ backgroundColor: color }"
                class="relative w-12 h-12 flex-shrink-0 rounded-full cursor-pointer transition-transform duration-200"
                :class="[
                  state.selectedColor === color
                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-primary-500 dark:ring-offset-gray-900'
                    : 'hover:scale-110 hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 dark:hover:ring-gray-600',
                ]"
                @click="() => (state.selectedColor = color)"
              />
            </div>
          </UFormGroup>

          <UFormGroup
            name="avatar"
            :label="$t('qrc.create.logo')"
            class="flex-1 mt-5"
            :help="$t('qrc.create.logoHelpText')"
            :ui="{
              label: { wrapper: 'mb-4' },
              container: 'flex flex-wrap items-center gap-3',
              help: 'mt-0',
            }"
          >
            <UAvatar :src="state.avatar" size="lg" />

            <UButton
              :label="$t('qrc.create.selectFile')"
              color="white"
              size="md"
              @click="onFileClick"
            />

            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            >
          </UFormGroup>
        </div>

        <div class="flex flex-col items-center ml-4">
          <p class="mb-2 block font-medium text-gray-700 dark:text-gray-200">
            {{ $t('qrc.create.preview') }}
          </p>

          <QrcodeVue
            class="wh-100 rounded-md"
            :size="180"
            :margin="2"
            :level="state.selectedLevel"
            :foreground="state.selectedColor"
            :value="qrcodePreviewUrl"
            :image-settings="imageSettings"
          />

          <UButton
            class="mt-4"
            :padded="false"
            color="gray"
            variant="link"
            icon="i-ic:baseline-settings-backup-restore"
            :label="$t('qrc.create.reset')"
            @click="resetQrcode"
          />
        </div>
      </div>

      <div class="flex space-x-4">
        <UButton variant="outline" @click="formRef && formRef.clear()">
          {{ $t('common.operation.reset') }}
        </UButton>
        <UButton type="submit">
          {{ $t('qrc.create.create') }}
        </UButton>
      </div>
    </UForm>
  </SubPage>
</template>
