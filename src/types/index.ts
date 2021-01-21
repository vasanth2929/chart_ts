export interface Option {
    selector: string;
    data: any[];
    type?: 'radial'
    width?: number;
    height?: number;
    fontColor?: string;
    leftLabel?: string;
    rightLabel?: string;
    valueInticatorColor?: string;
    verticalLineColor?: string;
    rightArcColor?: string;
    leftArcColorOnFailure?: string;
    backgroundColor?: string;
}

export type Data = {
    name: string,
    left: { name: string, value: number },
    right: { name: string, value: number }
}[];
