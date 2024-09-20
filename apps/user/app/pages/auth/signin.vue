<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Signin',
})

const toast = useToast()
const loading = ref(false)

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

const providers = [
  {
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    click: () => {
      console.log('Redirect to GitHub')
    },
  },
  {
    label: 'Continue with Google',
    icon: 'i-simple-icons-google',
    color: 'white' as const,
    click: () => {
      console.log('Redirect to Google')
    },
  },
]

function validate(state: any): FormError[] {
  const errors = []
  if (!state.email)
    errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password)
    errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

async function onSubmit(data: FormSubmitEvent<any>) {
  try {
    loading.value = true

    await $fetch('/api/auth/signin', {
      method: 'POST',
      body: data,
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
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
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
      </template>

      <template #password-hint>
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >
          Forgot password?
        </NuxtLink>
      </template>
    </UAuthForm>
  </UCard>
</template>
