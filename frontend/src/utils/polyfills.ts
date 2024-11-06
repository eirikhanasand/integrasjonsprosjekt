export default function polyfills() {
    if (!global.crypto) {
        global.crypto = {
            // @ts-expect-error
            getRandomValues: (array: number[]) => {
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
                return array;
            },
        };
    }
}
