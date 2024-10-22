let languages=[
    {language:"en",restore:'restore',backup:'backup',setting:'setting',show:'show',hide:'hide',
                   block:'block',channel:'channel',video:'video',keyword:'keyword',comment:'comment',
                   user:'user',highlight:'highlight',color:'color',curvature:'curvature',border:'border',
                   regex:'regex',posttime:'post time',regex_post_time:'minute ,hour,^1\sday'},
    {language:"zh",restore:'還原',backup:'備份',setting:'設定',show:'顯示',hide:'隱藏',
                   block:'屏蔽',channel:'頻道',video:'影片',keyword:'關鍵字',comment:'留言',
                   user:'用戶',highlight:'高亮',color:'顏色',curvature:'弧度',border:'邊框',
                   regex:'正規表示式',posttime:'發佈時間',regex_post_time:'分鐘,小時,^1\s天'},
];
let autoDectectSystemLanguage=true;//set true to auto detect system language or set false to assign specify language below
let language="en";
let currentlanguageindex=0;
//---add language by yourself -------------------------------------------------
const BLOCK_CHANNEL=0;const BLOCK_VIDEO_KEYWORD=1;const BLOCK_VIDEO=2;const BLOCK_COMMENT_USER=3;const BLOCK_COMMENT_KEYWORD=4;
const HIGHLIGHT_CHANNEL=5;const HIGHLIGHT_VIDEO_KEYWORD=6;const HIGHLIGHT_VIDEO=7;const HIGHLIGHT_COMMENT_USER=8;
let narrowwidth=150;
let block="block";let highlight="highlight";let setting="setting";let show='show';let hide='hide';
let parametersArray=[
    {title:"channel",value:[],uiwidth:200,filter:"true",storageid:"small_array0"},
    {title:"video keyword",value:[],uiwidth:narrowwidth-40,filter:"true",storageid:"small_array1"},
    {title:"video",value:[],uiwidth:narrowwidth-50,filter:"true",storageid:"small_array2"},
    {title:"comment user",value:[],uiwidth:200,filter:"true",storageid:"small_array3"},
    {title:"comment keyword",value:[],uiwidth:narrowwidth,filter:"true",storageid:"small_array4"},
    {title:"channel",value:[],uiwidth:200,filter:"true",storageid:"small_array5"},
    {title:"video keyword",value:[],uiwidth:narrowwidth-40,filter:"true",storageid:"small_array6"},
    {title:"video",value:[],uiwidth:narrowwidth-50,filter:"true",storageid:"small_array7"},
    {title:"comment user",value:[],uiwidth:200,filter:"true",storageid:"small_array8"},
    ];
const HIGHLIGHT_CHANNEL_BACKGROUND=0;const HIGHLIGHT_VIDEO_KEYWORD_ARC=1;const HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND=2;
const HIGHLIGHT_VIDEO_BACKGROUND=3;const HIGHLIGHT_COMMENT_USER_BACKGROUND=4;const HIGHTLIGHT_POSTTIME_BAKGROUND=5;
const HIGHTLIGHT_POSTTIME_REGX=6;const HIGHTLIGHT_POSTTIME_TRUE=7;const HIDE_COMMENT=8;
let parametersSingle=[
    {title:"highlight channel color",type:"color",value:'#ffffe6',storageid:"small_single0"},
    //highlight keyword border:
    {title:"curvature",type:"string",value:'12',valuer:'px',storageid:"small_single1"},
    {title:"color",type:"color",value:'#ff0000',valuep:'4px solid ',storageid:"small_single2"},
    {title:"highlight video color",type:"color",value:'#e6fffd',storageid:"small_single3"},
    {title:"hightlight comment user color",type:"color",value:'#ffffe6',storageid:"small_single4"},
    //highlight post time
    {title:"color",type:"color",value:'#ffd2dc',storageid:"small_single5"},
    {title:"regex",type:"string",value:'minute,hour,^1\sday',storageid:"small_single6"},
    {title:"highlight post time",type:"boolean",value:'true',storageid:"small_single7"},
    {title:"hide comment",type:"boolean",value:'false',storageid:"small_single8"},
    ];
//----------------------------------------------------------------------------
let title_restorefile="restore";let title_savefile="backup";
class ParametersAgent{
    container;uniqueid;
    filename="parameters.txt";
    fontsize="14px";
    parametersUiHieght="200";
    splitmark=",";
    static checkid="_checked";
    static currentSelect=BLOCK_CHANNEL;
    constructor(container,filename,fontsize=this.fontsize){
        this.container=container;
        this.filename=filename;
        this.fontsize=fontsize;
    }
    static LT=0;static LB=1;static RT=2;static RB=3; //parameters ui position
    setPositionxy(mode){
        let edgex="left";let edgey="top";
        let edgegapx="2px",edgegapy="2px";
        if(mode==ParametersAgent.LT){edgex="left";edgey="top";}
        else if(mode==ParametersAgent.LB){edgex="left";edgey="bottom";edgegapy="20px";}
        else if(mode==ParametersAgent.RT){edgex="right";edgey="top";}
        else if(mode==ParametersAgent.RB){edgex="right";edgey="bottom";edgegapy="20px";}
        let xy=`${edgex}:${edgegapx};${edgey}:${edgegapy};`;
        return xy;
    }
    setPanel_Parameters(positionmode,dofunc_whenopen,dofunc_whenclose,lines=2){
        //let table=this.generateParametersArrayUI(lines);
        let table=this.generateParametersArrayUI_tabpane();
        this.createParametersControlPanel(positionmode,table,dofunc_whenopen,dofunc_whenclose);
    }
    static setTAshow(index){
        ParametersAgent.currentSelect=index;
        let backgroundcolor="#cce6ff";
        if(index==this.SETTING){
           let p=document.getElementById("smallsuposettings");
           let b=document.getElementById("smallbuttonsetting");
           if(p!=null&&b!=null){
               p.style.display="block";b.style.background = backgroundcolor;
               for(let i=0;i<parametersArray.length;i++){
                   let p= parametersArray[i];
                   let ta=document.getElementById(p.storageid);
                   let button=document.getElementById("smallbutton"+p.storageid);
                   ta.style.display="none";
                   button.style.background = null;
               }
           }
        }else{
        for(let i=0;i<parametersArray.length;i++){
            let p= parametersArray[i];
              let ta=document.getElementById(p.storageid);
              let button=document.getElementById("smallbutton"+p.storageid);
           if(i==index){
               ta.style.display="block";
               button.style.background = backgroundcolor;
           }else{
               ta.style.display="none";
               button.style.background = null;
           }
        }
            let p=document.getElementById("smallsuposettings");let b=document.getElementById("smallbuttonsetting");
           if(p!=null&&b!=null){ p.style.display="none";b.style.background = null;}
        }
     }
    createParametersControlPanel(positionmode,mainpanel,dofunc_whenopen,dofunc_whenclose){
        const zindex=9999999;const position="fixed";
        const others="";//"transform: translate(0%, -100%);";
        const ui_border_color="#888888";
        //const id_uniq="youtubeP";
        const bgcolor="rgb(241, 242, 243)";const fcolor="black";
        const id_button="smallsupo_id_parametersControlPanel_button_"+this.uniqueid;
        const id_divpanel="smallsupo_id_parametersControlPanel_divpanel_"+this.uniqueid;
        const button_width="32px";
        const button_opacity="0.2";
        const ICON_SETTING='<svg id="i-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" /><circle cx="16" cy="16" r="4" /></svg>';
        const button_openicon=ICON_SETTING;
        let button_closeicon=ICON_SETTING;
        const button_fontsize="small";
        let SETTING=-1;
        let div=document.createElement("div");div.setAttribute("style","position:"+position+";z-Index:"+zindex+";"+this.setPositionxy(positionmode));
        let table=document.createElement("table");table.setAttribute("style","border:0px;");
        //---button--------------
        let tr0=document.createElement("tr");
        let td0=document.createElement("td");td0.setAttribute("style","vertical-align: top;");
        let button=document.createElement("div");button.setAttribute("id",id_button);
        button.setAttribute("style","text-align: center;cursor: pointer;width:"+button_width+";height:"+button_width+";background-color:"+bgcolor+";color:"+fcolor+";font-size: "+button_fontsize+";");
        button.innerHTML=button_closeicon;
        button.onmouseover= (e) => {
            let b=document.getElementById(id_button);let p=document.getElementById(id_divpanel);
            if(p.style.display=="none"){b.style.opacity=1;}
	    };
        button.onmouseleave=(e) => {
            let b=document.getElementById(id_button);let p=document.getElementById(id_divpanel);
            if(p.style.display=="none"){b.style.opacity=button_opacity;}
        };
        button.onclick = ()=> {
		let b=document.getElementById(id_button);let p=document.getElementById(id_divpanel);
		if(p.style.display=="none"){
			b.innerHTML=button_openicon;b.style.opacity=1;button.style.border ="1px solid "+ui_border_color+";";
			p.style.display="block";
			this.openParametersUI(dofunc_whenopen);
		}else{
			b.innerHTML=button_closeicon;button.style.border ="none";p.style.display ="none";
			this.closeParametersUI(dofunc_whenclose);
		}
        };
        td0.appendChild(button);tr0.appendChild(td0);
        //-----
        let tr1=document.createElement("tr");let td1=document.createElement("td");td1.setAttribute("style","vertical-align: center;");
        let divpanel=document.createElement("div");divpanel.setAttribute("id",id_divpanel);
        divpanel.setAttribute("style","background-color:"+bgcolor+";color:"+fcolor+";display:none;");
        //-----main panel ui code here
        divpanel.appendChild(mainpanel);
        td1.appendChild(divpanel);tr1.appendChild(td1);
        //-----
        if(positionmode==ParametersAgent.LT||positionmode==ParametersAgent.RT){table.appendChild(tr0);table.appendChild(tr1);}
        else if(positionmode==ParametersAgent.LB||positionmode==ParametersAgent.RB){table.appendChild(tr1);table.appendChild(tr0);}
        div.appendChild(table);this.container.appendChild(div);
        //default hidden
        divpanel.style.display="none";
        setTimeout(()=>{
            if(document.getElementById(id_divpanel).style.display=="none")document.getElementById(id_button).style.opacity=button_opacity;
        },5000);
    }
    static setFilerValue(id,filter){
        for(let i=0;i<parametersArray.length;i++){
            if(parametersArray[i].storageid==id){
                parametersArray[i].filter=filter;
                ParametersAgent.saveLocalStorage1(parametersArray[i].storageid+ParametersAgent.checkid,parametersArray[i].filter);
            }
        }
        //console.log(id,filter);
        for(let i=0;i<parametersSingle.length;i++){
            if(parametersSingle[i].storageid==id){
                parametersSingle[i].value==filter;
                ParametersAgent.saveLocalStorage1(parametersSingle[i].storageid,filter);
            }
        }
    }
    generateSettingPanel(){
       let widthpx=290;
       let table=document.createElement("table");table.setAttribute("id","smallsuposettings");table.setAttribute("style","display:'none';");
       let tr=document.createElement("tr");
       let td=document.createElement("td");td.setAttribute("style","width:"+widthpx+"px;vertical-align: top;font-size:"+this.fontsize+";");
       td=this.generateParametersSingleUI(td);tr.appendChild(td);table.appendChild(tr);
       tr=document.createElement("tr");
       td=document.createElement("td");td.setAttribute("style","width:"+widthpx+"px;vertical-align: center;font-size:"+this.fontsize+";");
       td.innerText="　";tr.appendChild(td);table.appendChild(tr);
       tr=document.createElement("tr");
       td=document.createElement("td");td.setAttribute("style","width:"+widthpx+"px;vertical-align: top;font-size:"+this.fontsize+";");
       this.loadLocalFile(td,title_restorefile,"font-size:"+this.fontsize+";",this.doAfterLoadFile.bind(this));
       tr.appendChild(td);table.appendChild(tr);
       tr=document.createElement("tr");
       td=document.createElement("td");td.setAttribute("style","width:"+widthpx+"px;vertical-align: top;font-size:"+this.fontsize+";");
       this.saveLocalFile(td,title_savefile,this.filename,"text","font-size:"+this.fontsize+";",this.doBeforeSaveFile.bind(this));
       tr.appendChild(td);table.appendChild(tr);
       return table;
    }
    generateParametersArrayUI_tabpane(){
        let table=document.createElement("table");
        table.style.border="1px solid #888888;";table.style.boxShadow = "10px 20px 30px gray";
        let trtop=document.createElement("tr");
        let tdtop=document.createElement("td");tdtop.setAttribute("colspan",3);tdtop.setAttribute("style","text-align:center;");
        tdtop.innerHTML="<h2>Youtube-filter</h2>";
        trtop.appendChild(tdtop);table.appendChild(trtop);
        let tr=document.createElement("tr");
        let tdleft=document.createElement("td");tdleft.setAttribute("style",
                   "width:200px;vertical-align: top;font-size:"+this.fontsize+";");
        let menutable=document.createElement("table");
        for(let i=0;i<parametersArray.length;i++){
            if(i==0||i==5){
               let type=block;if(i==5)type=highlight;
               if(i==5){
                   let tr=document.createElement("tr");
                   let td=document.createElement("td");td.setAttribute("style","visibility: hidden;");td.innerText="　";tr.appendChild(td);
                   td=document.createElement("td");
                   tr.appendChild(td);
                   menutable.appendChild(tr);
               }
               let tr=document.createElement("tr");
               let td=document.createElement("td");td.setAttribute("colspan",2);
               td.setAttribute("style","color: red;font-weight: bold;width:200px;vertical-align: top;text-align:left;font-size:"+this.fontsize+";");
               td.innerText=type;
               tr.appendChild(td);menutable.appendChild(tr);
            }
            let menutr=document.createElement("tr");
            let p=parametersArray[i];
            let td=document.createElement("td");td.setAttribute("style",
                   "vertical-align: top;font-size:"+this.fontsize+";");
            //let dtable=document.createElement("table");
            let dtdc=document.createElement("td");
            let dtdtitle=document.createElement("td");
            let c=document.createElement("input");c.setAttribute("id",p.storageid+ParametersAgent.checkid);c.setAttribute("type", "checkbox");
            let title=document.createElement("button");title.setAttribute("id","smallbutton"+p.storageid);
            title.setAttribute("style","width:180px;cursor: pointer;");title.innerText=p.title;
            p.filter=this.loadLocalStorage(p.storageid+ParametersAgent.checkid,p.filter);
            if(p.filter=="true"){c.checked=true;}else{c.checked=false;}
            c.onclick = function () {if(!c.checked){
            ParametersAgent.setFilerValue(p.storageid,"false");}else {ParametersAgent.setFilerValue(p.storageid,"true");}
                                    filter("from checkbox");
                                    };
            title.onclick = function (){
                ParametersAgent.setTAshow(i);
            };
            dtdc.appendChild(c);dtdtitle.appendChild(title);menutr.appendChild(dtdc);menutr.appendChild(dtdtitle);
            menutable.appendChild(menutr);

        }
        //----------------------------------------------
        let menutr=document.createElement("tr");
        let td=document.createElement("td");td.setAttribute("style","visibility: hidden;");td.innerText="　";menutr.appendChild(td);
        td=document.createElement("td");
        menutr.appendChild(td);
        menutable.appendChild(menutr);
        menutr=document.createElement("tr");
        td=document.createElement("td");menutr.appendChild(td);
        td=document.createElement("td");
        let settingbutton=document.createElement("button");settingbutton.setAttribute("style","width:180px;cursor: pointer;");
        settingbutton.innerText=setting;settingbutton.setAttribute("id","smallbuttonsetting");
        settingbutton.onclick = function (){ParametersAgent.setTAshow(this.SETTING);};
        td.appendChild(settingbutton);menutr.appendChild(td);
        menutable.appendChild(menutr);
        tdleft.appendChild(menutable);
        //----------------------------------------------

        let tdcenter=document.createElement("td");tdcenter.setAttribute("style","width:300px;vertical-align: top;font-size:"+this.fontsize+";");
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            let ta=document.createElement("textarea")
            ta.setAttribute("id",p.storageid);ta.setAttribute("rows",20);
            ta.setAttribute("style","display:'none';width:98%;height:100%;white-space:pre;overflow:scroll;resize: general;font-size:"+this.fontsize+";");
            tdcenter.appendChild(ta);
        }
        tdcenter.appendChild(this.generateSettingPanel());
        //let tdright=document.createElement("td");tdright.setAttribute("style","width:200px;vertical-align: top;font-size:"+this.fontsize+";");

