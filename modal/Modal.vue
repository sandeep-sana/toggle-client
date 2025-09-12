<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <!-- Header -->
            <div class="px-4 py-3 border-b">
                <slot name="header"></slot>
            </div>
            <!-- Body -->
            <div class="p-4">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>
