<template>
    <NuxtLayout>
        <NuxtPage class="font-semibold text-sm text-(--text-black)"/>
    </NuxtLayout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

:root {
    --white-base: #f0efeb;
    --white-shift: #f5f3ef;
    --white-outline: #dedcd8;

    --text-black: #0c0a06;
    --text-mid: #a3a19d;
    --text-light: #aeada9;
    --text-white: #fbf9f5;

    --orange-base: #f4580b;
}

html,
body {
    padding: 0;
    margin: 0;
    background-color: var(--white-base);
}

* {
    font-family: "Bai Jamjuree", sans-serif;
}

button, button > span {
    cursor: pointer;
}

span {
    cursor: default;
}

.smooth-trans {
    transition: all ease-in-out 100ms;
}
</style>
