private var ray: Ray ;
private var hit: RaycastHit;
private var currentObject: WeatherObject;
private var lastAnimation: String = "";
private var canPlayRandomAnim: boolean = true;
private var isPlayingCrouchAnim: boolean = false;
private var dogSleeping: boolean = false;
var noseCollider: SphereCollider;
var patCollider: BoxCollider;
var chestCollider: BoxCollider;

var invokeCrouchAnimationCycle: float = 10;
var timeCounter: float = 0;
var dogRenderer: Renderer;
var dogEyesMaterial: Material;
 
var breathEmitter: ParticleEmitter;

static var isDogSleeping: boolean = false;

static var isDogInteracting: boolean = false;

function Start () 
{
//	 set up animations modes
	animation["anim01_sit_touch"].wrapMode = WrapMode.Once;
	animation["anim01_sit_touch"].layer = 11;
	animation["anim01_sit_touch"].blendMode = AnimationBlendMode.Blend;
	
	animation["anim01_sit_pathead"].wrapMode = WrapMode.Once;
	animation["anim01_sit_pathead"].layer = 11;
	animation["anim01_sit_pathead"].blendMode = AnimationBlendMode.Blend;
	
	animation["anim01_rubchest"].wrapMode = WrapMode.Once;
	animation["anim01_rubchest"].layer = 11;
	animation["anim01_rubchest"].blendMode = AnimationBlendMode.Blend;
	
	animation["anim01_Crouch_sleep_dreamtouch"].wrapMode = WrapMode.Once;
	animation["anim01_Crouch_sleep_dreamtouch"].layer = 11;
	animation["anim01_Crouch_sleep_dreamtouch"].blendMode = AnimationBlendMode.Blend;
	
	animation["anim01_Crouch_Loop"].wrapMode = WrapMode.Once;
	animation["anim01_Crouch_Loop"].layer = 10;
	animation["anim01_Crouch_Loop"].blendMode = AnimationBlendMode.Additive;
	
	animation["anim01_sit_gesture_left"].wrapMode = WrapMode.Once;
	animation["anim01_sit_gesture_left"].layer = 11;
	animation["anim01_sit_gesture_left"].blendMode = AnimationBlendMode.Blend;
	
	animation["anim01_sit_gesture_right"].wrapMode = WrapMode.Once;
	animation["anim01_sit_gesture_right"].layer = 11;
	animation["anim01_sit_gesture_right"].blendMode = AnimationBlendMode.Blend;
	
	dogEyesMaterial = dogRenderer.materials[2] as Material;

	if(noseCollider == null)
	{
		Debug.LogWarning("no collider attached");
	}
}

