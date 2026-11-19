const route = require("express")();
const TokenManager = require("./token_manager");

route.use(require("cors")());
route.use(require("express").json());

let user = [
  {id:"1",username:"thewin",lname:"zaza",password:"555",tel:"888-888",role:"admin"},
  {id:"2",username:"wow",lname:"lnw",password:"777",tel:"333-333",role:"user1"}
];

route.get("/",(req,res)=>{
    res.send("hello");
})

route.post("/login",(req,res)=>{
    let userData = req.body;
    let u = user.find((v)=> v.username==userData.username && v.password==userData.password);
    if(u==undefined){
        res.status(401).json({status:"0", message:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"});
    }else{
        let accessToken = TokenManager.getGenerateAccessToken({id:u.id, username:u.username, role:u.role});
        res.json({status:"1", access_token:accessToken});
    }
});
route.post("/check_authen",(req,res)=>{
    let jwtStatus = TokenManager.checkAuthentication(req);
    if(jwtStatus!=false){
        res.json(jwtStatus);
    }else{
        res.status(401).json({status:"0", message:"Token ไม่ถูกต้องหรือหมดอายุ"});
    }
});

route.post("/get_user_data",(req,res)=>{
    let jwtStatus = TokenManager.checkAuthentication(req);
    if(jwtStatus!=false){
        let u = user.find((v)=> v.id == jwtStatus.id);
        let { password, ...safe } = u;
        res.json(safe);
    }else{
        res.status(401).json({status:"0", message:"Token ไม่ถูกต้องหรือหมดอายุ"});
    }
});

route.listen(4000,(err)=>{
    console.log("server started on 4000");
});