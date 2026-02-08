const express=require("express");
let app=express();

let port=8080;

app.listen(port,()=>{
    console.log("server is on");
})


app.get("/err", (err,req, res,next) => {
  next(err);
});

app.use((err,req,res,next)=>{
    console.log("finding err");
    next(err);
})

