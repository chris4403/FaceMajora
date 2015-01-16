$(function(){

    var canvas = document.getElementById("base");
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var canvas2d = canvas.getContext('2d');
    var imgMask = new Image();
    imgMask.src = $("#mask").attr("src");

    $("#fileInput").change(function() {
        var file = this.files[0];
        if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;
        var img = new Image();
        var reader = new FileReader();
        reader.onload = function(evt) {
            img.onload = function() {
                var height;
                var width;
                if (img.height > 800 || img.width > 800) {
                    if (img.height > img.width) {
                        height = 800;
                        width = img.width * 800 / img.height;
                    } else {
                        width = 800;
                        height = img.height * 800 / img.width;
                    }
                } else {
                    height = img.height;
                    width = img.width;
                }

                canvas.height = height;
                canvas.width = width;
                canvas2d.drawImage(img, 0, 0, width, height);
                $("#base").faceDetection({
                    complete: function (obj){

                        if(typeof(obj)=="undefined"){
                            console.log("not detect");
                            return false;
                        }else{
                            for (var i=0;i<obj.length;i++){
                                var length = ((obj[i].height - obj[i].width) > 0) ? obj[i].height : obj[i].width;
                                var scaleLength = length * 1.8;
                                var x = obj[i].x - (length * 0.4);
                                var y = obj[i].y - (length * 0.4);
                                canvas2d.drawImage(imgMask,x,y,scaleLength,scaleLength);
                            }
                        }
                    },

                    error:function(code,message){
                        console.error("Error:" + message);
                    }
                });
            }
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file);
    });

    return;

});
