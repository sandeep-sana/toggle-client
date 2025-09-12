<template>
    <div class="container-fluid position-relative d-flex p-0 justify-content-end sign-back"
        style="width: 60vw; height: 80vh; margin-top: 5vh; border-radius: 15px; overflow: hidden;">
        <img src="assets/images/signupd.jpg" class="img-fluid image-back h-100 w-100 object-fit-cover"
            alt="Signup background" />
        <div class="col-md-6 d-flex align-items-center glass-card justify-content-center position-relative shadow-lg">
            <div class="p-4 rounded-4">
                <form @submit="signup" novalidate>
                    <h3 class="text-center mb-4 fw-bold text-white">Sign Up</h3>

                    <!-- Domain -->
                    <div class="row">

                        <div class="form-floating mb-3 col-6">
                            <Field name="domain" as="input" type="text" class="form-control" id="domain"
                                placeholder="Domain" rules="required|nospace|alphabate|min:3|max:12" />
                            <label for="domain">Domain</label>
                            <ErrorMessage name="domain" class="error-message" />
                        </div>

                        <!-- First Name -->
                        <div class="form-floating mb-3 col-6">
                            <Field name="firstName" as="input" type="text" class="form-control" id="firstName"
                                placeholder="First Name" rules="required|nospace|alphabate|min:3|max:50" />
                            <label for="firstName">First Name</label>
                            <ErrorMessage name="firstName" class="error-message" />
                        </div>

                        <!-- Last Name -->
                        <div class="form-floating mb-3 col-6">
                            <Field name="lastName" as="input" type="text" class="form-control" id="lastName"
                                placeholder="Last Name" rules="required|nospace|alphabate|min:3|max:50" />
                            <label for="lastName">Last Name</label>
                            <ErrorMessage name="lastName" class="error-message" />
                        </div>

                        <!-- Company Name -->
                        <div class="form-floating mb-3 col-6">
                            <Field name="companyName" as="input" type="text" class="form-control" id="companyName"
                                placeholder="Company Name" rules="required|min:3|max:50" />
                            <label for="companyName">Company Name</label>
                            <ErrorMessage name="companyName" class="error-message" />
                        </div>

                        <!-- Email -->
                        <div class="form-floating mb-3 col-6">
                            <Field name="email" as="input" type="email" class="form-control" id="email"
                                placeholder="Company Email" rules="required|nospace|email" />
                            <label for="email">Company Email</label>
                            <ErrorMessage name="email" class="error-message" />
                        </div>
                        <div class="form-floating mb-3 col-6">
                            <Field name="email" as="input" type="email" class="form-control" id="email"
                                placeholder="Company Email" rules="required|nospace|email" />
                            <label for="email">Phone No</label>
                            <ErrorMessage name="email" class="error-message" />
                        </div>

                        <!-- Description -->
                        <div class="form-floating mb-3 col-12">
                            <Field name="description" as="textarea" class="form-control text-area-block"
                                id="description" rows="5"
                                placeholder="Description"
                                rules="required"
                                />
                                <label for="description">Description</label>
                                <ErrorMessage name="description" class="error-message" />
                        </div>

                    </div>

                    <!-- Submit button -->
                    <div class="d-grid">
                        <button type="submit" class="btn btn-light btn-lg fw-semibold" :disabled="isSubmitting">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '~~/api.config';
import STATUS from '~~/status';
import { Field, ErrorMessage, useForm } from 'vee-validate';

const router = useRouter();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { handleSubmit, isSubmitting } = useForm({});


const signup = handleSubmit(async (values) => {
    const query = {
        ...values,
        role: "SYSTEM_ADMIN",
    }
    try {
        const response = await api.post(`${config.public.API}/user/user`, {
            query: JSON.stringify(query),
        });
        if (response.status === STATUS.CREATED) {
            router.push('');
            $toast.success(response.data.message);
        }
    } catch (error) {
        console.log(error)
        $toast.error(error.response.data.message);
    }
});
</script>

<style scoped>
.glass-card {
    background: #353535;
}

.image-back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

/* Style the floating label instead of placeholder */
.custom-label {
    color: #353535;
    font-size: 0.95rem;
    transition: all 0.2s ease-in-out;
}

/* When input is focused or has value */
.form-control:focus~.custom-label,
.form-control:not(:placeholder-shown)~.custom-label {
    color: #0d6efd;
    /* highlight color */
    font-size: 0.8rem;
    transform: translateY(-1rem) translateX(-0.2rem);
    background: #fff;
    padding: 0 4px;
    border-radius: 4px;
}

.form-control {
    background-color: #353535!important;
    border: 1px solid #ced4da;
    color: #fff !important;
    margin: 5px;
}

.sign-back {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}
</style>
