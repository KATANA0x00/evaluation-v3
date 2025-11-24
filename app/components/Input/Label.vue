<template>
    <div class="w-full flex flex-col">
        <span class="mt-4 mb-2 md:mt-5 md:mb-3 pl-2 lg:pl-4">{{ label }}</span>
        <div class="relative flex items-center">
            <input
                v-model="modelValue"
                :type="computedType"
                :placeholder="placeHolder"
                :required="required"
                class="w-full outline-(--white-outline) text-(--text-black) bg-(--text-white) h-12 px-3 md:px-5 rounded-md"
            />
            <!-- Show toggle button only if password -->
            <button
                v-if="password"
                class="absolute right-3 text-(--text-mid) hover:text-(--text-black) aspect-square smooth-trans"
                type="button"
                @click="togglePassword"
            >
                <Icon
                    :name="
                        isShowPassword
                            ? 'ic:round-vpn-key-off'
                            : 'ic:round-vpn-key'
                    "
                    size="1.5rem"
                />
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: { type: String, required: true },
    placeHolder: { type: String, default: "" },
    password: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
});
const modelValue = defineModel({
    type: String,
    required: true,
});

const isShowPassword = ref(false);

// Compute input type
const computedType = computed(() => {
    if (props.email) return "email";
    if (props.password) return isShowPassword.value ? "text" : "password";
    return "text"; // default
});

const togglePassword = () => {
    isShowPassword.value = !isShowPassword.value;
};
</script>
