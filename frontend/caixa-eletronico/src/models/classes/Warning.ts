import { IWarning } from "../interfaces";


export default class Warning implements IWarning{

    active: boolean;
    mode: string;
    text: string;
    timer: number;

    constructor(active:boolean = false, mode: string = 'success', text: string = 'Texto do alerta', timer: number = 4000){
        this.active = active;
        this.mode = mode;
        this.text = text;
        this.timer = timer;
    }

    enable():void{
        this.active = true;

        setTimeout(() => {
            this.active = false;
        }, this.timer)
    }
}