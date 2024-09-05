
<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <head>
     <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
       <script type="text/javascript" src="http://code.jquery.com/jquery.js"></script>
       <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-tubeplayer/2.1.0/jquery.tubeplayer.min.js"></script>
   </head>

<script >
function SmartCanvas(name) {
   canvas = document.getElementById(name);
   canvas.name = name;
    canvas.canvasPos = canvas.getBoundingClientRect();
    canvas.ctx = canvas.getContext("2d");
   canvas.ctx.fillStyle = "rgb(255,255,255)";
    canvas.ctx.strokeStyle = "rgb(255,255,255)";
    canvas.ctx.lineWidth = 13;
    canvas.ctx.lineCap = "round";

   canvas.drawing =  false;
   canvas.posX = 0;
   canvas.posY = 0;

   this.canvas = canvas;


      this.down = function(evt) {

         try {
            // this는 canvas를 의미함
               this.posX = Math.round(evt.touches[0].clientX - this.canvasPos.left);
               this.posY = Math.round(evt.touches[0].clientY - this.canvasPos.top);
           } catch{
               this.posX = Math.round(evt.clientX - this.canvasPos.left);
               this.posY = Math.round(evt.clientY - this.canvasPos.top);
           }
           this.drawing = true;
       }

       this.move = function(evt) {
           if ( this.drawing == true) {
               this.ctx.beginPath();
               this.ctx.moveTo(this.posX, this.posY);
               try {
                   this.posX = Math.round(evt.touches[0].clientX - this.canvasPos.left);
                   this.posY = Math.round(evt.touches[0].clientY - this.canvasPos.top);
               } catch{
                   this.posX = Math.round(evt.clientX - this.canvasPos.left);
                   this.posY = Math.round(evt.clientY - this.canvasPos.top);
               }
               this.ctx.lineTo(this.posX, this.posY);
               this.ctx.stroke();
           }
       }

       this.up = function() {
           this.drawing = false;
       }


      canvas.addEventListener("mousedown", this.down);
       canvas.addEventListener("mousemove", this.move);
       canvas.addEventListener("mouseup", this.up);
   }

   </script>



<body>
<div>
  <h1 id="quest"></h1>
</div>
        <canvas id="canvas1" width="200" height="200" style="background-color: black"></canvas>
        <canvas id="canvas2" width="200" height="200" style="background-color: black"></canvas>
        <canvas id="canvas3" width="200" height="200" style="background-color: black"></canvas>
        <canvas id="canvas4" width="200" height="200" style="background-color: black"></canvas>
        <canvas id="canvas5" width="200" height="200" style="background-color: black"></canvas>
        <br>
        <button onclick="clear()">clear</button>
        <button onclick="predict()">predcit</button><br>
        <div id="res">
        </div>
        <div id = "err">
        </div>
<br>

        <div >
          <img id="image" width=300 height=350></img>
        </div>

        <div >
          <iframe id='youtube-video-player' width=600 height=350 frameborder="0" allow="accelerometer; autoplay;encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <div >
          <audio id="audio" controls="controls" >
            <source type="audio/mp3" />
          </audio>
        </div>
<script type="text/javascript">

   var mnist;

    s1 = new SmartCanvas("canvas1");
    s2 = new SmartCanvas("canvas2");
    s3 = new SmartCanvas("canvas3");
    s4 = new SmartCanvas("canvas4");
    s5 = new SmartCanvas("canvas5");
   tf.loadLayersModel('cnnmnconv/model.json').then(function(model) {
               mnist = model;
   });


    function preprocess(image) {
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();
        return tensor.div(255.0);
    }

   async function predict() {
     html = ""
     c = [s1.canvas,s2.canvas,s3.canvas,s4.canvas, s5.canvas]
     for(var i = 0; i<5; i++){
       const tensor = preprocess(c[i]);
       const prediction = await mnist.predict(tensor).data();
       const proposal = prediction.indexOf(Math.max.apply(null, prediction));

       var pr = prediction[proposal] * 100;
       html += proposal + "&nbsp; &nbsp;";

       if(pr > 50.0){
         console.log(html);
         if(pr < 80){
           console.log(i+1,"번째 글자가 잘못 입력되었습니다.");
         }
       }else{
         console.log("출력안함");
       }
    }
      document.getElementById("res").innerHTML = html;
    }



    var db = {
                questions : [
                            {ques : "넌센스퀴즈 경찰서의 반대말은?", link : " ",answer : "1234",type : 0},
                            {ques : "이미지 보고 연예인 이름 맞추기", link : "q1.jpeg",answer : "898",type : 1},
                            {ques : "영상을 보고 영화 제목 맞추기", link : "XFgsOBnf4Kg",answer : "라라랜드", type : 2},
                            {ques : "노래 듣고 제목 맞추기", link : "q2.mp3",answer : "넘쳐흘러",type : 3}
                          ]
              };
//랜덤으로 문제 가져오기
  const rand = Math.random() * db.questions.length;
  const randf = Math.floor(rand);

  var ques = db.questions[randf].ques;
  document.getElementById("quest").innerHTML = ques;

//이미지,음악,유튜브
  document.getElementById("image").style.display="none";
  document.getElementById("youtube-video-player").style.display="none";
  document.getElementById("audio").style.display="none";

  if (db.questions[randf].type == 1){
    document.getElementById('image').setAttribute('src', db.questions[randf].link);
    document.getElementById("image").style.display="block";
  }else if (db.questions[randf].type == 2){
    document.getElementById("youtube-video-player").setAttribute('src','https://www.youtube.com/embed/' + db.questions[randf].link);
    document.getElementById("youtube-video-player").style.display="block";
  }else if (db.questions[randf].type == 3){
    document.getElementById("audio").setAttribute('src',db.questions[randf].link);
    document.getElementById("audio").style.display="block";
  }

//answer로 캔버스 개수 (숨기고 보이기)
    var answer = db.questions[randf].answer.length;
    if(answer == 4){
      document.getElementById("canvas5").style.display="none";
    }else if(answer == 3){
      document.getElementById("canvas4").style.display="none";
      document.getElementById("canvas5").style.display="none";
    }else if(answer == 2){
      document.getElementById("canvas3").style.display="none";
      document.getElementById("canvas4").style.display="none";
      document.getElementById("canvas5").style.display="none";
    }else if(answer == 1){
      document.getElementById("canvas2").style.display="none";
      document.getElementById("canvas3").style.display="none";
      document.getElementById("canvas4").style.display="none";
      document.getElementById("canvas5").style.display="none";
    }

</script>


</body>

</html>
