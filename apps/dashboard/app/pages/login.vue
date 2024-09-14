<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Login',
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
    await $fetch('/api/login', {
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
      title="Welcome back"
      align="top"
      icon="i-heroicons-user-circle"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #description>
        Don't have an account?
        <NuxtLink
          to="/signup"
          class="text-primary font-medium"
        >
          Sign up
        </NuxtLink>.
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
