<script setup lang="ts">
import type { NuxtTurnstile } from '#components'
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Sign up',
})

const { $csrfFetch } = useNuxtApp()
const toast = useToast()
/**
 * - 0: Email
 * - 1: Phone
 */
const selectedMethod = ref(0)
const loading = ref(false)
const oauthLoading = ref(false)
const token = ref()
const turnstile = ref<InstanceType<typeof NuxtTurnstile> | null>()
const show = ref(false)

const fields = computed(() => {
  const commonFields = [
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    },
  ]

  const methodFields = selectedMethod.value === 0
    ? [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
        },
      ]
    : [
        {
          name: 'phone',
          type: 'tel',
          label: 'Phone',
          placeholder: 'Enter your phone number',
        },
      ]

  return [...methodFields, ...commonFields]
})

const tabItems = [
  {
    label: 'Email',
    icon: 'i-simple-line-icons:envelope',
  },
  {
    label: 'Phone',
    icon: 'i-simple-line-icons:screen-smartphone',
    disabled: true,
  },
]

const providers = computed(() => [
  {
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    to: '/api/oauth/github',
    external: true,
    // loading: oauthLoading.value,
    disabled: !token.value,
    click: () => {
      oauthLoading.value = true
    },
  },
])

function validate(state: any): FormError[] {
  const errors: FormError[] = []

  if (selectedMethod.value === 0 && !state.email) {
    errors.push({ path: 'email', message: 'Email is required' })
  }
  if (selectedMethod.value === 1 && !state.phone) {
    errors.push({ path: 'phone', message: 'Phone is required' })
  }

  if (!state.password) {
    errors.push({ path: 'password', message: 'Password is required' })
  }
  else if (state.password.length < 8) {
    errors.push({ path: 'password', message: 'Password must be at least 8 characters long' })
  }

  return errors
}

async function onSubmit(data: FormSubmitEvent<any>) {
  try {
    loading.value = true

    const key = selectedMethod.value === 0 ? 'email' : 'phone'
    const payload = {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      [key]: data[key],
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      password: data.password,
      captchaToken: token.value,
    }

    const { message } = await $csrfFetch('/api/auth/signup', {
      method: 'POST',
      body: payload,
    })

    if (message) {
      toast.add({ title: message })
    }

    // TODO: Redirect to verify email/phone page
    // await navigateTo(selectedMethod.value === 0 ? '/auth/verify-email' : '/auth/verify-phone')
    await navigateTo('/')
  }
  catch (error: any) {
    toast.add({ title: error.data?.message ?? null, color: 'red' })
  }
  finally {
    turnstile.value?.reset()
    loading.value = false
  }
}

onMounted(() => {
  show.value = true
})
</script>

<template>
  <UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      align="top"
      icon="i-heroicons-user-circle"
      title="Create an account"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{
        label: loading ? 'Please wait...' : 'Continue',
        disabled: !token || oauthLoading,
      }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        Already have an account?
        <NuxtLink
          to="/auth/signin"
          class="text-primary font-medium"
        >
          Signin
        </NuxtLink>

        <!-- <UTabs v-model="selectedMethod" :items="tabItems" class="mt-2" /> -->

        <UTabs v-model="selectedMethod" :items="tabItems" class="w-full mt-2">
          <template #icon="{ item, selected }">
            <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0 mr-2" :class="[selected && 'text-primary-500 dark:text-primary-400']" />
          </template>
          <template #default="{ item, selected }">
            <span class="truncate" :class="[selected && 'text-primary-500 dark:text-primary-400']">
              {{ item.label }}
            </span>
          </template>
        </UTabs>
      </template>
      <template #validation>
        <NuxtTurnstile
          v-if="show"
          ref="turnstile"
          v-model="token"
          :options="{ action: 'native' }"
        />
      </template>
    </UAuthForm>
  </UCard>
</template>
