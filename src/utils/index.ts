export let parseJson = (data: string | object | null): object | null => {
    try {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        else {
            return data;
        }
    } catch (error) {
        console.error("please provide options in json format")
        return null
    }
}

export function degreesToRadians(degrees: number): number {
    var pi = Math.PI;
    return degrees * (pi / 180);
}


export function math(num: number, num1: number): number {
    return num + num1
}
