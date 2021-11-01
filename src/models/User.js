const dotenv=require('dotenv');
const bcrypt=require('bcrypt');
const Joi=require('joi');
const Database= require('../database/database');
const generator = require('generate-password');
const Email = require('../utils/Email');

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
       
        console.log(validateResult)
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
    
    async forgotPassword(){
        var code = generator.generate({
            length: 6,
            numbers: true
        });
        const check=await this._database.readSingleTable(this._userType,null,["email","=",this._email]);

        if (check.error){
            return new Promise((resolve)=>{
                resolve({action:false})
            })
        }
        // console.log(check)
        if (check.result.rowCount==0){
            return new Promise((resolve)=>{
                resolve({noAcc:true})
            })
        }
        const result=await this._database.insert("verification_code",["email","verification_code","user_type"],[this._email,code,this._userType])
        if (this._database.connectionError){
            return new Promise((resolve)=>{
                resolve({connectionError:true})
            })
        }
        console.log(result)
        if (result.error){
            return new Promise((resolve)=>{
                resolve({action:false})
            })
        }
        const emailSender=new Email();
        emailSender.send(this._email,"Password reset verifiation code.","Your verification code to reset the password is "+code+" . Use it to reset your password.");
        return new Promise((resolve)=>{
            resolve({action:true})
        })
    }

    async resetPassword(verificationCode,newPassword){
        const result=await this._database.readSingleTable("verification_code",null,["email","=",this._email]);
        if (result.error || result.rowCount==0){
            return new Promise((resolve)=>{
                resolve({action:false});
            })
        }
        
        let codes=result.result.rows;
        let code = codes[0];
        codes.forEach(element => {
            if (element.id>code.id){
                code=element
            }
        });
        console.log(verificationCode+" "+code.verification_code)
        if (code.is_used==true)code.verification_code=""
        if (verificationCode==code.verification_code){

            const result1=await this._database.update("verification_code",["is_used","=",true,"id","=",code.id])
            console.log(result1)
            if (result1.error){
                return new Promise((resolve)=>{
                    resolve({action:false})
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const result2=await this._database.update(this._userType,["password","=",hashedPassword,"email","=",this._email])
            if (result2.error){
                return new Promise((resolve)=>{
                    resolve({action:false})
                })
            }
            return new Promise((resolve)=>{
                resolve({action:true})
            })
        }
        return new Promise((resolve)=>{
            resolve({action:false,invalidVC:true})
        })
    }

    async getUserDetails(){
        if (this._database.connectionError){
            return new Promise((resolve)=>{
                resolve({
                    connectionError:true
                });
            });
        }

        const result=await this._database.readSingleTable(this._userType,null,["user_id","=",this._u_id]);

        if (result.error || result.result.rowCount==0){
            return new Promise((resolve)=>{
                action:false
            });
        }
        // let data={
        //     userId:result.result.rows[0].user_id,
        //     firstName:result.result.rows[0].first_name,
        //     lastName:result.result.rows[0].last_name,
        //     contactNo:result.result.rows[0].contact_no
        // }
        let data=result.result.rows[0];
        data.password=undefined;
        console.log(typeof data1)
        return new Promise((resolve)=>{
            resolve({action:true,data:data});
        });
    }
}

module.exports= User;
