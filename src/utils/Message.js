class Message{
    #messgae;
    #recipient_id;
    constructor(message,recipient_id){
        if (this.constructor == Message){
            throw new Error("Abstract class can't be inititated.");
        }
        this.message=message;
        this.recipient_id=recipient_id;
    }
}