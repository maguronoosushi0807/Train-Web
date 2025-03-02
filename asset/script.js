const white  = "#F2F0F1";
const orange = "#FF831F";
const blue   = "#00A6B4";
const pink   = "#F79FBA";

let loc_now  = "Iwade";
let loc_dest = "Miyamae";

let ItW = new Array();
let WtI = new Array();
let MtW = new Array();
let WtM = new Array();


// 読み出し
window.onload = async function load(){
  const ItW_file = await fetch("asset/ItW.csv");
  const WtI_file = await fetch('asset/WtI.csv');
  const MtW_file = await fetch('asset/MtW.csv');
  const WtM_file = await fetch('asset/WtM.csv');
  
  const ItW_text = await ItW_file.text();
  const WtI_text = await WtI_file.text();
  const MtW_text = await MtW_file.text();
  const WtM_text = await WtM_file.text();


  const ItW_split = ItW_text.split(/,|\n/);
  ItW_split.forEach(function(value, index){
    let is_rapid = false;

    if(value.startsWith('_')){
      is_rapid = true;
      value = value.slice(1);
    }

    let hour = Number(value.substring(0,2));
    let min  = Number(value.substring(2,4));

    ItW.push({time: hour*60+min, is_rapid: is_rapid});
  })


  const WtI_split = WtI_text.split(/,|\n/);
  WtI_split.forEach(function(value, index){
    let is_rapid = false;

    if(value.startsWith('_')){
      is_rapid = true;
      value = value.slice(1);
    }

    let hour = Number(value.substring(0,2));
    let min  = Number(value.substring(2,4));

    WtI.push({time: hour*60+min, is_rapid: is_rapid});
  })


  const MtW_split = MtW_text.split(/,|\n/);
  MtW_split.forEach(function(value, index){
    let is_rapid = false;

    if(value.startsWith('_')){
      is_rapid = true;
      value = value.slice(1);
    }

    let hour = Number(value.substring(0,2));
    let min  = Number(value.substring(2,4));

    MtW.push({time: hour*60+min, is_rapid: is_rapid});
  })


  const WtM_split = WtM_text.split(/,|\n/);
  WtM_split.forEach(function(value, index){
    let is_rapid = false;

    if(value.startsWith('_')){
      is_rapid = true;
      value = value.slice(1);
    }

    let hour = Number(value.substring(0,2));
    let min  = Number(value.substring(2,4));

    WtM.push({time: hour*60+min, is_rapid: is_rapid});
  })


  document.getElementById("test").textContent = ItW.length+" - ";
  for(let i=0;i<ItW.length;i++){
    document.getElementById("test").textContent += ItW[i].time + " ";
  }


  update();
}

function changeLocation(){
  [loc_now, loc_dest] = [loc_dest, loc_now];
  document.getElementById("locations").textContent = loc_now + " to " + loc_dest;

  update();
}

