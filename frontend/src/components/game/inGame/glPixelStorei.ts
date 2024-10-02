export default function pixelStore(pixelStorei: any, _gl: WebGLRenderingContext) {
    return function(...args: any) {
        const [parameter] = args;
        switch(parameter) {
            case _gl.UNPACK_FLIP_Y_WEBGL:
                // Calls the original function when possible
                return pixelStorei(...args);
            default:
                // Suppress logging unsupported values
                return;
        }
    };
}