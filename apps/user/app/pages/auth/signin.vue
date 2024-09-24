<script setup lang="ts">
import { NuxtTurnstile } from '#components'
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Signin',
})

const toast = useToast()
/**
 * - 0: Email
 * - 1: Phone
 */
const selectedMethod = ref(0)
const loading = ref(false)
const token = ref()
// const turnstile = ref()
const turnstile = ref<InstanceType<typeof NuxtTurnstile> | null>()
// const turnstile = useTemplateRef<typeof NuxtTurnstile>(null)

const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
  },
]

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

const providers = [
  {
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    to: '/api/oauth/github',
    external: true,
    click: () => {
      console.log('Redirect to GitHub')
    },
  },
  {
    label: 'Continue with Google',
    icon: 'i-simple-icons-google',
    color: 'white' as const,
    to: '/api/oauth/google',
    external: true,
    click: () => {
      console.log('Redirect to Google')
    },
  },
]

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

    await $fetch('/api/auth/signin', {
      method: 'POST',
      body: {
        ...data,
        captchaToken: token.value,
      },
    })
    await navigateTo('/')
  }
  catch (error) {
    toast.add({ title: error.data?.message ?? null })
  }
  finally {
    turnstile.value?.reset()
    loading.value = false
  }
}
</script>

<template>
  <UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      title="Welcome back"
      align="top"
      icon="i-heroicons-user-circle"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{
        trailingIcon: 'i-heroicons-arrow-right-20-solid',
        label: loading ? 'Please wait...' : 'Continue',
      }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        Don't have an account?
        <NuxtLink
          to="/auth/signup"
          class="text-primary font-medium"
        >
          Signup
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

      <template #password-hint>
        <NuxtLink
          to="/auth/reset-password"
          class="text-primary font-medium"
        >
          Forgot password?
        </NuxtLink>
      </template>
      <template #validation>
        <NuxtTurnstile
          ref="turnstile"
          v-model="token"
          :options="{ action: 'native' }"
        />
      </template>
    </UAuthForm>
  </UCard>
</template>
