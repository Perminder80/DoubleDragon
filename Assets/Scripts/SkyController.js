/*
	here we control the sky color changes based on the time of the day (sun location...etc)
*/

var sunContainer: Transform;// we rotate this transform to move the sun 
var theSun:Light;
var nightLight: Light;
private var skymaterial: Material;

private var daynighttransitionTime: float = 0;
private var weatherStateTransitionTime: float = 0;
var moveX:float;
var scrollSpeed = 0.0;


private var offset = -0.5;

private var timePeriodStarted: float = 0;
private var currentObject: WeatherObject;
private var darkCloudsColor: Color = Color(100.0/255.0,100.0/255.0,100.0/255.0,1);
private var lightCloudsColor: Color = Color(200.0/255.0,200.0/255.0,200.0/255.0,1);


// sky state used for transition
private var skyColorCurrent: Color;
private var starsColorCurrent: Color;
private var sunIntesityCurrent: float;
private var cloudFactorCurrent: float;

private var skyColorTarget: Color;
private var starsColorTarget: Color;
private var sunIntesityTarget: float;
private var cloudFactorTarget: float;


private var transi:float;
private var lastDate: System.DateTime = System.DateTime(1, 1, 1);

var windows: GameObject;

var nightTimeSound: AudioClip;
var dayTimeSound: AudioClip;
var owlSound: AudioClip;