        tr.appendChild(tdleft);tr.appendChild(tdcenter);//tr.appendChild(this.generateParametersSingleUI(tdright));
        table.appendChild(tr);
        tr=document.createElement("tr");
       //?
        td=document.createElement("td");td.setAttribute("style","text-align: right;");td.setAttribute("colspan",2);this.generateQuestionLink(td);tr.appendChild(td);
        table.appendChild(tr);
        return table;
//--------------------

    }
    generateParametersArrayUI(lines){
        let table=document.createElement("table");
        table.style.border="1px solid #888888;";table.style.boxShadow = "10px 20px 30px gray";
        let startindex=0;
        let onelinecount=Math.ceil(parametersArray.length/lines);
        for(let j=0;j<lines;j++){
            let tr=document.createElement("tr");
            for(let i=0;i<onelinecount;i++){
                //console.log("index:"+(startindex+i));
                if((startindex+i)<parametersArray.length){
                let p=parametersArray[startindex+i];
                    let w=p.uiwidth;
                    let td=document.createElement("td");td.setAttribute("style","width:"+w+"px;word-wrap: break-word;vertical-align: bottom;font-size:"+
                               this.fontsize+";");
                    let d=document.createElement("div");d.innerText=p.title;//+'('+p.value.length+')';
                    let c=document.createElement("input");c.setAttribute("id",p.storageid+ParametersAgent.checkid);c.setAttribute("type", "checkbox");
                    p.filter=this.loadLocalStorage(p.storageid+ParametersAgent.checkid,p.filter);
                    if(p.filter=="true"){c.checked=true;}else{c.checked=false;}
                    c.onclick = function () {if(!c.checked){
                        ParametersAgent.setFilerValue(p.storageid,"false");}else {ParametersAgent.setFilerValue(p.storageid,"true");}
                        filter("from checkbox");
                                            };
                    d.appendChild(c);td.appendChild(d);
                    tr.appendChild(td);
                }
            }
            if(j==0){
                let td=document.createElement("td");td.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";");
                td.setAttribute("rowspan",lines*2);
                tr.appendChild(this.generateParametersSingleUI(td));
            }
            table.appendChild(tr);
            tr=document.createElement("tr");
            for(let i=0;i<onelinecount;i++){
                if((startindex+i)<parametersArray.length){
                let p=parametersArray[startindex+i];
                if(Array.isArray(p.value)){
                    let td=document.createElement("td");td.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";");
                    let w=p.uiwidth;
                    let h=this.parametersUiHieght;
                    let ta=document.createElement("textarea")
                    ta.setAttribute("id",p.storageid);
                    ta.setAttribute("style","width:"+w+"px;height:"+h+"px;white-space:pre;overflow:scroll;resize: general;font-size:"+this.fontsize+";");
                td.appendChild(ta);tr.appendChild(td);
                }
                }
            }
            table.appendChild(tr);
            startindex+=onelinecount;
        }
        //-------
        let tr=document.createElement("tr");
        let td=document.createElement("td");td.setAttribute("style","vertical-align: center;font-size:"+this.fontsize+";");td.setAttribute("colspan",onelinecount);
        this.loadLocalFile(td,title_restorefile,"font-size:"+this.fontsize+";",this.doAfterLoadFile.bind(this));tr.appendChild(td);
        //td=document.createElement("td");td.setAttribute("style","vertical-align: center;text-align:right;font-size:"+this.fontsize+";");
        this.saveLocalFile(td,title_savefile,this.filename,"text","font-size:"+this.fontsize+";",this.doBeforeSaveFile.bind(this));tr.appendChild(td);
        td=document.createElement("td");td.setAttribute("style","text-align: right;");this.generateQuestionLink(td);tr.appendChild(td);
        table.appendChild(tr);
        return table;
    }
    generateParametersSingleUI(container){
        let innerhtml="";let bodersytle="border-style: ridge;border-width: 2px;margin:2px";
        let colorwidth="70px;";
        let p=parametersSingle[0];
        let div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";"+bodersytle);
        innerhtml='<div><b>'+languages[currentlanguageindex].highlight+' '+languages[currentlanguageindex].channel+
            ':</b> '+languages[currentlanguageindex].color+'<input type="text" id="'+p.storageid+'" style="width:'+colorwidth+'">';
        innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
        div.innerHTML=innerhtml;container.appendChild(div);

        div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";"+bodersytle);
        innerhtml='<div><b>'+languages[currentlanguageindex].highlight+' '+languages[currentlanguageindex].channel+' '+
            languages[currentlanguageindex].border+':</b></div>';
        p=parametersSingle[1];
        innerhtml+='<div>'+p.title+':<input type="text" id="'+p.storageid+'" style="width:40px;">';
        p=parametersSingle[2];
        innerhtml+=' '+p.title+':<input type="text" id="'+p.storageid+'" style="width:'+colorwidth+'">';
        innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
        div.innerHTML=innerhtml;container.appendChild(div);

        p=parametersSingle[3];
        div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";"+bodersytle);
        innerhtml='<div><b>'+languages[currentlanguageindex].highlight+' '+languages[currentlanguageindex].video+
            ':</b> '+languages[currentlanguageindex].color+'<input type="text" id="'+p.storageid+'" style="width:'+colorwidth+'">';
        innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
        div.innerHTML=innerhtml;container.appendChild(div);

        p=parametersSingle[4];
        div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";"+bodersytle);
        innerhtml='<div><b>'+languages[currentlanguageindex].highlight+' '+languages[currentlanguageindex].comment+' '+
            languages[currentlanguageindex].user+':</b> '+languages[currentlanguageindex].color+'<input type="text" id="'+p.storageid+'" style="width:'+colorwidth+'">';
        innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
        div.innerHTML=innerhtml;container.appendChild(div);

        div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";"+bodersytle);
        //innerhtml='<div><b>'+languages[currentlanguageindex].highlight+' '+languages[currentlanguageindex].posttime+':</b></div>';

        p=parametersSingle[5];
        innerhtml='<div>'+p.title+':<input type="text" id="'+p.storageid+'" style="width:'+colorwidth+'">';
        innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
        p=parametersSingle[6];
        innerhtml+='<div>'+p.title+':</div><div><input type="text" id="'+p.storageid+'" style="width:96%;"></div>';
        div.innerHTML=innerhtml;container.appendChild(div);

        p=parametersSingle[7];
        let div1=document.createElement("div");div1.setAttribute("style","vertical-align: top;font-weight: bold;font-size:"+this.fontsize+";");
        let c=document.createElement("input");c.setAttribute("id",p.storageid);c.setAttribute("type", "checkbox");
        if((""+p.value).localeCompare("true")==0){c.checked=true;}else{c.checked=false;}
        c.onclick = function () {if(c.checked==false){
            p.value="false";//ParametersAgent.setFilerValue(p.storageid,"false");
        }else {p.value="true";//ParametersAgent.setFilerValue(p.storageid,"true");
              }
            filter("from checkbox post time");
                                };
        div1.innerText=p.title;
        div1.appendChild(c);
        div.insertBefore(div1,div.firstChild);

        let p1=parametersSingle[8];
        div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-weight: bold;font-size:"+this.fontsize+";"+bodersytle);
        let c1=document.createElement("input");c1.setAttribute("id",p1.storageid);c1.setAttribute("type", "checkbox");
        if((""+p1.value).localeCompare("true")==0){c1.checked=true;}else{c1.checked=false;}
        c1.onclick = function () {if(!c1.checked){
            p1.value="false";}else {p1.value="true";}
                                 filter("from checkbox");
                                };
        div.innerText=p1.title;
        div.appendChild(c1);
        container.appendChild(div);

        return container;
    }
    generateParametersSingleUI1(container){
        let innerhtml="";
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            if(p.type.localeCompare("boolean")==0){
                let div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";");
                let c=document.createElement("input");c.setAttribute("id",p.storageid);c.setAttribute("type", "checkbox");
                if((""+p.value).localeCompare("true")==0){c.checked=true;}else{c.checked=false;}
                c.onclick = function () {if(!c.checked){
                    p.value="false";}else {p.value="true";}
                        filter("from checkbox");
                                            };
                div.innerText=p.title;
                div.appendChild(c);
                container.appendChild(div);
            }else if(p.type.localeCompare("color")==0){
                let div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";");
                innerhtml='<div>'+p.title+':</div><div><input type="text" id="'+p.storageid+'" style="width:150px;">';
                innerhtml+='<input type="color" value="'+p.value+'" id="color-picker'+p.storageid+'"/></div>';
                div.innerHTML=innerhtml;
                container.appendChild(div);

            }else{
                let div=document.createElement("div");div.setAttribute("style","vertical-align: top;font-size:"+this.fontsize+";");
                innerhtml='<div>'+p.title+':</div><div><input type="text" id="'+p.storageid+'" style="width:96%;"></div>';
                div.innerHTML=innerhtml;
                container.appendChild(div);
            }
        }        
        return container;
    }
        generateQuestionLink(container){
        let icon='<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="none" /><text x="50%" y="50%" font-size="50" text-anchor="middle" fill="black" dy=".3em">?</text></svg>';
        let div=document.createElement("div");div.setAttribute("style","align:right;vertical-align: bottom;font-size:"+this.fontsize+";cursor: pointer;");
        div.onclick = function () {
            window.location.href = "https://greasyfork.org/scripts/500798";
        };
        div.innerHTML=icon;
        container.appendChild(div);
    }
    saveLocalFile(element,uistring,filename,filetype,style,doBeforeSave){
        let div=document.createElement("div");
        let l=document.createElement("label");l.innerText=uistring+": ";
        let b=document.createElement("button");b.setAttribute("style","border: 1px solid #888888;cursor: pointer;"+style);
        b.innerText=".txt";
        b.onclick = function () {
            let s="";
            s=doBeforeSave();
            ParametersAgent.download(s, filename, filetype);
        };
        div.appendChild(l);div.appendChild(b);
        element.appendChild(div);
    }
    static download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(file, filename);
        }else {
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            console.log(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
    loadLocalFile(element,uistring,style,doAfterLoad){
        let b=document.createElement("label");b.setAttribute("style",style);b.innerText=uistring+": ";element.appendChild(b);
        b=document.createElement("input");b.setAttribute("style",style);b.setAttribute("type", "file");
        b.addEventListener('change', function () {
            let fr = new FileReader();
            fr.onload = function () {
                doAfterLoad(fr.result);
            }
            fr.readAsText(this.files[0]);
        });
        element.appendChild(b);
    }
    doAfterLoadFile(s){
        let lines=s.split("\n");
        for(let i=0;i<lines.length;i++){
            if(lines[i].indexOf!=-1){
                let storageid=lines[i].substring(0,lines[i].indexOf(":"));
                let value=lines[i].substring(lines[i].indexOf(":")+1,lines[i].length);
                for(let j=0;j<parametersArray.length;j++){
                    let p=parametersArray[j];
                    if(p.storageid==storageid)p.value=JSON.parse(value);
                }
                for(let j=0;j<parametersSingle.length;j++){
                    let p=parametersSingle[j];
                    if(p.storageid==storageid)p.value=JSON.parse(value);
                }
            }
        }
        this.parametersToUi();
        this.save_parameters_toStorage();
    }
    doBeforeSaveFile(){
        this.uiToParameters();
        let s="";
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            s+=p.storageid+":"+JSON.stringify(p.value)+"\n";
        }
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            s+=p.storageid+":"+JSON.stringify(p.value)+"\n";
        }
        return s;
    }
    setColorPickerEvent(){
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            if(p.type.localeCompare("color")==0){
                let colorPicker = document.getElementById("color-picker"+p.storageid);
                let colortext = document.getElementById(p.storageid);
                if(colorPicker!=null&&colortext!=null){
                    colorPicker.value=p.value;
                    colorPicker.addEventListener("input", (event)=>{
                        p.value=event.target.value;
                        colortext.value=p.value;}, false);
                    colorPicker.addEventListener("change",(event)=>{
                        p.value=event.target.value;colortext.value=p.value;
                        filterDelay(3000);}, false);
                }
            }
        }
    }
    openParametersUI(dofunc_whenopen){
        ParametersAgent.setTAshow(ParametersAgent.currentSelect);
        this.setColorPickerEvent();
        dofunc_whenopen();
        this.load_parameters_fromStorage();
        this.parametersToUi();
    }
    closeParametersUI(dofunc_whenclose){
        this.uiToParameters();
        this.save_parameters_toStorage();
        dofunc_whenclose("from parameter ui button closed");
    }
    load_parameters_fromStorage(){
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            p.value=JSON.parse(this.loadLocalStorage(p.storageid,JSON.stringify(p.value)));
        }
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            p.value=JSON.parse(this.loadLocalStorage(p.storageid,JSON.stringify(p.value)));
        }
    }
    save_parameters_toStorage(){
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            this.saveLocalStorage(p.storageid,JSON.stringify(p.value));
        }
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            this.saveLocalStorage(p.storageid,JSON.stringify(p.value));
        }
    }
    parametersToUi(){
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            let ta=document.getElementById(p.storageid);ta.value=p.value.join("\n")+"\n";
            let l=ta.value.length;ta.focus();ta.setSelectionRange(l, l);
        }
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            document.getElementById(p.storageid).value=p.value;
        }
    }
    uiToParameters(){
        for(let i=0;i<parametersArray.length;i++){
            let p=parametersArray[i];
            p.value=document.getElementById(p.storageid).value.split('\n');
            p.value=p.value.filter((str) => str !=="");
        }
        for(let i=0;i<parametersSingle.length;i++){
            let p=parametersSingle[i];
            let d=document.getElementById(p.storageid);
            if(d.type=="checkbox"){
                p.value=d.checked;
            }else{
                p.value=document.getElementById(p.storageid).value;
            }
        }
    }
    static saveLocalStorage1(ls_id,value){
        localStorage.setItem(ls_id,value);
    }
    saveLocalStorage(ls_id,value){
        localStorage.setItem(ls_id, value);
    }
    loadLocalStorage(ls_id,parameter){
        if(!localStorage.getItem(ls_id))localStorage.setItem(ls_id, parameter);
        return localStorage.getItem(ls_id);
    }
    saveArrayLocalStorage(ls_id,ary){
        localStorage.setItem(ls_id, ary.toString());
    }
    loadArrayLocalStorage(ls_id,splitmark){
        let r=null;
        if(!localStorage.getItem(ls_id)){localStorage.setItem(ls_id, "");}
        r=localStorage.getItem(ls_id).split(splitmark);
        r=r.filter((str) => str !=="");
        return r;
     }
}
//----------------------------------------------------------------
// STG -----------------------------------------------------------------------------
class STG{ //smallsupo tools - general
    constructor(){}
    static delayRun(func,miliseconds=3000){setTimeout(function(){func();},miliseconds);}
    static COMPARE=0;static INDEXOF=1;static REGX=2;static INDEXOFREVERSE=3;
    static isEnglish(text){
        return /^[a-z]+$/i.test(text);
    }
    static stringToRegArray(s,splitmark){
      //s = s.replace("\\", "\\\\");
      let arr=s.split(splitmark);
      for(let i=0;i<arr.length;i++){
          arr[i]=new RegExp(arr[i]);
      }
      return arr;
    }
    static findInArray(text,ary,mode=this.COMPARE){
        let find=false;
        if(text==null)return false;
        ary.forEach((word) => {
            if(mode==this.COMPARE){if (text.localeCompare(word) == 0 ){find=true;}}
            else if(mode==this.INDEXOF){if(text.toLowerCase().indexOf(word.toLowerCase()) != -1 ){find=true;}}
            else if(mode==this.REGX){
                if(this.isEnglish(word)){
                    if(new RegExp("\\b("+word+")\\b", "gi").test(text)){find=true;}
                }else{
                    if(new RegExp(word,"g").test(text)){find=true;}
                }

            }
            else if(mode==this.INDEXOFREVERSE){if(word.toLowerCase().indexOf(text.toLowerCase()) != -1 ){find=true;}}
        });
        return find;
    }
    static findInArrayText(text,ary,mode=this.COMPARE){
        let find=null;
        if(text==null)return null;
        ary.forEach((word) => {
            if(mode==this.COMPARE){if (text.localeCompare(word) == 0 ){find=word;}}
            else if(mode==this.INDEXOF){if(text.toLowerCase().indexOf(word.toLowerCase()) != -1 ){find=word;}}
            else if(mode==this.REGX){if(word.test(text)){find=word;}}
            else if(mode==this.INDEXOFREVERSE){if(word.toLowerCase().indexOf(text.toLowerCase()) != -1 ){find=word;}}
        });
        return find;
    }
    static removeInArray(value,ary,mode=this.COMPARE){
        if(mode==this.COMPARE){return ary.filter((str) => str !==value);}
        else if(mode==this.INDEXOF){return ary.filter((str) => value.toLowerCase().indexOf(str.toLowerCase()) == -1);}
        else if(mode==this.INDEXOFREVERSE){return ary.filter((str) => str.toLowerCase().indexOf(value.toLowerCase()) == -1);}
    }
    static addRemoveInArray(value,addvalue,ary,mode=this.COMPARE){
        if(STG.findInArray(value,ary,mode)){ary=STG.removeInArray(value,ary,mode);}else{ary.push(addvalue);}
        return ary;
    }
}
//end STG ----------------------------------------------------
//----------------------------------------------------------------
class STD{ //smallsupo tools - dom ui
    static DISPLAY_NONE=0;static VISIBILITY_HIDDEN=1;
    constructor(){}
    static createEL(htmltag,id,style){
        let e=document.createElement(htmltag);if(id!=null)e.setAttribute("id",id);if(style!=null)e.setAttribute("style",style);
        return e;
    }
    //--------------------------------------------------------------------------------------------------
    static isHiddenEL(element,mode=this.DISPLAY_NONE){
        if(mode==this.DISPLAY_NONE){if(element.style.display==="none")return true;else return false;}
        else if(mode==this.VISIBILITY_HIDDEN){if(element.style.visibility==="hidden")return true;else return false;}
    }
    static hiddenEL(element,mode=this.DISPLAY_NONE){
        if(mode==this.DISPLAY_NONE){element.style.display="none";}
        else if(mode==this.VISIBILITY_HIDDEN){element.style.width="0px";element.style.height="0px";element.style.visibility="hidden";}
    }
    static visibleEL(element,mode=this.DISPLAY_NONE){
        if(mode==this.DISPLAY_NONE){element.style.display="block";}
        else if(mode==this.VISIBILITY_HIDDEN){element.style.width="100%";element.style.height="100%";element.style.visibility="visible";}
    }
    //-------------------------------------------------------------------------------------------------
    static eventStopBubbling(e) {
        e = window.event || e;if (e.stopPropagation) {e.stopPropagation();} else {e.cancelBubble = true;}
    }
    static setMouseEnterLeaveBgColor(el,enterColor="#eee",leaveColor="white"){
        el.addEventListener("mouseenter", () => {el.style.backgroundColor=enterColor;});
        el.addEventListener("mouseleave", () => {el.style.backgroundColor=leaveColor;});
    }
    static setMouseEnterLeaveColor(el,enterColor="#aaa",leaveColor="#eee"){
        el.addEventListener("mouseenter", () => {el.style.color=enterColor;});
        el.addEventListener("mouseleave", () => {el.style.color=leaveColor;});
    }
    //-------------------------------------------------------------------------------------------------
    static arrayToTextarea(ary,ta){if(ta!=null){ta.value = ary.join("\n")+"\n";}}
    static textareaToArray(ta){
        let ary=[];ary=ta.value.split('\n');ary=ary.filter((str) => str !=="");
        return ary;
    }
    static cursor_scrollToBottom(element){
        let l=element.value.length;element.focus();element.setSelectionRange(l, l);
    }
    static adjustELnotOutofScreen(dome,useParent,defaultTranslateX=0,defaultTranslateY=0){
        let body=document.getElementsByTagName('body')[0];
        if(useParent)body=dome.parentElement;
        let bodyRect = body.getBoundingClientRect();
        let domeRect = dome.getBoundingClientRect();
        //out right
        if(domeRect.right>bodyRect.right){
            dome.style.transform=`translate(${defaultTranslateX+parseInt(bodyRect.right-domeRect.right)}px,${defaultTranslateY}px)`;
        }
        //out left、top、bottom...
        //TBD

}
    //-------------------------------------------------------------------------------------------------
    static getDomNode(root,queryArray){
        let node=root;
        if(queryArray.length>0){
            node=root.querySelector(queryArray[0]);
            for(let i=1;i<queryArray.length;i++){if(node!=null){node=node.querySelector(queryArray[i]);}}
        }
        return node;
    }
    static getDomNodes(root,queryArray){
        let nodes=null;
        let endquery=queryArray.pop();
        let node=STD.getDomNode(root,queryArray);
        if(node!=null){nodes=node.querySelectorAll(endquery);}
        return nodes;
    }
    static getDomAttribute(root,queryArray,attribute){
        let value=null;let node=this.getDomNode(root,queryArray);
        if(node!=null){if(node.hasAttribute(attribute))value=node.getAttribute(attribute);}
        return value;
    }
    static getDomInnerText(root,queryArray){
        let value=null;let node=this.getDomNode(root,queryArray);
        if(node!=null){value=node.innerText;}
        return value;
    }
    //-------------------------------------------------------------------------------------------------
    static ABSOLUTE_RIGHT=0;static COVERALL=1;
    static setELPosition(el,mode){
        if(mode==STD.ABSOLUTE_RIGHT){
            el.style.position="absolute";
            el.style.left="100%";
            el.style.transform="translateX(-100%)";
        }
        if(mode==STD.COVERALL){
            el.style.position="absolute";
            //el.width="100%";el.height="100%";
            let parentnode=el.parentElement;let rect = parentnode.getBoundingClientRect();
            el.style.width=parseInt(rect.right-rect.left)+"px";
            el.style.height=parseInt(rect.bottom-rect.top)+"px";
            el.style.textAlign="center";
            el.style.left=parentnode.offsetLeft; el.style.top=parentnode.offsetTop;
        }
    }
        //-------special---------------------------------------------------------------------------------------
    static ISCOVER=true;static UNCOVER=false
    static setCoverEL(becoverdEl,uniqueId,show,zindex=999,inner=SVGICON.CLOSERED,bgcolor="transparent"){ //show cover, hind cover
       if(becoverdEl==null)return;
       let id="smallsupo_coverel_id"+uniqueId;
        let temp=becoverdEl.querySelectorAll('span[id="'+id+'"]');
        if(temp.length>1){
            for(let i=1;i<temp.length;i++)temp[i].remove();
        }else if(temp.length==1){
        }else{
            let cover=STD.createEL("span",id,"zindex:"+zindex+";background-color:"+bgcolor+";");
            //cover.style.backgroundColor="blue";
            cover.innerHTML=SVGICON.getIcon(inner,32,32);
            becoverdEl.appendChild(cover);
            STD.setELPosition(cover,STD.COVERALL);
            STD.hiddenEL(cover);
        }
        let cover=document.getElementById(id);
        if(cover!=null){
            if(show)STD.visibleEL(cover);
            else STD.hiddenEL(cover);
        }
    }
}
//--------------------------------------------------------------
class SVGICON{
    constructor(){}
    static SETTING='<svg id="i-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="WWWWWW" height="HHHHHH" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" /><circle cx="16" cy="16" r="4" /></svg>';
    static CLOSERED='<svg id="i-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="WWWWWW" height="HHHHHH" fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M2 30 L30 2 M30 30 L2 2" /></svg>';
     static getIcon(icontype,width=32,height=32){
	     return icontype.replace("WWWWWW",width).replace("HHHHHH",height);
     }
}
//--下拉選單--------------------------------------------------------------
let currentMenu=null;
function whenPopup(p){
    if(currentMenu!=null){
        STD.hiddenEL(currentMenu);
    }
    currentMenu=p;
}
class SFAC_DropDownMenu{
    //lines[{title:"",func}]
    static IDPRE="smallsupo_dropdown_id";
    static removeUnFIndPopupMenu(containerEL,uniqueId,index){
        let ns=containerEL.querySelectorAll('span[id^="'+SFAC_DropDownMenu.IDPRE+uniqueId+'"]');
        if(ns!=null){
            if(ns.length==1){
                let x=containerEL.querySelector('span[id="'+SFAC_DropDownMenu.IDPRE+uniqueId+index+'"]');
                if(x==null){
                    containerEL.removeChild(ns[0]);
                }
            }else{
                for(let i=0;i<ns.length;i++){
                    containerEL.removeChild(ns[i]);
                }
            }
        }
    }
    static setPopupMenu(containerEL,uniqueId,items,attributes,positionMode,whenPopup,endPopup,useParent,zindex=999){
        if(containerEL==null)return;
        let dropdown_id=SFAC_DropDownMenu.IDPRE+uniqueId;
        let dropdown_button_id="smallsupo_dropdown_button_id"+uniqueId;
        let dropdown_panel_id="smallsupo_dropdown_panel_id"+uniqueId;
        let temp=containerEL.querySelectorAll('span[id="'+dropdown_id+'"]');
        if(temp.length>1){
            for(let i=1;i<temp.length;i++)temp[i].remove();
        }else if(temp.length==1){
        }else{
            let span=STD.createEL("span",dropdown_id,"z-index:"+zindex+";align:left;");
            if(positionMode!=null)STD.setELPosition(span,positionMode);
            let button=STD.createEL("button",dropdown_button_id,'color:#eeeeee;padding:0px 10px 4px 10px;background-color:transparent;border:none;cursor: pointer;');button.innerText="⁝";span.appendChild(button);
            STD.setMouseEnterLeaveColor(button);
            let panel=STD.createEL("div",dropdown_panel_id,"display: none;padding:6px;position: absolute;z-index:99999;background-color: #ffffff;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);transform: translateX(-20px);");
            for(let i=0;i<items.length;i++){
                let item=STD.createEL("div",null,"cursor: pointer;padding:2px;white-space: nowrap;");
                item.innerHTML=items[i].title(attributes);
                STD.setMouseEnterLeaveBgColor(item);
                item.onclick=()=>{
                    let panel=document.getElementById(dropdown_panel_id);panel.style.display="none";
                    items[i].func(attributes);
                    STD.eventStopBubbling(event);
                };
                panel.appendChild(item);
            }
            span.appendChild(panel);
            containerEL.appendChild(span);
            //-------------------------------------------
            button.onclick = ()=> {
                let b=document.getElementById(dropdown_button_id);
                let p=document.getElementById(dropdown_panel_id);
                if(STD.isHiddenEL(p)){
                    whenPopup(p);
                    STD.visibleEL(p);STD.adjustELnotOutofScreen(p,useParent,-22);
                }else{
                    STD.hiddenEL(p);
                }
                STD.eventStopBubbling(event);
            };
        }
    }
}

