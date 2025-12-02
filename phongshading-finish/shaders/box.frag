#version 300 es
precision mediump float;

out vec4 FragColor;

uniform float ambientStrength, specularStrength, diffuseStrength,shininess;

in vec3 Normal;//法向量
in vec3 FragPos;//相机观察的片元位置
in vec2 TexCoord;//纹理坐标
in vec4 FragPosLightSpace;//光源观察的片元位置

uniform vec3 viewPos;//相机位置
uniform vec4 u_lightPosition; //光源位置	
uniform vec3 lightColor;//入射光颜色

uniform sampler2D diffuseTexture;
uniform sampler2D depthTexture;
//uniform samplerCube cubeSampler;//盒子纹理采样器


float shadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
{
    float shadow=0.0;  //非阴影
    /*TODO3: 添加阴影计算，返回1表示是阴影，返回0表示非阴影*/
    
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;

    float lightSeeDepth = texture(depthTexture, projCoords.xy).r;
    float currentDepth = projCoords.z;

    //判定该projCoords.xy片元是否阴影，返回1.0或 0.0
  
    if (currentDepth > lightSeeDepth+0.005)  shadow=1.0; 
    //currentDepth=projCoords.z可能大于1，规范化投影导致
    if(currentDepth > 1.0)   shadow = 0.0;  
     
    return shadow;
   
}       

void main()
{
    
    //采样纹理颜色
    vec3 TextureColor = texture(diffuseTexture, TexCoord).xyz;

    //计算光照颜色
 	vec3 norm = normalize(Normal);

	vec3 lightDir;
	if(u_lightPosition.w==1.0) 
        lightDir = normalize(u_lightPosition.xyz - FragPos);        
	else lightDir = normalize(u_lightPosition.xyz);

	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 halfDir = normalize(viewDir + lightDir);


    /*******TODO2:根据phong shading方法计算ambient,diffuse,specular*/
    vec3  ambient,diffuse,specular;
    
    ambient= ambientStrength*lightColor; 
    
	diffuse = diffuseStrength * max(dot(lightDir, norm), 0.0) * TextureColor *lightColor ; //用纹理色作为Kd材质反射率 



    if(dot(lightDir,norm)<0.0)  specular =vec3(0,0,0);//光线从背面照时，应该没有镜面光
    else specular = specularStrength * pow(max(dot(norm, halfDir), 0.0), shininess) * lightColor;
    
    //光照颜色计算
  	vec3 lightReflectColor=(ambient + diffuse + specular);


    //判定是否阴影，并对各种颜色进行混合
    float shadow = shadowCalculation(FragPosLightSpace, norm, lightDir);
	
    
    //阴影色和光照色进行混合
    vec3 resultColor=(1.0-shadow/2.0)* lightReflectColor ;
    
    FragColor = vec4(resultColor, 1.f);
}


