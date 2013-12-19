var groundRenderer: Renderer;
private var currentObject: WeatherObject;
private var transi: float = 1;
private var current: float;
private var target: float;
function Update () 
{
	if(OrangeWeatherController.selectedWeatherObject != null)
	{
		if(currentObject != OrangeWeatherController.selectedWeatherObject)
		{
			currentObject = OrangeWeatherController.selectedWeatherObject;
			
			
			target = currentObject.snowAmount;
			current = groundRenderer.material.GetFloat("_Blend");

			if(current != currentObject.snowAmount)
			{
				transi = 0;
			}
			
			
			if(currentObject.afterHeavySnow)
			{
			
				if(currentObject.temp < 0)
				{
					// keep most of the snow
					target = 1;
					transi = 0;
				}
				else
				{
					// keep most of the snow
					target = 0.5;
					transi = 0;
				}
			}
		}
		
	}
	
	if(transi < 1)
	{
		transi += Time.deltaTime;
		groundRenderer.material.SetFloat("_Blend",Mathf.Lerp(current,target,transi));
	}

}