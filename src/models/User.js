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

    // async register(){
    //     const validateData=Joi.object(
    //         {   userId:Joi.string().max(10).required(),
    //             firstName:Joi.string().max(20).required(),
    //             lastName:Joi.ref('firstName'),
    //             email: Joi.string().max(30).email().required(),
    //             contactNo:Joi.num(10).max().required()
    //         }).validate({
    //             userId:this._u_id,
    //             firstName:this._first_name,
    //             lastName:this._last_name,
    //             email:this._email,
    //             contactNo:this._contact_no
    //         });
    //     if(validateData.error){
    //         return new Promise((resolve)=>resolve({validationError:validateData.error}));
    //     }

    //     if(this._database.connectionError){
    //         return new Promise((resolve)=>resolve({connectionError:true}));
    //     }
    //    if (this._password==null){
    //        this._password=firstName+'@'+userId;
    //    }
    //     const result=await this._database.insert(this.constructor.name,[this._u_id,this._first_name,this._last_name,this._email,this._password,this._contact_no,true]);

    //     if (result.result.error){
    //         return new Promise((resolve)=>resolve({action:false}))
    //     }

    //     return new Promise((resolve)=>resolve({action:true}));
    // }

    async login(password){
        const validateResult= Joi.object({
            email: Joi.string().max(30).email().required().label("email"),
             password:Joi.string().required().label("password")
        }).validate({
            email : this._email,
             password : password
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
