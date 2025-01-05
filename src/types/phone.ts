import { PhoneCase } from "./phone_case";

export type Phone = {
    id: string;
    name: string;
    svg: string;
    width: number;
    height: number;
    model3d: string;
    case: PhoneCase[];
};