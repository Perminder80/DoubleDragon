private var currentObject: WeatherObject;
private var targetAngle: float;
private var lastAngle: float = 0.0;
private var transi:float = 1;
private var skymaterial: Material;
private var angleDiff: float = 100.333; //from -100.333 (sun rise) to 100.333 (sun set)
private var distanceDiff: float = 0.6;
static var lastDate: System.DateTime = System.DateTime(1, 1, 1);
var sky: GameObject;
static var shouldSkip: boolean = false; // global variable used by the main controller to decide whether to skip
function Start()
{
	if(sky == null)
	{
		Debug.LogWarning("no sky object attached!");
	}
	
	skymaterial = sky.renderer.material;
	
}
function Update () {
	if(OrangeWeatherController.selectedWeatherObject != null && currentObject != OrangeWeatherController.selectedWeatherObject)
	{
		currentObject = OrangeWeatherController.selectedWeatherObject;
//		var sunRiseTime: float = currentObject.sunRise.Hour + ((currentObject.sunRise.Minute/60.0 * 100.0)/100.0);
//			
//		var sunSetTime: float = currentObject.sunSet.Hour + ((currentObject.sunSet.Minute/60.0 * 100.0)/100.0);
		var sunRiseTime: float = CalcRiseSettime.RiseTime;
		var sunSetTime: float =  CalcRiseSettime.SetTime;
		var middayTime: float = (sunSetTime + sunRiseTime)/2;
		
		var midnightTime: float = (24 - (sunSetTime - sunRiseTime))/2.0;
		
				
		if(currentObject.isCurrent)
		{
			// current weather... calculate the angle using current time
//			var dt: System.DateTime = new System.DateTime();
//			dt = System.DateTime.Now;
//			
//			var currentTime: float = dt.Hour + ((dt.Minute/60.0 * 100.0)/100.0);
			var currentTimeHours: float = System.Convert.ToInt32((WeatherData.local["time"] as String).Substring(0,2));
			var currentTimeMinutes: float = System.Convert.ToInt32((WeatherData.local["time"] as String).Substring(3,2));
	
			var currentLocalTime: float = currentTimeHours + ((currentTimeMinutes/60.0 * 100.0)/100.0);
			if(currentLocalTime < middayTime && currentTimeHours > 0)
			{
				targetAngle = 100.333 * (middayTime - currentLocalTime)/(middayTime - sunRiseTime);
				shouldSkip = false;
			}
			else
			{
				targetAngle = -(100.333 * (middayTime - currentLocalTime)/(middayTime - sunSetTime));
				
				shouldSkip = true;
			}
		
			
		}
		else
		{
			// forcast use midday/midnight 
			if(currentObject.isDayTime)
			{
				if(OrangeWeatherController.isForward)
				{
					targetAngle = 0;
				}
				else
				{
					targetAngle = 360;

				}			
			}
			else
			{
				if(OrangeWeatherController.isForward)
				{
					targetAngle = -180;
				}
				else
				{
					targetAngle = 180;

				}

			}
			
		}
		if(System.DateTime.Equals(lastDate,System.DateTime(1, 1, 1)))//FTU no animation...
		{
			transform.eulerAngles.z = targetAngle;
//			print(targetAngle);
			// move the sky gradient according to sun position?
//			var move: float;
//			if(360 - transform.eulerAngles.z <180)
//			 	move = -(360 - transform.eulerAngles.z) * distanceDiff/angleDiff;
//			else
//			 	move = -(transform.eulerAngles.z) * distanceDiff/angleDiff;
//			skymaterial.SetTextureOffset("_SkyGradient",Vector2(0,Mathf.Clamp((move),-0.5,0)));			
			transi = 1;
		}
		else
			transi = 0;// start animation

		lastDate = currentObject.date;
		
//		if(transform.eulerAngles.z > 180)
//			lastAngle = -360 + transform.eulerAngles.z;
//		else
			lastAngle = transform.eulerAngles.z;

	}
	
	// animate
			
		if(transi < 1)
		{ 
			transi += Time.deltaTime ;
			if(360 - lastAngle < 180)
			{
				transform.eulerAngles.z = Mathf.Lerp(lastAngle,Mathf.Abs(targetAngle),transi);
			}
			else
			{
				transform.eulerAngles.z = Mathf.Lerp(lastAngle,targetAngle,transi);
			}
			
			
		}
		// move the sky gradient according to sun position?
//			if(Mathf.Abs(transform.rotation.z) <=0.76)
//			{
				var moveX: float;
	
				if(360 - transform.eulerAngles.z <180)
				 	moveX = -(360 - transform.eulerAngles.z) * distanceDiff/angleDiff;
				else
				 	moveX = -(transform.eulerAngles.z) * distanceDiff/angleDiff;
				skymaterial.SetTextureOffset("_SkyGradient",Vector2(0,Mathf.Clamp((moveX),-0.6,0)));
//			}
	
}