private var snowEmitter: ParticleEmitter;
private var maxSnow: int = 200;
var currentObject: WeatherObject;


function Start()
{
	snowEmitter = particleEmitter;
	
	if(snowEmitter == null)
	{
		Debug.LogWarning("Script not attached to Particle Emitter");
	}
	else
	{
		snowEmitter.maxEmission = 0;
		snowEmitter.worldVelocity.x = 0;
		snowEmitter.emit = true;
	}

	
}
function Update () {
	
	if(snowEmitter!= null && OrangeWeatherController.selectedWeatherObject != null)
	{
		if(currentObject != OrangeWeatherController.selectedWeatherObject)
		{
			currentObject = OrangeWeatherController.selectedWeatherObject;
			snowEmitter.maxEmission = currentObject.snowAmount * maxSnow;
			snowEmitter.minEmission = currentObject.snowAmount * maxSnow;
		}
		
		
	}
	
}