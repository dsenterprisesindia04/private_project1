const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export async function onRequestPost({request,env}) {
 if(!env.DB)return json({error:"DB binding नहीं मिला"},500);
 let b;try{b=await request.json()}catch{return json({error:"गलत अनुरोध"},400)}
 const product=String(b.product||"").trim(),name=String(b.name||"").trim(),phone=String(b.phone||"").trim(),address=String(b.address||"").trim(),email=String(b.email||"").trim(),quantity=Number(b.quantity);
 if(!product||!name||!phone||!address||!Number.isInteger(quantity)||quantity<1||quantity>999)return json({error:"सही जानकारी भरें"},400);
 const orderId="DS"+Date.now().toString().slice(-9)+Math.floor(Math.random()*90+10);
 try{
 await env.DB.prepare("INSERT INTO orders (order_id,product,quantity,customer_name,phone,email,address,status,created_at) VALUES (?,?,?,?,?,?,?,'Pending approval',datetime('now'))").bind(orderId,product,quantity,name,phone,email,address).run();
 return json({ok:true,orderId});
 }catch(e){return json({error:"ऑर्डर सेव नहीं हुआ। Database migration जाँचें।"},500)}
}
export async function onRequestGet({request,env,params}) {
 if(!env.DB)return json({error:"DB binding नहीं मिला"},500);
 const phone=new URL(request.url).searchParams.get("phone")||"";
 try{
 const row=await env.DB.prepare("SELECT order_id,product,quantity,status FROM orders WHERE order_id=? AND phone=?").bind(params.id,phone).first();
 if(!row)return json({error:"ऑर्डर नहीं मिला"},404);
 return json({orderId:row.order_id,product:row.product,quantity:row.quantity,status:row.status});
 }catch(e){return json({error:"डेटाबेस में समस्या"},500)}
}
