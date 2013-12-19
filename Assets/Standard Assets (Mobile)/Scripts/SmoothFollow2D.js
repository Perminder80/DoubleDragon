
#pragma strict

var target : Transform;
var smoothTime = 0.3;
private var thisTransform : Transform;
private var velocity : Vector2;

function Start()
{
	thisTransform = transform;
	thisTransform.position.z = -7.29;
}

function Update() 
{
	thisTransform.position.x = Mathf.SmoothDamp( thisTransform.position.x, 
		target.position.x, velocity.x, smoothTime);
	//thisTransform.position.y = Mathf.SmoothDamp( thisTransform.position.y, 
		//target.position.y, velocity.y, smoothTime);
	thisTransform.position.y = 10.0;
	
}