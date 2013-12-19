private var rainEmitter: ParticleEmitter;
private var maxRain: int = 500;
private var currentObject: WeatherObject;

var rainSound: AudioClip;
var heavyRainSound: AudioClip;
function Start()
{
	rainEmitter = particleEmitter;
	
	if(rainEmitter == null)
	{
		Debug.LogWarning("Script not attached to Particle Emitter");
	}
	else
	{
		rainEmitter.maxEmission = 0;
		rainEmitter.worldVelocity.x = 0;
		rainEmitter.emit = true;
	}

	
}
function Update () {
	
	audio.mute = OrangeWeatherController.muteSound;	

	if(rainEmitter!= null && OrangeWeatherController.selectedWeatherObject != null)
	{
		if(currentObject != OrangeWeatherController.selectedWeatherObject)
		{
			currentObject = OrangeWeatherController.selectedWeatherObject;
			rainEmitter.maxEmission = currentObject.rainAmount * maxRain;
//			rainEmitter.worldVelocity.z = currentObject.windSpeed;
		if(currentObject.rainAmount != 0)
		{
			if(currentObject.rainAmount <= 0.5)
			{
				audio.clip = rainSound;
				audio.loop = true;
				audio.Play();
			}
			else
			{
				audio.clip = heavyRainSound;
				audio.loop = true;
				audio.Play();

			}
		
		}
		else
		{
			audio.Stop();
		}
		}
		
		
	}
	
}