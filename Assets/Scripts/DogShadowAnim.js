@script ExecuteInEditMode()

var SunContainer: Transform;
var shadowContainer: Transform;
var shadow: GameObject;
private var angleDiff: float = 100.333; //from -100.333 (sun rise) to 100.333 (sun set)
private var distanceCenter: float = 1197.704;// midday shadow
private var distanceDiff: float = 1.084;//from 1198.788 (sun rise) to 1196.62
private var lastPos: float = 0;
private var transi: float = 0;
private var lastRotation: float = 0;
var moveX:float;
function Start()
{
	shadowContainer = transform;
}
function Update() 
{
	if(SunContainer.rotation.z != lastRotation && Mathf.Abs(SunContainer.rotation.z) <= 0.76)
	{
		lastRotation = SunContainer.rotation.z;
		if(360 - SunContainer.eulerAngles.z <180 )
		{
			moveX = (360 - SunContainer.eulerAngles.z) * distanceDiff/angleDiff;
		}
				
		else
			moveX = -(SunContainer.eulerAngles.z) * distanceDiff/angleDiff;
			 
			 
		shadowContainer.position.x = Mathf.Clamp(distanceCenter + (moveX ),1196.62,1198.788);
		lastPos = shadowContainer.position.x;
	}
	
	if(Mathf.Abs(SunContainer.rotation.z) >0.76)
	{	
		if(transi <1)
		{
			transi += Time.deltaTime;
			shadowContainer.position.x = Mathf.Lerp(lastPos,1197.704,transi);
		}
	}
	else
	{
		transi = 0;
	}
	
	
}