//----------------------------------------------------------------
//--- 文字選取popup選單 ---------------------------------------------------------
let selecttextpopupshow=false;
class SFAC_SelectTextPopup{
    constructor(){}
    static setPopupEvent(triggerEL,containerEL,lines,uniqueId,whenPopup,endPopup){
        triggerEL.onmouseup = ()=>{
            let selecttext = window.getSelection().toString();document.execCommand('copy');
            if(selecttext!=null&&selecttext.length>0){
                //window.getSelection().empty();
                let x=event.clientX;let y=event.clientY;
                if(!selecttextpopupshow)SFAC_SelectTextPopup.setPopup(containerEL,x,y,uniqueId,selecttext,lines,whenPopup,endPopup);
            }
            STD.eventStopBubbling(event);
        };
    }
    static setPopup(containerEL,x,y,uniqueId,selecttext,lines,whenPopup,endPopup,useParent=false){
        let container=document.getElementsByTagName('body')[0];if(containerEL!=null)container=containerEL;
        let left=0;if(x!=null)left=x;let top=0;if(y!=null)top=y;
        let popup_id="smallsupo_selecttextpopup_id"+uniqueId;
        let temp=container.querySelectorAll('div[id="'+popup_id+'"]');
        if(temp.length>1){
            for(let i=1;i<temp.length;i++)temp[i].remove();
        }else if(temp.length==1){
        }else{
            let popup=STD.createEL("div",popup_id,'left:'+left+'px;top:'+top+'px;padding:6px;border:1px black;'+
                                   'position: fixed;z-index:999999;cursor: pointer;background-color: #ffffff;'+
                                   'box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);white-space: nowrap;'+
                                   'transform: translate(-50px, -30px);');
            for(let i=0;i<lines.length;i++){
                let item=STD.createEL("div",popup_id+"_item"+i,"cursor: pointer;padding:2px;white-space: nowrap;");
                STD.setMouseEnterLeaveBgColor(item);
                popup.appendChild(item);
            }
            container.appendChild(popup);
            popup.onmouseleave= (e) => {popup.style.display="none";};
        }
        //-- do --
        let p=document.getElementById(popup_id);
        //whenPopup(p);
        p.style.left=left+"px";p.style.top=top+"px";
        p.style.display="block";
        p.style.transform="translate(-30px,-20px)";STD.adjustELnotOutofScreen(p,useParent,-32,-20);
        for(let i=0;i<lines.length;i++){
            let item=document.getElementById(popup_id+"_item"+i);
            item.innerHTML=lines[i].title+"<font color=#ff0000>"+selecttext+"</font>";
            item.onclick = function () {
                p.style.display="none";
                lines[i].func(selecttext);
            };
        }

    }
}

