private var currentObject: WeatherObject;
var emitter: ParticleEmitter;
var windSound: AudioClip;
var balloon: Rigidbody;
function Update () {
// weather state related animations
	audio.mute = OrangeWeatherController.muteSound;	

	if(OrangeWeatherController.selectedWeatherObject != null && currentObject != OrangeWeatherController.selectedWeatherObject)
	{
	
		
		currentObject = OrangeWeatherController.selectedWeatherObject;

		// check the wind speed?
		var wSpeed: int;
		if(WeatherData.metric == 0)
		{
			// non metric.. convert to metric							
			wSpeed	= Mathf.Round(currentObject.windSpeed * 1.609344 ); 
		}
		else
		{
			wSpeed	= currentObject.windSpeed; 

		}
		if(wSpeed >= 30)
		{
			emitter.emit = true;
			if(!audio.isPlaying)
			{
				audio.clip = windSound;
				audio.loop = true;
				audio.Play();
			}
			balloon.AddForce(Vector3(0,10 , 0.2 *wSpeed),ForceMode.Impulse);

		}
		else
		{
			emitter.emit = false;
			if(audio.isPlaying)
			{
				audio.Stop();
			}
		}
		
	}

}