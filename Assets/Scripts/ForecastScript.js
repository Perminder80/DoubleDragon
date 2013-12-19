// everything on the board is controlled here

private var currentObject: WeatherObject;
private var numberOfDays: int = 3;// this class supports 3 day forecast only...
private var rowObjects: Array = new Array();

private var ray: Ray ;
private var hit: RaycastHit;
var prefab: Transform;
var headText: TextMesh;
var dayText: TextMesh;
var nightText: TextMesh;

function Start()
{
	// Cache GameObjects in Hashtable
	for(var i = 1; i< numberOfDays+1; i++)
	{
		var tempDay: TextMesh = GameObject.Find("/WD_kennel/Plane/T_Day"+i).GetComponent(TextMesh);
		var tempNight: TextMesh = GameObject.Find("/WD_kennel/Plane/T_Night"+i).GetComponent(TextMesh);
		
		var iconDay: Renderer = GameObject.Find("/WD_kennel/Plane/I_Day"+i).GetComponent(Renderer);
		var iconNight: Renderer = GameObject.Find("/WD_kennel/Plane/I_Night"+i).GetComponent(Renderer);
		
		
		var dayName: TextMesh = GameObject.Find("/WD_kennel/Plane/DAY"+i).GetComponent(TextMesh);
		var forecastDay: Hashtable = new Hashtable();
		forecastDay.Add("tempD",tempDay);
		forecastDay.Add("tempN",tempNight);
		forecastDay.Add("iconD",iconDay);
		forecastDay.Add("iconN",iconNight);
		forecastDay.Add("dayName",dayName);

		rowObjects.Add(forecastDay);
		headText.text = WeatherData.txtMan.GetText("3_DAY_FORECAST");
		dayText.text = WeatherData.txtMan.GetText("FORECAST_DAY").ToUpper();
		nightText.text = WeatherData.txtMan.GetText("FORECAST_NIGHT").ToUpper();

		
	}
}
function Update () {

	if(OrangeWeatherController.selectedWeatherObject != null)
	{
		// update the board
//		if(currentObject != OrangeWeatherController.selectedWeatherObject)
//		{
			currentObject = OrangeWeatherController.selectedWeatherObject;
			for(var i = 1; i< numberOfDays+1; i++)
			{
				var forecastDay: Hashtable = rowObjects[i-1] as Hashtable;
				(forecastDay["tempD"] as TextMesh).text = (WeatherData.weatherObjects[(i * 2) - 1] as WeatherObject).temp+"°";
				(forecastDay["tempN"] as TextMesh).text = (WeatherData.weatherObjects[(i * 2)] as WeatherObject).temp+"°";
				
				(forecastDay["iconD"] as Renderer).material.mainTexture = Resources.Load("Chalked icons/"+(WeatherData.weatherObjects[(i * 2) - 1] as WeatherObject).weatherID);
				(forecastDay["iconN"] as Renderer).material.mainTexture = Resources.Load("Chalked icons/"+(WeatherData.weatherObjects[(i * 2) ] as WeatherObject).weatherID);
				
				(forecastDay["dayName"] as TextMesh).text = (WeatherData.weatherObjects[(i * 2) - 1] as WeatherObject).date.ToString("ddd",OrangeWeatherController.dateFormat).ToUpper();
	
			}
//		}
		
//		 detect touches on the board
		
		if(Input.touchCount > 0)
		{
			var touch: Touch = Input.touches[0];
			if(!OrangeWeatherController.isChangingState && !DogController.isDogInteracting)
			{
				if(touch.phase == TouchPhase.Ended)
				{
					ray = Camera.main.ScreenPointToRay(touch.position);
						
		//			Debug.DrawLine(ray.origin,ray.direction * 2);
			
					if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
					{
						var name: String;
						var index: int;
						if(hit.collider.gameObject.layer == 25) // hit a day forecast
						{
							name = hit.collider.gameObject.name;
							index = System.Convert.ToInt16(name.Substring(name.Length - 1, 1)) * 2 -1;
							OrangeWeatherController.selectedWeatherID = index;
							OrangeWeatherController.selectedWeatherObject = WeatherData.weatherObjects[index];
							OrangeWeatherController.isChangingState = true;
							if (prefab)
			    				hit.transform.Instantiate(prefab, 
			    				hit.point - Vector3(0,0,0),  
			    				Quaternion.identity );
						}
						if(hit.collider.gameObject.layer == 26) // hit a night forecast
						{
							name = hit.collider.gameObject.name;
							index = System.Convert.ToInt16(name.Substring(name.Length - 1, 1))* 2;
							OrangeWeatherController.selectedWeatherID = index;
							OrangeWeatherController.selectedWeatherObject = WeatherData.weatherObjects[index];
							OrangeWeatherController.isChangingState = true;

							if (prefab)
			    				hit.transform.Instantiate(prefab, 
			    				hit.point - Vector3(0,0,0),  
			    				Quaternion.identity );
						}
					}
				}
			}
		}
		
	}
	
	
}