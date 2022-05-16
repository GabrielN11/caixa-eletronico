import { ITransaction } from "../interfaces";

export default class Transaction implements ITransaction{

    value: number;
    type: string;
    date: string;

    constructor(value:number = 0, type:string = '', date:string = ''){
        this.value = value;
        this.type = type;
        this.date = date;
    }
}