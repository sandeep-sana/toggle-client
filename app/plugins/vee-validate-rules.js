import { defineRule } from 'vee-validate';

defineRule('required', value => {
  if (!value || String(value).trim() === '') {
    return 'This field is required!';
  }
  return true;
});

defineRule('nospace', (value) => {
  if (/\s/.test(value)) {
    return 'Spaces are not allowed'
  }
  return true
})
defineRule('nouppercase', (value) => {
  if (/[A-Z]/.test(value)) {
    return 'Uppercase letters are not allowed';
  }
  return true;
});

defineRule('email', (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(value)) {
    return 'Please enter a valid email address'
  }
  return true
})

defineRule('number', (value) => {
  const regex = /^[0-9]+$/
  if (!regex.test(value)) {
    return 'Only numbers are allowed'
  }
  return true
})

defineRule('alphabate', (value) => {
  const regex = /^[A-Za-z]+$/
  if (!regex.test(value)) {
    return 'Only alphabets are allowed'
  }
  return true
})

defineRule('min', (value, [limit]) => {
  if (String(value).length < Number(limit)) {
    return `Must be at least ${limit} characters`
  }
  return true
})

defineRule('max', (value, [limit]) => {
  if (String(value).length > Number(limit)) {
    return `Must be no more than ${limit} characters`
  }
  return true
})

export default defineNuxtPlugin(() => {})