function LateUpdate()
{
	// weather state related animations
	
	
	if(OrangeWeatherController.selectedWeatherObject != null && currentObject != OrangeWeatherController.selectedWeatherObject)
	{
		audio.Stop();

		var currentTimeHours: float = System.Convert.ToInt32((WeatherData.local["time"] as String).Substring(0,2));
		currentObject = OrangeWeatherController.selectedWeatherObject;
		
		var temp: int;
		var wSpeed: int;
		
		if(WeatherData.metric == 0)
		{
			// non metric.. convert to metric
			temp = Mathf.Round((currentObject.temp -32) * 5.0/9.0);
							
			wSpeed	= Mathf.Round(currentObject.windSpeed * 1.609344 ); 
		}
		else
		{
			temp = currentObject.temp;
							
			wSpeed	= currentObject.windSpeed;
		}
		if(currentObject.isCurrent)
		{
			if(currentTimeHours < 23 && currentTimeHours > 5)
			{
				isDogSleeping = false;
			}
			else
			{
				isDogSleeping = true;
			}
		}
		else
		{
			if(currentObject.isDayTime)
			{
				isDogSleeping = false;

			}
			else
			{
				isDogSleeping = true;

			}
		}
		
		if(!isDogSleeping)
		{
			dogSleeping = false;
	
			if(lastAnimation == "anim01_Crouch_miserable_enter" || lastAnimation == "anim01_Crouch_miserable")
			{
				lastAnimation = "";
				canPlayRandomAnim = false;
	
				animation["anim01_Crouch_miserable_enter"].speed = -4;
				animation.Play("anim01_Crouch_miserable_enter");
			}
			// check the wind speed?
			
			if(currentObject.rainAmount < 1)
			{
			if(wSpeed < 10)
			{
				//  idle
				animation.CrossFade("anim01_sit_gentle_pant",0.5);
						canPlayRandomAnim = true;
	
			}
			else if( wSpeed >= 10 && wSpeed < 30)
			{
				// gentle ears wag
				animation.CrossFade("anim01_sit_pant_ears_wag_gentle",0.5);
						canPlayRandomAnim = true;
	
				
			}
			else 
			{
				// ears wag
				
	//			animation.CrossFade("anim01_Wind_Enter");
	
				animation.CrossFade("anim01_Wind_LOOP",0.5);
	
				canPlayRandomAnim = false;
	
			}
			}
			else
			{
				animation.CrossFade("sit_rain_loop",0.5);
				canPlayRandomAnim = false;
			}
			
			if(temp > 27 && currentObject.rainAmount ==0)
			{
				animation.CrossFade("sit_smile_loop",0.5);
				canPlayRandomAnim = false;
				
			}
			if(temp < 5)
			{
				animation.CrossFade("anim01_sit_shiver_loop",0.5);
				canPlayRandomAnim = false;
			}
			
		}
		else
		{
				dogSleeping = true;
				lastAnimation ="anim01_Crouch_miserable_enter";
	
				animation["anim01_Crouch_miserable_enter"].speed = 4;
	//			animation.CrossFade("anim01_Crouch_miserable");
	
				animation.CrossFade("anim01_Crouch_miserable_enter",0.5);
				canPlayRandomAnim = false;
		}
		if(temp < 5)
		{
		
			breathEmitter.emit = true;
		}
		else if (temp >= 5)
		{
			breathEmitter.emit = false;
	
		}
	}
	
	// touch events related animations
	if(Input.touchCount == 1 && !isDogInteracting && !OrangeWeatherController.displaySearchUI && !OrangeWeatherController.displayInfoScreen)
	{	
		var touch: Touch = Input.touches[0];
		
		if(!dogSleeping)
		{
			if(touch.phase == TouchPhase.Began)
			{
				ray = Camera.main.ScreenPointToRay(touch.position);
					
	//			Debug.DrawLine(ray.origin,ray.direction * 2);
		
				if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
	   		 	{
	   		 		if(hit.collider.gameObject.layer == 30 || hit.collider.gameObject.layer == 29 || hit.collider.gameObject.layer == 28)
					{
						var i: int = Random.Range(0,3);
//						if(hit.collider.gameObject.layer == 30)
						if(i == 0)
						{
							animation.CrossFade("anim01_sit_touch");
							canPlayRandomAnim = false;
							isDogInteracting = true;
							Invoke("DogFinishedInteracting",animation["anim01_sit_touch"].clip.length);

						}
//						else if(hit.collider.gameObject.layer == 29)
						else if(i == 1)
						{
							animation.CrossFade("anim01_sit_pathead");
							canPlayRandomAnim = false;
							isDogInteracting = true;
							Invoke("DogFinishedInteracting",animation["anim01_sit_pathead"].clip.length);

						}
//						else if(hit.collider.gameObject.layer == 28)
						else if(i == 2)
						{
		//					animation.CrossFade("anim01_rubchest");
		//					canPlayRandomAnim = false;
							animation.CrossFade("anim01_rubchest");
							
							
							canPlayRandomAnim = false;
							isDogInteracting = true;
							Invoke("DogFinishedInteracting",animation["anim01_rubchest"].clip.length);

//							shouldLockCamera = true;
//							isDogInteracting = false;
						}
					}
					
					
				}
				
			}
			
//			if(touch.phase == TouchPhase.Moved)
//			{
//				ray = Camera.main.ScreenPointToRay(touch.position);
//					
//	//			Debug.DrawLine(ray.origin,ray.direction * 2);
//		
//				if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
//	   		 	{
//					
//					if(hit.collider.gameObject.layer == 28 && shouldLockCamera)
//					{
//						animation.CrossFade("anim01_rubchest");
//						
//						
//						canPlayRandomAnim = false;
//						isDogInteracting = true;
//					}
//					
//				}
//				else
//				{
//					shouldLockCamera = false;
//				}
//				
//			}
			
			if(touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
			{
				if(CameraScript.shouldLockCamera)
				{
					CameraScript.shouldLockCamera = false;
				}
	
			}
		}
		else
		{
			if(touch.phase == TouchPhase.Began)
			{
				ray = Camera.main.ScreenPointToRay(touch.position);
					
	//			Debug.DrawLine(ray.origin,ray.direction * 2);
		
				if(Physics.Raycast(ray.origin, ray.direction * 2,hit))
	   		 	{
					if(hit.collider.gameObject.layer == 30 || hit.collider.gameObject.layer == 29 || hit.collider.gameObject.layer == 28)
					{
						audio.Stop();
						lastAnimation ="anim01_Crouch_miserable_enter";

						animation.CrossFade("anim01_Crouch_sleep_dreamtouch");
						canPlayRandomAnim = false;
						isDogInteracting = true;
						Invoke("DogFinishedInteracting",animation["anim01_Crouch_sleep_dreamtouch"].clip.length);
					}
					
	
				}
				
			}
			
		}
	}
	// random animations??
	timeCounter += Time.deltaTime;
	
	if(timeCounter > invokeCrouchAnimationCycle)
	{
		isPlayingCrouchAnim = true;

		timeCounter = 0;

		CrouchAnimation();
	}
	else
	{
		isPlayingCrouchAnim = false;
	}
	
	if(OrangeWeatherController.displaySearchUI)
	{
			isDogInteracting = false;

	}
}
function CrouchAnimation()
{
	if(canPlayRandomAnim && lastAnimation == "")
	{
		isPlayingCrouchAnim = true;
		animation.CrossFade("anim01_Crouch_Loop");
		
		
	}
}
function PlayWindLoop()
{
	animation.CrossFade("anim01_Wind_LOOP");

}

function PlayMiserableLoop()
{
	lastAnimation ="anim01_Crouch_miserable";

	animation.CrossFade("anim01_Crouch_miserable");
	canPlayRandomAnim = false;


}

function PlayRainLoop()
{
}

function DogFinishedInteracting()
{
	isDogInteracting = false;
	CameraScript.shouldLockCamera = false;
}


function GestureLeft()
{
	animation.CrossFade("anim01_sit_gesture_left");
	canPlayRandomAnim = false;
	isDogInteracting = true;
	Invoke("DogFinishedInteracting",animation["anim01_sit_gesture_left"].clip.length);

}

function GestureRight()
{
	animation.CrossFade("anim01_sit_gesture_right");
	canPlayRandomAnim = false;
	isDogInteracting = true;
	Invoke("DogFinishedInteracting",animation["anim01_sit_gesture_right"].clip.length);

}