function update(){
  // 時刻を取得
  let date = new Date();
  let hour = date.getHours();
  let min  = date.getMinutes();
  let time = hour*60 + min;

  let leave_1    = new Array();
  let arrive_1   = new Array();
  let duration_1 = new Array();
  let is_rapid_1 = new Array();

  let waiting    = new Array();

  let leave_2    = new Array();
  let arrive_2   = new Array();
  let duration_2 = new Array();
  let is_rapid_2 = new Array();

  let total      = new Array();
  
  let count = 0;
  // 岩出から宮前
  if(loc_now == "Iwade"){
    // 岩出から和歌山
    for(let i=0;i<ItW.length;i++){
      if(time <= ItW[i].time){
        let time = ItW[i].time;
        let min  = time%60;
        let hour = (time-min) / 60;
        
        let duration = 22;
        if(ItW[i].is_rapid){
          duration = 15;
        }
        
        leave_1.push({time: time,  hour: hour,  min: min});
        arrive_1.push(time+duration);
        duration_1.push(duration);
        is_rapid_1.push(ItW[i].is_rapid);

        count++;
        if(count == 4) break;
      }
    }

    // 和歌山から宮前
    count = 0;
    for(let i=0;i<WtM.length;i++){
      if(arrive_1[count] <= WtM[i].time){
        let duration = 3;
        let time = WtM[i].time + duration;
        let min  = time%60;
        let hour = (time-min) / 60;

        waiting.push(time - arrive_1[count]);

        leave_2.push(time);
        arrive_2.push({time: time,  hour: hour, min: min});
        duration_2.push(duration);
        is_rapid_2.push(false);

        total.push(time - leave_1[count].time);

        count++;
        if(count == 4) break;
      }
    }
  }
  // 宮前から岩出
  else{
    // 宮前から和歌山
    for(let i=0;i<MtW.length;i++){
      if(time <= MtW[i].time){
        let time = MtW[i].time;
        let min  = time%60;
        let hour = (time-min) / 60;

        let duration = 3;
        
        leave_1.push({time: time,  hour: hour,  min: min});
        arrive_1.push(time+duration);
        duration_1.push(duration);
        is_rapid_1.push(MtW[i].is_rapid);

        count++;
        if(count == 4) break;
      }
    }

    // 和歌山から岩出
    count = 0;
    for(let i=0;i<WtI.length;i++){
      if(arrive_1[count] <= WtI[i].time){
        let duration = 22;
        let is_rapid = false;
        if(WtI[i].is_rapid){
          duration = 15;
          is_rapid = true;
        }

        let time = WtI[i].time + duration;
        let min  = time%60;
        let hour = (time-min) / 60;

        waiting.push(WtI[i].time - arrive_1[count]);

        leave_2.push(time);
        arrive_2.push({time: time,  hour: hour, min: min});
        duration_2.push(duration);
        is_rapid_2.push(is_rapid);

        total.push(time - leave_1[count].time);

        count++;
        if(count == 4) break;
      }
    }
  }
  
  
  for(let i=0;i<count;i++){
    let num = i+1;
    document.getElementById("leave-"   +num).textContent = leave_1[i].hour+":"+ ("00"+leave_1[i].min).slice(-2);
    if(is_rapid_1[i]){
      document.getElementById("leave-"   +num).style.color = orange;
    }else{
      document.getElementById("leave-"   +num).style.color = white;
    }

    document.getElementById("arrive-"  +num).textContent = arrive_2[i].hour+":"+ ("00"+arrive_2[i].min).slice(-2);
    if(is_rapid_2[i]){
      document.getElementById("arrive-"   +num).style.color = orange;
    }else{
      document.getElementById("arrive-"   +num).style.color = white;
    }

    // document.getElementById("waiting-" +num).textContent = waiting[i] + "min - (" + Math.round(waiting[i]/total[i]*100) + "% waiting)";
    document.getElementById("waiting-" +num).textContent = total[i] + "min - (" + Math.round(waiting[i]/total[i]*100) + "% waiting)";

    document.getElementById("iwade-"   +num).style.flex = duration_1[i];
    document.getElementById("wakayama-"+num).style.flex = waiting[i];
    document.getElementById("miyamae-" +num).style.flex = duration_2[i];
    
    if(loc_now == "Iwade"){
      document.getElementById("iwade-"  +num).style.backgroundColor = pink;
      document.getElementById("miyamae-"+num).style.backgroundColor = blue;
    }else{
      document.getElementById("iwade-"  +num).style.backgroundColor = blue;
      document.getElementById("miyamae-"+num).style.backgroundColor = pink;
    }

  }

  document.getElementById("test").textContent = leave_1[0].hour+":"+("00"+leave_1[0].min).slice(-2)+" → "+arrive_2[0].hour+":"+("00"+arrive_2[0].min).slice(-2)+" _ location:"+duration_1[0]+"("+is_rapid_1[0]+") - wait:"+waiting[0]+" - destination:"+duration_2[0]+"("+is_rapid_2[0]+")"+" _ total:"+total[0];

}

// leave-1
// arrive-1
// waiting-1