// end  -------------------------------------------------
class YoutubeHandler{
    static findNewDayNode(e){
        let nodes=STD.getDomNodes(e,['div[id="content"]','div[id="details"]','div[id="meta"]','ytd-video-meta-block','div[id="metadata"]','div[id="metadata-line"]','span']);
        let node=null;
        if(nodes!=null&&nodes.length>=2)node=nodes[1];
        return node;
    }
    static find_video_channel_id_youtube_homepage(e){
        let id=null;
        let node=STD.getDomNode(e,['div[id="content"]','div[id="details"]','a[id="avatar-link"]']);
        if(node!=null){
            id=node.getAttribute("href");
            if(id!=null){id=id.substring(1,id.length)+"|"+node.getAttribute("title");}
            //console.log(id);
        }
        return id;
    }
    static find_comment_channel_id_youtube_watchpage(e){
    let r=null;let r1=null;
    let as=['div[id="header-author"]','a[id="author-text"]'];
    let as1=['div[id="header-author"]','a[id="author-text"]','span'];
    r=STD.getDomAttribute(e,as,"href");
    r1=STD.getDomInnerText(e,as1);
    //if(r!=null)r=r.replace("/channel/","")+"|"+r.replace("/","");
    if(r!=null){r=r.replace("/channel/","");r=r.replace("/","");}
    return r;
}
    static get_channel_id_in_comment_replay_watchpage(e,queryArray){
    let id=null;
    let node=STD.getDomNode(e,queryArray);
    if(node!=null){
        //id=node.getAttribute("href");id=id.replace("/channel/","")+"|"+id.replace("/","");
        id=node.getAttribute("href");id=id.replace("/channel/","");id=id.replace("/","");
    }
    return id;
}
    static find_video_channel_id_watchpage(e){
    let id=null;
    let node=STD.getDomNode(e,['div[id="upload-info"]','div[id="container"]','yt-formatted-string']);
    if(node!=null){
        id=node.querySelector('a').getAttribute("href");
        if(id!=null)id=id.substring(1,id.length)+"|"+node.innerText;
        //console.log(id);
    }
    return id;
}
    static find_video_channel_id_youtube_searchpage(e){
    let id=null;
    let node=STD.getDomNode(e,['div[id="channel-info"]','ytd-channel-name','yt-formatted-string','a']);
    if(node!=null){
            id=node.getAttribute("href");
        if(id!=null){id=id.substring(1,id.length)+"|"+node.innerText;}
            //console.log(id);
    }
    return id;
}
    static cutid(id){
  let result=id;
  if(id.indexOf("|")!=-1){result=id.substring(0,id.indexOf("|"));}
  return result;
}
    static setUnlink_HomePage(rootn){
        function handleClick(event) {
            return false;
        }
        let n=STD.getDomNode(rootn,['div[id="content"]','div[id="details"]','div[id="meta"]','h3']);
        if(n!=null)n.style.cursor = "text";
        YoutubeHandler.removeALink(rootn,['div[id="content"]','div[id="details"]','div[id="meta"]','h3','a[id="video-title-link"]']);
    }
    static setUnlinkSearchPage(rootn){
    function handleClick(event) {
        event.preventDefault();
       event.stopPropagation();
       return false;
    }
    let n=STD.getDomNode(rootn,['div[id="dismissible"]','div[class="text-wrapper style-scope ytd-video-renderer"]','div[id="meta"]','h3']);
    if(n!=null)n.style.cursor = "default";
    YoutubeHandler.removeALink(n,['a']);
}
    static setUnlinkRightSideWatchPage(rootn,queryArray){
        //let n=STD.getDomNode(rootn,queryArray);
        //if(n!=null)n=STD.getDomNode(n,['h3']);
        if(rootn!=null)rootn.style.cursor = "text";
        YoutubeHandler.removeALink(rootn,queryArray);
    }
    static removeALink(rootn,queryArray){
    function handleClick1(event) {
        //event.preventDefault();
        //event.stopPropagation();
        return false;
    }
    let n1=STD.getDomNode(rootn,queryArray);
    if(n1!=null){
        n1.style.display = "inline-block";
        n1.style.pointerEvents = "none";
        n1.onclick=handleClick1;
    }
}
    static elementSetToDefault(e,newDayNode){
        e.style.display="block";
        e.style.background =null;
        e.style.border = null;
        if(newDayNode!=null){
            newDayNode.style.background =null;
            newDayNode.style.border = null;
        }
}
    static removeHighLightTag(e,uniqueid){
  let id="smallsupo_"+uniqueid
  let c=document.querySelectorAll('span[id^="'+id+'"]');
  for(let i=0;i<c.length;i++){
      if(e.contains(c[i])){
          e.removeChild(c[i]);
      }
  }
}
   static setHighLightTag(e,uniqueid,text,show,bordercolor,borderradius){
   let id="smallsupo_"+uniqueid;
   //console.log(id);
   let n=document.getElementById(id);
   if(n==null){
           let x=STD.createEL("span",id,"position:absolute;right:0px;bottom:0px;padding:4px 4px 0px 4px;color:white;background-color:"+bordercolor+";");
           x.style.transform="translateXY(-96%,-96%)";
           x.style.borderRadius=borderradius+" 0px 2px 0px";x.innerText=text;
           e.appendChild(x);
   }else{
       if(show){n.style.display="block";n.innerText=text;
               }else {n.style.display="none";}
   }
}
   static setHighLightTagforWatchPage(e,uniqueid,text,show,bordercolor,borderradius){
   let id="smallsupo_"+uniqueid;
   //console.log(id);
   let n=document.getElementById(id);
   if(n==null){
           let x=STD.createEL("span",id,"position:relative;left:0px;top:0px;padding:2px 2px 2px 2px;color:white;background-color:"+bordercolor+";");
           //x.style.transform="translateXY(-96%,-96%)";
           x.style.borderRadius="4px 4px 4px 4px";x.innerText=text;
           e.insertBefore(x,e.firstChild);
   }else{
       if(show){n.style.display="block";n.innerText=text;
               }else {n.style.display="none";}
   }
}
    static findIdInArray(text,ary){
    let find=false;
    if(text==null)return false;
    if(text.indexOf("|")!=-1)text=text.substring(0,text.indexOf("|"));
    ary.forEach((word) => {
        if(word.indexOf("|")!=-1)word=word.substring(0,word.indexOf("|"));
        if (text.localeCompare(word) == 0 ){find=true;}
    });
    return find;
}
    static findChannelIdareadyhave(idtitle){
    let find=false;
    for(let i=0;i<tempchannelArray.length;i++){
        let cid=tempchannelArray[i];
        if(cid.title==idtitle){
            find=true;
        }
    }
    return find;
}
    static getChannelId(idtitle){
    let id=null;
    for(let i=0;i<tempchannelArray.length;i++){
        let cid=tempchannelArray[i];
        if(cid.title==idtitle){
            id=cid.id;
        }
    }
    return id;
}
        static moveChannelcontainerToUPLayer(rootn){
        let dn=rootn.querySelector('div#dismissible div[class="metadata style-scope ytd-compact-video-renderer"]');
        if(dn!=null){
        let sn=dn.querySelector('a').querySelector('div');
            if(sn!=null){
                dn.appendChild(sn);
                //dn.querySelector('a').querySelector('div').inner;
            }
        }

    }
    static getChannelIDformURL(rootn,link,videoid,channelcontainer,channeltitle){
    $.ajax({
 		url: link,type: 'get',dataType: "text",
	    success: (data) => {
            let serchstartstring='<link itemprop="url" href="http://www.youtube.com/';
            let startindex=data.indexOf(serchstartstring);
            if(startindex<0)return;
            let r=data.substring(startindex+serchstartstring.length,data.indexOf('"',startindex+serchstartstring.length));

            if(channelcontainer==null)return;
            let id=r;
            //console.log(id);
            let o={title:channeltitle,id:id}
            tempchannelArray.push(o);
             id=id+"|"+channeltitle;
            SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"runchannel_watch",videoid);
            SFAC_DropDownMenu.setPopupMenu(channelcontainer,"runchannel_watch"+videoid,dropdownitems_homepage,[id,videoid],null,whenPopup,null,false);
            //moveChannelcontainerToUPLayer(rootn);
	    },
        complete: (data) => {

        },
        error: (data) => {

        }
	});
    }
    static drawUI(tag,cid,vid,text,e,arr){
       let keeprun=true;
       for(let i=0;i<arr.length;i++){
           if(keeprun){
             if(arr[i]==HIGHLIGHT_VIDEO&&parametersArray[HIGHLIGHT_VIDEO].filter=="true"){
                 if(STG.findInArray(vid,parametersArray[HIGHLIGHT_VIDEO].value,STG.COMPARE)){e.style.background=parametersSingle[HIGHLIGHT_VIDEO_BACKGROUND].value;keeprun=false;}
             }else if(arr[i]==BLOCK_VIDEO&&parametersArray[BLOCK_VIDEO].filter=="true"){
                 if(STG.findInArray(vid,parametersArray[BLOCK_VIDEO].value,STG.COMPARE)){STD.hiddenEL(e);keeprun=false;}
             }else if(arr[i]==HIGHLIGHT_VIDEO_KEYWORD&&parametersArray[HIGHLIGHT_VIDEO_KEYWORD].filter=="true"){
                 if(STG.findInArray(text,parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value,STG.REGX)){
                     let s=STG.findInArrayText(text,parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value,STG.INDEXOF);
                     e.style.border = parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].valuep+parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].value;
                     e.style.borderRadius =parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_ARC].value+parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_ARC].valuer;
                     YoutubeHandler.setHighLightTag(e,tag+vid,s,true,parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].value,e.style.borderRadius);
                     keeprun=true;
                 }
             }else if(arr[i]==HIGHLIGHT_CHANNEL&&parametersArray[HIGHLIGHT_CHANNEL].filter=="true"){
                 if(YoutubeHandler.findIdInArray(cid,parametersArray[HIGHLIGHT_CHANNEL].value)){e.style.background=parametersSingle[HIGHLIGHT_CHANNEL_BACKGROUND].value;keeprun=false;}
             }else if(arr[i]==BLOCK_CHANNEL&&parametersArray[BLOCK_CHANNEL].filter=="true"){
                 if(YoutubeHandler.findIdInArray(cid,parametersArray[BLOCK_CHANNEL].value)){STD.hiddenEL(e);keeprun=false;}
             }else if(arr[i]==BLOCK_VIDEO_KEYWORD&&parametersArray[BLOCK_VIDEO_KEYWORD].filter=="true"){
                 if(STG.findInArray(text,parametersArray[BLOCK_VIDEO_KEYWORD].value,STG.INDEXOF)){STD.hiddenEL(e);keeprun=false;}
             }
             else if(arr[i]==HIGHLIGHT_COMMENT_USER&&parametersArray[HIGHLIGHT_COMMENT_USER].filter=="true"){
                 if(STG.findInArray(cid,parametersArray[HIGHLIGHT_COMMENT_USER].value,STG.COMPARE)){e.style.background=parametersSingle[HIGHLIGHT_COMMENT_USER_BACKGROUND].value;keeprun=false;}
             }else if(arr[i]==BLOCK_COMMENT_USER&&parametersArray[BLOCK_COMMENT_USER].filter=="true"){
                 if(YoutubeHandler.findIdInArray(cid,parametersArray[BLOCK_COMMENT_USER].value)){STD.hiddenEL(e);keeprun=false;}
             }else if(arr[i]==BLOCK_COMMENT_KEYWORD&&parametersArray[BLOCK_COMMENT_KEYWORD].filter=="true"){
                 //if(STG.findInArray(text,parametersArray[BLOCK_COMMENT_KEYWORD].value,STG.INDEXOF)){STD.hiddenEL(e);}
                 if(STG.findInArray(text,parametersArray[BLOCK_COMMENT_KEYWORD].value,STG.REGX)){STD.hiddenEL(e);}
             }
           }
       }
        return keeprun;
    }
}
//----------------------------------------------------------------
function removeClickEvent(){
window.addEventListener('click', event => {
    //console.log(event.target);
  if (event.target.tagName=="H3") {
    event.stopPropagation();
      //event.preventDefault();
  }
}, true);
}
//---------------------------------------------------------------
let CHANNELID=0,VIDEOID=1;
let dropdownitems_homepage_title=['block channel','block video','highlight channel','highlight video'];
let dropdownitems_homepage=[
    {title:(attributes)=>{return `${dropdownitems_homepage_title[0]} <font color=#ff0000>${attributes[CHANNELID].split("|")[1]}</font>`},
     func:(attributes)=>{sp.load_parameters_fromStorage();let value=attributes[CHANNELID];if(value.indexOf("|")!=-1)value=value.substring(0,value.indexOf("|"));
                         parametersArray[BLOCK_CHANNEL].value=STG.addRemoveInArray(value,attributes[CHANNELID],parametersArray[BLOCK_CHANNEL].value,STG.INDEXOFREVERSE);

                         sp.save_parameters_toStorage();filter("from dropdownmenu_homepage");}},
    {title:(attributes)=>{return dropdownitems_homepage_title[1]},
     func:(attributes)=>{sp.load_parameters_fromStorage();parametersArray[BLOCK_VIDEO].value=STG.addRemoveInArray(attributes[VIDEOID],attributes[VIDEOID],parametersArray[BLOCK_VIDEO].value);sp.save_parameters_toStorage();filter("from dropdownmenu_homepage");}},
    {title:(attributes)=>{return dropdownitems_homepage_title[2]},
     func:(attributes)=>{sp.load_parameters_fromStorage();let value=attributes[CHANNELID];if(value.indexOf("|")!=-1)value=value.substring(0,value.indexOf("|"));
                         parametersArray[HIGHLIGHT_CHANNEL].value=STG.addRemoveInArray(value,attributes[CHANNELID],parametersArray[HIGHLIGHT_CHANNEL].value,STG.INDEXOFREVERSE);

                         sp.save_parameters_toStorage();filter("from dropdownmenu_homepage");}},
    {title:(attributes)=>{return dropdownitems_homepage_title[3]},
     func:(attributes)=>{sp.load_parameters_fromStorage();parametersArray[HIGHLIGHT_VIDEO].value=STG.addRemoveInArray(attributes[VIDEOID],attributes[VIDEOID],parametersArray[HIGHLIGHT_VIDEO].value);sp.save_parameters_toStorage();filter("from dropdownmenu_homepage");}}
];
let selecttext_popupitems_homepage_title=['block','highlight'];
let selecttext_popupitems_homepage=[
    {title:selecttext_popupitems_homepage_title[0]+" ",func:(selecttext)=>{sp.load_parameters_fromStorage();parametersArray[BLOCK_VIDEO_KEYWORD].value.push(selecttext.trim());sp.save_parameters_toStorage();filter("from selecttext_popupitems_homepage");}},
    {title:selecttext_popupitems_homepage_title[1]+" ",func:(selecttext)=>{sp.load_parameters_fromStorage();parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value=STG.addRemoveInArray(selecttext.trim(),selecttext.trim(),parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value);sp.save_parameters_toStorage();filter("from selecttext_popupitems_homepage");}}]

