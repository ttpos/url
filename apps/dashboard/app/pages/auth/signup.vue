<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Sign up',
})

const toast = useToast()

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
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: data,
    })
    await navigateTo('/')
  }
  catch (error) {
    toast.add({ title: error.data?.message ?? null })
  }
}
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      align="top"
      icon="i-heroicons-user-circle"
      title="Create an account"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Create account' }"
      @submit="onSubmit"
    >
      <template #description>
        Already have an account?
        <NuxtLink
          to="/auth/login"
          class="text-primary font-medium"
        >
          Login
        </NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
