/*******************生成立方体纹理对象*******************************/
function configureCubeMap(program) {
	gl.activeTexture(gl.TEXTURE0);

    cubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.uniform1i(gl.getUniformLocation(program, "cubeSampler"), 0);

	var faces = [
	    ["./skybox/right.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
        ["./skybox/left.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
        ["./skybox/top.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
        ["./skybox/bottom.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
        ["./skybox/front.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
        ["./skybox/back.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
		];
    
    for (var i = 0; i < 6; i++) {
        var face = faces[i][1];
        var image = new Image();
        image.src = faces[i][0];
        image.onload = function (cubeMap, face, image) {
            return function () {
		        gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
        }(cubeMap, face, image);
    }
}

/*TODO1:创建一般2D颜色纹理对象并加载图片*/
function configureTexture(image) {
    // 1. 创建纹理对象
    var texture = gl.createTexture();
    
    // 2. 绑定2D纹理目标
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // 3. 设置纹理参数（过滤方式和环绕方式）
    // 放大过滤：线性插值
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 缩小过滤：线性插值（如需mipmap可改为gl.LINEAR_MIPMAP_LINEAR）
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // S方向（水平）环绕方式：重复纹理
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // T方向（垂直）环绕方式：重复纹理
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
    // 4. 处理图片加载（异步操作）
    image.onload = function() {
        // 重新绑定纹理确保操作对象正确
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 将图片数据传入纹理
        gl.texImage2D(
            gl.TEXTURE_2D,    // 目标纹理类型
            0,                // 细节层级（基础层级为0）
            gl.RGBA,          // 纹理内部存储格式
            gl.RGBA,          // 源图片数据格式
            gl.UNSIGNED_BYTE, // 像素数据类型
            image             // 加载完成的图片对象
        );
        // 如需生成mipmap可添加此行
        // gl.generateMipmap(gl.TEXTURE_2D);
    };
    
    // 5. 返回配置好的纹理对象
    return texture;
}