function filter_homepage_newVersion(){
    let videoPanels=document.querySelectorAll('ytd-rich-item-renderer[class="style-scope ytd-rich-grid-renderer"]');
    for(let i=0;i<videoPanels.length;i++){
        let newDayNode=YoutubeHandler.findNewDayNode(videoPanels[i]);
        YoutubeHandler.elementSetToDefault(videoPanels[i],newDayNode);

        if(videoPanels[i].querySelector('ytd-ad-slot-renderer')!=null){
        STD.hiddenEL(videoPanels[i]);
        }else{


        let id=YoutubeHandler.find_video_channel_id_youtube_homepage(videoPanels[i]);
        let text=null;
        YoutubeHandler.setUnlink_HomePage(videoPanels[i]);
        let videoid=STD.getDomAttribute(videoPanels[i],['div#content div#details div#meta a#video-title-link'],"href");
        if(videoid!=null){
            videoid=videoid.replace("/watch?v=","");
            if(videoid.indexOf("&")!=-1)videoid=videoid.substring(0,videoid.indexOf("&"));
        }
        let channelcontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta ytd-video-meta-block div#metadata div#byline-container']);
        let titlecontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta h3 yt-formatted-string#video-title']);
        if(titlecontainer!=null){text=titlecontainer.innerText;}
        //-------------------
        let keeprun=false;
        if(id!=null&&videoid!=null&&channelcontainer!=null&&titlecontainer!=null&&text!=null){
            keeprun=true;
            SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"",videoid);
            SFAC_DropDownMenu.setPopupMenu(channelcontainer,videoid,dropdownitems_homepage,[id,videoid],STD.ABSOLUTE_RIGHT,whenPopup,null,false);
            let textcontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta']);
            SFAC_SelectTextPopup.setPopupEvent(textcontainer,null,selecttext_popupitems_homepage,"homepage",whenPopup,null);
            if(newDayNode!=null&&((""+parametersSingle[HIGHTLIGHT_POSTTIME_TRUE].value).localeCompare("true")==0)){
                  let arr = STG.stringToRegArray(parametersSingle[HIGHTLIGHT_POSTTIME_REGX].value,",");
                  if(STG.findInArray(newDayNode.innerText,arr,STG.REGX)){
                       newDayNode.style.background=parametersSingle[HIGHTLIGHT_POSTTIME_BAKGROUND].value;
                  }
            }
            if(keeprun){YoutubeHandler.removeHighLightTag(videoPanels[i],"homehightag_");}
            if(keeprun){
                YoutubeHandler.drawUI("homehightag_",id,videoid,text,videoPanels[i],[HIGHLIGHT_VIDEO,BLOCK_VIDEO,HIGHLIGHT_VIDEO_KEYWORD,HIGHLIGHT_CHANNEL,BLOCK_CHANNEL,BLOCK_VIDEO_KEYWORD]);
            }
        }
        }
    }
}
function filter_homepage(){
    let videoPanels=document.querySelectorAll('ytd-rich-item-renderer[class="style-scope ytd-rich-grid-row"]');
    for(let i=0;i<videoPanels.length;i++){
        let newDayNode=YoutubeHandler.findNewDayNode(videoPanels[i]);
        YoutubeHandler.elementSetToDefault(videoPanels[i],newDayNode);
        let id=YoutubeHandler.find_video_channel_id_youtube_homepage(videoPanels[i]);
        let text=null;
        YoutubeHandler.setUnlink_HomePage(videoPanels[i]);
        let videoid=STD.getDomAttribute(videoPanels[i],['div#content div#details div#meta a#video-title-link'],"href");
        if(videoid!=null){
            videoid=videoid.replace("/watch?v=","");
            if(videoid.indexOf("&")!=-1)videoid=videoid.substring(0,videoid.indexOf("&"));
        }
        let channelcontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta ytd-video-meta-block div#metadata div#byline-container']);
        let titlecontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta h3 yt-formatted-string#video-title']);
        if(titlecontainer!=null){text=titlecontainer.innerText;}
        //-------------------
        let keeprun=false;
        if(id!=null&&videoid!=null&&channelcontainer!=null&&titlecontainer!=null&&text!=null){
            keeprun=true;
            SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"",videoid);
            SFAC_DropDownMenu.setPopupMenu(channelcontainer,videoid,dropdownitems_homepage,[id,videoid],STD.ABSOLUTE_RIGHT,whenPopup,null,false);
            let textcontainer=STD.getDomNode(videoPanels[i],['div#content div#details div#meta']);
            SFAC_SelectTextPopup.setPopupEvent(textcontainer,null,selecttext_popupitems_homepage,"homepage",whenPopup,null);
            if(newDayNode!=null&&((""+parametersSingle[HIGHTLIGHT_POSTTIME_TRUE].value).localeCompare("true")==0)){
                  let arr = STG.stringToRegArray(parametersSingle[HIGHTLIGHT_POSTTIME_REGX].value,",");
                  if(STG.findInArray(newDayNode.innerText,arr,STG.REGX)){
                       newDayNode.style.background=parametersSingle[HIGHTLIGHT_POSTTIME_BAKGROUND].value;
                  }
            }
            if(keeprun){YoutubeHandler.removeHighLightTag(videoPanels[i],"homehightag_");}
            if(keeprun){
                YoutubeHandler.drawUI("homehightag_",id,videoid,text,videoPanels[i],[HIGHLIGHT_VIDEO,BLOCK_VIDEO,HIGHLIGHT_VIDEO_KEYWORD,HIGHLIGHT_CHANNEL,BLOCK_CHANNEL,BLOCK_VIDEO_KEYWORD]);
            }
        }
    }
}
let rowcount=0;
function getItemRowCount(content){
    if(rowcount==0)rowcount=content.parentElement.children.length;
    return rowcount;
}
function filter_homepage_reorder(){
    let videoPanels=document.querySelectorAll('ytd-rich-item-renderer[class="style-scope ytd-rich-grid-row"]');
    if(videoPanels.length==0)return;
    let content=videoPanels[0].parentElement.parentElement.parentElement;
    if(content==null)return;
    //let itemperrow=parseInt(videoPanels[0].getAttribute("items-per-row"));
    let itemperrow=getItemRowCount(videoPanels[0]);//console.log(itemperrow);

    let rows=content.querySelectorAll('ytd-rich-grid-row[class="style-scope ytd-rich-grid-renderer"]');
    //console.log(videoPanels.length, rows.length,videoPanels.length/3);
    //remove all video
    for(let i=0;i<rows.length;i++){
        let container=rows[i].querySelector('div[id="contents"]');
            let c=container.querySelectorAll('ytd-rich-item-renderer[class="style-scope ytd-rich-grid-row"]');
           // console.log(c.length);
            for(let k=0;k<c.length;k++){
                container.removeChild(c[k]);
            }
    }
    //add all video
    let index=0;let counter=0;
    for(let i=0;i<videoPanels.length;i++){
        if(index<rows.length){
        let container=rows[index].querySelector('div[id="contents"]');
        if(videoPanels[i].querySelector('ytd-ad-slot-renderer')!=null){
            //console.log("find ad "+index+" "+i);
        }else{
            container.appendChild(videoPanels[i]);
            if(videoPanels[i].style.display=='none'){}else{counter++;}
        }
        if(counter==itemperrow){index++;counter=0;}
        }
    }
}
//---------------------------------------------------------------
let dropdownitemscomment_watchpage_title=['block user','highlight user'];
let dropdownitemscomment_watchpage=[
    {title:(attributes)=>{return `${dropdownitemscomment_watchpage_title[0]} <font color=#ff0000>${attributes[CHANNELID]}</font>`},
     func:(attributes)=>{sp.load_parameters_fromStorage();let value=attributes[CHANNELID];if(value.indexOf("|")!=-1)value=value.substring(0,value.indexOf("|"));
                         parametersArray[BLOCK_COMMENT_USER].value=STG.addRemoveInArray(value,attributes[CHANNELID],parametersArray[BLOCK_COMMENT_USER].value,STG.INDEXOFREVERSE);sp.save_parameters_toStorage();filter("from dropdownitemscomment_watchpage");}},
    {title:(attributes)=>{return dropdownitemscomment_watchpage_title[1]},
     func:(attributes)=>{sp.load_parameters_fromStorage();let value=attributes[CHANNELID];if(value.indexOf("|")!=-1)value=value.substring(0,value.indexOf("|"));
                         parametersArray[HIGHLIGHT_COMMENT_USER].value=STG.addRemoveInArray(value,attributes[CHANNELID],parametersArray[HIGHLIGHT_COMMENT_USER].value,STG.INDEXOFREVERSE);sp.save_parameters_toStorage();filter("from dropdownitemscomment_watchpage");}}
];
let selecttext_popupitems_comment_watchpage_title=['block'];
let selecttext_popupitems_comment_watchpage=[{title:selecttext_popupitems_comment_watchpage_title[0]+" ",
     func:(selecttext)=>{sp.load_parameters_fromStorage();parametersArray[BLOCK_COMMENT_KEYWORD].value.push(selecttext.trim());sp.save_parameters_toStorage();filter("from selecttext_popupitems_comment_watchpage");}}]
