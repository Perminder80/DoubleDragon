private var currentObject: WeatherObject;
var thunderSound: AudioClip;

static var thunderLoopON: boolean = false;
function Update () {
// weather state related animations
	audio.mute = OrangeWeatherController.muteSound;	

	if(OrangeWeatherController.selectedWeatherObject != null && currentObject != OrangeWeatherController.selectedWeatherObject)
	{
		currentObject = OrangeWeatherController.selectedWeatherObject;
		
		if(currentObject.isThunder)
		{
			// we have thunder
			
			//flick light and play sound every few seconds
			audio.Stop();
			CancelInvoke();
			StopAllCoroutines();
			thunderLoopON = false;
			light.enabled = false;	
			ThunderStart();
		}
		else
		{
			// no thunder
			if(audio.isPlaying)
			{
				audio.Stop();
				CancelInvoke();
				StopAllCoroutines();
				thunderLoopON = false;
					light.enabled = false;
				
			}
		}
	}
}
function ThunderStart()
{
	StartCoroutine("ThunderLoop");

}
function ThunderLoop()
{

	if(currentObject.isThunder)
	{
			thunderLoopON = true;
		    audio.clip = thunderSound;
		    audio.Play();
			light.enabled = true;
		
			yield WaitForSeconds(0.2);
			
			light.enabled = false;

			yield WaitForSeconds(0.2);
			
			light.enabled = true;
			
			yield WaitForSeconds(0.1);
			
			light.enabled = false;
			
			yield WaitForSeconds(0.1);
			
			light.enabled = true;

			yield WaitForSeconds(0.5);
			
			light.enabled = false;

			thunderLoopON = false;

			
		
	}
	
	Invoke("ThunderStart",7);
	
}