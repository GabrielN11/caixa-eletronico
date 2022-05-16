import { INote } from "../interfaces";

export class Note implements INote{

    value: number;
    image: string;
    name: string;
    quantity: number;

    constructor(value: number = 2, image: string = 'nota_2.jpg', name: string = 'note_2', quantity: number = 0){
        this.value = value;
        this.image = image;
        this.name = name;
        this.quantity = quantity;
    }

    concatPath(path:string):string{
        return path + '/' + this.image;
    }
}