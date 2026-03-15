// TradingView Chart

new TradingView.widget({
width:500,
height:300,
symbol:"BINANCE:BTCUSDT",
interval:"5",
timezone:"Etc/UTC",
theme:"dark",
style:"1",
container_id:"chart"
});


// TELEGRAM CONFIG

const BOT_TOKEN="8680897603:AAG1q6d4VU-hI-xN04uxVuIM3IzoRpD0_Ac";
const CHAT_ID="895422832";

function sendAlert(msg){

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
chat_id:CHAT_ID,
text:msg
})
});

}



// CALCULATOR FUNCTION

function calculate(){

let type=document.getElementById("type").value;

let capital=parseFloat(document.getElementById("capital").value);

let entry=parseFloat(document.getElementById("entry").value);

let lossPercent=parseFloat(document.getElementById("lossPercent").value);

let profitPercent=parseFloat(document.getElementById("profitPercent").value);


// Input validation

if(!capital || !entry || !lossPercent || !profitPercent){

alert("Please fill all fields");

return;

}


// Recommended leverage

let leverage=Math.floor(100/lossPercent);


// Position size

let positionSize=capital*leverage;


// Stop Loss & Take Profit

let sl;
let tp;

if(type==="long"){

sl=entry-(entry*lossPercent/100);
tp=entry+(entry*profitPercent/100);

}else{

sl=entry+(entry*lossPercent/100);
tp=entry-(entry*profitPercent/100);

}


// Estimated liquidation

let liqDistance=entry/leverage;

let liquidation;

if(type==="long"){

liquidation=entry-liqDistance;

}else{

liquidation=entry+liqDistance;

}


// Risk

let riskAmount=capital*(lossPercent/100);


// Profit

let profit=capital*(profitPercent/100)*leverage;


// Risk Reward

let rr=profitPercent/lossPercent;


// Output

let result=`

Position Size: $${positionSize.toFixed(2)}

Recommended Leverage: ${leverage}x

Stop Loss Price: ${sl.toFixed(2)}

Take Profit Price: ${tp.toFixed(2)}

Estimated Liquidation: ${liquidation.toFixed(2)}

Risk Amount: $${riskAmount.toFixed(2)}

Potential Profit: $${profit.toFixed(2)}

Risk Reward Ratio: 1:${rr.toFixed(2)}

`;

document.getElementById("output").innerHTML=result;


// Telegram alert

sendAlert("Trade Calculated\n\n"+result);

}