function filter_watchpage(){
    let commentPanels=document.querySelectorAll('ytd-comment-thread-renderer[class="style-scope ytd-item-section-renderer"]');
    let index=0;
    for(let i=0;i<commentPanels.length;i++){
        YoutubeHandler.elementSetToDefault(commentPanels[i]);
        let id=YoutubeHandler.find_comment_channel_id_youtube_watchpage(commentPanels[i]);
        let text=STD.getDomInnerText(commentPanels[i],['div[id="content"]','yt-attributed-string[id="content-text"]']);
        let channelcontainer=STD.getDomNode(commentPanels[i],['div[id="header-author"]']);
        let commentcontainer=STD.getDomNode(commentPanels[i],['div[id="content"]']);
        let keeprun=false;
        if(id!=null&&text!=null&&channelcontainer!=null&&commentcontainer!=null){
            let cc=STD.getDomNode(commentPanels[i],['div[id="header-author"]']);
            SFAC_DropDownMenu.removeUnFIndPopupMenu(cc,"comment",YoutubeHandler.cutid(id)+index);
            SFAC_DropDownMenu.setPopupMenu(cc,"comment"+YoutubeHandler.cutid(id)+index,dropdownitemscomment_watchpage,[id],null,whenPopup,null,false);
            //setDropdownMenuComment(cc,id,index,commentPanels[i]);
            index+=1;
            SFAC_SelectTextPopup.setPopupEvent(commentcontainer,null,selecttext_popupitems_comment_watchpage,"watchpage",whenPopup,null);
            keeprun=true;
            keeprun=YoutubeHandler.drawUI("",id,null,text,commentPanels[i],[HIGHLIGHT_COMMENT_USER,BLOCK_COMMENT_USER,BLOCK_COMMENT_KEYWORD]);
            if(keeprun){
                index=filter_comment_replay_watchpage(commentPanels[i],index,false);
            }
        }
    }
    if((""+parametersSingle[HIDE_COMMENT].value).localeCompare("true")==0){
        hidden_comment_watchpage();
    }else{
        let hiddennode=document.getElementById("smallsupo_hiddennode");
        if(hiddennode!=null)hiddennode.remove();
        let comment=document.getElementById("sections");if(comment!=null)comment.style.display="block";
    }
    //right side video
    filter_rightside_video_watchpage();
    //video self
    filter_videoself_watchpage();
}
function hidden_comment_watchpage(){
    let p=document.querySelector('ytd-comments[id="comments"]');
    if(p==null)return;
    let hiddennode=document.getElementById("smallsupo_hiddennode");
    if(hiddennode==null){
        let hiddennode=STD.createEL("div","smallsupo_hiddennode",'cursor: pointer;');
        let index=getCurrentLanguageIndex(language);
        hiddennode.innerText=languages[index].show+"/"+languages[index].hide+" "+languages[index].comment;
        p.insertBefore(hiddennode, p.children[1]);
        let comment=document.getElementById("sections");comment.style.display="none";
    }else{
        hiddennode.onclick=(evnt)=>{
            let commentnode=document.getElementById("sections");
            //console.log("hi"+comment);
            if(commentnode!=null){
                if(commentnode.style.display=="none"){commentnode.style.display="block";}else{
                    commentnode.style.display="none";
                }
            }
        };
    }
}
function filter_comment_replay_watchpage(comment,index){
    let replies=comment.querySelector('div[id="replies"]').querySelectorAll('ytd-comment-view-model');
    //console.log(replies.length);
    for(let i=0;i<replies.length;i++){
        YoutubeHandler.elementSetToDefault(replies[i]);
        let id=YoutubeHandler.get_channel_id_in_comment_replay_watchpage(replies[i],['div[id="header-author"]','a[id="author-text"]']);
        let text=STD.getDomInnerText(replies[i],['div[id="content"]','yt-attributed-string[id="content-text"]']);
        //console.log(text);
        let channelcontainer=STD.getDomNode(replies[i],['div[id="header-author"]']);//,'a[id="author-text"]','yt-formatted-string']);
        let commentcontainer=STD.getDomNode(replies[i],['div[id="content"]','yt-attributed-string[id="content-text"]']);
        if(id!=null&&channelcontainer!=null){
            //console.log(id," ",cutid(id));
            SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"comment",YoutubeHandler.cutid(id)+index);
            SFAC_DropDownMenu.setPopupMenu(channelcontainer,"comment"+YoutubeHandler.cutid(id)+index,dropdownitemscomment_watchpage,[id],null,whenPopup,null,false);
            index+=1;
        }
        if(commentcontainer!=null){
            SFAC_SelectTextPopup.setPopupEvent(commentcontainer,null,selecttext_popupitems_comment_watchpage,"watchpage",whenPopup,null);
        }
        let keeprun=true;
        YoutubeHandler.drawUI("",id,null,text,replies[i],[HIGHLIGHT_COMMENT_USER,BLOCK_COMMENT_USER,BLOCK_COMMENT_KEYWORD]);
    }
    return index;
}
function filter_rightside_video_watchpage(){
let videoP=document.querySelectorAll('ytd-compact-video-renderer');
    for(let i=0;i<videoP.length;i++){
        YoutubeHandler.elementSetToDefault(videoP[i]);
        let tc=STD.getDomNode(videoP[i],['div[class="details style-scope ytd-compact-video-renderer"]','h3','span[id="video-title"]']);
        let text=null;
        let id=null;
        let videoid=videoP[i].querySelector('#thumbnail').getAttribute("href");
        videoid=videoid.replace("/watch?v=","");if(videoid.indexOf("&")!=-1){videoid.substring(0,videoid.indexOf("&"));}
        let videourl="https://www.youtube.com/watch?v="+videoid;
         let channelcontainer=videoP[i].querySelector('div#dismissible div#metadata div#byline-container');
        let channeltitle=channelcontainer.querySelector('div#container yt-formatted-string').getAttribute("title");
        //if(i==0){
            if(YoutubeHandler.findChannelIdareadyhave(channeltitle)){
                id=YoutubeHandler.getChannelId(channeltitle);
                //console.log(channeltitle,"aready has",id);
                id=id+"|"+channeltitle;
                SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"runchannel_watch",videoid);
                SFAC_DropDownMenu.setPopupMenu(channelcontainer,"runchannel_watch"+videoid,dropdownitems_homepage,[id,videoid],STD.ABSOLUTE_RIGHT,whenPopup,null,false);

               YoutubeHandler.moveChannelcontainerToUPLayer(videoP[i]);
               }else{
                YoutubeHandler.getChannelIDformURL(videoid[i],videourl,videoid,channelcontainer,channeltitle);
            }
        //}
        let keeprun=false;
        if(tc!=null){
            text=tc.innerText;
            YoutubeHandler.setUnlinkRightSideWatchPage(videoP[i],['div[class="details style-scope ytd-compact-video-renderer"]','a']);
            SFAC_SelectTextPopup.setPopupEvent(STD.getDomNode(videoP[i],['div[class="details style-scope ytd-compact-video-renderer"]'])
                                               ,null,selecttext_popupitems_homepage,"runchannel_watch",whenPopup,null);
            keeprun=true;
        }
        if(keeprun){YoutubeHandler.removeHighLightTag(videoP[i],"videohightag_");}
        if(keeprun){
        YoutubeHandler.drawUI("videohightag_",id,videoid,text,videoP[i],[HIGHLIGHT_VIDEO,BLOCK_VIDEO,HIGHLIGHT_VIDEO_KEYWORD,HIGHLIGHT_CHANNEL,BLOCK_CHANNEL,BLOCK_VIDEO_KEYWORD]);
        }
    }
}

