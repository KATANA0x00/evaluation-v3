<template>
    <div class="absolute w-screen grid grid-cols-1 gap-5 md:flex md:justify-between items-center md:px-8 pt-3">
        <div class="flex gap-1 justify-center md:justify-start">
            <img src="~/assets/logo_1.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
            <img src="~/assets/logo_2.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
            <img src="~/assets/logo_3.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
            <img src="~/assets/logo_4.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
            <img src="~/assets/logo_5.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
            <img src="~/assets/logo_6.png" class="h-[2.5rem] lg:h-[2.8rem] 2xl:h-[4rem]" alt="Logo" />
        </div>
        <div class="flex flex-col text-center md:text-end w-full md:w-fit">
            <span class="font-bold text-sm lg:text-base 2xl:text-lg text-(--orange-base)"
                >โครงการพัฒนากำลังคนสมรรถนะสูงด้านเซมิคอนดักเตอร์ขั้นสูง</span
            >
            <span class="font-semibold text-xs lg:text-sm 2xl:text-base"
                >เทคโนโลยีเวเฟอร์และปัญญาประดิษฐ์/แมชชีนเลิร์นนิง</span
            >
            <span class="font-medium text-xs lg:text-sm 2xl:text-base"
                >สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง</span
            >
        </div>
    </div>
    <div class="flex justify-center items-center w-screen h-screen">
        <slot></slot>
    </div>
</template>
