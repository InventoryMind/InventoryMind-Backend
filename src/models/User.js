const dotenv=require('dotenv');
const bcrypt=require('bcrypt');
const Joi=require('joi');
const Database= require('../database/database');

dotenv.config();

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

    constructor(data){
        this._database=new Database();
        this._userType=data.userType;
        this._email=data.email;
        this._u_id=data.userId;
        // this._password=data.password;
    
    }

    async login(password){
        const validateResult= Joi.object({
            email: Joi.string().max(30).email().required().label("email"),
             password:Joi.string().required().label("password"),
             userType:Joi.string().max(20).required()
        }).validate({
            email : this._email,
             password : password,
             userType:this._userType
        });

        if (validateResult.error){
            // console.log("validate error");
            return new Promise((resolve)=>
            resolve({validationError:true}));
        }

        if (this._database.connectionError){
            return new Promise((resolve)=> resolve({connectionError:true}));
        }
       

        var userData= await this._database.readSingleTable(this._userType,null,['email','=',this._email]);
        // console.log(userData.result);
        if (userData.error || !userData.result.rows[0]){
            return new Promise((resolve)=> resolve({allowedAccess: false}));
        }
        userData=userData.result;
        this._u_id=userData.rows[0].user_id;
        this._first_name=userData.rows[0].first_name;
        this._last_name=userData.rows[0].last_name;
        this._contact_no=userData.rows[0].contact;
        this._is_active=userData.rows[0].isActive;
        this._user_password=userData.rows[0].password;
        
        const isCompare= await bcrypt.compare(password,this._user_password);
        console.log(isCompare);

        if (!isCompare){
            return new Promise((resolve)=>resolve({allowedAccess: false,password:this._user_password}));
        }

        return new Promise((resolve)=>resolve({
            allowedAccess:true,
            tokenData:{
                'userId' : this._u_id,
                'email':this._email,
                'firstName' : this._first_name,
                'lastName' : this._last_name,
                'userType' : this._userType,
            }
        }));
    }
}

module.exports= User;
