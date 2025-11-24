<template>
    <Block
        class="min-w-full max-w-full md:aspect-2/1 md:py-5! px-6!"
        :hoverColor="(watchable || admin) ? 'var(--text-light)' : undefined"
    >
        <div class="w-full h-full flex flex-col justify-between gap-3">
            <div class="flex items-start gap-2">
                <!-- <div v-if="!admin" class="aspect-square w-fit flex items-center justify-center p-1 rounded-full text-(--text-white)" :class="watchable ? 'bg-green-500':'bg-(--white-outline)'">
                    <Icon :name="watchable ? 'material-symbols:lock-open-right-rounded':'material-symbols:lock-open-rounded'" size="1rem"/>
                </div> -->
                <span class="font-bold text-sm 2xl:text-lg"><slot></slot></span>
            </div>
            <div v-if="!admin" class="flex items-center gap-2 xl:mb-5 ">
                <div class="w-full h-2 bg-(--white-outline) rounded-full overflow-hidden">
                    <div class="h-2 bg-(--orange-base) rounded-full" :style="{ width: `${props.progress}%` }">
                    </div>
                </div>
                <span class="w-8 lg:w-12 text-end">{{ progress }}%</span>
            </div>
        </div>
    </Block>
</template>

<script setup>
const props = defineProps({
    progress: {
        type: Number,
        default: 0
    },
    watchable: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
})
</script>