var streetLampRenderer: Renderer;
function Start()
{
	skymaterial = renderer.material;
	currentObject = null;

	if(sunContainer == null)
	{
		Debug.LogWarning("Sun container is not attached!");
	}
	if(theSun == null)
	{
		Debug.LogWarning("Sun is not attached!");

	}
}
function Update () 
{
	audio.mute = OrangeWeatherController.muteSound;	
	if(OrangeWeatherController.selectedWeatherObject != null)
	{
		if(currentObject != OrangeWeatherController.selectedWeatherObject)
		{
			
			currentObject = OrangeWeatherController.selectedWeatherObject;
			scrollSpeed = currentObject.windSpeed/1000.0 * Mathf.Exp(0.1);
//			print(currentObject.cloudPercent);
			switch(currentObject.cloudPercent)
			{
				case 0:
	
					// no clouds
					cloudFactorTarget = 1;
					if(currentObject.isDayTime)
					{
						skyColorTarget = Color.white;
						starsColorTarget = Color.black;
						sunIntesityTarget = 0.6;
					}
					else
					{
						skyColorTarget = Color.black;
						starsColorTarget = Color.white;
						sunIntesityTarget = 0.4;
	
					}
					
					break;
				case 1:
	
					// cloudy
					sunIntesityTarget = 0.35;
					starsColorTarget = Color.black;

					if(currentObject.isDayTime)
					{
						skyColorTarget = Color(120.0/255.0,120.0/255.0,120.0/255.0,1);
						cloudFactorTarget = 0;

					}
					else
					{
						skyColorTarget = Color.black;
						cloudFactorTarget = 0.4;

					}
					if(currentObject.rainAmount == 1 || currentObject.rainAmount == 0.5)
					{
						if(currentObject.isDayTime)
						{
							skyColorTarget = Color(60.0/255.0,60.0/255.0,60.0/255.0,1);
						}
						else
							skyColorTarget = Color.black;
	
					}
					
					break;
				case 0.1:
				case 0.25:
					if(currentObject.isDayTime)
					{
						skyColorTarget = Color.white;
						starsColorTarget = Color.black;
						sunIntesityTarget = 0.55;
						cloudFactorTarget = 0.25;

					}
					else
					{
						skyColorTarget = Color.black;
						starsColorTarget = Color.white;
						sunIntesityTarget = 0.4;
						cloudFactorTarget = 0.3;

					}
					break;
				case 0.75:
					if(currentObject.isDayTime)
					{
						skyColorTarget = Color.white;
						starsColorTarget = Color.black;
						sunIntesityTarget = 0.35;
						cloudFactorTarget = 0.1;

					}
					else
					{
						skyColorTarget = Color.black;
						starsColorTarget = Color(50.0/255.0,50.0/255.0,50.0/255.0,1);
						sunIntesityTarget = 0.4;
						cloudFactorTarget = 0.3;

					}
					if(currentObject.rainAmount >= 0.5)
					{
						skyColorTarget = Color.black;
						sunIntesityTarget = 0.35;
					}
					break;
			}
			if(System.DateTime.Equals(lastDate,System.DateTime(1, 1, 1)))//FTU no animation...
			{
				skymaterial.SetColor("_SkyColor",skyColorTarget);
				skymaterial.SetColor("_StarsColor",starsColorTarget);
				skymaterial.SetFloat("_CloudFactor",cloudFactorTarget);

				theSun.intensity = sunIntesityTarget;
				transi = 1;
			}
			else
			{
				transi = 0;// animate;
	
			}
			
			skyColorCurrent = skymaterial.GetColor("_SkyColor");
			starsColorCurrent = skymaterial.GetColor("_StarsColor");
			sunIntesityCurrent = theSun.intensity;
			cloudFactorCurrent = skymaterial.GetFloat("_CloudFactor");
			lastDate = currentObject.date;
				   
		}
		
	// check if we are in night time...
	if(Mathf.Abs(sunContainer.rotation.z) >0.76)
	{
		// we are!
//		theSun.intensity = 0.4;
		
		streetLampRenderer.materials[1].SetTextureOffset("_MainTex",Vector2(0,0));
		windows.renderer.sharedMaterial.SetTextureOffset("_MainTex",Vector2(0,0.5));
		if(daynighttransitionTime < 1)
		{
			daynighttransitionTime += Time.deltaTime * 2;
		
			theSun.color = Color.Lerp(Color.white,Color(49.0/255.0,101.0/255.0,1,1),daynighttransitionTime);
			nightLight.intensity = Mathf.Lerp(0,2,daynighttransitionTime);
			theSun.intensity = Mathf.Lerp(sunIntesityTarget,0,daynighttransitionTime);
//			skymaterial.SetColor("_SkyColor",Color.Lerp(skyColorCurrent,skyColorTarget,daynighttransitionTime));
//			skymaterial.SetColor("_StarsColor",Color.Lerp(starsColorCurrent,starsColorTarget,daynighttransitionTime));
		}
		
		//check the sound
		if(currentObject.rainAmount == 0 && currentObject.windSpeed < 30  && !currentObject.isDayTime)
		{
			if(!audio.isPlaying)
			{
				if(currentObject.temp > 10 )
				{
					audio.clip = nightTimeSound;
					audio.volume = 0.25;
					audio.Play();
				}
				else
				{
					audio.clip = owlSound;
					audio.volume = 1;
					audio.Play();
				}
			}
		}
	}
	else
	{
		// we are not..
//		theSun.intensity = 0.6;
		streetLampRenderer.materials[1].SetTextureOffset("_MainTex",Vector2(0.5,0));

		windows.renderer.sharedMaterial.SetTextureOffset("_MainTex",Vector2(0,0));
//		nightLight.enabled = false;
//		theSun.enabled = true;
//		if(audio.isPlaying) audio.Stop();
		//check the sound
		if(currentObject.rainAmount == 0 && currentObject.windSpeed < 30  && currentObject.temp > 10 && currentObject.isDayTime)
		{
			if(!audio.isPlaying)
			{
				audio.clip = dayTimeSound;
				audio.volume = 1;
				audio.Play();
			}
		}
		if(daynighttransitionTime > 0)
		{
			daynighttransitionTime -= Time.deltaTime * 2;
		
			theSun.color = Color.Lerp(Color.white,Color(49.0/255.0,101.0/255.0,1,1),daynighttransitionTime);
			nightLight.intensity = Mathf.Lerp(0,2,daynighttransitionTime);
			theSun.intensity = Mathf.Lerp(sunIntesityTarget,0,daynighttransitionTime);
//			skymaterial.SetColor("_SkyColor",Color.Lerp(skyColorTarget,skyColorCurrent,daynighttransitionTime));
//			skymaterial.SetColor("_StarsColor",Color.Lerp(starsColorTarget, starsColorCurrent,daynighttransitionTime));

		}
	}
	
	
	if(transi < 1)
	{ 
		transi += Time.deltaTime;
		
		skymaterial.SetColor("_SkyColor",Color.Lerp(skyColorCurrent,skyColorTarget,transi));
		skymaterial.SetColor("_StarsColor",Color.Lerp(starsColorCurrent,starsColorTarget,transi));
		skymaterial.SetFloat("_CloudFactor",Mathf.Lerp(cloudFactorCurrent,cloudFactorTarget,transi));
		
		if(currentObject.isDayTime)
			theSun.intensity = Mathf.Lerp(sunIntesityCurrent,sunIntesityTarget,transi);
	}	
	else
	{
		OrangeWeatherController.isChangingState = false;
	}
	// move the clouds
	
	if(currentObject.windSpeed > 5 && currentObject.cloudPercent != 0)
	{
		if(offset > 1)
		{
			offset = 0;
		}
		offset += scrollSpeed * Time.deltaTime;
		
    	skymaterial.SetTextureOffset("_Cloud1", Vector2(offset,offset*2));
    	skymaterial.SetTextureOffset("_Cloud2", Vector2(offset*2,offset*3));
    }
    if(currentObject.isFoggy && !RenderSettings.fog)
    	RenderSettings.fog = true;
    
    if(!currentObject.isFoggy && RenderSettings.fog)
    	RenderSettings.fog = false;

   }
}