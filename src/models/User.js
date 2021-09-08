const bcrypt=require('bcrypt');
const Joi=require('joi');
const Database= require('../database/database');

class User {
    _u_id;
    _first_name;
    _last_name;
    _email;
    _entered_password;
    _user_password;
    _contact_no;
    _is_active;
    _database;
    _userType;
    _data;
    constructor(data){
        this._database=new Database();
        this._userType=data.userType;
        // this._u_id=u_id;
        // this._first_name=first_name;
        // this._last_name=last_name;
        this._email=data.email;
        this._password=data.password;
        // this._contact_no=contact_no;
        // this._is_active=is_active;
        this._data=data;
    }

    async login(){
        const validateResult= Joi.object({
            email: Joi.string().max(30).required().label("email"),
            password:Joi.string().required().label("password")
        }).validate({
            email : this._email,
            password : this._password
        });
        // console.log(validateResult.error);

        // if (validateResult.error){
        //     console.log("validate error");
        //     return new Promise((resolve)=>
        //     resolve({validationError:validateResult.error}));
        // }

        if (this._database.connectionError){
            return new Promise((resolve)=> resolve({connectionError:true}));
        }
        const userData= await this._database.readSingleTable(this._userType,['user_id','first_name','last_name','email','password','contact','isActive'],['email','=',this._email]);
        if (userData.error || !userData.result[0]){
            return new Promise((resolve)=> resolve({allowedAccess: false}));
        }
        this._u_id=userData.result[0]['user_id'];
        this._first_name=userData.result[0]['first_name'];
        this._last_name=userData.result[0]['last_name'];
        this._contact_no=userData.result[0]['contact'];
        this._is_active=userData.result[0]['isActive'];
        this._user_password=userData.result[0]['password'];

        const isCompare= await bcrypt.compare(this._password,this._user_password);

        if (!isCompare){
            return new Promise((resolve)=>resolve({allowedAccess: false}));
        }

        return new Promise((resolve)=>resolve({
            allowedAccess:true,
            tokenData:{
                'user_id' : this._u_id,
                'first_name' : this._first_name,
                'last_name' : this._last_name,
                'user_type' : this._userType,
            }
        }));
    }
}

module.exports= User;