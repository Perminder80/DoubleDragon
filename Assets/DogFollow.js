#pragma strict

var speed : float = 0.05;
var targetPosition : Vector3;

function Start () {

}

function Update () {
	//transform.Rotate(0, speed*Time.deltaTime, 0);
	
	var targetSphere = GameObject.Find("TargetSphere");
	
	// Find player position
	var player = GameObject.Find("3rd Person Controller");
	//var playerTransform = player.transform;
	var playerPosition = player.transform.position;
	
	// Find a point just behind the player
	//var playerDirectionVector = player.transform.forward;
	//playerDirectionVector.x *= -1;
	//playerDirectionVector.z *= -1;
	
	// Set this object's target position to that point behind the player
	//targetPosition = playerPosition + playerDirectionVector*3;
	targetPosition = playerPosition - player.transform.forward*3;
	
	//var distanceX = targetPosition.x - this.transform.position.x;
	//var distanceZ = targetPosition.z - this.transform.position.z;
	
	var distanceTmp = targetPosition - this.transform.position;
	
	// Calculate angle between this and target		
	//angle = Vector3.Angle(this.transform.position, targetPosition);
	//angle = calcAngle(this.transform.position, targetPosition);
			
	// Move this
	//this.transform.Translate(distanceX*Mathf.Sin(angle), 0, distanceZ*Mathf.Cos(angle));
	//this.transform.position += Vector3(distanceX*Mathf.Cos(angle), 0, distanceZ*Mathf.Sin(angle)).normalized * 0.01;
	//this.transform.position += Vector3(distanceX/30, 0, distanceZ/30);
	this.transform.position += distanceTmp/100;
	this.transform.position.y = 0;
	
	targetSphere.transform.position = Vector3(targetPosition.x, 0, targetPosition.z);
	
	//var dogAngle = Mathf.Atan2(distanceX, distanceZ);
	//transform.forward = Vector3(distanceX*Mathf.Cos(angle), 0, distanceZ*Mathf.Sin(angle));
	//var forwardTmp = Vector3(distanceX, 0, distanceZ);
	//forwardTmp.Normalize();
	//transform.forward = forwardTmp;
	var vectorBetweenBallAndCharacter = player.transform.position - targetSphere.transform.position;
	var headTo = targetSphere.transform.position + vectorBetweenBallAndCharacter/20;
	var directionToCharacter = headTo - this.transform.position;
	directionToCharacter.y = 0;
	
	transform.forward = directionToCharacter.normalized;
	
	//print("angle = "+angle+ ", target x = "+targetPosition.x+ ", target z = "+targetPosition.z);
	
}


function calcAngle(vec1 : Vector3, vec2 : Vector3)
{
	var calcAngle = Mathf.Atan2(vec1.x-vec2.x, vec1.z-vec2.z);// *	(180/Mathf.PI);	
	
	//if(calcAngle < 0)	
		//calcAngle = Mathf.Abs(calcAngle);
	//else
		//calcAngle = 360 - calcAngle;		
	
	return calcAngle;
}
