(function(s){
    var P=/[\.\/]/,Y=function(){},ka=function(n,U){
        return n-U
    },X,ca,ia={
        n:{}
    },S=function(n,U){
        var W=ca,I=Array.prototype.slice.call(arguments,2),B=S.listeners(n),N=0,G,$=[],K={},O=[];
        X=n;
        for(var M=ca=0,la=B.length;M<la;M++)"zIndex"in B[M]&&($.push(B[M].zIndex),B[M].zIndex<0&&(K[B[M].zIndex]=B[M]));
        for($.sort(ka);$[N]<0;){
            G=K[$[N++]];
            O.push(G.apply(U,I));
            if(ca){
                ca=W;
                return O
            }
        }
        for(M=0;M<la;M++){
            G=B[M];
            if("zIndex"in G)if(G.zIndex==$[N]){
                O.push(G.apply(U,I));
                if(ca){
                    ca=W;
                    return O
                }
                do{
                    N++;
                    (G=K[$[N]])&& O.push(G.apply(U,I));
                    if(ca){
                        ca=W;
                        return O
                    }
                }while(G)
            }else K[G.zIndex]=G;
            else{
                O.push(G.apply(U,I));
                if(ca){
                    ca=W;
                    return O
                }
            }
        }
        ca=W;
        return O.length?O:null
    };

    S.listeners=function(n){
        n=n.split(P);
        var U=ia,W,I,B,N,G,$,K,O=[U],M=[];
        B=0;
        for(N=n.length;B<N;B++){
            K=[];
            G=0;
            for($=O.length;G<$;G++){
                U=O[G].n;
                W=[U[n[B]],U["*"]];
                for(I=2;I--;)(U=W[I])&&(K.push(U),M=M.concat(U.f||[]))
            }
            O=K
        }
        return M
    };
    
    S.on=function(n,U){
        for(var W=n.split(P),I=ia,B=0,N=W.length;B<N;B++){
            I=I.n;
            !I[W[B]]&&(I[W[B]]={
                n:{}
            });
            I=I[W[B]]
        }
        I.f=I.f||[];
        B=0;
        for(N=I.f.length;B<N;B++)if(I.f[B]==U)return Y;I.f.push(U);
        return function(G){
            +G==+G&&(U.zIndex=+G)
        }
    };

    S.stop=function(){
        ca=1
    };
    
    S.nt=function(n){
        if(n)return RegExp("(?:\\.|\\/|^)"+n+"(?:\\.|\\/|$)").test(X);
        return X
    };
    
    S.unbind=function(n,U){
        var W=n.split(P),I,B,N,G,$,K,O=[ia];
        G=0;
        for($=W.length;G<$;G++)for(K=0;K<O.length;K+=N.length-2){
            N=[K,1];
            I=O[K].n;
            if(W[G]!="*")I[W[G]]&&N.push(I[W[G]]);else for(B in I)I.hasOwnProperty(B)&&N.push(I[B]);O.splice.apply(O,N)
        }
        G=0;
        for($=O.length;G<$;G++)for(I=O[G];I.n;){
            if(U){
                if(I.f){
                    K= 0;
                    for(W=I.f.length;K<W;K++)if(I.f[K]==U){
                        I.f.splice(K,1);
                        break
                    }!I.f.length&&delete I.f
                }
                for(B in I.n)if(I.n.hasOwnProperty(B)&&I.n[B].f){
                    N=I.n[B].f;
                    K=0;
                    for(W=N.length;K<W;K++)if(N[K]==U){
                        N.splice(K,1);
                        break
                    }!N.length&&delete I.n[B].f
                }
            }else{
                delete I.f;
                for(B in I.n)I.n.hasOwnProperty(B)&&I.n[B].f&&delete I.n[B].f
            }
            I=I.n
        }
    };
    
    S.once=function(n,U){
        var W=function(){
            U.apply(this,arguments);
            S.unbind(n,W)
        };
        
        return S.on(n,W)
    };
    
    S.version="0.4.0";
    S.toString=function(){
        return"You are running Eve 0.4.0"
    };
    
    typeof module!= "undefined"&&module.exports?module.exports=S:s.eve=S
})(this);
(function(){
    function s(a,b,c,d,f,g){
        c=L(c);
        var j,o,q,u,x,r,E=a.ms,A={},H={},v={};
        
        if(d){
            r=0;
            for(C=ba.length;r<C;r++){
                var z=ba[r];
                if(z.el.id==b.id&&z.anim==a){
                    z.percent!=c?(ba.splice(r,1),q=1):o=z;
                    b.attr(z.totalOrigin);
                    break
                }
            }
        }else d=+H;
        r=0;
        for(var C=a.percents.length;r<C;r++){
            if(a.percents[r]==c||a.percents[r]>d*a.top){
                c=a.percents[r];
                x=a.percents[r-1]||0;
                E=E/a.top*(c-x);
                u=a.percents[r+1];
                j=a.anim[c];
                break
            }
            d&&b.attr(a.anim[a.percents[r]])
        }
        if(j){
            if(o){
                o.initstatus=d;
                o.start=new Date-o.ms*d
            }else{
                for(var D in j)if(j[N](D))if(ma[N](D)|| b.paper.customAttributes[N](D)){
                    A[D]=b.attr(D);
                    A[D]==null&&(A[D]=pa[D]);
                    H[D]=j[D];
                    switch(ma[D]){
                        case w:
                            v[D]=(H[D]-A[D])/E;
                            break;
                        case "colour":
                            A[D]=n.getRGB(A[D]);
                            r=n.getRGB(H[D]);
                            v[D]={
                                r:(r.r-A[D].r)/E,
                                g:(r.g-A[D].g)/E,
                                b:(r.b-A[D].b)/E
                            };
                    
                            break;
                        case "path":
                            r=ua(A[D],H[D]);
                            z=r[1];
                            A[D]=r[0];
                            v[D]=[];
                            r=0;
                            for(C=A[D].length;r<C;r++){
                                v[D][r]=[0];
                                for(var V=1,ra=A[D][r].length;V<ra;V++)v[D][r][V]=(z[r][V]-A[D][r][V])/E
                            }
                            break;
                        case "transform":
                            r=b._;
                            if(C=$a(r[D],H[D])){
                                A[D]=C.from;
                                H[D]=C.to;
                                v[D]=[];
                                v[D].real= true;
                                r=0;
                                for(C=A[D].length;r<C;r++){
                                    v[D][r]=[A[D][r][0]];
                                    V=1;
                                    for(ra=A[D][r].length;V<ra;V++)v[D][r][V]=(H[D][r][V]-A[D][r][V])/E
                                }
                            }else{
                                C=b.matrix||new X;
                                r={
                                    _:{
                                        transform:r.transform
                                    },
                                    getBBox:function(){
                                        return b.getBBox(1)
                                    }
                                };
                    
                                A[D]=[C.a,C.b,C.c,C.d,C.e,C.f];
                                ab(r,H[D]);
                                H[D]=r._.transform;
                                v[D]=[(r.matrix.a-C.a)/E,(r.matrix.b-C.b)/E,(r.matrix.c-C.c)/E,(r.matrix.d-C.d)/E,(r.matrix.e-C.e)/E,(r.matrix.e-C.f)/E]
                            }
                            break;
                        case "csv":
                            C=T(j[D])[ha](W);
                            z=T(A[D])[ha](W);
                            if(D=="clip-rect"){
                                A[D]=z;
                                v[D]=[];
                                for(r=z.length;r--;)v[D][r]= (C[r]-A[D][r])/E
                            }
                            H[D]=C;
                            break;
                        default:
                            C=[][M](j[D]);
                            z=[][M](A[D]);
                            v[D]=[];
                            for(r=b.paper.customAttributes[D].length;r--;)v[D][r]=((C[r]||0)-(z[r]||0))/E
                    }
                }
                r=j.easing;
                D=n.easing_formulas[r];
                if(!D)if((D=T(r).match(ea))&&D.length==5){
                    var na=D;
                    D=function(Ca){
                        return Y(Ca,+na[1],+na[2],+na[3],+na[4],E)
                    }
                }else D=bb;
                r=j.start||a.start||+new Date;
                z={
                    anim:a,
                    percent:c,
                    timestamp:r,
                    start:r+(a.del||0),
                    status:0,
                    initstatus:d||0,
                    stop:false,
                    ms:E,
                    easing:D,
                    from:A,
                    diff:v,
                    to:H,
                    el:b,
                    callback:j.callback,
                    prev:x,
                    next:u,
                    repeat:g|| a.times,
                    origin:b.attr(),
                    totalOrigin:f
                };

                ba.push(z);
                if(d&&!o&&!q){
                    z.stop=true;
                    z.start=new Date-E*d;
                    if(ba.length==1)return Da()
                }
                q&&(z.start=new Date-z.ms*d);
                ba.length==1&&Ma(Da)
            }
            eve("anim.start."+b.id,b,a)
        }
    }
    function P(a,b){
        var c=[],d={};
    
        this.ms=b;
        this.times=1;
        if(a){
            for(var f in a)a[N](f)&&(d[L(f)]=a[f],c.push(L(f)));c.sort(cb)
        }
        this.anim=d;
        this.top=c[c.length-1];
        this.percents=c
    }
    function Y(a,b,c,d,f,g){
        function j(A,H){
            var v,z,C,D;
            C=A;
            for(z=0;z<8;z++){
                D=((u*C+q)*C+o)*C-A;
                if(k(D)<H)return C;
                v=(3*u*C+2*q)* C+o;
                if(k(v)<1.0E-6)break;
                C-=D/v
            }
            v=0;
            z=1;
            C=A;
            if(C<v)return v;
            if(C>z)return z;
            for(;v<z;){
                D=((u*C+q)*C+o)*C;
                if(k(D-A)<H)break;
                A>D?v=C:z=C;
                C=(z-v)/2+v
            }
            return C
        }
        var o=3*b,q=3*(d-b)-o,u=1-o-q,x=3*c,r=3*(f-c)-x,E=1-x-r;
        return function(A,H){
            var v=j(A,H);
            return((E*v+r)*v+x)*v
        }(a,1/(200*g))
    }
    function ka(){
        return this.x+fa+this.y+fa+this.width+" \u00d7 "+this.height
    }
    function X(a,b,c,d,f,g){
        a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+f,this.f=+g):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f= 0)
    }
    function ca(a){
        for(var b=[],c=0,d=a.length;d-2>c;c+=2){
            var f=[{
                x:+a[c],
                y:+a[c+1]
            },{
                x:+a[c],
                y:+a[c+1]
            },{
                x:+a[c+2],
                y:+a[c+3]
            },{
                x:+a[c+4],
                y:+a[c+5]
            }];
            d-4==c?(f[0]={
                x:+a[c-2],
                y:+a[c-1]
            },f[3]=f[2]):c&&(f[0]={
                x:+a[c-2],
                y:+a[c-1]
            });
            b.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])
        }
        return b
    }
    function ia(){
        return this.hex
    }
    function S(a,b,c){
        function d(){
            var f=Array.prototype.slice.call(arguments,0),g=f.join("\u2400"), j=d.cache=d.cache||{},o=d.count=d.count||[];
            if(j[N](g)){
                a:{
                    f=0;
                    for(var q=o.length;f<q;f++)if(o[f]===g){
                        o.push(o.splice(f,1)[0]);
                        break a
                    }
                }
            return c?c(j[g]):j[g]
            }
            o.length>=1E3&&delete j[o.shift()];
            o.push(g);
            j[g]=a[O](b,f);
            return c?c(j[g]):j[g]
        }
        return d
    }
    function n(a){
        if(n.is(a,"function"))return U?a():eve.on("DOMload",a);
        if(n.is(a,y))return n._engine.create[O](n,a.splice(0,3+n.is(a[0],w))).add(a);
        var b=Array.prototype.slice.call(arguments,0);
        if(n.is(b[b.length-1],"function")){
            var c=b.pop();
            return U?c.call(n._engine.create[O](n, b)):eve.on("DOMload",function(){
                c.call(n._engine.create[O](n,b))
            })
        }
        return n._engine.create[O](n,arguments)
    }
    n.version="2.0.1";
    n.eve=eve;
    var U,W=/[, ]+/,I={
        circle:1,
        rect:1,
        path:1,
        ellipse:1,
        text:1,
        image:1
    },B=/\{(\d+)\}/g,N="hasOwnProperty",G={
        doc:document,
        win:window
    },$={
        was:Object.prototype[N].call(G.win,"Raphael"),
        is:G.win.Raphael
    },K=function(){
        this.ca=this.customAttributes={}
    },O="apply",M="concat",la="createTouch"in G.doc,fa=" ",T=String,ha="split",J="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[ha](fa), i={
        mousedown:"touchstart",
        mousemove:"touchmove",
        mouseup:"touchend"
    },t=T.prototype.toLowerCase,p=Math,e=p.max,h=p.min,k=p.abs,l=p.pow,m=p.PI,w="number",y="array",F=Object.prototype.toString;
    n._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i;
    var Q=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i, R={
        NaN:1,
        Infinity:1,
        "-Infinity":1
    },ea=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,Z=p.round,L=parseFloat,da=parseInt,ga=T.prototype.toUpperCase,pa=n._availableAttrs={
        "arrow-end":"none",
        "arrow-start":"none",
        blur:0,
        "clip-rect":"0 0 1e9 1e9",
        cursor:"default",
        cx:0,
        cy:0,
        fill:"#fff",
        "fill-opacity":1,
        font:'10px "Arial"',
        "font-family":'"Arial"',
        "font-size":"10",
        "font-style":"normal",
        "font-weight":400,
        gradient:0,
        height:0,
        href:"http://raphaeljs.com/",
        "letter-spacing":0,
        opacity:1,
        path:"M0,0",
        r:0, 
        rx:0,
        ry:0,
        src:"",
        stroke:"#000",
        "stroke-dasharray":"",
        "stroke-linecap":"butt",
        "stroke-linejoin":"butt",
        "stroke-miterlimit":0,
        "stroke-opacity":1,
        "stroke-width":1,
        target:"_blank",
        "text-anchor":"middle",
        title:"Raphael",
        transform:"",
        width:0,
        x:0,
        y:0
    },ma=n._availableAnimAttrs={
        blur:w,
        "clip-rect":"csv",
        cx:w,
        cy:w,
        fill:"colour",
        "fill-opacity":w,
        "font-size":w,
        height:w,
        opacity:w,
        path:"path",
        r:w,
        rx:w,
        ry:w,
        stroke:"colour",
        "stroke-opacity":w,
        "stroke-width":w,
        transform:"transform",
        width:w,
        x:w,
        y:w
    },oa=/\s*,\s*/,db= {
        hs:1,
        rg:1
    },eb=/,?([achlmqrstvxz]),?/gi,fb=/([achlmrqstvz])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,gb=/([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,Na=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)\s*,?\s*/ig;
    n._radial_gradient=/^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;
    var va={},cb=function(a,b){
        return L(a)-L(b)
    },xa=function(){},bb=function(a){
        return a
    },Ea=n._rectPath=function(a,b,c,d,f){
        if(f)return[["M",a+f,b],["l",c-f*2,0],["a",f,f,0,0,1,f,f],["l",0,d-f*2],["a",f,f,0,0,1,-f,f],["l",f*2-c,0],["a", f,f,0,0,1,-f,-f],["l",0,f*2-d],["a",f,f,0,0,1,f,-f],["z"]];
        return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]
    },Oa=function(a,b,c,d){
        d==null&&(d=c);
        return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]
    },Fa=n._getPath={
        path:function(a){
            return a.attr("path")
        },
        circle:function(a){
            a=a.attrs;
            return Oa(a.cx,a.cy,a.r)
        },
        ellipse:function(a){
            a=a.attrs;
            return Oa(a.cx,a.cy,a.rx,a.ry)
        },
        rect:function(a){
            a=a.attrs;
            return Ea(a.x,a.y,a.width,a.height,a.r)
        },
        image:function(a){
            a=a.attrs;
            return Ea(a.x, a.y,a.width,a.height)
        },
        text:function(a){
            a=a._getBBox();
            return Ea(a.x,a.y,a.width,a.height)
        }
    },Pa=n.mapPath=function(a,b){
        if(!b)return a;
        var c,d,f,g,j,o,q;
        a=ua(a);
        f=0;
        for(j=a.length;f<j;f++){
            q=a[f];
            g=1;
            for(o=q.length;g<o;g+=2){
                c=b.x(q[g],q[g+1]);
                d=b.y(q[g],q[g+1]);
                q[g]=c;
                q[g+1]=d
            }
        }
        return a
    };

    n._g=G;
    n.type=G.win.SVGAngle||G.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";
    if(n.type=="VML"){
        var ja=G.doc.createElement("div");
        ja.innerHTML='<v:shape adj="1"/>';
        ja=ja.firstChild;
        ja.style.behavior="url(#default#VML)";
        if(!ja||typeof ja.adj!="object")return n.type="";
        ja=null
    }
    n.svg=!(n.vml=n.type=="VML");
    n._Paper=K;
    n.fn=K=K.prototype=n.prototype;
    n._id=0;
    n._oid=0;
    n.is=function(a,b){
        b=t.call(b);
        if(b=="finite")return!R[N](+a);
        if(b=="array")return a instanceof Array;
        return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||F.call(a).slice(8,-1).toLowerCase()==b
    };
    
    n.angle=function(a,b,c,d,f,g){
        if(f== null){
            a=a-c;
            b=b-d;
            if(!a&&!b)return 0;
            return(180+p.atan2(-b,-a)*180/m+360)%360
        }
        return n.angle(a,b,f,g)-n.angle(c,d,f,g)
    };
    
    n.rad=function(a){
        return a%360*m/180
    };
    
    n.deg=function(a){
        return a*180/m%360
    };
    
    n.snapTo=function(a,b,c){
        c=n.is(c,"finite")?c:10;
        if(n.is(a,y))for(var d=a.length;d--;){
            if(k(a[d]-b)<=c)return a[d]
        }else{
            a=+a;
            d=b%a;
            if(d<c)return b-d;
            if(d>a-c)return b-d+a
        }
        return b
    };
    
    n.createUUID=function(a,b){
        return function(){
            return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()
        }
    }(/[xy]/g, function(a){
        var b=p.random()*16|0;
        return(a=="x"?b:b&3|8).toString(16)
    });
    n.setWindow=function(a){
        eve("setWindow",n,G.win,a);
        G.win=a;
        G.doc=G.win.document;
        n._engine.initWin&&n._engine.initWin(G.win)
    };
    
    var ya=function(a){
        if(n.vml){
            var b=/^\s+|\s+$/g,c;
            try{
                var d=new ActiveXObject("htmlfile");
                d.write("<body>");
                d.close();
                c=d.body
            }catch(f){
                c=createPopup().document.body
            }
            var g=c.createTextRange();
            ya=S(function(o){
                try{
                    c.style.color=T(o).replace(b,"");
                    var q=g.queryCommandValue("ForeColor");
                    q=(q&255)<<16|q&65280| (q&16711680)>>>16;
                    return"#"+("000000"+q.toString(16)).slice(-6)
                }catch(u){
                    return"none"
                }
            })
        }else{
            var j=G.doc.createElement("i");
            j.title="Rapha\u00ebl Colour Picker";
            j.style.display="none";
            G.doc.body.appendChild(j);
            ya=S(function(o){
                j.style.color=o;
                return G.doc.defaultView.getComputedStyle(j,"").getPropertyValue("color")
            })
        }
        return ya(a)
    },hb=function(){
        return"hsb("+[this.h,this.s,this.b]+")"
    },ib=function(){
        return"hsl("+[this.h,this.s,this.l]+")"
    },Qa=function(){
        return this.hex
    },Ra=function(a,b,c){
        b==null&& n.is(a,"object")&&"r"in a&&"g"in a&&"b"in a&&(c=a.b,b=a.g,a=a.r);
        if(b==null&&n.is(a,"string")){
            c=n.getRGB(a);
            a=c.r;
            b=c.g;
            c=c.b
        }
        if(a>1||b>1||c>1){
            a/=255;
            b/=255;
            c/=255
        }
        return[a,b,c]
    },Sa=function(a,b,c,d){
        a*=255;
        b*=255;
        c*=255;
        a={
            r:a,
            g:b,
            b:c,
            hex:n.rgb(a,b,c),
            toString:Qa
        };
    
        n.is(d,"finite")&&(a.opacity=d);
        return a
    };
    
    n.color=function(a){
        var b;
        n.is(a,"object")&&"h"in a&&"s"in a&&"b"in a?(b=n.hsb2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.hex=b.hex):n.is(a,"object")&&"h"in a&&"s"in a&&"l"in a?(b=n.hsl2rgb(a),a.r=b.r, a.g=b.g,a.b=b.b,a.hex=b.hex):(n.is(a,"string")&&(a=n.getRGB(a)),n.is(a,"object")&&"r"in a&&"g"in a&&"b"in a?(b=n.rgb2hsl(a),a.h=b.h,a.s=b.s,a.l=b.l,b=n.rgb2hsb(a),a.v=b.b):(a={
            hex:"none"
        },a.r=a.g=a.b=a.h=a.s=a.v=a.l=-1));
        a.toString=Qa;
        return a
    };
    
    n.hsb2rgb=function(a,b,c,d){
        this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o);
        a*=360;
        var f,g,j;
        a=a%360/60;
        j=c*b;
        b=j*(1-k(a%2-1));
        c=f=g=c-j;
        a=~~a;
        c+=[j,b,0,0,b,j][a];
        f+=[b,j,j,b,0,0][a];
        g+=[0,0,b,j,j,b][a];
        return Sa(c,f,g,d)
    };
    
    n.hsl2rgb= function(a,b,c,d){
        this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);
        if(a>1||b>1||c>1){
            a/=360;
            b/=100;
            c/=100
        }
        a*=360;
        var f,g,j;
        a=a%360/60;
        j=2*b*(c<0.5?c:1-c);
        b=j*(1-k(a%2-1));
        c=f=g=c-j/2;
        a=~~a;
        c+=[j,b,0,0,b,j][a];
        f+=[b,j,j,b,0,0][a];
        g+=[0,0,b,j,j,b][a];
        return Sa(c,f,g,d)
    };
    
    n.rgb2hsb=function(a,b,c){
        c=Ra(a,b,c);
        a=c[0];
        b=c[1];
        c=c[2];
        var d,f;
        d=e(a,b,c);
        f=d-h(a,b,c);
        a=f==0?null:d==a?(b-c)/f:d==b?(c-a)/f+2:(a-b)/f+4;
        a=(a+360)%6*60/360;
        return{
            h:a,
            s:f==0?0:f/d,
            b:d,
            toString:hb
        }
    };

    n.rgb2hsl=function(a, b,c){
        c=Ra(a,b,c);
        a=c[0];
        b=c[1];
        c=c[2];
        var d,f,g;
        d=e(a,b,c);
        f=h(a,b,c);
        g=d-f;
        a=g==0?null:d==a?(b-c)/g:d==b?(c-a)/g+2:(a-b)/g+4;
        a=(a+360)%6*60/360;
        d=(d+f)/2;
        return{
            h:a,
            s:g==0?0:d<0.5?g/(2*d):g/(2-2*d),
            l:d,
            toString:ib
        }
    };

    n._path2string=function(){
        return this.join(",").replace(eb,"$1")
    };
    
    n._preload=function(a,b){
        var c=G.doc.createElement("img");
        c.style.cssText="position:absolute;left:-9999em;top:-9999em";
        c.onload=function(){
            b.call(this);
            this.onload=null;
            G.doc.body.removeChild(this)
        };
        
        c.onerror=function(){
            G.doc.body.removeChild(this)
        };        
        G.doc.body.appendChild(c);
        c.src=a
    };
    
    n.getRGB=S(function(a){
        if(!a||(a=T(a)).indexOf("-")+1)return{
            r:-1,
            g:-1,
            b:-1,
            hex:"none",
            error:1,
            toString:ia
        };
    
        if(a=="none")return{
            r:-1,
            g:-1,
            b:-1,
            hex:"none",
            toString:ia
        };
        !db[N](a.toLowerCase().substring(0,2))&&a.charAt()!="#"&&(a=ya(a));
        var b,c,d,f,g,j;
        if(a=a.match(Q)){
            a[2]&&(d=da(a[2].substring(5),16),c=da(a[2].substring(3,5),16),b=da(a[2].substring(1,3),16));
            a[3]&&(d=da((g=a[3].charAt(3))+g,16),c=da((g=a[3].charAt(2))+g,16),b=da((g=a[3].charAt(1))+g,16));
            a[4]&&(j= a[4][ha](oa),b=L(j[0]),j[0].slice(-1)=="%"&&(b*=2.55),c=L(j[1]),j[1].slice(-1)=="%"&&(c*=2.55),d=L(j[2]),j[2].slice(-1)=="%"&&(d*=2.55),a[1].toLowerCase().slice(0,4)=="rgba"&&(f=L(j[3])),j[3]&&j[3].slice(-1)=="%"&&(f/=100));
            if(a[5]){
                j=a[5][ha](oa);
                b=L(j[0]);
                j[0].slice(-1)=="%"&&(b*=2.55);
                c=L(j[1]);
                j[1].slice(-1)=="%"&&(c*=2.55);
                d=L(j[2]);
                j[2].slice(-1)=="%"&&(d*=2.55);
                (j[0].slice(-3)=="deg"||j[0].slice(-1)=="\u00b0")&&(b/=360);
                a[1].toLowerCase().slice(0,4)=="hsba"&&(f=L(j[3]));
                j[3]&&j[3].slice(-1)== "%"&&(f/=100);
                return n.hsb2rgb(b,c,d,f)
            }
            if(a[6]){
                j=a[6][ha](oa);
                b=L(j[0]);
                j[0].slice(-1)=="%"&&(b*=2.55);
                c=L(j[1]);
                j[1].slice(-1)=="%"&&(c*=2.55);
                d=L(j[2]);
                j[2].slice(-1)=="%"&&(d*=2.55);
                (j[0].slice(-3)=="deg"||j[0].slice(-1)=="\u00b0")&&(b/=360);
                a[1].toLowerCase().slice(0,4)=="hsla"&&(f=L(j[3]));
                j[3]&&j[3].slice(-1)=="%"&&(f/=100);
                return n.hsl2rgb(b,c,d,f)
            }
            a={
                r:b,
                g:c,
                b:d,
                toString:ia
            };
        
            a.hex="#"+(16777216|d|c<<8|b<<16).toString(16).slice(1);
            n.is(f,"finite")&&(a.opacity=f);
            return a
        }
        return{
            r:-1,
            g:-1, 
            b:-1,
            hex:"none",
            error:1,
            toString:ia
        }
    },n);
    n.hsb=S(function(a,b,c){
        return n.hsb2rgb(a,b,c).hex
    });
    n.hsl=S(function(a,b,c){
        return n.hsl2rgb(a,b,c).hex
    });
    n.rgb=S(function(a,b,c){
        return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)
    });
    n.getColor=function(a){
        a=this.getColor.start=this.getColor.start||{
            h:0,
            s:1,
            b:a||0.75
        };
        
        var b=this.hsb2rgb(a.h,a.s,a.b);
        a.h+=0.075;
        a.h>1&&(a.h=0,a.s-=0.2,a.s<=0&&(this.getColor.start={
            h:0,
            s:1,
            b:a.b
        }));
        return b.hex
    };
    
    n.getColor.reset=function(){
        delete this.start
    };
    
    n.parsePathString= S(function(a){
        if(!a)return null;
        var b={
            a:7,
            c:6,
            h:1,
            l:2,
            m:2,
            r:4,
            q:4,
            s:4,
            t:2,
            v:1,
            z:0
        },c=[];
        n.is(a,y)&&n.is(a[0],y)&&(c=wa(a));
        c.length||T(a).replace(fb,function(d,f,g){
            var j=[];
            d=f.toLowerCase();
            g.replace(Na,function(o,q){
                q&&j.push(+q)
            });
            d=="m"&&j.length>2&&(c.push([f][M](j.splice(0,2))),d="l",f=f=="m"?"l":"L");
            if(d=="r")c.push([f][M](j));else for(;j.length>=b[d];){
                c.push([f][M](j.splice(0,b[d])));
                if(!b[d])break
            }
        });
        c.toString=n._path2string;
        return c
    });
    n.parseTransformString=S(function(a){
        if(!a)return null;
        var b=[];
        n.is(a,y)&&n.is(a[0],y)&&(b=wa(a));
        b.length||T(a).replace(gb,function(c,d,f){
            var g=[];
            t.call(d);
            f.replace(Na,function(j,o){
                o&&g.push(+o)
            });
            b.push([d][M](g))
        });
        b.toString=n._path2string;
        return b
    });
    n.findDotsAtSegment=function(a,b,c,d,f,g,j,o,q){
        var u=1-q,x=l(u,3),r=l(u,2),E=q*q,A=E*q,H=x*a+r*3*q*c+u*3*q*q*f+A*j;
        x=x*b+r*3*q*d+u*3*q*q*g+A*o;
        r=a+2*q*(c-a)+E*(f-2*c+a);
        A=b+2*q*(d-b)+E*(g-2*d+b);
        var v=c+2*q*(f-c)+E*(j-2*f+c);
        E=d+2*q*(g-d)+E*(o-2*g+d);
        a=u*a+q*c;
        b=u*b+q*d;
        f=u*f+q*j;
        g=u*g+q*o;
        o=90- p.atan2(r-v,A-E)*180/m;
        (r>v||A<E)&&(o+=180);
        return{
            x:H,
            y:x,
            m:{
                x:r,
                y:A
            },
            n:{
                x:v,
                y:E
            },
            start:{
                x:a,
                y:b
            },
            end:{
                x:f,
                y:g
            },
            alpha:o
        }
    };

    n._removedFactory=function(a){
        return function(){
            throw Error("Rapha\u00ebl: you are calling to method \u201c"+a+"\u201d of removed object");
        }
    };

    var Ta=S(function(a){
        if(!a)return{
            x:0,
            y:0,
            width:0,
            height:0
        };
    
        a=ua(a);
        for(var b=0,c=0,d=[],f=[],g,j=0,o=a.length;j<o;j++){
            g=a[j];
            if(g[0]=="M"){
                b=g[1];
                c=g[2];
                d.push(b);
                f.push(c)
            }else{
                b=jb(b,c,g[1],g[2],g[3],g[4],g[5],g[6]);
                d=d[M](b.min.x,b.max.x);
                f=f[M](b.min.y,b.max.y);
                b=g[5];
                c=g[6]
            }
        }
        a=h[O](0,d);
        g=h[O](0,f);
        return{
            x:a,
            y:g,
            width:e[O](0,d)-a,
            height:e[O](0,f)-g
        }
    },null,function(a){
        return{
            x:a.x,
            y:a.y,
            width:a.width,
            height:a.height
        }
    }),wa=function(a){
        var b=[];
        if(!n.is(a,y)||!n.is(a&&a[0],y))a=n.parsePathString(a);
        for(var c=0,d=a.length;c<d;c++){
            b[c]=[];
            for(var f=0,g=a[c].length;f<g;f++)b[c][f]=a[c][f]
        }
        b.toString=n._path2string;
        return b
    };
    
    ja=n._pathToRelative=S(function(a){
        if(!n.is(a,y)||!n.is(a&&a[0],y))a=n.parsePathString(a);
        var b=[],c=0,d=0,f=0, g=0,j=0;
        a[0][0]=="M"&&(c=a[0][1],d=a[0][2],f=c,g=d,j++,b.push(["M",c,d]));
        j=j;
        for(var o=a.length;j<o;j++){
            var q=b[j]=[],u=a[j];
            if(u[0]!=t.call(u[0])){
                q[0]=t.call(u[0]);
                switch(q[0]){
                    case "a":
                        q[1]=u[1];
                        q[2]=u[2];
                        q[3]=u[3];
                        q[4]=u[4];
                        q[5]=u[5];
                        q[6]=+(u[6]-c).toFixed(3);
                        q[7]=+(u[7]-d).toFixed(3);
                        break;
                    case "v":
                        q[1]=+(u[1]-d).toFixed(3);
                        break;
                    case "m":
                        f=u[1];
                        g=u[2];
                    default:
                        for(var x=1,r=u.length;x<r;x++)q[x]=+(u[x]-(x%2?c:d)).toFixed(3)
                }
            }else{
                b[j]=[];
                u[0]=="m"&&(f=u[1]+c,g=u[2]+d);
                q=0;
                for(x=u.length;q< x;q++)b[j][q]=u[q]
            }
            u=b[j].length;
            switch(b[j][0]){
                case "z":
                    c=f;
                    d=g;
                    break;
                case "h":
                    c+=+b[j][u-1];
                    break;
                case "v":
                    d+=+b[j][u-1];
                    break;
                default:
                    c+=+b[j][u-2];
                    d+=+b[j][u-1]
            }
        }
        b.toString=n._path2string;
        return b
    },0,wa);
    var Ua=n._pathToAbsolute=S(function(a){
        if(!n.is(a,y)||!n.is(a&&a[0],y))a=n.parsePathString(a);
        if(!a||!a.length)return[["M",0,0]];
        var b=[],c=0,d=0,f=0,g=0,j=0;
        a[0][0]=="M"&&(c=+a[0][1],d=+a[0][2],f=c,g=d,j++,b[0]=["M",c,d]);
        for(var o,q=j,u=a.length;q<u;q++){
            b.push(j=[]);
            o=a[q];
            if(o[0]!=ga.call(o[0])){
                j[0]= ga.call(o[0]);
                switch(j[0]){
                    case "A":
                        j[1]=o[1];
                        j[2]=o[2];
                        j[3]=o[3];
                        j[4]=o[4];
                        j[5]=o[5];
                        j[6]=+(o[6]+c);
                        j[7]=+(o[7]+d);
                        break;
                    case "V":
                        j[1]=+o[1]+d;
                        break;
                    case "H":
                        j[1]=+o[1]+c;
                        break;
                    case "R":
                        for(var x=[c,d][M](o.slice(1)),r=2,E=x.length;r<E;r++){
                            x[r]=+x[r]+c;
                            x[++r]=+x[r]+d
                        }
                        b.pop();
                        b=b[M](ca(x));
                        break;
                    case "M":
                        f=+o[1]+c;
                        g=+o[2]+d;
                    default:
                        r=1;
                        for(E=o.length;r<E;r++)j[r]=+o[r]+(r%2?c:d)
                }
            }else if(o[0]=="R"){
                x=[c,d][M](o.slice(1));
                b.pop();
                b=b[M](ca(x));
                j=["R"][M](o.slice(-2))
            }else{
                x=0;
                for(r=o.length;x<r;x++)j[x]= o[x]
            }
            switch(j[0]){
                case "Z":
                    c=f;
                    d=g;
                    break;
                case "H":
                    c=j[1];
                    break;
                case "V":
                    d=j[1];
                    break;
                case "M":
                    f=j[j.length-2];
                    g=j[j.length-1];
                default:
                    c=j[j.length-2];
                    d=j[j.length-1]
            }
        }
        b.toString=n._path2string;
        return b
    },null,wa),Va=function(a,b,c,d,f,g){
        var j=1/3,o=2/3;
        return[j*a+o*c,j*b+o*d,j*f+o*c,j*g+o*d,f,g]
    },Wa=function(a,b,c,d,f,g,j,o,q,u){
        var x=m*120/180,r=m/180*(+f||0),E=[],A,H=S(function(V,ra,na){
            var Ca=V*p.cos(na)-ra*p.sin(na);
            V=V*p.sin(na)+ra*p.cos(na);
            return{
                x:Ca,
                y:V
            }
        });
        if(u){
            C=u[0];
            A=u[1];
            g=u[2];
            z=u[3]
        }else{
            A= H(a,b,-r);
            a=A.x;
            b=A.y;
            A=H(o,q,-r);
            o=A.x;
            q=A.y;
            p.cos(m/180*f);
            p.sin(m/180*f);
            A=(a-o)/2;
            C=(b-q)/2;
            var v=A*A/(c*c)+C*C/(d*d);
            v>1&&(v=p.sqrt(v),c=v*c,d=v*d);
            v=c*c;
            z=d*d;
            v=(g==j?-1:1)*p.sqrt(k((v*z-v*C*C-z*A*A)/(v*C*C+z*A*A)));
            g=v*c*C/d+(a+o)/2;
            var z=v*-d*A/c+(b+q)/2,C=p.asin(((b-z)/d).toFixed(9));
            A=p.asin(((q-z)/d).toFixed(9));
            C=a<g?m-C:C;
            A=o<g?m-A:A;
            C<0&&(C=m*2+C);
            A<0&&(A=m*2+A);
            j&&C>A&&(C-=m*2);
            !j&&A>C&&(A-=m*2)
        }
        v=A-C;
        if(k(v)>x){
            E=A;
            v=o;
            var D=q;
            A=C+x*(j&&A>C?1:-1);
            o=g+c*p.cos(A);
            q=z+d*p.sin(A);
            E=Wa(o, q,c,d,f,0,j,v,D,[A,E,g,z])
        }
        v=A-C;
        f=p.cos(C);
        x=p.sin(C);
        j=p.cos(A);
        A=p.sin(A);
        g=p.tan(v/4);
        c=4/3*c*g;
        g=4/3*d*g;
        d=[a,b];
        a=[a+c*x,b-g*f];
        b=[o+c*A,q-g*j];
        o=[o,q];
        a[0]=2*d[0]-a[0];
        a[1]=2*d[1]-a[1];
        if(u)return[a,b,o][M](E);
        E=[a,b,o][M](E).join()[ha](",");
        u=[];
        o=0;
        for(q=E.length;o<q;o++)u[o]=o%2?H(E[o-1],E[o],r).y:H(E[o],E[o+1],r).x;
        return u
    },za=function(a,b,c,d,f,g,j,o,q){
        var u=1-q;
        return{
            x:l(u,3)*a+l(u,2)*3*q*c+u*3*q*q*f+l(q,3)*j,
            y:l(u,3)*b+l(u,2)*3*q*d+u*3*q*q*g+l(q,3)*o
        }
    },jb=S(function(a,b,c,d,f,g,j, o){
        var q=f-2*c+a-(j-2*f+c),u=2*(c-a)-2*(f-c),x=a-c,r=(-u+p.sqrt(u*u-4*q*x))/2/q;
        q=(-u-p.sqrt(u*u-4*q*x))/2/q;
        var E=[b,o],A=[a,j],H;
        k(r)>"1e12"&&(r=0.5);
        k(q)>"1e12"&&(q=0.5);
        r>0&&r<1&&(H=za(a,b,c,d,f,g,j,o,r),A.push(H.x),E.push(H.y));
        q>0&&q<1&&(H=za(a,b,c,d,f,g,j,o,q),A.push(H.x),E.push(H.y));
        q=g-2*d+b-(o-2*g+d);
        u=2*(d-b)-2*(g-d);
        x=b-d;
        r=(-u+p.sqrt(u*u-4*q*x))/2/q;
        q=(-u-p.sqrt(u*u-4*q*x))/2/q;
        k(r)>"1e12"&&(r=0.5);
        k(q)>"1e12"&&(q=0.5);
        r>0&&r<1&&(H=za(a,b,c,d,f,g,j,o,r),A.push(H.x),E.push(H.y));
        q>0&& q<1&&(H=za(a,b,c,d,f,g,j,o,q),A.push(H.x),E.push(H.y));
        return{
            min:{
                x:h[O](0,A),
                y:h[O](0,E)
            },
            max:{
                x:e[O](0,A),
                y:e[O](0,E)
            }
        }
    }),ua=n._path2curve=S(function(a,b){
        var c=Ua(a),d=b&&Ua(b),f={
            x:0,
            y:0,
            bx:0,
            by:0,
            X:0,
            Y:0,
            qx:null,
            qy:null
        },g={
            x:0,
            y:0,
            bx:0,
            by:0,
            X:0,
            Y:0,
            qx:null,
            qy:null
        },j=function(v,z){
            var C,D;
            if(!v)return["C",z.x,z.y,z.x,z.y,z.x,z.y];
            !(v[0]in{
                T:1,
                Q:1
            })&&(z.qx=z.qy=null);
            switch(v[0]){
                case "M":
                    z.X=v[1];
                    z.Y=v[2];
                    break;
                case "A":
                    v=["C"][M](Wa[O](0,[z.x,z.y][M](v.slice(1))));
                    break;
                case "S":
                    C=z.x+(z.x- (z.bx||z.x));
                    D=z.y+(z.y-(z.by||z.y));
                    v=["C",C,D][M](v.slice(1));
                    break;
                case "T":
                    z.qx=z.x+(z.x-(z.qx||z.x));
                    z.qy=z.y+(z.y-(z.qy||z.y));
                    v=["C"][M](Va(z.x,z.y,z.qx,z.qy,v[1],v[2]));
                    break;
                case "Q":
                    z.qx=v[1];
                    z.qy=v[2];
                    v=["C"][M](Va(z.x,z.y,v[1],v[2],v[3],v[4]));
                    break;
                case "L":
                    v=["C"][M]([z.x,z.y,v[1],v[2],v[1],v[2]]);
                    break;
                case "H":
                    v=["C"][M]([z.x,z.y,v[1],z.y,v[1],z.y]);
                    break;
                case "V":
                    v=["C"][M]([z.x,z.y,z.x,v[1],z.x,v[1]]);
                    break;
                case "Z":
                    v=["C"][M]([z.x,z.y,z.X,z.Y,z.X,z.Y])
            }
            return v
        },o=function(v,z){
            if(v[z].length> 7){
                v[z].shift();
                for(var C=v[z];C.length;)v.splice(z++,0,["C"][M](C.splice(0,6)));
                v.splice(z,1);
                x=e(c.length,d&&d.length||0)
            }
        },q=function(v,z,C,D,V){
            v&&z&&v[V][0]=="M"&&z[V][0]!="M"&&(z.splice(V,0,["M",D.x,D.y]),C.bx=0,C.by=0,C.x=v[V][1],C.y=v[V][2],x=e(c.length,d&&d.length||0))
        },u=0,x=e(c.length,d&&d.length||0);
        for(;u<x;u++){
            c[u]=j(c[u],f);
            o(c,u);
            d&&(d[u]=j(d[u],g));
            d&&o(d,u);
            q(c,d,f,g,u);
            q(d,c,g,f,u);
            var r=c[u],E=d&&d[u],A=r.length,H=d&&E.length;
            f.x=r[A-2];
            f.y=r[A-1];
            f.bx=L(r[A-4])||f.x;
            f.by=L(r[A- 3])||f.y;
            g.bx=d&&(L(E[H-4])||g.x);
            g.by=d&&(L(E[H-3])||g.y);
            g.x=d&&E[H-2];
            g.y=d&&E[H-1]
        }
        return d?[c,d]:c
    },null,wa);
    n._parseDots=S(function(a){
        for(var b=[],c=0,d=a.length;c<d;c++){
            var f={},g=a[c].match(/^([^:]*):?([\d\.]*)/);
            f.color=n.getRGB(g[1]);
            if(f.color.error)return null;
            f.color=f.color.hex;
            g[2]&&(f.offset=g[2]+"%");
            b.push(f)
        }
        c=1;
        for(d=b.length-1;c<d;c++)if(!b[c].offset){
            a=L(b[c-1].offset||0);
            g=0;
            for(f=c+1;f<d;f++)if(b[f].offset){
                g=b[f].offset;
                break
            }
            g||(g=100,f=d);
            g=L(g);
            for(g=(g-a)/(f-c+1);c< f;c++){
                a+=g;
                b[c].offset=a+"%"
            }
        }
        return b
    });
    var Aa=n._tear=function(a,b){
        a==b.top&&(b.top=a.prev);
        a==b.bottom&&(b.bottom=a.next);
        a.next&&(a.next.prev=a.prev);
        a.prev&&(a.prev.next=a.next)
    };
    
    n._tofront=function(a,b){
        b.top!==a&&(Aa(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)
    };
    
    n._toback=function(a,b){
        b.bottom!==a&&(Aa(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)
    };
    
    n._insertafter=function(a,b,c){
        Aa(a,c);
        b==c.top&&(c.top=a);
        b.next&&(b.next.prev=a);
        a.next=b.next;
        a.prev=b;
        b.next=a
    };
    
    n._insertbefore= function(a,b,c){
        Aa(a,c);
        b==c.bottom&&(c.bottom=a);
        b.prev&&(b.prev.next=a);
        a.prev=b.prev;
        b.prev=a;
        a.next=b
    };
    
    var ab=n._extractTransform=function(a,b){
        if(b==null)return a._.transform;
        b=T(b).replace(/\.{3}|\u2026/g,a._.transform||"");
        var c=n.parseTransformString(b),d=0,f=0,g=0,j=1,o=1,q=a._;
        g=new X;
        q.transform=c||[];
        if(c){
            f=0;
            for(var u=c.length;f<u;f++){
                var x=c[f],r=x.length,E=T(x[0]).toLowerCase(),A=x[0]!=E,H=A?g.invert():0,v,z,C,D,V;
                E=="t"&&r==3?A?(v=H.x(0,0),z=H.y(0,0),C=H.x(x[1],x[2]),D=H.y(x[1], x[2]),g.translate(C-v,D-z)):g.translate(x[1],x[2]):E=="r"?r==2?(V=V||a.getBBox(1),g.rotate(x[1],V.x+V.width/2,V.y+V.height/2),d+=x[1]):r==4&&(A?(C=H.x(x[2],x[3]),D=H.y(x[2],x[3]),g.rotate(x[1],C,D)):g.rotate(x[1],x[2],x[3]),d+=x[1]):E=="s"?r==2||r==3?(V=V||a.getBBox(1),g.scale(x[1],x[r-1],V.x+V.width/2,V.y+V.height/2),j*=x[1],o*=x[r-1]):r==5&&(A?(C=H.x(x[3],x[4]),D=H.y(x[3],x[4]),g.scale(x[1],x[2],C,D)):g.scale(x[1],x[2],x[3],x[4]),j*=x[1],o*=x[2]):E=="m"&&r==7&&g.add(x[1],x[2],x[3],x[4],x[5],x[6]);
                q.dirtyT=1;
                a.matrix=g
            }
        }
        a.matrix=g;
        q.sx=j;
        q.sy=o;
        q.deg=d;
        q.dx=f=g.e;
        q.dy=g=g.f;
        j==1&&o==1&&!d&&q.bbox?(q.bbox.x+=+f,q.bbox.y+=+g):q.dirtyT=1
    },Xa=function(a){
        var b=a[0];
        switch(b.toLowerCase()){
            case "t":
                return[b,0,0];
            case "m":
                return[b,1,0,0,1,0,0];
            case "r":
                return a.length==4?[b,0,a[2],a[3]]:[b,0];
            case "s":
                return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]
        }
    },$a=n._equaliseTransform=function(a,b){
        b=T(b).replace(/\.{3}|\u2026/g,a);
        a=n.parseTransformString(a)||[];
        b=n.parseTransformString(b)|| [];
        for(var c=e(a.length,b.length),d=[],f=[],g=0,j,o,q,u;g<c;g++){
            q=a[g]||Xa(b[g]);
            u=b[g]||Xa(q);
            if(q[0]!=u[0]||q[0].toLowerCase()=="r"&&(q[2]!=u[2]||q[3]!=u[3])||q[0].toLowerCase()=="s"&&(q[3]!=u[3]||q[4]!=u[4]))return;
            d[g]=[];
            f[g]=[];
            j=0;
            for(o=e(q.length,u.length);j<o;j++){
                j in q&&(d[g][j]=q[j]);
                j in u&&(f[g][j]=u[j])
            }
        }
        return{
            from:d,
            to:f
        }
    };

    n._getContainer=function(a,b,c,d){
        var f;
        f=d==null&&!n.is(a,"object")?G.doc.getElementById(a):a;
        if(f!=null){
            if(f.tagName)return b==null?{
                container:f,
                width:f.style.pixelWidth|| f.offsetWidth,
                height:f.style.pixelHeight||f.offsetHeight
            }:{
                container:f,
                width:b,
                height:c
            };
        
            return{
                container:1,
                x:a,
                y:b,
                width:c,
                height:d
            }
        }
    };

    n.pathToRelative=ja;
    n._engine={};

    n.path2curve=ua;
    n.matrix=function(a,b,c,d,f,g){
        return new X(a,b,c,d,f,g)
    };
    (function(a){
        function b(d){
            var f=p.sqrt(c(d));
            d[0]&&(d[0]/=f);
            d[1]&&(d[1]/=f)
        }
        function c(d){
            return d[0]*d[0]+d[1]*d[1]
        }
        a.add=function(d,f,g,j,o,q){
            var u=[[],[],[]],x=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]];
            f=[[d,g,o],[f,j,q],[0,0,1]];
            d&&d instanceof X&&(f=[[d.a,d.c,d.e],[d.b,d.d,d.f],[0,0,1]]);
            for(d=0;d<3;d++)for(g=0;g<3;g++){
                for(j=o=0;j<3;j++)o+=x[d][j]*f[j][g];
                u[d][g]=o
            }
            this.a=u[0][0];
            this.b=u[1][0];
            this.c=u[0][1];
            this.d=u[1][1];
            this.e=u[0][2];
            this.f=u[1][2]
        };
        
        a.invert=function(){
            var d=this.a*this.d-this.b*this.c;
            return new X(this.d/d,-this.b/d,-this.c/d,this.a/d,(this.c*this.f-this.d*this.e)/d,(this.b*this.e-this.a*this.f)/d)
        };
        
        a.clone=function(){
            return new X(this.a,this.b,this.c,this.d,this.e,this.f)
        };
        
        a.translate=function(d,f){
            this.add(1,0, 0,1,d,f)
        };
        
        a.scale=function(d,f,g,j){
            f==null&&(f=d);
            (g||j)&&this.add(1,0,0,1,g,j);
            this.add(d,0,0,f,0,0);
            (g||j)&&this.add(1,0,0,1,-g,-j)
        };
        
        a.rotate=function(d,f,g){
            d=n.rad(d);
            f=f||0;
            g=g||0;
            var j=+p.cos(d).toFixed(9);
            d=+p.sin(d).toFixed(9);
            this.add(j,d,-d,j,f,g);
            this.add(1,0,0,1,-f,-g)
        };
        
        a.x=function(d,f){
            return d*this.a+f*this.c+this.e
        };
        
        a.y=function(d,f){
            return d*this.b+f*this.d+this.f
        };
        
        a.get=function(d){
            return+this[T.fromCharCode(97+d)].toFixed(4)
        };
        
    a.toString=function(){
        return n.svg?"matrix("+[(this.get(0)-0.5), (this.get(1)-0.334),(this.get(2)+0.134),(this.get(3)-0.5),(this.get(4)+4.2404),(this.get(5)+43.4067)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()
        };
        
    a.toFilter=function(){
        return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"
        };
        
        a.offset=function(){
            return[this.e.toFixed(4),this.f.toFixed(4)]
        };
        
        a.split=function(){
            var d={};
        
            d.dx=this.e;
            d.dy=this.f;
            var f=[[this.a,this.c],[this.b, this.d]];
            d.scalex=p.sqrt(c(f[0]));
            b(f[0]);
            d.shear=f[0][0]*f[1][0]+f[0][1]*f[1][1];
            f[1]=[f[1][0]-f[0][0]*d.shear,f[1][1]-f[0][1]*d.shear];
            d.scaley=p.sqrt(c(f[1]));
            b(f[1]);
            d.shear/=d.scaley;
            var g=-f[0][1];
            f=f[1][1];
            f<0?(d.rotate=n.deg(p.acos(f)),g<0&&(d.rotate=360-d.rotate)):d.rotate=n.deg(p.asin(g));
            d.isSimple=!+d.shear.toFixed(9)&&(d.scalex.toFixed(9)==d.scaley.toFixed(9)||!d.rotate);
            d.isSuperSimple=!+d.shear.toFixed(9)&&d.scalex.toFixed(9)==d.scaley.toFixed(9)&&!d.rotate;
            d.noRotation=!+d.shear.toFixed(9)&& !d.rotate;
            return d
        };
        
        a.toTransformString=function(d){
            d=d||this[ha]();
            if(d.isSimple){
                d.scalex=+d.scalex.toFixed(4);
                d.scaley=+d.scaley.toFixed(4);
                d.rotate=+d.rotate.toFixed(4);
                return(d.dx&&d.dy?"t"+[d.dx,d.dy]:"")+(d.scalex!=1||d.scaley!=1?"s"+[d.scalex,d.scaley,0,0]:"")+(d.rotate?"r"+[d.rotate,0,0]:"")
            }
            return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]
        }
    })(X.prototype);
    ja=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);
    navigator.vendor== "Apple Computer, Inc."&&(ja&&ja[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&ja&&ja[1]<8?K.safari=function(){
        var a=this.rect(-99,-99,this.width+99,this.height+99).attr({
            stroke:"none"
        });
        setTimeout(function(){
            a.remove()
        })
    }:K.safari=xa;
    var kb=function(){
        this.returnValue=false
    },lb=function(){
        return this.originalEvent.preventDefault()
    },mb=function(){
        this.cancelBubble=true
    },nb=function(){
        return this.originalEvent.stopPropagation()
    },ob=function(){
        if(G.doc.addEventListener)return function(a, b,c,d){
            var f=la&&i[b]?i[b]:b,g=function(j){
                var o=j.clientX+(G.doc.documentElement.scrollLeft||G.doc.body.scrollLeft),q=j.clientY+(G.doc.documentElement.scrollTop||G.doc.body.scrollTop);
                if(la&&i[N](b))for(var u=0,x=j.targetTouches&&j.targetTouches.length;u<x;u++)if(j.targetTouches[u].target==a){
                    x=j;
                    j=j.targetTouches[u];
                    j.originalEvent=x;
                    j.preventDefault=lb;
                    j.stopPropagation=nb;
                    break
                }
                return c.call(d,j,o,q)
            };
            
            a.addEventListener(f,g,false);
            return function(){
                a.removeEventListener(f,g,false);
                return true
            }
        };    
        if(G.doc.attachEvent)return function(a,b,c,d){
            var f=function(g){
                g=g||G.win.event;
                var j=g.clientX+(G.doc.documentElement.scrollLeft||G.doc.body.scrollLeft),o=g.clientY+(G.doc.documentElement.scrollTop||G.doc.body.scrollTop);
                g.preventDefault=g.preventDefault||kb;
                g.stopPropagation=g.stopPropagation||mb;
                return c.call(d,g,j,o)
            };
        
            a.attachEvent("on"+b,f);
            return function(){
                a.detachEvent("on"+b,f);
                return true
            }
        }
    }(),qa=[],Ga=function(a){
        for(var b=a.clientX,c=a.clientY,d=G.doc.documentElement.scrollTop||G.doc.body.scrollTop, f=G.doc.documentElement.scrollLeft||G.doc.body.scrollLeft,g,j=qa.length;j--;){
            g=qa[j];
            if(la)for(var o=a.touches.length,q;o--;){
                q=a.touches[o];
                if(q.identifier==g.el._drag.id){
                    b=q.clientX;
                    c=q.clientY;
                    (a.originalEvent?a.originalEvent:a).preventDefault();
                    break
                }
            }else a.preventDefault();
            o=g.el.node;
            var u=o.nextSibling,x=o.parentNode,r=o.style.display;
            G.win.opera&&x.removeChild(o);
            o.style.display="none";
            q=g.el.paper.getElementByPoint(b,c);
            o.style.display=r;
            G.win.opera&&(u?x.insertBefore(o,u):x.appendChild(o));
            q&&eve("drag.over."+g.el.id,g.el,q);
            b+=f;
            c+=d;
            eve("drag.move."+g.el.id,g.move_scope||g.el,b-g.el._drag.x,c-g.el._drag.y,b,c,a)
        }
    },Ha=function(a){
        n.unmousemove(Ga).unmouseup(Ha);
        for(var b=qa.length,c;b--;){
            c=qa[b];
            c.el._drag={};
        
            eve("drag.end."+c.el.id,c.end_scope||c.start_scope||c.move_scope||c.el,a)
        }
        qa=[]
    },aa=n.el={};

    for(xa=J.length;xa--;)(function(a){
        n[a]=aa[a]=function(b,c){
            n.is(b,"function")&&(this.events=this.events||[],this.events.push({
                name:a,
                f:b,
                unbind:ob(this.shape||this.node||G.doc,a,b,c|| this)
            }));
            return this
        };
        
        n["un"+a]=aa["un"+a]=function(b){
            for(var c=this.events,d=c.length;d--;)if(c[d].name==a&&c[d].f==b){
                c[d].unbind();
                c.splice(d,1);
                !c.length&&delete this.events;
                break
            }
            return this
        }
    })(J[xa]);
    aa.data=function(a,b){
        var c=va[this.id]=va[this.id]||{};
    
        if(arguments.length==1){
            if(n.is(a,"object")){
                for(var d in a)a[N](d)&&this.data(d,a[d]);return this
            }
            eve("data.get."+this.id,this,c[a],a);
            return c[a]
        }
        c[a]=b;
        eve("data.set."+this.id,this,b,a);
        return this
    };
    
    aa.removeData=function(a){
        a==null?va[this.id]= {}:va[this.id]&&delete va[this.id][a];
        return this
    };
    
    aa.hover=function(a,b,c,d){
        return this.mouseover(a,c).mouseout(b,d||c)
    };
    
    aa.unhover=function(a,b){
        return this.unmouseover(a).unmouseout(b)
    };
    
    var sa=[];
    aa.drag=function(a,b,c,d,f,g){
        function j(o){
            (o.originalEvent||o).preventDefault();
            var q=G.doc.documentElement.scrollTop||G.doc.body.scrollTop,u=G.doc.documentElement.scrollLeft||G.doc.body.scrollLeft;
            this._drag.x=o.clientX+u;
            this._drag.y=o.clientY+q;
            this._drag.id=o.identifier;
            !qa.length&&n.mousemove(Ga).mouseup(Ha);
            qa.push({
                el:this,
                move_scope:d,
                start_scope:f,
                end_scope:g
            });
            b&&eve.on("drag.start."+this.id,b);
            a&&eve.on("drag.move."+this.id,a);
            c&&eve.on("drag.end."+this.id,c);
            eve("drag.start."+this.id,f||d||this,o.clientX+u,o.clientY+q,o)
        }
        this._drag={};
    
        sa.push({
            el:this,
            start:j
        });
        this.mousedown(j);
        return this
    };
    
    aa.onDragOver=function(a){
        a?eve.on("drag.over."+this.id,a):eve.unbind("drag.over."+this.id)
    };
    
    aa.undrag=function(){
        for(var a=sa.length;a--;)sa[a].el==this&&(this.unmousedown(sa[a].start),sa.splice(a,1),eve.unbind("drag.*."+ this.id));
        !sa.length&&n.unmousemove(Ga).unmouseup(Ha)
    };
    
    K.circle=function(a,b,c){
        a=n._engine.circle(this,a||0,b||0,c||0);
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    K.rect=function(a,b,c,d,f){
        a=n._engine.rect(this,a||0,b||0,c||0,d||0,f||0);
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    K.ellipse=function(a,b,c,d){
        a=n._engine.ellipse(this,a||0,b||0,c||0,d||0);
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    K.path=function(a){
        a&&!n.is(a,"string")&&!n.is(a[0],y)&&(a+="");
        var b=n._engine.path(n.format[O](n, arguments),this);
        this.__set__&&this.__set__.push(b);
        return b
    };
    
    K.image=function(a,b,c,d,f){
        a=n._engine.image(this,a||"about:blank",b||0,c||0,d||0,f||0);
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    K.text=function(a,b,c){
        a=n._engine.text(this,a||0,b||0,T(c));
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    K.set=function(a){
        !n.is(a,"array")&&(a=Array.prototype.splice.call(arguments,0,arguments.length));
        var b=new ta(a);
        this.__set__&&this.__set__.push(b);
        return b
    };
    
    K.setStart=function(a){
        this.__set__=a||this.set()
    };    
    K.setFinish=function(){
        var a=this.__set__;
        delete this.__set__;
        return a
    };
    
    K.setSize=function(a,b){
        return n._engine.setSize.call(this,a,b)
    };
    
    K.setViewBox=function(a,b,c,d,f){
        return n._engine.setViewBox.call(this,a,b,c,d,f)
    };
    
    K.top=K.bottom=null;
    K.raphael=n;
    K.getElementByPoint=function(a,b){
        var c=this.canvas,d=G.doc.elementFromPoint(a,b);
        if(G.win.opera&&d.tagName=="svg"){
            var f;
            f=c.getBoundingClientRect();
            var g=c.ownerDocument,j=g.body;
            g=g.documentElement;
            f={
                y:f.top+(G.win.pageYOffset||g.scrollTop||j.scrollTop)- (g.clientTop||j.clientTop||0),
                x:f.left+(G.win.pageXOffset||g.scrollLeft||j.scrollLeft)-(g.clientLeft||j.clientLeft||0)
            };
            
            j=c.createSVGRect();
            j.x=a-f.x;
            j.y=b-f.y;
            j.width=j.height=1;
            f=c.getIntersectionList(j,null);
            f.length&&(d=f[f.length-1])
        }
        if(!d)return null;
        for(;d.parentNode&&d!=c.parentNode&&!d.raphael;)d=d.parentNode;
        d==this.canvas.parentNode&&(d=c);
        return d=d&&d.raphael?this.getById(d.raphaelid):null
    };
    
    K.getById=function(a){
        for(var b=this.bottom;b;){
            if(b.id==a)return b;
            b=b.next
        }
        return null
    };
    
    K.forEach= function(a,b){
        for(var c=this.bottom;c;){
            if(a.call(b,c)===false)break;
            c=c.next
        }
        return this
    };
    
    aa.getBBox=function(a){
        if(this.removed)return{};
        
        var b=this._;
        if(a){
            if(b.dirty||!b.bboxwt){
                this.realPath=Fa[this.type](this);
                b.bboxwt=Ta(this.realPath);
                b.bboxwt.toString=ka;
                b.dirty=0
            }
            return b.bboxwt
        }
        if(b.dirty||b.dirtyT||!b.bbox){
            if(b.dirty||!this.realPath){
                b.bboxwt=0;
                this.realPath=Fa[this.type](this)
            }
            b.bbox=Ta(Pa(this.realPath,this.matrix));
            b.bbox.toString=ka;
            b.dirty=b.dirtyT=0
        }
        return b.bbox
    };
    
    aa.clone=function(){
        if(this.removed)return null;
        var a=this.paper[this.type]().attr(this.attr());
        this.__set__&&this.__set__.push(a);
        return a
    };
    
    aa.glow=function(a){
        if(this.type=="text")return null;
        a=a||{};
    
        a={
            width:(a.width||10)+(+this.attr("stroke-width")||1),
            fill:a.fill||false,
            opacity:a.opacity||0.5,
            offsetx:a.offsetx||0,
            offsety:a.offsety||0,
            color:a.color||"#000"
        };
        
        var b=a.width/2,c=this.paper,d=c.set(),f=this.realPath||Fa[this.type](this);
        f=this.matrix?Pa(f,this.matrix):f;
        for(var g=1;g<b+1;g++)d.push(c.path(f).attr({
            stroke:a.color,
            fill:a.fill?a.color: "none",
            "stroke-linejoin":"round",
            "stroke-linecap":"round",
            "stroke-width":+(a.width/b*g).toFixed(3),
            opacity:+(a.opacity/b).toFixed(3)
        }));
        return d.insertBefore(this).translate(a.offsetx,a.offsety)
    };
    
    var Ia={},Ba=function(a,b,c,d,f,g,j,o,q){
        var u=0,x=100,r=[a,b,c,d,f,g,j,o].join(),E=Ia[r],A,H;
        !E&&(Ia[r]=E={
            data:[]
        });
        E.timer&&clearTimeout(E.timer);
        E.timer=setTimeout(function(){
            delete Ia[r]
        },2E3);
        if(q!=null&&!E.precision){
            var v=Ba(a,b,c,d,f,g,j,o);
            E.precision=~~v*10;
            E.data=[]
        }
        x=E.precision||x;
        for(v=0;v< x+1;v++){
            E.data[v*x]?H=E.data[v*x]:(H=n.findDotsAtSegment(a,b,c,d,f,g,j,o,v/x),E.data[v*x]=H);
            v&&(u+=l(l(A.x-H.x,2)+l(A.y-H.y,2),0.5));
            if(q!=null&&u>=q)return H;
            A=H
        }
        if(q==null)return u
    };
        
    J=function(a,b){
        return function(c,d,f){
            c=ua(c);
            for(var g,j,o,q,u="",x={},r=0,E=0,A=c.length;E<A;E++){
                o=c[E];
                if(o[0]=="M"){
                    g=+o[1];
                    j=+o[2]
                }else{
                    q=Ba(g,j,o[1],o[2],o[3],o[4],o[5],o[6]);
                    if(r+q>d){
                        if(b&&!x.start){
                            g=Ba(g,j,o[1],o[2],o[3],o[4],o[5],o[6],d-r);
                            u+=["C"+g.start.x,g.start.y,g.m.x,g.m.y,g.x,g.y];
                            if(f)return u;
                            x.start=u;
                            u=["M"+g.x,g.y+"C"+g.n.x,g.n.y,g.end.x,g.end.y,o[5],o[6]].join();
                            r+=q;
                            g=+o[5];
                            j=+o[6];
                            continue
                        }
                        if(!a&&!b){
                            g=Ba(g,j,o[1],o[2],o[3],o[4],o[5],o[6],d-r);
                            return{
                                x:g.x,
                                y:g.y,
                                alpha:g.alpha
                            }
                        }
                    }
                    r+=q;
                    g=+o[5];
                    j=+o[6]
                }
                u+=o.shift()+o
            }
            x.end=u;
            g=a?r:b?x:n.findDotsAtSegment(g,j,o[0],o[1],o[2],o[3],o[4],o[5],1);
            g.alpha&&(g={
                x:g.x,
                y:g.y,
                alpha:g.alpha
            });
            return g
        }
    };

    var Ya=J(1),Za=J(),Ja=J(0,1);
    n.getTotalLength=Ya;
    n.getPointAtLength=Za;
    n.getSubpath=function(a,b,c){
        if(this.getTotalLength(a)-c<1.0E-6)return Ja(a, b).end;
        a=Ja(a,c,1);
        return b?Ja(a,b).end:a
    };
    
    aa.getTotalLength=function(){
        if(this.type=="path"){
            if(this.node.getTotalLength)return this.node.getTotalLength();
            return Ya(this.attrs.path)
        }
    };

    aa.getPointAtLength=function(a){
        if(this.type=="path")return Za(this.attrs.path,a)
    };
        
    aa.getSubpath=function(a,b){
        if(this.type=="path")return n.getSubpath(this.attrs.path,a,b)
    };
        
    J=n.easing_formulas={
        linear:function(a){
            return a
        },
        "<":function(a){
            return l(a,1.7)
        },
        ">":function(a){
            return l(a,0.48)
        },
        "<>":function(a){
            var b=0.48- a/1.04,c=p.sqrt(0.1734+b*b);
            a=c-b;
            a=l(k(a),1/3)*(a<0?-1:1);
            b=-c-b;
            b=l(k(b),1/3)*(b<0?-1:1);
            a=a+b+0.5;
            return(1-a)*3*a*a+a*a*a
        },
        backIn:function(a){
            return a*a*(2.70158*a-1.70158)
        },
        backOut:function(a){
            a-=1;
            return a*a*(2.70158*a+1.70158)+1
        },
        elastic:function(a){
            if(a==!!a)return a;
            return l(2,-10*a)*p.sin((a-0.075)*2*m/0.3)+1
        },
        bounce:function(a){
            var b;
            a<1/2.75?b=7.5625*a*a:a<2/2.75?(a-=1.5/2.75,b=7.5625*a*a+0.75):a<2.5/2.75?(a-=2.25/2.75,b=7.5625*a*a+0.9375):(a-=2.625/2.75,b=7.5625*a*a+0.984375);
            return b
        }
    };
    J.easeIn=J["ease-in"]=J["<"];
    J.easeOut=J["ease-out"]=J[">"];
    J.easeInOut=J["ease-in-out"]=J["<>"];
    J["back-in"]=J.backIn;
    J["back-out"]=J.backOut;
    var ba=[],Ma=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){
        setTimeout(a,16)
    },Da=function(){
        for(var a=+new Date,b=0;b<ba.length;b++){
            var c=ba[b];
            if(!(c.el.removed||c.paused)){
                var d=a-c.start,f=c.ms,g=c.easing,j=c.from,o=c.diff,q=c.to, u=c.el,x={},r,E={},A;
                c.initstatus?(d=(c.initstatus*c.anim.top-c.prev)/(c.percent-c.prev)*f,c.status=c.initstatus,delete c.initstatus,c.stop&&ba.splice(b--,1)):c.status=(c.prev+(c.percent-c.prev)*(d/f))/c.anim.top;
                if(!(d<0))if(d<f){
                    var H=g(d/f),v;
                    for(v in j)if(j[N](v)){
                        switch(ma[v]){
                            case w:
                                r=+j[v]+H*f*o[v];
                                break;
                            case "colour":
                                r="rgb("+[Ka(Z(j[v].r+H*f*o[v].r)),Ka(Z(j[v].g+H*f*o[v].g)),Ka(Z(j[v].b+H*f*o[v].b))].join(",")+")";
                                break;
                            case "path":
                                r=[];
                                d=0;
                                for(g=j[v].length;d<g;d++){
                                    r[d]=[j[v][d][0]];
                                    q= 1;
                                    for(E=j[v][d].length;q<E;q++)r[d][q]=+j[v][d][q]+H*f*o[v][d][q];
                                    r[d]=r[d].join(fa)
                                }
                                r=r.join(fa);
                                break;
                            case "transform":
                                if(o[v].real){
                                    r=[];
                                    d=0;
                                    for(g=j[v].length;d<g;d++){
                                        r[d]=[j[v][d][0]];
                                        q=1;
                                        for(E=j[v][d].length;q<E;q++)r[d][q]=j[v][d][q]+H*f*o[v][d][q]
                                    }
                                }else{
                                    r=function(z){
                                        return+j[v][z]+H*f*o[v][z]
                                    };
                                
                                    r=[["m",r(0),r(1),r(2),r(3),r(4),r(5)]]
                                }
                                break;
                            case "csv":
                                if(v=="clip-rect"){
                                    r=[];
                                    for(d=4;d--;)r[d]=+j[v][d]+H*f*o[v][d]
                                }
                                break;
                            default:
                                g=[][M](j[v]);
                                r=[];
                                for(d=u.paper.customAttributes[v].length;d--;)r[d]= +g[d]+H*f*o[v][d]
                        }
                        x[v]=r
                    }
                    u.attr(x);
                    (function(z,C,D){
                        setTimeout(function(){
                            eve("anim.frame."+z,C,D)
                        })
                    })(u.id,u,c.anim)
                }else{
                    (function(z,C,D){
                        setTimeout(function(){
                            eve("anim.frame."+C.id,C,D);
                            eve("anim.finish."+C.id,C,D);
                            n.is(z,"function")&&z.call(C)
                        })
                    })(c.callback,u,c.anim);
                    u.attr(q);
                    ba.splice(b--,1);
                    if(c.repeat>1&&!c.next){
                        for(A in q)q[N](A)&&(E[A]=c.totalOrigin[A]);c.el.attr(E);
                        s(c.anim,c.el,c.anim.percents[0],null,c.totalOrigin,c.repeat-1)
                    }
                    c.next&&!c.stop&&s(c.anim,c.el,c.next,null,c.totalOrigin, c.repeat)
                }
            }
        }
        n.svg&&u&&u.paper&&u.paper.safari();
        ba.length&&Ma(Da)
    },Ka=function(a){
        return a>255?255:a<0?0:a
    };
    
    aa.animateWith=function(a,b,c,d,f,g){
        c=c?n.animation(c,d,f,g):b;
        a=a.status(b);
        return this.animate(c).status(c,a*b.ms/c.ms)
    };
    
    aa.onAnimation=function(a){
        a?eve.on("anim.frame."+this.id,a):eve.unbind("anim.frame."+this.id);
        return this
    };
    
    P.prototype.delay=function(a){
        var b=new P(this.anim,this.ms);
        b.times=this.times;
        b.del=+a||0;
        return b
    };
    
    P.prototype.repeat=function(a){
        var b=new P(this.anim,this.ms);
        b.del=this.del;
        b.times=p.floor(e(a,0))||1;
        return b
    };
    
    n.animation=function(a,b,c,d){
        if(a instanceof P)return a;
        if(n.is(c,"function")||!c){
            d=d||c||null;
            c=null
        }
        a=Object(a);
        b=+b||0;
        var f={},g,j;
        for(j in a)a[N](j)&&L(j)!=j&&L(j)+"%"!=j&&(g=true,f[j]=a[j]);if(!g)return new P(a,b);
        c&&(f.easing=c);
        d&&(f.callback=d);
        return new P({
            100:f
        },b)
    };
    
    aa.animate=function(a,b,c,d){
        if(this.removed){
            d&&d.call(this);
            return this
        }
        a=a instanceof P?a:n.animation(a,b,c,d);
        s(a,this,a.percents[0],null,this.attr());
        return this
    };    
    aa.setTime=function(a,b){
        a&&b!=null&&this.status(a,h(b,a.ms)/a.ms);
        return this
    };
    
    aa.status=function(a,b){
        var c=[],d=0,f,g;
        if(b!=null){
            s(a,this,-1,h(b,1));
            return this
        }
        for(f=ba.length;d<f;d++){
            g=ba[d];
            if(g.el.id==this.id&&(!a||g.anim==a)){
                if(a)return g.status;
                c.push({
                    anim:g.anim,
                    status:g.status
                })
            }
        }
        if(a)return 0;
        return c
    };

    aa.pause=function(a){
        for(var b=0;b<ba.length;b++)ba[b].el.id==this.id&&(!a||ba[b].anim==a)&&eve("anim.pause."+this.id,this,ba[b].anim)!==false&&(ba[b].paused=true);
        return this
    };
    
    aa.resume= function(a){
        for(var b=0;b<ba.length;b++)if(ba[b].el.id==this.id&&(!a||ba[b].anim==a)){
            var c=ba[b];
            eve("anim.resume."+this.id,this,c.anim)!==false&&(delete c.paused,this.status(c.anim,c.status))
        }
        return this
    };
    
    aa.stop=function(a){
        for(var b=0;b<ba.length;b++)ba[b].el.id==this.id&&(!a||ba[b].anim==a)&&eve("anim.stop."+this.id,this,ba[b].anim)!==false&&ba.splice(b--,1);
        return this
    };
    
    aa.toString=function(){
        return"Rapha\u00ebl\u2019s object"
    };
    
    var ta=function(a){
        this.items=[];
        this.length=0;
        this.type="set";
        if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==aa.constructor||a[b].constructor==ta)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)
    };
        
    J=ta.prototype;
    J.push=function(){
        for(var a,b,c=0,d=arguments.length;c<d;c++)(a=arguments[c])&&(a.constructor==aa.constructor||a.constructor==ta)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);
        return this
    };
    
    J.pop=function(){
        this.length&&delete this[this.length--];
        return this.items.pop()
    };
    
    J.forEach=function(a,b){
        for(var c= 0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===false)break;return this
    };
    
    for(var La in aa)aa[N](La)&&(J[La]=function(a){
        return function(){
            var b=arguments;
            return this.forEach(function(c){
                c[a][O](c,b)
            })
        }
    }(La));J.attr=function(a,b){
        if(a&&n.is(a,y)&&n.is(a[0],"object"))for(var c=0,d=a.length;c<d;c++)this.items[c].attr(a[c]);
        else{
            c=0;
            for(d=this.items.length;c<d;c++)this.items[c].attr(a,b)
        }
        return this
    };
    
    J.clear=function(){
        for(;this.length;)this.pop()
    };
        
    J.splice=function(a,b){
        a=a<0?e(this.length+ a,0):a;
        b=e(0,h(this.length-a,b));
        var c=[],d=[],f=[],g;
        for(g=2;g<arguments.length;g++)f.push(arguments[g]);
        for(g=0;g<b;g++)d.push(this[a+g]);
        for(;g<this.length-a;g++)c.push(this[a+g]);
        var j=f.length;
        for(g=0;g<j+c.length;g++)this.items[a+g]=this[a+g]=g<j?f[g]:c[g-j];
        for(g=this.items.length=this.length-=b-j;this[g];)delete this[g++];
        return new ta(d)
    };
    
    J.exclude=function(a){
        for(var b=0,c=this.length;b<c;b++)if(this[b]==a){
            this.splice(b,1);
            return true
        }
    };
    
    J.animate=function(a,b,c,d){
        (n.is(c,"function")|| !c)&&(d=c||null);
        var f=this.items.length,g=f,j=this,o;
        if(!f)return this;
        d&&(o=function(){
            !--f&&d.call(j)
        });
        c=n.is(c,"string")?c:o;
        b=n.animation(a,b,c,o);
        for(a=this.items[--g].animate(b);g--;)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(a,b);
        return this
    };
    
    J.insertAfter=function(a){
        for(var b=this.items.length;b--;)this.items[b].insertAfter(a);
        return this
    };
    
    J.getBBox=function(){
        for(var a=[],b=[],c=[],d=[],f=this.items.length;f--;)if(!this.items[f].removed){
            var g=this.items[f].getBBox();
            a.push(g.x);
            b.push(g.y);
            c.push(g.x+g.width);
            d.push(g.y+g.height)
        }
        a=h[O](0,a);
        b=h[O](0,b);
        return{
            x:a,
            y:b,
            width:e[O](0,c)-a,
            height:e[O](0,d)-b
        }
    };

    J.clone=function(a){
        a=new ta;
        for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());
        return a
    };
    
    J.toString=function(){
        return"Rapha\u00ebl\u2018s set"
    };
    
    n.registerFont=function(a){
        if(!a.face)return a;
        this.fonts=this.fonts||{};
    
        var b={
            w:a.w,
            face:{},
            glyphs:{}
        },c=a.face["font-family"],d;
        for(d in a.face)a.face[N](d)&&(b.face[d]=a.face[d]);this.fonts[c]? this.fonts[c].push(b):this.fonts[c]=[b];
        if(!a.svg){
            b.face["units-per-em"]=da(a.face["units-per-em"],10);
            for(var f in a.glyphs)if(a.glyphs[N](f)){
                c=a.glyphs[f];
                b.glyphs[f]={
                    w:c.w,
                    k:{},
                    d:c.d&&"M"+c.d.replace(/[mlcxtrv]/g,function(j){
                        return{
                            l:"L",
                            c:"C",
                            x:"z",
                            t:"m",
                            r:"l",
                            v:"c"
                        }
                        [j]||"M"
                    })+"z"
                };
            
                if(c.k)for(var g in c.k)c[N](g)&&(b.glyphs[f].k[g]=c.k[g])
            }
        }
        return a
    };

    K.getFont=function(a,b,c,d){
        d=d||"normal";
        c=c||"normal";
        b=+b||{
            normal:400,
            bold:700,
            lighter:300,
            bolder:800
        }
        [b]||400;
        if(n.fonts){
            var f=n.fonts[a];
            if(!f){
                a=RegExp("(^|\\s)"+a.replace(/[^\w\d\s+!~.:_-]/g,"")+"(\\s|$)","i");
                for(var g in n.fonts)if(n.fonts[N](g)&&a.test(g)){
                    f=n.fonts[g];
                    break
                }
            }
            var j;
            if(f){
                g=0;
                for(a=f.length;g<a;g++){
                    j=f[g];
                    if(j.face["font-weight"]==b&&(j.face["font-style"]==c||!j.face["font-style"])&&j.face["font-stretch"]==d)break
                }
            }
            return j
        }
    };

    K.print=function(a,b,c,d,f,g,j){
        g=g||"middle";
        j=e(h(j||0,1),-1);
        var o=this.set(),q=T(c)[ha](""),u=0;
        n.is(d,c)&&(d=this.getFont(d));
        if(d){
            c=(f||16)/d.face["units-per-em"];
            var x=d.face.bbox[ha](W);
            f=+x[0];
            g=+x[1]+(g=="baseline"?x[3]-x[1]+ +d.face.descent:(x[3]-x[1])/2);
            x=0;
            for(var r=q.length;x<r;x++){
                var E=x&&d.glyphs[q[x-1]]||{},A=d.glyphs[q[x]];
                u+=x?(E.w||d.w)+(E.k&&E.k[q[x]]||0)+d.w*j:0;
                A&&A.d&&o.push(this.path(A.d).attr({
                    fill:"#000",
                    stroke:"none",
                    transform:[["t",u*c,0]]
                }))
            }
            o.transform(["...s",c,c,f,g,"t",(a-f)/c,(b-g)/c])
        }
        return o
    };
    
    K.add=function(a){
        if(n.is(a,"array"))for(var b=this.set(),c=0,d=a.length,f;c<d;c++){
            f=a[c]||{};
        
            I[N](f.type)&&b.push(this[f.type]().attr(f))
        }
        return b
    };
    
    n.format= function(a,b){
        var c=n.is(b,y)?[0][M](b):arguments;
        a&&n.is(a,"string")&&c.length-1&&(a=a.replace(B,function(d,f){
            return c[++f]==null?"":c[f]
        }));
        return a||""
    };
    
    n.fullfill=function(){
        var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(d,f,g){
            var j=g;
            f.replace(b,function(o,q,u,x,r){
                q=q||x;
                j&&(q in j&&(j=j[q]),typeof j=="function"&&r&&(j=j()))
            });
            return j=(j==null||j==g?d:j)+""
        };
        
        return function(d,f){
            return String(d).replace(a,function(g,j){
                return c(g,j,f)
            })
        }
    }();
    n.ninja=function(){
        $.was?G.win.Raphael=$.is:delete Raphael;
        return n
    };
    
    n.st=J;
    (function(a,b,c){
        function d(){
            /in/.test(a.readyState)?setTimeout(d,9):n.eve("DOMload")
        }
        a.readyState==null&&a.addEventListener&&(a.addEventListener(b,c=function(){
            a.removeEventListener(b,c,false);
            a.readyState="complete"
        },false),a.readyState="loading");
        d()
    })(document,"DOMContentLoaded");
    $.was?G.win.Raphael=n:Raphael=n;
    eve.on("DOMload",function(){
        U=true
    })
})();
window.Raphael.svg&&function(s){
    var P=String,Y=parseFloat,ka=parseInt,X=Math,ca=X.max,ia=X.abs,S=X.pow,n=/[, ]+/,U=s.eve,W={
        block:"M5,0 0,2.5 5,5z",
        classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",
        diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",
        open:"M6,1 1,3.5 6,6",
        oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
    },I={};
    
    s.toString=function(){
        return"Your browser supports SVG.\nYou are running Rapha\u00ebl "+this.version
    };
        
    var B=function(i,t){
        if(t){
            typeof i=="string"&&(i=B(i));
            for(var p in t)t.hasOwnProperty(p)&&(p.substring(0, 6)=="xlink:"?i.setAttributeNS("http://www.w3.org/1999/xlink",p.substring(6),P(t[p])):i.setAttribute(p,P(t[p])))
        }else{
            i=s._g.doc.createElementNS("http://www.w3.org/2000/svg",i);
            i.style&&(i.style.webkitTapHighlightColor="rgba(0,0,0,0)")
        }
        return i
    },N=function(i,t){
        var p="linear",e=i.id+t,h=0.5,k=0.5,l=i.node,m=i.paper,w=l.style,y=s._g.doc.getElementById(e);
        if(!y){
            t=P(t).replace(s._radial_gradient,function(R,ea,Z){
                p="radial";
                if(ea&&Z){
                    h=Y(ea);
                    k=Y(Z);
                    R=(k>0.5)*2-1;
                    S(h-0.5,2)+S(k-0.5,2)>0.25&&(k=X.sqrt(0.25- S(h-0.5,2))*R+0.5)&&k!=0.5&&(k=k.toFixed(5)-1.0E-5*R)
                }
                return""
            });
            t=t.split(/\s*\-\s*/);
            if(p=="linear"){
                y=t.shift();
                y=-Y(y);
                if(isNaN(y))return null;
                var F=[0,0,X.cos(s.rad(y)),X.sin(s.rad(y))];
                y=1/(ca(ia(F[2]),ia(F[3]))||1);
                F[2]*=y;
                F[3]*=y;
                F[2]<0&&(F[0]=-F[2],F[2]=0);
                F[3]<0&&(F[1]=-F[3],F[3]=0)
            }
            var Q=s._parseDots(t);
            if(!Q)return null;
            e=e.replace(/[\(\)\s,\xb0#]/g,"_");
            i.gradient&&e!=i.gradient.id&&(m.defs.removeChild(i.gradient),delete i.gradient);
            if(!i.gradient){
                y=B(p+"Gradient",{
                    id:e
                });
                i.gradient= y;
                B(y,p=="radial"?{
                    fx:h,
                    fy:k
                }:{
                    x1:F[0],
                    y1:F[1],
                    x2:F[2],
                    y2:F[3],
                    gradientTransform:i.matrix.invert()
                });
                m.defs.appendChild(y);
                m=0;
                for(F=Q.length;m<F;m++)y.appendChild(B("stop",{
                    offset:Q[m].offset?Q[m].offset:m?"100%":"0%",
                    "stop-color":Q[m].color||"#fff"
                }))
            }
        }
        B(l,{
            fill:"url(#"+e+")",
            opacity:1,
            "fill-opacity":1
        });
        w.fill="";
        w.opacity=1;
        return w.fillOpacity=1
    },G=function(i){
        var t=i.getBBox(1);
        B(i.pattern,{
            patternTransform:i.matrix.invert()+" translate("+t.x+","+t.y+")"
        })
    },$=function(i,t,p){
        if(i.type=="path"){
            for(var e= P(t).toLowerCase().split("-"),h=i.paper,k=p?"end":"start",l=i.node,m=i.attrs,w=m["stroke-width"],y=e.length,F="classic",Q,R,ea,Z,L,da=3,ga=3,pa=5;y--;)switch(e[y]){
                case "block":case "classic":case "oval":case "diamond":case "open":case "none":
                    F=e[y];
                    break;
                case "wide":
                    ga=5;
                    break;
                case "narrow":
                    ga=2;
                    break;
                case "long":
                    da=5;
                    break;
                case "short":
                    da=2
            }
            F=="open"?(da+=2,ga+=2,pa+=2,ea=1,Z=p?4:1,L={
                fill:"none",
                stroke:m.stroke
            }):(Z=ea=da/2,L={
                fill:m.stroke,
                stroke:"none"
            });
            i._.arrows?p?(i._.arrows.endPath&&I[i._.arrows.endPath]--, i._.arrows.endMarker&&I[i._.arrows.endMarker]--):(i._.arrows.startPath&&I[i._.arrows.startPath]--,i._.arrows.startMarker&&I[i._.arrows.startMarker]--):i._.arrows={};
        
            if(F!="none"){
                e="raphael-marker-"+F;
                y="raphael-marker-"+k+F+da+ga;
                s._g.doc.getElementById(e)?I[e]++:(h.defs.appendChild(B(B("path"),{
                    "stroke-linecap":"round",
                    d:W[F],
                    id:e
                })),I[e]=1);
                var ma=s._g.doc.getElementById(y),oa;
                ma?(I[y]++,oa=ma.getElementsByTagName("use")[0]):(ma=B(B("marker"),{
                    id:y,
                    markerHeight:ga,
                    markerWidth:da,
                    orient:"auto", 
                    refX:Z,
                    refY:ga/2
                }),oa=B(B("use"),{
                    "xlink:href":"#"+e,
                    transform:(p?" rotate(180 "+da/2+" "+ga/2+") ":" ")+"scale("+da/pa+","+ga/pa+")",
                    "stroke-width":1/((da/pa+ga/pa)/2)
                }),ma.appendChild(oa),h.defs.appendChild(ma),I[y]=1);
                B(oa,L);
                h=ea*(F!="diamond"&&F!="oval");
                p?(Q=i._.arrows.startdx*w||0,R=s.getTotalLength(m.path)-h*w):(Q=h*w,R=s.getTotalLength(m.path)-(i._.arrows.enddx*w||0));
                L={};
            
                L["marker-"+k]="url(#"+y+")";
                if(R||Q)L.d=Raphael.getSubpath(m.path,Q,R);
                B(l,L);
                i._.arrows[k+"Path"]=e;
                i._.arrows[k+"Marker"]= y;
                i._.arrows[k+"dx"]=h;
                i._.arrows[k+"Type"]=F;
                i._.arrows[k+"String"]=t
            }else{
                p?(Q=i._.arrows.startdx*w||0,R=s.getTotalLength(m.path)-Q):(Q=0,R=s.getTotalLength(m.path)-(i._.arrows.enddx*w||0));
                i._.arrows[k+"Path"]&&B(l,{
                    d:Raphael.getSubpath(m.path,Q,R)
                });
                delete i._.arrows[k+"Path"];
                delete i._.arrows[k+"Marker"];
                delete i._.arrows[k+"dx"];
                delete i._.arrows[k+"Type"];
                delete i._.arrows[k+"String"]
            }
            for(L in I)if(I.hasOwnProperty(L)&&!I[L])(i=s._g.doc.getElementById(L))&&i.parentNode.removeChild(i)
        }
    },K= {
        "":[0],
        none:[0],
        "-":[3,1],
        ".":[1,1],
        "-.":[3,1,1,1],
        "-..":[3,1,1,1,1,1],
        ". ":[1,3],
        "- ":[4,3],
        "--":[8,3],
        "- .":[4,3,1,3],
        "--.":[8,3,1,3],
        "--..":[8,3,1,3,1,3]
    },O=function(i,t,p){
        if(t=K[P(t).toLowerCase()]){
            var e=i.attrs["stroke-width"]||"1";
            p={
                round:e,
                square:e,
                butt:0
            }
            [i.attrs["stroke-linecap"]||p["stroke-linecap"]]||0;
            for(var h=[],k=t.length;k--;)h[k]=t[k]*e+(k%2?1:-1)*p;
            B(i.node,{
                "stroke-dasharray":h.join(",")
            })
        }
    },M=function(i,t){
        var p=i.node,e=i.attrs,h=p.style.visibility;
        p.style.visibility="hidden";
        for(var k in t)if(t.hasOwnProperty(k))if(s._availableAttrs.hasOwnProperty(k)){
            var l=t[k];
            e[k]=l;
            switch(k){
                case "blur":
                    i.blur(l);
                    break;
                case "href":case "title":case "target":
                    var m=p.parentNode;
                    if(m.tagName.toLowerCase()!="a"){
                        var w=B("a");
                        m.insertBefore(w,p);
                        w.appendChild(p);
                        m=w
                    }
                    k=="target"&&l=="blank"?m.setAttributeNS("http://www.w3.org/1999/xlink","show","new"):m.setAttributeNS("http://www.w3.org/1999/xlink",k,l);
                    break;
                case "cursor":
                    p.style.cursor=l;
                    break;
                case "transform":
                    i.transform(l);
                    break;
                case "arrow-start":
                    $(i, l);
                    break;
                case "arrow-end":
                    $(i,l,1);
                    break;
                case "clip-rect":
                    m=P(l).split(n);
                    if(m.length==4){
                        i.clip&&i.clip.parentNode.parentNode.removeChild(i.clip.parentNode);
                        w=B("clipPath");
                        var y=B("rect");
                        w.id=s.createUUID();
                        B(y,{
                            x:m[0],
                            y:m[1],
                            width:m[2],
                            height:m[3]
                        });
                        w.appendChild(y);
                        i.paper.defs.appendChild(w);
                        B(p,{
                            "clip-path":"url(#"+w.id+")"
                        });
                        i.clip=y
                    }
                    if(!l)if(l=p.getAttribute("clip-path")){
                        (l=s._g.doc.getElementById(l.replace(/(^url\(#|\)$)/g,"")))&&l.parentNode.removeChild(l);
                        B(p,{
                            "clip-path":""
                        });
                        delete i.clip
                    }
                    break;
                case "path":
                    i.type=="path"&&(B(p,{
                        d:l?e.path=s._pathToAbsolute(l):"M0,0"
                    }),i._.dirty=1,i._.arrows&&("startString"in i._.arrows&&$(i,i._.arrows.startString),"endString"in i._.arrows&&$(i,i._.arrows.endString,1)));
                    break;
                case "width":
                    p.setAttribute(k,l);
                    i._.dirty=1;
                    if(e.fx){
                        k="x";
                        l=e.x
                    }else break;case "x":
                    e.fx&&(l=-e.x-(e.width||0));
                case "rx":
                    if(k=="rx"&&i.type=="rect")break;case "cx":
                    p.setAttribute(k,l);
                    i.pattern&&G(i);
                    i._.dirty=1;
                    break;
                case "height":
                    p.setAttribute(k,l);
                    i._.dirty=1;
                    if(e.fy){
                        k="y";
                        l= e.y
                    }else break;case "y":
                    e.fy&&(l=-e.y-(e.height||0));
                case "ry":
                    if(k=="ry"&&i.type=="rect")break;case "cy":
                    p.setAttribute(k,l);
                    i.pattern&&G(i);
                    i._.dirty=1;
                    break;
                case "r":
                    i.type=="rect"?B(p,{
                        rx:l,
                        ry:l
                    }):p.setAttribute(k,l);
                    i._.dirty=1;
                    break;
                case "src":
                    i.type=="image"&&p.setAttributeNS("http://www.w3.org/1999/xlink","href",l);
                    break;
                case "stroke-width":
                    if(i._.sx!=1||i._.sy!=1)l/=ca(ia(i._.sx),ia(i._.sy))||1;
                    i.paper._vbSize&&(l*=i.paper._vbSize);
                    p.setAttribute(k,l);
                    e["stroke-dasharray"]&&O(i,e["stroke-dasharray"], t);
                    i._.arrows&&("startString"in i._.arrows&&$(i,i._.arrows.startString),"endString"in i._.arrows&&$(i,i._.arrows.endString,1));
                    break;
                case "stroke-dasharray":
                    O(i,l,t);
                    break;
                case "fill":
                    var F=P(l).match(s._ISURL);
                    if(F){
                        w=B("pattern");
                        var Q=B("image");
                        w.id=s.createUUID();
                        B(w,{
                            x:0,
                            y:0,
                            patternUnits:"userSpaceOnUse",
                            height:1,
                            width:1
                        });
                        B(Q,{
                            x:0,
                            y:0,
                            "xlink:href":F[1]
                        });
                        w.appendChild(Q);
                        (function(ea){
                            s._preload(F[1],function(){
                                var Z=this.offsetWidth,L=this.offsetHeight;
                                B(ea,{
                                    width:Z,
                                    height:L
                                });
                                B(Q,{
                                    width:Z, 
                                    height:L
                                });
                                i.paper.safari()
                            })
                        })(w);
                        i.paper.defs.appendChild(w);
                        p.style.fill="url(#"+w.id+")";
                        B(p,{
                            fill:"url(#"+w.id+")"
                        });
                        i.pattern=w;
                        i.pattern&&G(i);
                        break
                    }
                    m=s.getRGB(l);
                    if(m.error){
                        if((i.type=="circle"||i.type=="ellipse"||P(l).charAt()!="r")&&N(i,l)){
                            if("opacity"in e||"fill-opacity"in e)if(m=s._g.doc.getElementById(p.getAttribute("fill").replace(/^url\(#|\)$/g,""))){
                                var R=m.getElementsByTagName("stop");
                                B(R[R.length-1],{
                                    "stop-opacity":("opacity"in e?e.opacity:1)*("fill-opacity"in e?e["fill-opacity"]: 1)
                                })
                            }
                            e.gradient=l;
                            e.fill="none";
                            break
                        }
                    }else{
                        delete t.gradient;
                        delete e.gradient;
                        !s.is(e.opacity,"undefined")&&s.is(t.opacity,"undefined")&&B(p,{
                            opacity:e.opacity
                        });
                        !s.is(e["fill-opacity"],"undefined")&&s.is(t["fill-opacity"],"undefined")&&B(p,{
                            "fill-opacity":e["fill-opacity"]
                        })
                    }
                    m.hasOwnProperty("opacity")&&B(p,{
                        "fill-opacity":m.opacity>1?m.opacity/100:m.opacity
                    });
                case "stroke":
                    m=s.getRGB(l);
                    p.setAttribute(k,m.hex);
                    k=="stroke"&&m.hasOwnProperty("opacity")&&B(p,{
                        "stroke-opacity":m.opacity>1?m.opacity/ 100:m.opacity
                    });
                    k=="stroke"&&i._.arrows&&("startString"in i._.arrows&&$(i,i._.arrows.startString),"endString"in i._.arrows&&$(i,i._.arrows.endString,1));
                    break;
                case "gradient":
                    (i.type=="circle"||i.type=="ellipse"||P(l).charAt()!="r")&&N(i,l);
                    break;
                case "opacity":
                    e.gradient&&!e.hasOwnProperty("stroke-opacity")&&B(p,{
                        "stroke-opacity":l>1?l/100:l
                    });
                case "fill-opacity":
                    if(e.gradient){
                        (m=s._g.doc.getElementById(p.getAttribute("fill").replace(/^url\(#|\)$/g,"")))&&(R=m.getElementsByTagName("stop"),B(R[R.length- 1],{
                            "stop-opacity":l
                        }));
                        break
                    }
                default:
                    k=="font-size"&&(l=ka(l,10)+"px");
                    m=k.replace(/(\-.)/g,function(ea){
                        return ea.substring(1).toUpperCase()
                    });
                    p.style[m]=l;
                    i._.dirty=1;
                    p.setAttribute(k,l)
            }
        }
        la(i,t);
        p.style.visibility=h
    },la=function(i,t){
        if(i.type=="text"&&(t.hasOwnProperty("text")||t.hasOwnProperty("font")||t.hasOwnProperty("font-size")||t.hasOwnProperty("x")||t.hasOwnProperty("y"))){
            var p=i.attrs,e=i.node,h=e.firstChild?ka(s._g.doc.defaultView.getComputedStyle(e.firstChild,"").getPropertyValue("font-size"), 10):10;
            if(t.hasOwnProperty("text")){
                for(p.text=t.text;e.firstChild;)e.removeChild(e.firstChild);
                for(var k=P(t.text).split("\n"),l=[],m,w=0,y=k.length;w<y;w++){
                    m=B("tspan");
                    w&&B(m,{
                        dy:h*1.2,
                        x:p.x
                    });
                    m.appendChild(s._g.doc.createTextNode(k[w]));
                    e.appendChild(m);
                    l[w]=m
                }
            }else{
                l=e.getElementsByTagName("tspan");
                w=0;
                for(y=l.length;w<y;w++)w?B(l[w],{
                    dy:h*1.2,
                    x:p.x
                }):B(l[0],{
                    dy:0
                })
            }
            B(e,{
                x:p.x,
                y:p.y
            });
            i._.dirty=1;
            e=i._getBBox();
            (p=p.y-(e.y+e.height/2))&&s.is(p,"finite")&&B(l[0],{
                dy:p
            })
        }
    },fa=function(i,t){
        this[0]= this.node=i;
        i.raphael=true;
        this.id=s._oid++;
        i.raphaelid=this.id;
        this.matrix=s.matrix();
        this.realPath=null;
        this.paper=t;
        this.attrs=this.attrs||{};
    
        this._={
            transform:[],
            sx:1,
            sy:1,
            deg:0,
            dx:0,
            dy:0,
            dirty:1
        };
        !t.bottom&&(t.bottom=this);
        (this.prev=t.top)&&(t.top.next=this);
        t.top=this;
        this.next=null
    },T=s.el;
    fa.prototype=T;
    T.constructor=fa;
    s._engine.path=function(i,t){
        var p=B("path");
        t.canvas&&t.canvas.appendChild(p);
        p=new fa(p,t);
        p.type="path";
        M(p,{
            fill:"none",
            stroke:"#000",
            path:i
        });
        return p
    };
    
    T.rotate=function(i, t,p){
        if(this.removed)return this;
        i=P(i).split(n);
        i.length-1&&(t=Y(i[1]),p=Y(i[2]));
        i=Y(i[0]);
        p==null&&(t=p);
        if(t==null||p==null){
            p=this.getBBox(1);
            t=p.x+p.width/2;
            p=p.y+p.height/2
        }
        this.transform(this._.transform.concat([["r",i,t,p]]));
        return this
    };
    
    T.scale=function(i,t,p,e){
        if(this.removed)return this;
        i=P(i).split(n);
        i.length-1&&(t=Y(i[1]),p=Y(i[2]),e=Y(i[3]));
        i=Y(i[0]);
        t==null&&(t=i);
        e==null&&(p=e);
        if(p==null||e==null)var h=this.getBBox(1);
        p=p==null?h.x+h.width/2:p;
        e=e==null?h.y+h.height/2:e;
        this.transform(this._.transform.concat([["s", i,t,p,e]]));
        return this
    };
    
    T.translate=function(i,t){
        if(this.removed)return this;
        i=P(i).split(n);
        i.length-1&&(t=Y(i[1]));
        i=Y(i[0])||0;
        t=+t||0;
        this.transform(this._.transform.concat([["t",i,t]]));
        return this
    };
    
    T.transform=function(i){
        var t=this._;
        if(i==null)return t.transform;
        s._extractTransform(this,i);
        this.clip&&B(this.clip,{
            transform:this.matrix.invert()
        });
        this.pattern&&G(this);
        this.node&&B(this.node,{
            transform:this.matrix
        });
        if(t.sx!=1||t.sy!=1)this.attr({
            "stroke-width":this.attrs.hasOwnProperty("stroke-width")? this.attrs["stroke-width"]:1
        });
        return this
    };
    
    T.hide=function(){
        !this.removed&&this.paper.safari(this.node.style.display="none");
        return this
    };
    
    T.show=function(){
        !this.removed&&this.paper.safari(this.node.style.display="");
        return this
    };
    
    T.remove=function(){
        if(!this.removed){
            var i=this.paper;
            i.__set__&&i.__set__.exclude(this);
            U.unbind("*.*."+this.id);
            this.gradient&&i.defs.removeChild(this.gradient);
            s._tear(this,i);
            this.node.parentNode.removeChild(this.node);
            for(var t in this)this[t]=typeof this[t]=="function"? s._removedFactory(t):null;this.removed=true
        }
    };

    T._getBBox=function(){
        if(this.node.style.display=="none"){
            this.show();
            var i=true
        }
        var t={};
    
        try{
            t=this.node.getBBox()
        }catch(p){}finally{
            t=t||{}
        }
        i&&this.hide();
        return t
    };

    T.attr=function(i,t){
        if(this.removed)return this;
        if(i==null){
            var p={},e;
            for(e in this.attrs)this.attrs.hasOwnProperty(e)&&(p[e]=this.attrs[e]);p.gradient&&p.fill=="none"&&(p.fill=p.gradient)&&delete p.gradient;
            p.transform=this._.transform;
            return p
        }
        if(t==null&&s.is(i,"string")){
            if(i=="fill"&& this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;
            if(i=="transform")return this._.transform;
            e=i.split(n);
            p={};
        
            for(var h=0,k=e.length;h<k;h++){
                i=e[h];
                i in this.attrs?p[i]=this.attrs[i]:s.is(this.paper.customAttributes[i],"function")?p[i]=this.paper.customAttributes[i].def:p[i]=s._availableAttrs[i]
            }
            return k-1?p:p[e[0]]
        }
        if(t==null&&s.is(i,"array")){
            p={};
        
            h=0;
            for(k=i.length;h<k;h++)p[i[h]]=this.attr(i[h]);
            return p
        }
        if(t!=null){
            p={};
        
            p[i]=t
        }else i!=null&&s.is(i,"object")&&(p=i);
        for(h in p)U("attr."+ h+"."+this.id,this,p[h]);for(h in this.paper.customAttributes)if(this.paper.customAttributes.hasOwnProperty(h)&&p.hasOwnProperty(h)&&s.is(this.paper.customAttributes[h],"function")){
            e=this.paper.customAttributes[h].apply(this,[].concat(p[h]));
            this.attrs[h]=p[h];
            for(k in e)e.hasOwnProperty(k)&&(p[k]=e[k])
        }
        M(this,p);
        return this
    };
    
    T.toFront=function(){
        if(this.removed)return this;
        this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);
        var i=this.paper;
        i.top!=this&&s._tofront(this,i);
        return this
    };
    
    T.toBack=function(){
        if(this.removed)return this;
        var i=this.node.parentNode;
        i.tagName.toLowerCase()=="a"?i.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):i.firstChild!=this.node&&i.insertBefore(this.node,this.node.parentNode.firstChild);
        s._toback(this,this.paper);
        return this
    };
    
    T.insertAfter=function(i){
        if(this.removed)return this;
        var t=i.node||i[i.length-1].node;
        t.nextSibling?t.parentNode.insertBefore(this.node, t.nextSibling):t.parentNode.appendChild(this.node);
        s._insertafter(this,i,this.paper);
        return this
    };
    
    T.insertBefore=function(i){
        if(this.removed)return this;
        var t=i.node||i[0].node;
        t.parentNode.insertBefore(this.node,t);
        s._insertbefore(this,i,this.paper);
        return this
    };
    
    T.blur=function(i){
        if(+i!==0){
            var t=B("filter"),p=B("feGaussianBlur");
            this.attrs.blur=i;
            t.id=s.createUUID();
            B(p,{
                stdDeviation:+i||1.5
            });
            t.appendChild(p);
            this.paper.defs.appendChild(t);
            this._blur=t;
            B(this.node,{
                filter:"url(#"+t.id+")"
            })
        }else{
            this._blur&& (this._blur.parentNode.removeChild(this._blur),delete this._blur,delete this.attrs.blur);
            this.node.removeAttribute("filter")
        }
    };

    s._engine.circle=function(i,t,p,e){
        var h=B("circle");
        i.canvas&&i.canvas.appendChild(h);
        i=new fa(h,i);
        i.attrs={
            cx:t,
            cy:p,
            r:e,
            fill:"none",
            stroke:"#000"
        };
    
        i.type="circle";
        B(h,i.attrs);
        return i
    };
    
    s._engine.rect=function(i,t,p,e,h,k){
        var l=B("rect");
        i.canvas&&i.canvas.appendChild(l);
        i=new fa(l,i);
        i.attrs={
            x:t,
            y:p,
            width:e,
            height:h,
            r:k||0,
            rx:k||0,
            ry:k||0,
            fill:"none",
            stroke:"#000"
        };    
        i.type="rect";
        B(l,i.attrs);
        return i
    };
    
    s._engine.ellipse=function(i,t,p,e,h){
        var k=B("ellipse");
        i.canvas&&i.canvas.appendChild(k);
        i=new fa(k,i);
        i.attrs={
            cx:t,
            cy:p,
            rx:e,
            ry:h,
            fill:"none",
            stroke:"#000"
        };
    
        i.type="ellipse";
        B(k,i.attrs);
        return i
    };
    
    s._engine.image=function(i,t,p,e,h,k){
        var l=B("image");
        B(l,{
            x:p,
            y:e,
            width:h,
            height:k,
            preserveAspectRatio:"none"
        });
        l.setAttributeNS("http://www.w3.org/1999/xlink","href",t);
        i.canvas&&i.canvas.appendChild(l);
        i=new fa(l,i);
        i.attrs={
            x:p,
            y:e,
            width:h,
            height:k,
            src:t
        };
    
        i.type= "image";
        return i
    };
    
    s._engine.text=function(i,t,p,e){
        var h=B("text");
        i.canvas&&i.canvas.appendChild(h);
        i=new fa(h,i);
        i.attrs={
            x:t,
            y:p,
            "text-anchor":"middle",
            text:e,
            font:s._availableAttrs.font,
            stroke:"none",
            fill:"#000"
        };
    
        i.type="text";
        M(i,i.attrs);
        return i
    };
    
    s._engine.setSize=function(i,t){
        this.width=i||this.width;
        this.height=t||this.height;
        this.canvas.setAttribute("width",this.width);
        this.canvas.setAttribute("height",this.height);
        this._viewBox&&this.setViewBox.apply(this,this._viewBox);
        return this
    };
    
    s._engine.create= function(){
        var i=s._getContainer.apply(0,arguments),t=i&&i.container,p=i.x,e=i.y,h=i.width;
        i=i.height;
        if(!t)throw Error("SVG container not found.");
        var k=B("svg"),l;
        p=p||0;
        e=e||0;
        h=h||512;
        i=i||342;
        B(k,{
            height:i,
            version:1.1,
            width:h,
            xmlns:"http://www.w3.org/2000/svg"
        });
        t==1?(k.style.cssText="overflow:visible;position:absolute;left:"+p+"px;top:"+e+"px",s._g.doc.body.appendChild(k),l=1):(k.style.cssText="overflow:visible;position:relative",t.firstChild?t.insertBefore(k,t.firstChild):t.appendChild(k));
        t= new s._Paper;
        t.width=h;
        t.height=i;
        t.canvas=k;
        t.clear();
        t._left=t._top=0;
        l&&(t.renderfix=function(){});
        t.renderfix();
        return t
    };
    
    s._engine.setViewBox=function(i,t,p,e,h){
        U("setViewBox",this,this._viewBox,[i,t,p,e,h]);
        var k=ca(p/this.width,e/this.height),l=this.top,m=h?"meet":"xMinYMin",w;
        i==null?(this._vbSize&&(k=1),delete this._vbSize,w="0 0 "+this.width+" "+this.height):(this._vbSize=k,w=i+" "+t+" "+p+" "+e);
        for(B(this.canvas,{
            viewBox:w,
            preserveAspectRatio:m
        });k&&l;){
            m="stroke-width"in l.attrs?l.attrs["stroke-width"]: 1;
            l.attr({
                "stroke-width":m
            });
            l._.dirty=1;
            l._.dirtyT=1;
            l=l.prev
        }
        this._viewBox=[i,t,p,e,!!h];
        return this
    };
    
    s.prototype.renderfix=function(){
        var i=this.canvas,t=i.style,p=i.getScreenCTM()||i.createSVGMatrix();
        i=-p.e%1;
        p=-p.f%1;
        if(i||p){
            i&&(this._left=(this._left+i)%1,t.left=this._left+"px");
            p&&(this._top=(this._top+p)%1,t.top=this._top+"px")
        }
    };

    s.prototype.clear=function(){
        s.eve("clear",this);
        for(var i=this.canvas;i.firstChild;)i.removeChild(i.firstChild);
        this.bottom=this.top=null;
        (this.desc=B("desc")).appendChild(s._g.doc.createTextNode("Created with Rapha\u00ebl "+ s.version));
        i.appendChild(this.desc);
        i.appendChild(this.defs=B("defs"))
    };
    
    s.prototype.remove=function(){
        U("remove",this);
        this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);
        for(var i in this)this[i]=typeof this[i]=="function"?s._removedFactory(i):null
    };
        
    var ha=s.st,J;
    for(J in T)T.hasOwnProperty(J)&&!ha.hasOwnProperty(J)&&(ha[J]=function(i){
        return function(){
            var t=arguments;
            return this.forEach(function(p){
                p[i].apply(p,t)
            })
        }
    }(J))
}(window.Raphael);
window.Raphael.vml&&function(s){
    var P=String,Y=parseFloat,ka=Math,X=ka.round,ca=ka.max,ia=ka.min,S=ka.abs,n=/[, ]+/,U=s.eve,W={
        M:"m",
        L:"l",
        C:"c",
        Z:"x",
        m:"t",
        l:"r",
        c:"v",
        z:"x"
    },I=/([clmz]),?([^clmz]*)/gi,B=/ progid:\S+Blur\([^\)]+\)/g,N=/-?[^,\s-]+/g,G={
        path:1,
        rect:1,
        image:1
    },$={
        circle:1,
        ellipse:1
    },K=function(e){
        var h=/[ahqstv]/ig,k=s._pathToAbsolute;
        P(e).match(h)&&(k=s._path2curve);
        h=/[clmz]/g;
        if(k==s._pathToAbsolute&&!P(e).match(h))return e=P(e).replace(I,function(Q,R,ea){
            var Z=[],L=R.toLowerCase()== "m",da=W[R];
            ea.replace(N,function(ga){
                L&&Z.length==2&&(da+=Z+W[R=="m"?"l":"L"],Z=[]);
                Z.push(X(ga*21600))
            });
            return da+Z
        });
        h=k(e);
        var l;
        e=[];
        for(var m=0,w=h.length;m<w;m++){
            k=h[m];
            l=h[m][0].toLowerCase();
            l=="z"&&(l="x");
            for(var y=1,F=k.length;y<F;y++)l+=X(k[y]*21600)+(y!=F-1?",":"");
            e.push(l)
        }
        return e.join(" ")
    },O=function(e,h,k){
        var l=s.matrix();
        l.rotate(-e,0.5,0.5);
        return{
            dx:l.x(h,k),
            dy:l.y(h,k)
        }
    },M=function(e,h,k,l,m,w){
        var y=e._,F=e.matrix,Q=y.fillpos;
        e=e.node;
        var R=e.style,ea=1,Z="",L=21600/h, da=21600/k;
        R.visibility="hidden";
        if(h&&k){
            e.coordsize=S(L)+" "+S(da);
            R.rotation=w*(h*k<0?-1:1);
            if(w){
                var ga=O(w,l,m);
                l=ga.dx;
                m=ga.dy
            }
            h<0&&(Z+="x");
            k<0&&(Z+=" y")&&(ea=-1);
            R.flip=Z;
            e.coordorigin=l*-L+" "+m*-da;
            if(Q||y.fillsize){
                l=(l=e.getElementsByTagName("fill"))&&l[0];
                e.removeChild(l);
                Q&&(ga=O(w,F.x(Q[0],Q[1]),F.y(Q[0],Q[1])),l.position=ga.dx*ea+" "+ga.dy*ea);
                y.fillsize&&(l.size=y.fillsize[0]*S(h)+" "+y.fillsize[1]*S(k));
                e.appendChild(l)
            }
            R.visibility="visible"
        }
    };

    s.toString=function(){
        return"Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\u00ebl "+ this.version
    };
    
    var la=function(e,h,k){
        h=P(h).toLowerCase().split("-");
        k=k?"end":"start";
        for(var l=h.length,m="classic",w="medium",y="medium";l--;)switch(h[l]){
            case "block":case "classic":case "oval":case "diamond":case "open":case "none":
                m=h[l];
                break;
            case "wide":case "narrow":
                y=h[l];
                break;
            case "long":case "short":
                w=h[l]
        }
        e=e.node.getElementsByTagName("stroke")[0];
        e[k+"arrow"]=m;
        e[k+"arrowlength"]=w;
        e[k+"arrowwidth"]=y
    },fa=function(e,h){
        e.attrs=e.attrs||{};
    
        var k=e.node,l=e.attrs,m=k.style,w=G[e.type]&& (h.x!=l.x||h.y!=l.y||h.width!=l.width||h.height!=l.height||h.cx!=l.cx||h.cy!=l.cy||h.rx!=l.rx||h.ry!=l.ry||h.r!=l.r),y=$[e.type]&&(l.cx!=h.cx||l.cy!=h.cy||l.r!=h.r||l.rx!=h.rx||l.ry!=h.ry),F;
        for(F in h)h.hasOwnProperty(F)&&(l[F]=h[F]);w&&(l.path=s._getPath[e.type](e),e._.dirty=1);
        h.href&&(k.href=h.href);
        h.title&&(k.title=h.title);
        h.target&&(k.target=h.target);
        h.cursor&&(m.cursor=h.cursor);
        "blur"in h&&e.blur(h.blur);
        if(h.path&&e.type=="path"||w){
            k.path=K(~P(l.path).toLowerCase().indexOf("r")?s._pathToAbsolute(l.path): l.path);
            e.type=="image"&&(e._.fillpos=[l.x,l.y],e._.fillsize=[l.width,l.height],M(e,1,1,0,0,0))
        }
        "transform"in h&&e.transform(h.transform);
        if(y){
            m=+l.cx;
            w=+l.cy;
            y=+l.rx||+l.r||0;
            F=+l.ry||+l.r||0;
            k.path=s.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",X((m-y)*21600),X((w-F)*21600),X((m+y)*21600),X((w+F)*21600),X(m*21600))
        }
        if("clip-rect"in h){
            m=P(h["clip-rect"]).split(n);
            if(m.length==4){
                m[2]=+m[2]+ +m[0];
                m[3]=+m[3]+ +m[1];
                w=k.clipRect||s._g.doc.createElement("div");
                y=w.style;
                y.clip=s.format("rect({1}px {2}px {3}px {0}px)", m);
                k.clipRect||(y.position="absolute",y.top=0,y.left=0,y.width=e.paper.width+"px",y.height=e.paper.height+"px",k.parentNode.insertBefore(w,k),w.appendChild(k),k.clipRect=w)
            }
            h["clip-rect"]||k.clipRect&&(k.clipRect.style.clip="auto")
        }
        if(e.textpath){
            m=e.textpath.style;
            h.font&&(m.font=h.font);
            h["font-family"]&&(m.fontFamily='"'+h["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,"")+'"');
            h["font-size"]&&(m.fontSize=h["font-size"]);
            h["font-weight"]&&(m.fontWeight=h["font-weight"]);
            h["font-style"]&& (m.fontStyle=h["font-style"])
        }
        "arrow-start"in h&&la(e,h["arrow-start"]);
        "arrow-end"in h&&la(e,h["arrow-end"],1);
        if(h.opacity!=null||h["stroke-width"]!=null||h.fill!=null||h.src!=null||h.stroke!=null||h["stroke-width"]!=null||h["stroke-opacity"]!=null||h["fill-opacity"]!=null||h["stroke-dasharray"]!=null||h["stroke-miterlimit"]!=null||h["stroke-linejoin"]!=null||h["stroke-linecap"]!=null){
            m=(m=k.getElementsByTagName("fill"))&&m[0];
            !m&&(m=i("fill"));
            e.type=="image"&&h.src&&(m.src=h.src);
            h.fill&&(m.on= true);
            if(m.on==null||h.fill=="none"||h.fill===null)m.on=false;
            if(m.on&&h.fill)if(w=P(h.fill).match(s._ISURL)){
                m.parentNode==k&&k.removeChild(m);
                m.rotate=true;
                m.src=w[1];
                m.type="tile";
                y=e.getBBox(1);
                m.position=y.x+" "+y.y;
                e._.fillpos=[y.x,y.y];
                s._preload(w[1],function(){
                    e._.fillsize=[this.offsetWidth,this.offsetHeight]
                })
            }else{
                m.color=s.getRGB(h.fill).hex;
                m.src="";
                m.type="solid";
                s.getRGB(h.fill).error&&(e.type in{
                    circle:1,
                    ellipse:1
                }||P(h.fill).charAt()!="r")&&T(e,h.fill,m)&&(l.fill="none",l.gradient= h.fill,m.rotate=false)
            }
            if("fill-opacity"in h||"opacity"in h){
                y=((+l["fill-opacity"]+1||2)-1)*((+l.opacity+1||2)-1)*((+s.getRGB(h.fill).o+1||2)-1);
                y=ia(ca(y,0),1);
                m.opacity=y;
                m.src&&(m.color="none")
            }
            k.appendChild(m);
            m=k.getElementsByTagName("stroke")&&k.getElementsByTagName("stroke")[0];
            w=false;
            !m&&(w=m=i("stroke"));
            if(h.stroke&&h.stroke!="none"||h["stroke-width"]||h["stroke-opacity"]!=null||h["stroke-dasharray"]||h["stroke-miterlimit"]||h["stroke-linejoin"]||h["stroke-linecap"])m.on=true;
            (h.stroke== "none"||h.stroke===null||m.on==null||h.stroke==0||h["stroke-width"]==0)&&(m.on=false);
            y=s.getRGB(h.stroke);
            m.on&&h.stroke&&(m.color=y.hex);
            y=((+l["stroke-opacity"]+1||2)-1)*((+l.opacity+1||2)-1)*((+y.o+1||2)-1);
            F=(Y(h["stroke-width"])||1)*0.75;
            y=ia(ca(y,0),1);
            h["stroke-width"]==null&&(F=l["stroke-width"]);
            h["stroke-width"]&&(m.weight=F);
            F&&F<1&&(y*=F)&&(m.weight=1);
            m.opacity=y;
            h["stroke-linejoin"]&&(m.joinstyle=h["stroke-linejoin"]||"miter");
            m.miterlimit=h["stroke-miterlimit"]||8;
            h["stroke-linecap"]&& (m.endcap=h["stroke-linecap"]=="butt"?"flat":h["stroke-linecap"]=="square"?"square":"round");
            if(h["stroke-dasharray"]){
                y={
                    "-":"shortdash",
                    ".":"shortdot",
                    "-.":"shortdashdot",
                    "-..":"shortdashdotdot",
                    ". ":"dot",
                    "- ":"dash",
                    "--":"longdash",
                    "- .":"dashdot",
                    "--.":"longdashdot",
                    "--..":"longdashdotdot"
                };
            
                m.dashstyle=y.hasOwnProperty(h["stroke-dasharray"])?y[h["stroke-dasharray"]]:""
            }
            w&&k.appendChild(m)
        }
        if(e.type=="text"){
            e.paper.canvas.style.display="";
            k=e.paper.span;
            w=l.font&&l.font.match(/\d+(?:\.\d*)?(?=px)/);
            m=k.style;
            l.font&&(m.font=l.font);
            l["font-family"]&&(m.fontFamily=l["font-family"]);
            l["font-weight"]&&(m.fontWeight=l["font-weight"]);
            l["font-style"]&&(m.fontStyle=l["font-style"]);
            w=Y(l["font-size"]||w&&w[0])||10;
            m.fontSize=w*100+"px";
            e.textpath.string&&(k.innerHTML=P(e.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));
            k=k.getBoundingClientRect();
            e.W=l.w=(k.right-k.left)/100;
            e.H=l.h=(k.bottom-k.top)/100;
            e.X=l.x;
            e.Y=l.y+e.H/2;
            ("x"in h||"y"in h)&&(e.path.v=s.format("m{0},{1}l{2},{1}", X(l.x*21600),X(l.y*21600),X(l.x*21600)+1));
            k=["x","y","text","font","font-family","font-weight","font-style","font-size"];
            m=0;
            for(w=k.length;m<w;m++)if(k[m]in h){
                e._.dirty=1;
                break
            }
            switch(l["text-anchor"]){
                case "start":
                    e.textpath.style["v-text-align"]="left";
                    e.bbx=e.W/2;
                    break;
                case "end":
                    e.textpath.style["v-text-align"]="right";
                    e.bbx=-e.W/2;
                    break;
                default:
                    e.textpath.style["v-text-align"]="center";
                    e.bbx=0
            }
            e.textpath.style["v-text-kern"]=true
        }
    },T=function(e,h,k){
        e.attrs=e.attrs||{};
    
        var l=Math.pow,m="linear", w=".5 .5";
        e.attrs.gradient=h;
        h=P(h).replace(s._radial_gradient,function(ea,Z,L){
            m="radial";
            Z&&L&&(Z=Y(Z),L=Y(L),l(Z-0.5,2)+l(L-0.5,2)>0.25&&(L=ka.sqrt(0.25-l(Z-0.5,2))*((L>0.5)*2-1)+0.5),w=Z+" "+L);
            return""
        });
        h=h.split(/\s*\-\s*/);
        if(m=="linear"){
            var y=h.shift();
            y=-Y(y);
            if(isNaN(y))return null
        }
        h=s._parseDots(h);
        if(!h)return null;
        e=e.shape||e.node;
        if(h.length){
            e.removeChild(k);
            k.on=true;
            k.method="none";
            k.color=h[0].color;
            k.color2=h[h.length-1].color;
            for(var F=[],Q=0,R=h.length;Q<R;Q++)h[Q].offset&& F.push(h[Q].offset+" "+h[Q].color);
            k.colors=F.length?F.join():"0% "+k.color;
            m=="radial"?(k.type="gradientTitle",k.focus="100%",k.focussize="0 0",k.focusposition=w,k.angle=0):(k.type="gradient",k.angle=(270-y)%360);
            e.appendChild(k)
        }
        return 1
    },ha=function(e,h){
        this[0]=this.node=e;
        e.raphael=true;
        this.id=s._oid++;
        e.raphaelid=this.id;
        this.Y=this.X=0;
        this.attrs={};
    
        this.paper=h;
        this.matrix=s.matrix();
        this._={
            transform:[],
            sx:1,
            sy:1,
            dx:0,
            dy:0,
            deg:0,
            dirty:1,
            dirtyT:1
        };
        !h.bottom&&(h.bottom=this);
        (this.prev=h.top)&& (h.top.next=this);
        h.top=this;
        this.next=null
    },J=s.el;
    ha.prototype=J;
    J.constructor=ha;
    J.transform=function(e){
        if(e==null)return this._.transform;
        var h=this.paper._viewBoxShift,k=h?"s"+[h.scale,h.scale]+"-1-1t"+[h.dx,h.dy]:"",l;
        h&&(l=e=P(e).replace(/\.{3}|\u2026/g,this._.transform||""));
        s._extractTransform(this,k+e);
        h=this.matrix.clone();
        var m=this.skew;
        e=this.node;
        k=~P(this.attrs.fill).indexOf("-");
        var w=!P(this.attrs.fill).indexOf("url(");
        h.translate(-0.5,-0.5);
        if(w||k||this.type=="image"){
            m.matrix= "1 0 0 1";
            m.offset="0 0";
            m=h.split();
            if(k&&m.noRotation||!m.isSimple){
                e.style.filter=h.toFilter();
                k=this.getBBox();
                m=this.getBBox(1);
                h=k.x-m.x;
                k=k.y-m.y;
                e.coordorigin=h*-21600+" "+k*-21600;
                M(this,1,1,h,k,0)
            }else{
                e.style.filter="";
                M(this,m.scalex,m.scaley,m.dx,m.dy,m.rotate)
            }
        }else{
            e.style.filter="";
            m.matrix=P(h);
            m.offset=h.offset()
        }
        l&&(this._.transform=l);
        return this
    };

    J.rotate=function(e,h,k){
        if(this.removed)return this;
        if(e!=null){
            e=P(e).split(n);
            e.length-1&&(h=Y(e[1]),k=Y(e[2]));
            e=Y(e[0]);
            k==null&& (h=k);
            if(h==null||k==null){
                k=this.getBBox(1);
                h=k.x+k.width/2;
                k=k.y+k.height/2
            }
            this._.dirtyT=1;
            this.transform(this._.transform.concat([["r",e,h,k]]));
            return this
        }
    };

    J.translate=function(e,h){
        if(this.removed)return this;
        e=P(e).split(n);
        e.length-1&&(h=Y(e[1]));
        e=Y(e[0])||0;
        h=+h||0;
        this._.bbox&&(this._.bbox.x+=e,this._.bbox.y+=h);
        this.transform(this._.transform.concat([["t",e,h]]));
        return this
    };
    
    J.scale=function(e,h,k,l){
        if(this.removed)return this;
        e=P(e).split(n);
        e.length-1&&(h=Y(e[1]),k=Y(e[2]),l=Y(e[3]), isNaN(k)&&(k=null),isNaN(l)&&(l=null));
        e=Y(e[0]);
        h==null&&(h=e);
        l==null&&(k=l);
        if(k==null||l==null)var m=this.getBBox(1);
        k=k==null?m.x+m.width/2:k;
        l=l==null?m.y+m.height/2:l;
        this.transform(this._.transform.concat([["s",e,h,k,l]]));
        this._.dirtyT=1;
        return this
    };
    
    J.hide=function(){
        !this.removed&&(this.node.style.display="none");
        return this
    };
    
    J.show=function(){
        !this.removed&&(this.node.style.display="");
        return this
    };
    
    J._getBBox=function(){
        if(this.removed)return{};
        
        return{
            x:this.X+(this.bbx||0)-this.W/2,
            y:this.Y- this.H,
            width:this.W,
            height:this.H
        }
    };

    J.remove=function(){
        if(!this.removed){
            this.paper.__set__&&this.paper.__set__.exclude(this);
            s.eve.unbind("*.*."+this.id);
            s._tear(this,this.paper);
            this.node.parentNode.removeChild(this.node);
            this.shape&&this.shape.parentNode.removeChild(this.shape);
            for(var e in this)this[e]=typeof this[e]=="function"?s._removedFactory(e):null;this.removed=true
        }
    };

    J.attr=function(e,h){
        if(this.removed)return this;
        if(e==null){
            var k={},l;
            for(l in this.attrs)this.attrs.hasOwnProperty(l)&& (k[l]=this.attrs[l]);k.gradient&&k.fill=="none"&&(k.fill=k.gradient)&&delete k.gradient;
            k.transform=this._.transform;
            return k
        }
        if(h==null&&s.is(e,"string")){
            if(e=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;
            l=e.split(n);
            k={};
        
            for(var m=0,w=l.length;m<w;m++){
                e=l[m];
                e in this.attrs?k[e]=this.attrs[e]:s.is(this.paper.customAttributes[e],"function")?k[e]=this.paper.customAttributes[e].def:k[e]=s._availableAttrs[e]
            }
            return w-1?k:k[l[0]]
        }
        if(this.attrs&&h==null&&s.is(e,"array")){
            k= {};
        
            m=0;
            for(w=e.length;m<w;m++)k[e[m]]=this.attr(e[m]);
            return k
        }
        h!=null&&(k={},k[e]=h);
        h==null&&s.is(e,"object")&&(k=e);
        for(m in k)U("attr."+m+"."+this.id,this,k[m]);if(k){
            for(m in this.paper.customAttributes)if(this.paper.customAttributes.hasOwnProperty(m)&&k.hasOwnProperty(m)&&s.is(this.paper.customAttributes[m],"function")){
                l=this.paper.customAttributes[m].apply(this,[].concat(k[m]));
                this.attrs[m]=k[m];
                for(w in l)l.hasOwnProperty(w)&&(k[w]=l[w])
            }
            k.text&&this.type=="text"&&(this.textpath.string= k.text);
            fa(this,k)
        }
        return this
    };
    
    J.toFront=function(){
        !this.removed&&this.node.parentNode.appendChild(this.node);
        this.paper&&this.paper.top!=this&&s._tofront(this,this.paper);
        return this
    };
    
    J.toBack=function(){
        if(this.removed)return this;
        this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),s._toback(this,this.paper));
        return this
    };
    
    J.insertAfter=function(e){
        if(this.removed)return this;
        e.constructor==s.st.constructor&&(e=e[e.length-1]);
        e.node.nextSibling?e.node.parentNode.insertBefore(this.node,e.node.nextSibling):e.node.parentNode.appendChild(this.node);
        s._insertafter(this,e,this.paper);
        return this
    };
    
    J.insertBefore=function(e){
        if(this.removed)return this;
        e.constructor==s.st.constructor&&(e=e[0]);
        e.node.parentNode.insertBefore(this.node,e.node);
        s._insertbefore(this,e,this.paper);
        return this
    };
    
    J.blur=function(e){
        var h=this.node.runtimeStyle,k=h.filter;
        k=k.replace(B,"");
        +e!==0?(this.attrs.blur=e,h.filter=k+"  progid:DXImageTransform.Microsoft.Blur(pixelradius="+ (+e||1.5)+")",h.margin=s.format("-{0}px 0 0 -{0}px",X(+e||1.5))):(h.filter=k,h.margin=0,delete this.attrs.blur)
    };
    
    s._engine.path=function(e,h){
        var k=i("shape");
        k.style.cssText="position:absolute;left:0;top:0;width:1px;height:1px";
        k.coordsize="21600 21600";
        k.coordorigin=h.coordorigin;
        var l=new ha(k,h),m={
            fill:"none",
            stroke:"#000"
        };
    
        e&&(m.path=e);
        l.type="path";
        l.path=[];
        l.Path="";
        fa(l,m);
        h.canvas.appendChild(k);
        m=i("skew");
        m.on=true;
        k.appendChild(m);
        l.skew=m;
        l.transform("");
        return l
    };
    
    s._engine.rect=function(e, h,k,l,m,w){
        var y=s._rectPath(h,k,l,m,w);
        e=e.path(y);
        var F=e.attrs;
        e.X=F.x=h;
        e.Y=F.y=k;
        e.W=F.width=l;
        e.H=F.height=m;
        F.r=w;
        F.path=y;
        e.type="rect";
        return e
    };
    
    s._engine.ellipse=function(e,h,k,l,m){
        e=e.path();
        e.X=h-l;
        e.Y=k-m;
        e.W=l*2;
        e.H=m*2;
        e.type="ellipse";
        fa(e,{
            cx:h,
            cy:k,
            rx:l,
            ry:m
        });
        return e
    };
    
    s._engine.circle=function(e,h,k,l){
        e=e.path();
        e.X=h-l;
        e.Y=k-l;
        e.W=e.H=l*2;
        e.type="circle";
        fa(e,{
            cx:h,
            cy:k,
            r:l
        });
        return e
    };
    
    s._engine.image=function(e,h,k,l,m,w){
        var y=s._rectPath(k,l,m,w);
        e=e.path(y).attr({
            stroke:"none"
        });
        var F=e.attrs,Q=e.node,R=Q.getElementsByTagName("fill")[0];
        F.src=h;
        e.X=F.x=k;
        e.Y=F.y=l;
        e.W=F.width=m;
        e.H=F.height=w;
        F.path=y;
        e.type="image";
        R.parentNode==Q&&Q.removeChild(R);
        R.rotate=true;
        R.src=h;
        R.type="tile";
        e._.fillpos=[k,l];
        e._.fillsize=[m,w];
        Q.appendChild(R);
        M(e,1,1,0,0,0);
        return e
    };
    
    s._engine.text=function(e,h,k,l){
        var m=i("shape"),w=i("path"),y=i("textpath");
        h=h||0;
        k=k||0;
        l=l||"";
        w.v=s.format("m{0},{1}l{2},{1}",X(h*21600),X(k*21600),X(h*21600)+1);
        w.textpathok=true;
        y.string=P(l);
        y.on=true;
        m.style.cssText= "position:absolute;left:0;top:0;width:1px;height:1px";
        m.coordsize="21600 21600";
        m.coordorigin="0 0";
        var F=new ha(m,e),Q={
            fill:"#000",
            stroke:"none",
            font:s._availableAttrs.font,
            text:l
        };
    
        F.shape=m;
        F.path=w;
        F.textpath=y;
        F.type="text";
        F.attrs.text=P(l);
        F.attrs.x=h;
        F.attrs.y=k;
        F.attrs.w=1;
        F.attrs.h=1;
        fa(F,Q);
        m.appendChild(y);
        m.appendChild(w);
        e.canvas.appendChild(m);
        e=i("skew");
        e.on=true;
        m.appendChild(e);
        F.skew=e;
        F.transform("");
        return F
    };
    
    s._engine.setSize=function(e,h){
        var k=this.canvas.style;
        this.width= e;
        this.height=h;
        e==+e&&(e+="px");
        h==+h&&(h+="px");
        k.width=e;
        k.height=h;
        k.clip="rect(0 "+e+" "+h+" 0)";
        this._viewBox&&s._engine.setViewBox.apply(this,this._viewBox);
        return this
    };
    
    s._engine.setViewBox=function(e,h,k,l,m){
        s.eve("setViewBox",this,this._viewBox,[e,h,k,l,m]);
        var w=this.width,y=this.height,F=1/ca(k/w,l/y),Q,R;
        m&&(Q=y/l,R=w/k,k*Q<w&&(e-=(w-k*Q)/2/Q),l*R<y&&(h-=(y-l*R)/2/R));
        this._viewBox=[e,h,k,l,!!m];
        this._viewBoxShift={
            dx:-e,
            dy:-h,
            scale:F
        };
    
        this.forEach(function(ea){
            ea.transform("...")
        });
        return this
    };
    
    var i;
    s._engine.initWin=function(e){
        var h=e.document;
        h.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");
        try{
            !h.namespaces.rvml&&h.namespaces.add("rvml","urn:schemas-microsoft-com:vml");
            i=function(l){
                return h.createElement("<rvml:"+l+' class="rvml">')
            }
        }catch(k){
            i=function(l){
                return h.createElement("<"+l+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
            }
        }
    };

    s._engine.initWin(s._g.win);
    s._engine.create=function(){
        var e=s._getContainer.apply(0,arguments),h=e.container, k=e.height,l=e.width,m=e.x;
        e=e.y;
        if(!h)throw Error("VML container not found.");
        var w=new s._Paper,y=w.canvas=s._g.doc.createElement("div"),F=y.style;
        m=m||0;
        e=e||0;
        l=l||512;
        k=k||342;
        w.width=l;
        w.height=k;
        l==+l&&(l+="px");
        k==+k&&(k+="px");
        w.coordsize="21600000 21600000";
        w.coordorigin="0 0";
        w.span=s._g.doc.createElement("span");
        w.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
        y.appendChild(w.span);
        F.cssText=s.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", l,k);
        h==1?(s._g.doc.body.appendChild(y),F.left=m+"px",F.top=e+"px",F.position="absolute"):h.firstChild?h.insertBefore(y,h.firstChild):h.appendChild(y);
        w.renderfix=function(){};
    
        return w
    };
    
    s.prototype.clear=function(){
        s.eve("clear",this);
        this.canvas.innerHTML="";
        this.span=s._g.doc.createElement("span");
        this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
        this.canvas.appendChild(this.span);
        this.bottom=this.top=null
    };
    
    s.prototype.remove=function(){
        s.eve("remove", this);
        this.canvas.parentNode.removeChild(this.canvas);
        for(var e in this)this[e]=typeof this[e]=="function"?s._removedFactory(e):null;return true
    };
    
    var t=s.st,p;
    for(p in J)J.hasOwnProperty(p)&&!t.hasOwnProperty(p)&&(t[p]=function(e){
        return function(){
            var h=arguments;
            return this.forEach(function(k){
                k[e].apply(k,h)
            })
        }
    }(p))
}(window.Raphael); 