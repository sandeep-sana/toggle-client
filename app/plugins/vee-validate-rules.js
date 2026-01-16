import { defineRule } from "vee-validate";


defineRule("required", value => {
if(!value || String(value).trim() === ''){
    return 'This field is required!';
}
return true;
});


defineRule('min', (value, [limit]) =>{
    if(String(value).length < Number(limit)){
        return `Must be atleast ${limit} characters`
    }
    return true;
})

defineRule('email', (value) => {
    const regex = /^[^\s@]+@[^\s@].@[^\s@]+$/
    if(!regex.test(value)){
        return 'Please enter a valid email address';
    }
    return true;
})



export default defineNuxtPlugin(() => {})