export class ResponseDto<T> {
    statusCode:number;
    message:string;
    data: T;

    constructor(status, message: string, data: T){
        this.statusCode = status;
        this.message = message;
        this.data = data;
    }

    static Ok():ResponseDto<string>{
        return new ResponseDto<string>('OK','','');
    }

    static OK_WITH<T>(data: T): ResponseDto<T> {
        return new ResponseDto<T>('OK', '', data);
    }

    static ERROR(message): ResponseDto<string> {
        return new ResponseDto<string>('ERROR',message,'');
    }


}

