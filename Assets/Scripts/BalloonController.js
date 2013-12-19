var currentObject: WeatherObject;
var balloon: Transform;
var scrollSpeed = 0.1;

var period: float = 1.0;

private var offset: float = 1230.0;

private var timePeriodStarted: float = 0;

function Start()
{
	balloon = transform;
	
}
function Update () {
	
	if(OrangeWeatherController.selectedWeatherObject != null)
	{
		if(currentObject != OrangeWeatherController.selectedWeatherObject)
		{
			currentObject = OrangeWeatherController.selectedWeatherObject;	
			if(currentObject.isDayTime && currentObject.cloudPercent <= 0.25)
			{
				// show the balloon
				timePeriodStarted = Time.time;
	    		offset = 1190.5;
	    		scrollSpeed = 0.1 +(currentObject.windSpeed/100.00);
			}
			else
			{
				// dont show the balloon
				scrollSpeed = 10;
			}
			
		}
		
	}
	
	if(Time.time - timePeriodStarted > period)
	{
	   
	    
	    if(offset > 1230)
	    {
	    	if(currentObject.isDayTime && currentObject.cloudPercent <= 0.25)
			{
				timePeriodStarted = Time.time;
	    		offset = 1190.5;
			}
			else
			{
				// dont show the balloon
				
			}
	    	
	    }
	    else
	    {
	    	offset += scrollSpeed * Time.deltaTime;

	    	balloon.position.x = offset;

	    }
    }

}