function filter_videoself_watchpage(){
let r=document.querySelector('div[id="columns"]');
    if (r==null)return;
    let id=null;
    let videoid=STD.getDomAttribute(r,['div[id="primary"]','div[id="below"]','ytd-watch-metadata'],"video-id");
    let videocontainer=STD.getDomNode(r,['div[id="primary"]','div[id="below"]','ytd-watch-metadata','div[id="above-the-fold"]','div[id="title"]']);
    let titlecontainer=STD.getDomNode(videocontainer,['h1']);
    let channelcontainer=STD.getDomNode(r,['div[id="primary"]','div[id="below"]','div[id="above-the-fold"]','div[id="top-row"]','ytd-video-owner-renderer']);
    let coveredEL=null;if(channelcontainer!=null)coveredEL=STD.getDomNode(channelcontainer,['div[id="upload-info"]']);
    let text=null;
    if(channelcontainer!=null&&coveredEL!=null&&videoid!=null&&channelcontainer!=null){
        channelcontainer.style.background=null;
        STD.setCoverEL(coveredEL,"channel",STD.UNCOVER);
        STD.setCoverEL(videocontainer,"video",STD.UNCOVER);
        id=YoutubeHandler.find_video_channel_id_watchpage(channelcontainer);
    }
    if(titlecontainer!=null){YoutubeHandler.removeHighLightTag(titlecontainer,"watchhightag_");}
    let keeprun=false;
    if(id!=null&&channelcontainer!=null){
        SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"runchannelw",id);
        SFAC_DropDownMenu.setPopupMenu(channelcontainer,"runchannelw"+id,dropdownitems_homepage,[id,videoid],null,whenPopup,null,false);
        //setDropdownMenuVideoWatchPage(channelcontainer,id,"watchpage",channelcontainer);
        if(videocontainer!=null){
            SFAC_SelectTextPopup.setPopupEvent(videocontainer,null,selecttext_popupitems_homepage,"runchannelw",whenPopup,null);
            //text=STD.getDomInnerText(videocontainer,['div[id="title"]','yt-formatted-string']);
            text=videocontainer.innerText;
        }
        keeprun=true;
    }
    
    if(keeprun){
        if(YoutubeHandler.findIdInArray(id,parametersArray[HIGHLIGHT_CHANNEL].value)&&parametersArray[HIGHLIGHT_CHANNEL].filter=="true"){
            channelcontainer.style.background=parametersSingle[HIGHLIGHT_CHANNEL_BACKGROUND].value;
            //keeprun=false;
        }
    }
    if(keeprun){
        if(YoutubeHandler.findIdInArray(id,parametersArray[BLOCK_CHANNEL].value)&&parametersArray[BLOCK_CHANNEL].filter=="true"){
            STD.setCoverEL(coveredEL,"channel",STD.ISCOVER);
            //keeprun=false;
        }
    }
    if(keeprun){
        videocontainer.style.background=null;
        if(STG.findInArray(videoid,parametersArray[HIGHLIGHT_VIDEO].value,STG.INDEXOF)&&parametersArray[HIGHLIGHT_VIDEO].filter=="true"){
            videocontainer.style.background=parametersSingle[HIGHLIGHT_VIDEO_BACKGROUND].value;
            //keeprun=false;
        }
    }
    if(keeprun){
        if(STG.findInArray(videoid,parametersArray[BLOCK_VIDEO].value,STG.INDEXOF)&&parametersArray[BLOCK_VIDEO].filter=="true"){
            STD.setCoverEL(videocontainer,"video",STD.ISCOVER);
            //keeprun=false;
        }
    }
    if(keeprun){
        if(parametersArray[HIGHLIGHT_VIDEO_KEYWORD].filter=="true"){
                 if(STG.findInArray(text,parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value,STG.REGX)){
                     let s=STG.findInArrayText(text,parametersArray[HIGHLIGHT_VIDEO_KEYWORD].value,STG.INDEXOF);
                     //videocontainer.style.border = parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].valuep+parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].value;
                     videocontainer.style.borderRadius =parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_ARC].value+parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_ARC].valuer;
                     if(titlecontainer!=null){
                         YoutubeHandler.setHighLightTagforWatchPage(titlecontainer,"watchhightag_"+videoid,s,true,parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].value,videocontainer.style.borderRadius);
                     }
                 }
        }
    }
}
//---------------------------------------------------------
function filter_searchpage(){
    let videoPanels=document.querySelectorAll('ytd-video-renderer');
    for(let i=0;i<videoPanels.length;i++){
        //let newDayNode=findNewDayNode(videoPanels[i]);
        YoutubeHandler.elementSetToDefault(videoPanels[i],null);
        let id=YoutubeHandler.find_video_channel_id_youtube_searchpage(videoPanels[i]);
        let text=null;

        YoutubeHandler.setUnlinkSearchPage(videoPanels[i]);

        let videoid=STD.getDomAttribute(videoPanels[i],['div[id="dismissible"]','ytd-thumbnail','a'],"href");
        if(videoid!=null){
            videoid=videoid.replace("/watch?v=","");
            if(videoid.indexOf("&")!=-1)videoid=videoid.substring(0,videoid.indexOf("&"));
            //console.log(videoid);
        }

        let channelcontainer=STD.getDomNode(videoPanels[i],['div[id="channel-info"]']);
        //console.log(id,videoid);)
        let titlecontainer=STD.getDomNode(videoPanels[i],['div[id="dismissible"]','div[class="text-wrapper style-scope ytd-video-renderer"]','div[id="meta"]','h3']);
        if(titlecontainer!=null){text=titlecontainer.innerText;}
        let keeprun=false;

        if(id!=null&&videoid!=null&&channelcontainer!=null&&titlecontainer!=null&&text!=null){
          keeprun=true;
          SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"research",videoid);
          SFAC_DropDownMenu.setPopupMenu(channelcontainer,"research"+videoid,dropdownitems_homepage,[id,videoid],STD.ABSOLUTE_RIGHT,whenPopup,null,false);
          // let textcontainer=STD.getDomNode(videoPanels[i],['div[id="content"]','div[id="details"]','div[id="meta"]']);

          SFAC_SelectTextPopup.setPopupEvent(titlecontainer,null,selecttext_popupitems_homepage,"researchpage",whenPopup,null);
        }
         if(keeprun){ YoutubeHandler.removeHighLightTag(videoPanels[i],"searchhightag_");}
         if(keeprun){
             YoutubeHandler.drawUI("searchhightag_",id,videoid,text,videoPanels[i],[HIGHLIGHT_VIDEO,BLOCK_VIDEO,HIGHLIGHT_VIDEO_KEYWORD,HIGHLIGHT_CHANNEL,BLOCK_CHANNEL,BLOCK_VIDEO_KEYWORD]);
         }
      }
}
//---------------------------------------------------------
function filter_shortpage(){
    let noshortad=true;
    let root=document.querySelector('div[id="shorts-inner-container"]');
    let comments=root.querySelectorAll('ytd-reel-video-renderer[class="reel-video-in-sequence style-scope ytd-shorts"]');
    let index=0;
    let currentindex=-1;
    for(let i=0;i<comments.length;i++){
        //YoutubeHandler.elementSetToDefault(comments[i]);
        let videolink=STD.getDomAttribute(comments[i],['a[class="ytp-title-link yt-uix-sessionlink"]'],"href");
        //console.log("link "+i+":"+videolink);
        if(videolink!=null&&videolink.localeCompare(window.location.href)==0){
            currentindex=i;
        }
        if(noshortad){
            let ad=null;
            ad=comments[i].querySelector('ytd-ad-slot-renderer');
            if(ad!=null){
                root.removeChild(comments[i]);
                continue;
            }
        }

    }
    //console.log("match:"+currentindex);
    if(currentindex==-1)return;
    //----
    let commentPanels=comments[currentindex].querySelectorAll('ytd-comment-thread-renderer[class="style-scope ytd-item-section-renderer"]');
    //console.log(commentPanels.length);
    for(let i=0;i<commentPanels.length;i++){
         YoutubeHandler.elementSetToDefault(commentPanels[i]);
        let usercontainer=STD.getDomNode(commentPanels[i],['#header-author']);
        let userid=STD.getDomAttribute(usercontainer,['h3','a'],"href");
        if(userid!=null){userid=userid.replace("/","");}
        let commentcontainer=commentPanels[i].querySelector("#content");
        let comment=STD.getDomInnerText(commentcontainer,["#content-text > span"]);
        let keeprun=false;
        if(userid!=null&&comment!=null&&usercontainer!=null&&commentcontainer!=null){
            SFAC_DropDownMenu.removeUnFIndPopupMenu(usercontainer,"short",YoutubeHandler.cutid(userid)+i);
            SFAC_DropDownMenu.setPopupMenu(usercontainer,"short"+YoutubeHandler.cutid(userid)+i,dropdownitemscomment_watchpage,[userid],null,whenPopup,null,true);
            SFAC_SelectTextPopup.setPopupEvent(commentcontainer,null,selecttext_popupitems_comment_watchpage,"short",whenPopup,null);
            keeprun=true;
         }
        if(keeprun){
            keeprun=YoutubeHandler.drawUI("",userid,null,comment,commentPanels[i],[HIGHLIGHT_COMMENT_USER,BLOCK_COMMENT_USER,BLOCK_COMMENT_KEYWORD]);
        }
        if(keeprun){
           filter_short_reply(commentPanels[i],i);
        }

    }// end for(let i=0;i<commentPanels.length;i++)

}//end filter_shortpage
function filter_short_reply(comment,index){
    let replies=comment.querySelector('div[id="replies"]').querySelectorAll('ytd-comment-view-model');
        for(let i=0;i<replies.length;i++){
        YoutubeHandler.elementSetToDefault(replies[i]);
        let id=STD.getDomAttribute(replies[i],['div[id="header-author"]','a[id="author-text"]'],"href");
         id=id+"|"+id.replace("/","");
        let text=STD.getDomInnerText(replies[i],['div[id="content"]','yt-attributed-string[id="content-text"]']);
        //console.log(text);
        let channelcontainer=STD.getDomNode(replies[i],['div[id="header-author"]']);//,'a[id="author-text"]','yt-formatted-string']);
        let commentcontainer=STD.getDomNode(replies[i],['div[id="content"]','yt-attributed-string[id="content-text"]']);
        if(id!=null&&channelcontainer!=null){
            //console.log(id," ",cutid(id));
            SFAC_DropDownMenu.removeUnFIndPopupMenu(channelcontainer,"shortreply",YoutubeHandler.cutid(id)+index+i);
            SFAC_DropDownMenu.setPopupMenu(channelcontainer,"shortreply"+YoutubeHandler.cutid(id)+index+i,dropdownitemscomment_watchpage,[id],null,whenPopup,null,true);
            //setDropdownMenuComment(commentcontainer,id,index,replies[i]);
            index+=1;
        }
        if(commentcontainer!=null){
            SFAC_SelectTextPopup.setPopupEvent(commentcontainer,null,selecttext_popupitems_comment_watchpage,"shortreply",whenPopup,null);
        }
        let keeprun=true;
        if(keeprun){
            YoutubeHandler.drawUI("",id,null,text,replies[i],[HIGHLIGHT_COMMENT_USER,BLOCK_COMMENT_USER,BLOCK_COMMENT_KEYWORD]);
        }
    }
}//end filter_short_reply(commetPanels,index)
//------------------------------------------------------------------------------------------------------------------
let is_observer=false;let page_observer=null;
function stop_page_observer(){
    is_observer=false;
    //if(debug)console.log("stop_page_observer");
    if(page_observer!=null){page_observer.disconnect();page_observer=null;}
}
let isfiltering=false;
function detectYoutubeVersion(){
  let newV=false;
  let videoPanels=document.querySelectorAll('ytd-rich-item-renderer[class="style-scope ytd-rich-grid-row"]');
  if(videoPanels.length==0)newV=true;
  return newV;
}
function filter(from){
    //do something here
    console.log("filter-run..."+from);
    stop_page_observer();
    let url=window.location.href;
    if(url.localeCompare("https://www.youtube.com/")==0){
        rowcount=0;
        if(detectYoutubeVersion()==true){
            filter_homepage_newVersion();
        }else{
            filter_homepage();
            filter_homepage_reorder();
        }
        removeClickEvent();
        start_page_observer(document.querySelector('ytd-rich-grid-renderer'));
    }else if(/youtube.com\/watch/.test(url)){
        filter_watchpage();
        start_page_observer(document.querySelector('div[id="columns"]'));
    }else if(/youtube.com\/results/.test(url)){
        filter_searchpage();
        removeClickEvent();
        start_page_observer(document.querySelector('div[id="columns"]'));
    }else if(/youtube.com\/shorts/.test(url)){
        filter_shortpage();
        start_page_observer(document.querySelector('div[id="shorts-inner-container"]'));
    }
    isfiltering=false;
}
let pre=0;let filtertimer;
function filterDelay(milis){
    let now= new Date();
    if(now-pre>milis){
           clearTimeout(filtertimer);
           filtertimer=setTimeout(()=>{
               if(isfiltering!=true){isfiltering=true;filter("filterDelay:"+milis/1000);}pre=now;}, 500);
        }
}
function start_page_observer(dome){
    is_observer=true;
    if(dome==null){dome=document.getElementsByTagName('body')[0];}
    //if(debug)console.log("start_page_observer");
    if(page_observer==null){
        page_observer = new MutationObserver(mutationRecords => {filterDelay(3000);});
        page_observer.observe(dome, {
            attributes:false,childList: true,characterData:false,attributeOldValue:false,
            subtree: true,characterDataOldValue: false});
    }
}
//----------------------------------------------------------------
let currentUrl = location.href;
let page_interval=null;
function start_page_interval(milis){
    //console.log("start_page_interval");
    page_interval=setInterval(()=>{
        if (location.href !== currentUrl) {
            stop_page_interval();
            setTimeout(function() {
                sp.load_parameters_fromStorage();
                currentUrl = location.href;
                filter("from interval");
                start_page_interval();
            }, milis);
        }
    }, 3000);
}
function stop_page_interval(){
    //console.log("stop_page_interval");
    if(page_interval!=null){clearInterval(page_interval);}
}
//----------------------------------------------------------------
let tempchannelArray=[];let ttcasid="tempchannelArray_storage";
function transfertempchannelarrytostring(){
  let s="";
     for(let i=0;i<tempchannelArray.length-1;i++){
        s+=tempchannelArray[i].title+'YYYYY'+tempchannelArray[i].id+'XXXXX';
    }
    if(tempchannelArray.length>0){
        s+=tempchannelArray[tempchannelArray.length-1].title+'YYYYY'+tempchannelArray[tempchannelArray.length-1].id;
    }
  return s;
}
function save_tempchannelarray(){
    let s=transfertempchannelarrytostring();
    localStorage.setItem(ttcasid, s);
}
function load_tempchannelarray(){
    let r=null;
    if(!localStorage.getItem(ttcasid)){localStorage.setItem(ttcasid, "");}
    let s=localStorage.getItem(ttcasid);
    if(s==""){tempchannelArray.length=0;return;}
    let sa=s.split("XXXXX");
    tempchannelArray.length=0;
    for(let i=0;i<sa.length;i++){
       let temp=sa[i].split("YYYYY");
       let o={title:temp[0],id:temp[1]}
       tempchannelArray.push(o);
    }
}
//----------------------------------------------------------------
function do_before_openSetting(){
    stop_page_observer();
}
function do_after_closeSetting(){
    filter("from parameter ui button closed");
}
function getCurrentLanguageIndex(language){
    let index=0;
        for(let i=0;i<languages.length;i++){
            let l=languages[i];
             if(l.language==language){
                 index=i;
             }
        }
    return index;

}
function setLanguage(){
    if(autoDectectSystemLanguage){
        let systemLanguage = navigator.language;
        language=systemLanguage.substring(0,2);

    }
    for(let i=0;i<languages.length;i++){
        let l=languages[i];
            if(l.language==language){
                block=l.block;highlight=l.highlight;setting=l.setting;show=l.show;hide=l.hide;
                parametersArray[BLOCK_CHANNEL].title=l.channel;
                parametersArray[BLOCK_VIDEO_KEYWORD].title=l.video+" "+l.keyword;
                parametersArray[BLOCK_VIDEO].title=l.video;
                parametersArray[BLOCK_COMMENT_USER].title=l.comment+" "+l.user;
                parametersArray[BLOCK_COMMENT_KEYWORD].title=l.comment+" "+l.keyword;
                parametersArray[HIGHLIGHT_CHANNEL].title=l.channel;
                parametersArray[HIGHLIGHT_VIDEO_KEYWORD].title=l.video+" "+l.keyword;
                parametersArray[HIGHLIGHT_VIDEO].title=l.video;
                parametersArray[HIGHLIGHT_COMMENT_USER].title=l.comment+" "+l.user;
                parametersSingle[HIGHLIGHT_CHANNEL_BACKGROUND].title=l.highlight+" "+l.channel+" "+l.color;
                parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_ARC].title=l.curvature;
                parametersSingle[HIGHLIGHT_VIDEO_KEYWORD_BACKGROUND].title=l.color;
                parametersSingle[HIGHLIGHT_VIDEO_BACKGROUND].title=l.highlight+" "+l.video+" "+l.color;
                parametersSingle[HIGHLIGHT_COMMENT_USER_BACKGROUND].title=l.highlight+" "+l.comment+" "+l.user+" "+l.color;
                parametersSingle[HIGHTLIGHT_POSTTIME_BAKGROUND].title=l.color;
                parametersSingle[HIGHTLIGHT_POSTTIME_REGX].title=l.regex;
                parametersSingle[HIGHTLIGHT_POSTTIME_TRUE].title=l.highlight+" "+l.posttime;
                parametersSingle[HIDE_COMMENT].title=l.hide+" "+l.comment;
                dropdownitems_homepage_title[0]=l.block+" "+l.channel;
                dropdownitems_homepage_title[1]=l.block+" "+l.video;
                dropdownitems_homepage_title[2]=l.highlight+" "+l.channel;
                dropdownitems_homepage_title[3]=l.highlight+" "+l.video;
                selecttext_popupitems_homepage_title[0]=l.block;
                selecttext_popupitems_homepage_title[1]=l.highlight;
                dropdownitemscomment_watchpage_title[0]=l.block+" "+l.user;
                dropdownitemscomment_watchpage_title[1]=l.highlight+" "+l.user;
                selecttext_popupitems_comment_watchpage_title[0]=l.block;
                selecttext_popupitems_homepage[0].title=selecttext_popupitems_homepage_title[0]+" ";
                selecttext_popupitems_homepage[1].title=selecttext_popupitems_homepage_title[1]+" ";
                selecttext_popupitems_comment_watchpage[0].title=selecttext_popupitems_comment_watchpage_title[0]+" ";
                title_restorefile=l.restore;
                title_savefile=l.backup;
                currentlanguageindex=i;
            }
        }
}
let sp;
function init(){
    sp=new ParametersAgent(document.getElementsByTagName('body')[0],"Youtube-filter(channel、comment、video).txt");
    sp.load_parameters_fromStorage();
    let lines=2;sp.setPanel_Parameters(ParametersAgent.LB,do_before_openSetting,do_after_closeSetting,lines);
    load_tempchannelarray();
}
//-----------------------------------------------------------------
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
setTimeout(function() {
(function() {
    try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string
            });
        }
    } catch (error) {
        console.error("An error occurred: " + error.message);
    }
    console.log("Youtube Filter...");
    setLanguage();
    init();
    start_page_observer(document.getElementsByTagName('body')[0]);
    start_page_interval(3000);
    document.onclick=(evnt)=>{if(currentMenu!=null){
        STD.hiddenEL(currentMenu);currentMenu=null;
    }};
     window.addEventListener('beforeunload', function (e) { //video channel id
          console.log("beforeunload");save_tempchannelarray();
        });

    window.addEventListener('resize', debounce(function() {
    rowcount=0;
}, 50));
})();
}, 3000);
