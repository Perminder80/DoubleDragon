// script to control search, info & mute buttons
private var ray: Ray ;
private var hit: RaycastHit;

var soundOnTex: Texture2D;
var soundOffTex: Texture2D;
var muteButtonRenderer: Renderer;
var prefab: Transform;
private var buttonTouched: boolean;
function Update () {
		if(Input.touchCount > 0)
		{
			var touch: Touch = Input.touches[0];
			if(touch.phase == TouchPhase.Began)
			{
				ray = Camera.main.ScreenPointToRay(touch.position);
					
	//			Debug.DrawLine(ray.origin,ray.direction * 2);
		
				if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
				{
					if(hit.collider.gameObject.layer == 27)
					{
						CameraScript.shouldLockCamera = true;
					}
					
					if( hit.collider.gameObject.layer == 22 || hit.collider.gameObject.layer == 23 || hit.collider.gameObject.layer == 24)
					{
						CameraScript.shouldLockCamera = true;
						buttonTouched = true;
					}
				}
					
			}
			if(touch.phase == TouchPhase.Canceled )
			{
				CameraScript.shouldLockCamera = false;
				buttonTouched = false;

			}
			if(touch.phase == TouchPhase.Moved && buttonTouched)
			{
				CameraScript.shouldLockCamera = false;
				buttonTouched = false;
			}
			if(touch.phase == TouchPhase.Ended)
			{
				buttonTouched = false;
				
				if (CameraScript.shouldLockCamera)
				{
					CameraScript.shouldLockCamera = false;

					ray = Camera.main.ScreenPointToRay(touch.position);
					
					if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
					{
						if(hit.collider.gameObject.layer == 27 && !OrangeWeatherController.displayInfoScreen)//search
						{
							CameraScript.shouldLockCamera = false;
							OrangeWeatherController.displaySearchUI = true;
							if (prefab)
				    				hit.transform.Instantiate(prefab, 
				    				hit.point - Vector3(0,0,0),  
				    				Quaternion.identity );
	
						}
						if(hit.collider.gameObject.layer == 22)//accu
						{
							Application.OpenURL((WeatherData.weatherURL.Replace(" ","%20")));
							if (prefab)
				    				hit.transform.Instantiate(prefab, 
				    				hit.point - Vector3(0,0,0),  
				    				Quaternion.identity );
	
						}
						if(hit.collider.gameObject.layer == 23 && !OrangeWeatherController.displaySearchUI)//info
						{
							OrangeWeatherController.displayInfoScreen = true;
							OrangeWeatherController.scrollPosition = Vector2(0,0);
							if (prefab)
				    				hit.transform.Instantiate(prefab, 
				    				hit.point - Vector3(0,0,0),  
				    				Quaternion.identity );
	
						}
						if(hit.collider.gameObject.layer == 24 && !OrangeWeatherController.displaySearchUI && !OrangeWeatherController.displayInfoScreen)//mute
						{
							if(!OrangeWeatherController.muteSound)
							{
								muteButtonRenderer.material.mainTexture = soundOffTex;
								OrangeWeatherController.muteSound = true;
							}
							else
							{
								muteButtonRenderer.material.mainTexture = soundOnTex;
	
								OrangeWeatherController.muteSound = false;
							}
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