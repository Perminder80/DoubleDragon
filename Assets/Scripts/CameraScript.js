var target: Transform;
var limit: float = 10.0;
var moved: float = 0;
private var amtToMove: float;
var speed: float= 7;

var initTrans: float = 0;
var lockCamera: float = 1;
private var targetLock: float = 0;
private var currentLock: float = 0;
private var touchStartedPosX : float = 0;
private var isMoving: boolean = false;
private var dogController: DogController;

var dogPrefab: GameObject;

static var shouldLockCamera: boolean = false;

//function Awake()
//{
//
//#if UNITY_ANDROID
//	Screen.SetResolution (320, 480, true);
//#endif
//	
//}

function Start()
{
	target = transform;
	dogController = dogPrefab.GetComponent("DogController") as DogController;
}
function Update () 
{
	if(initTrans < 1)
	{
		initTrans+= Time.deltaTime;
		
		transform.eulerAngles.x = Mathf.Lerp(26,6.222,initTrans);
		
		transform.position.y =Mathf.Lerp(40.32,39.79384,initTrans);
		transform.position.z =Mathf.Lerp(5.738652,6.11135,initTrans);

	}
	// move the camera 
	if(Input.touchCount > 0 && !shouldLockCamera && !OrangeWeatherController.displaySearchUI && !OrangeWeatherController.displayInfoScreen && lockCamera >=1)
	{
		var touch = Input.touches[0];
		
		if(touch.phase == TouchPhase.Began)
		{
			touchStartedPosX = touch.position.x;
		}
		if(touch.phase == TouchPhase.Moved)
		{
				isMoving = true;
				if(touch.deltaPosition.x > 0)
				{
					if(moved > -limit)
					{
						moved += speed * Time.deltaTime * -touch.deltaPosition.x;
						if(moved < -limit)
						{
							amtToMove = -limit - (moved-speed * Time.deltaTime * -touch.deltaPosition.x);
							moved = -limit;
							if(!DogController.isDogSleeping)
								dogController.GestureRight();

						}
						else
						{
							amtToMove = speed * Time.deltaTime * -touch.deltaPosition.x;

						}
						transform.RotateAround(target.position,Vector3.up,amtToMove);
					}
				}
				else
				{
					if(moved < limit)
					{
						moved += speed* Time.deltaTime * -touch.deltaPosition.x;
						if(moved > limit)
						{
							amtToMove = -((moved-speed * Time.deltaTime * -touch.deltaPosition.x) - limit);
							moved = limit;
							if(!DogController.isDogSleeping)
								dogController.GestureLeft();

						}
						else
						{
							amtToMove = speed * Time.deltaTime * -touch.deltaPosition.x;
						}
						transform.RotateAround(target.position, Vector3.up, amtToMove);
					}
	
				}
		}
		if(touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
		{
			// make the camera lock in three positions (dog, house, balloon)
			
			if(isMoving)
			{
				isMoving = false;
				currentLock = target.eulerAngles.y;
	//			print(currentLock);
				lockCamera = 0;
				if(touch.position.x < touchStartedPosX)
				{
					if(Mathf.Round(currentLock) <= limit)
					{
						targetLock = limit;
						
						moved = limit;
						if(!DogController.isDogSleeping)
								dogController.GestureLeft();
					}
					else
					{
						targetLock = 360;
						moved = 0;
					}
				}
				else
				{
					if(currentLock >= 360 - limit)
					{
						targetLock = 360 - limit;
						moved = -limit;
						if(!DogController.isDogSleeping)
								dogController.GestureRight();
					}
					else
					{
						targetLock = 0;
						moved = 0;
					}
				}
			}
		}
	}
	
	// lock the camera
	if(lockCamera < 1)
	{
		lockCamera+= Time.deltaTime * 2;
		
		target.eulerAngles.y = Mathf.Lerp(currentLock,targetLock,lockCamera);
		
		
	}
	
		
}
