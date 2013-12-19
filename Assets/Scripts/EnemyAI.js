#pragma strict

var speed : float = 0.05;
var targetPosition : Vector3;

function Start () {

}

function Update () {

	// Find player position
	var player = GameObject.Find("3rd Person Controller");
	var playerPosition = player.transform.position;
		
	// Set this object's target position to that point behind the player
	targetPosition = playerPosition;
	
	var distanceTmp = targetPosition - this.transform.position;
	
	// Move this
	this.transform.position += distanceTmp/100;
	this.transform.position.y = 1.8;
	
	//targetSphere.transform.position = Vector3(targetPosition.x, 0, targetPosition.z);
	//var vectorBetweenBallAndCharacter = player.transform.position - targetSphere.transform.position;
	//var headTo = targetSphere.transform.position + vectorBetweenBallAndCharacter/20;
	//var directionToCharacter = headTo - this.transform.position;
	var directionToCharacter = playerPosition - this.transform.position;
	directionToCharacter.y = 0;
	
	transform.forward = directionToCharacter.normalized;
}
