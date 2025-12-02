2024修改：
=================v1========
0）文件名修改为phongshading，原来是sphere_phongshading

1）box.frag中，发现没有diffuseStrengh添加,specularStrength，都乘以Kd,ks
    Kd = diffuseStrength * max(dot(lightDir, norm), 0.0);
    Ks = specularStrength * pow(max(dot(norm, halfDir), 0.0), shininess);
    
    congfigMaterialParameters.js中修改了参数
    var ambientStrength = 0.5; //ka
	var diffuseStrength = 0.5; //kd
	var specularStrength = 0.5; //ks

2）box.grag中，应该考虑
    //光线从背面照时，没有镜面光了！
    if(dot(lightDir,norm)<0.0)  specular =vec3(0,0,0);


3）models.js作了修改
    //原来文件里加了太多的模型，这里只需要立方体和平面，以及球体
    
4）阴影就用一般的判定，
       z>depth+0.005

5） 最后颜色计算时，优点不自然
        =（1-shadow/2）*光照色， 纹理色再前面作为Kd计算

=================v2========
6） 去掉平行投影，只透视投影；
    更改模糊的变量名如theta,phi为lightTheta,lightPhi

7）点光源时，出现奇怪的阴影？
//box.frag中加了下面这句就去除奇怪的边缘阴影了，为什么？
if(projCoords.z > 1.0)   shadow = 0.0;  
？解释：裁剪范围内的Z应该小于1，但是因为透视的规范化投影非线性可能导致Z>1


