const express=require('express');
const { Auth } = require('../src/middlewares/auth');
const instance = require('../src/utils/razorpay');
const razormodel = require('../models/razormodel');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const { User } = require('../models/user');
const paymentroute=express.Router();

paymentroute.post("/payment/create",Auth,async(req,res)=>{
     
    try{
     
     const {email,_id,first_name,last_name}=req.detail;   


// these would be visible on big payload object, add fields inside notes and the ones given here ONLY,
// dont add new field outside notes,... for rest fields like receipt,currency, assign them yourself
const order= await instance.orders.create({
amount: 50000,
currency: "INR",
receipt: "Premium Subscription for Dev tinder",
notes: {
  user:_id,
  emailId:email,
firstname:first_name,
lastname:last_name
}
})

//save payment details to DB
const paymentobj=new razormodel({
  userId:req.detail._id,
  orderId:order.id,
  status:order.status,
  amount:order.amount,
  currency:order.currency,
  receipt:order.receipt,
  notes:order.notes
})

const saved=await paymentobj.save();

//return back the details to frontend in form of json...
res.json({saved,key_id:process.env.RAZORPAY_KEY_ID});

    }
    catch(err){
      console.error("Razorpay error:", err);
  return res.status(500).json({ error: err.message || "Something went wrong" });
    }
})


//TO CHECK THIS FEATURE, USE PRODUCTION, not localhost

//‼️WEBHOOK VALIDATION -- we used /api/ in webhook path already to take care of production as it contains /api
paymentroute.post("/payment/webhook",async(req,res)=>{   // ‼️ dont use Auth here
                             
    try{

      const webhookSignature=req.get("X-Razorpay-Signature");

      //returns a boolean value
    const isvalid=validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
   process.env.RAZORPAY_WEBHOOK_SECRET)

   if(!isvalid)
 return res.status(500).send("webhook signature is invalid");


   // update the user as premium...
   // return success response to razorpay by status(200)


  // https://razorpay.com/docs/webhooks/payloads/payments/   check the object here
   const paymentdetails=req.body.payload.payment.entity; // this contains all info about our payment, inbuilt object of razorpay

   const doc=await razormodel.findOne({orderId:paymentdetails?.order_id});
   doc.status=paymentdetails?.status;
   await doc.save(); 


   //now in User, assign premium:true for the user,
 const user=await User.findByIdAndUpdate(paymentdetails?.notes?.user,{ispremium:true},{new:true});
 await user.save();



   // these were the 2 events setup by us for webhook

  //  if(req.body.event=="payment.captured"){

  //  }

  //  if(req.body.event=="payment.failed"){

  //  }

   return res.status(200).send("webhook received successfully")  // important, else it will keep on calling you again n again
    }
    catch(err){
     return res.status(500).send(err.message);
    }
})


paymentroute.post("/payment/verify",Auth,async(req,res)=>{
   
 const userdata=req.detail;
 if(userdata?.ispremium)
  res.send({check:true});
else
  res.send({check:false});
})

module.exports={paymentroute}