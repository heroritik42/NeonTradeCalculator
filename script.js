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

const BOT_TOKEN = "8680897603:AAG1q6d4VU-hI-xN04uxVuIM3IzoRpD0_Ac";
const CHAT_ID = "895422832";

function sendAlert(msg){

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
chat_id:CHAT_ID,
text:msg
})
}).catch(err => console.log("Telegram Error:",err));

}



// MAIN CALCULATOR

function calculate(){

let type = document.getElementById("type").value;

let capital = parseFloat(document.getElementById("capital").value);

let entry = parseFloat(document.getElementById("entry").value);

let lossPercent = parseFloat(document.getElementById("lossPercent").value);

let profitPercent = parseFloat(document.getElementById("profitPercent").value);


// INPUT VALIDATION

if(!capital || !entry || !lossPercent || !profitPercent){

alert("Please fill all fields");

return;

}


// SAFER LEVERAGE (SL से नीचे liquidation)

let leverage = Math.floor(90 / lossPercent);


// POSITION SIZE

let positionSize = capital * leverage;


// STOP LOSS & TAKE PROFIT

let sl;
let tp;

if(type === "long"){

sl = entry - (entry * lossPercent / 100);
tp = entry + (entry * profitPercent / 100);

}else{

sl = entry + (entry * lossPercent / 100);
tp = entry - (entry * profitPercent / 100);

}


// ESTIMATED LIQUIDATION

let liqDistance = entry / leverage;

let liquidation;

if(type === "long"){

liquidation = entry - liqDistance;

}else{

liquidation = entry + liqDistance;

}


// RISK AMOUNT

let riskAmount = capital * (lossPercent / 100);


// POTENTIAL PROFIT

let profit = capital * (profitPercent / 100) * leverage;


// RISK REWARD

let rr = profitPercent / lossPercent;


// LIQUIDATION SAFETY CHECK

let warning = "";

if(type === "long" && liquidation >= sl){

warning = "⚠️ WARNING: Liquidation above Stop Loss. Reduce leverage.";

}

if(type === "short" && liquidation <= sl){

warning = "⚠️ WARNING: Liquidation above Stop Loss. Reduce leverage.";

}


// OUTPUT

let result = `

Position Size: $${positionSize.toFixed(2)}

Recommended Leverage: ${leverage}x

Stop Loss Price: ${sl.toFixed(2)}

Take Profit Price: ${tp.toFixed(2)}

Estimated Liquidation: ${liquidation.toFixed(2)}

Risk Amount: $${riskAmount.toFixed(2)}

Potential Profit: $${profit.toFixed(2)}

Risk Reward Ratio: 1:${rr.toFixed(2)}

${warning}

`;


document.getElementById("output").innerHTML = result;


// TELEGRAM ALERT

sendAlert("📊 Trade Calculated\n\n" + result);

}
