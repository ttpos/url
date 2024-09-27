<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
  middleware: ['protected'],
})

useSeoMeta({
  title: 'Verify Phone',
})

const { $csrfFetch } = useNuxtApp()
const user = useAuthenticatedUser()
const toast = useToast()
const loading = ref(false)

const fields = [
  {
    name: 'code',
    type: 'text',
    label: 'Verification Code',
    placeholder: 'Enter your phone Verification Code',
  },
]

function validate(state: any): FormError[] {
  const errors = []
  if (!state.code)
    errors.push({ path: 'code', message: 'Verification Code is required' })

  return errors
}

async function onSubmit(data: FormSubmitEvent<any>) {
  try {
    loading.value = true

    await $csrfFetch('/api/auth/verify-phone', {
      method: 'POST',
      body: {
        ...data,
        userId: user.value.id,
      },
    })
    await navigateTo('/')
  }
  catch (error) {
    toast.add({ title: error.data?.message ?? null })
  }
  finally {
    loading.value = false
  }
}

const { data, error, status } = await useAsyncData('isPhoneVerified', () =>
  $csrfFetch(`/api/auth/${user.value.phone}/check-verification`))

onBeforeMount(async () => {
  if (data.value?.isPhoneVerified) {
    await navigateTo('/')
  }
})
</script>

<template>
  <UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
    <div
      v-if="status === 'pending' || status === 'idle'"
      class="flex flex-col gap-3 items-center"
    >
      <UIcon name="i-mingcute:loading-3-fill" class="animate-spin size-10" />
      <p class="text-sm text-foreground">
        Checking email verfication.
      </p>
    </div>

    <UAuthForm
      :fields="fields"
      :validate="validate"
      align="top"
      icon="i-material-symbols:key"
      title="Verify Phone"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Verify' }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        Verification code was sent to <b>{{ user.email }}</b>. Check your spam folder if you can't find the email.
      </template>
      <template #validation>
        <UAlert
          v-if="error"
          color="red"
          icon="i-heroicons-information-circle-20-solid"
          variant="soft"
          title="Server Crashed."
          :description="error.statusMessage ? error.statusMessage : error.message"
        />
      </template>
    </UAuthForm>
  </UCard>
</template>
