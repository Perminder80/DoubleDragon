var lamp: Light;
var factor: float = 0.2;

function Update () 
{
	if(lamp.intensity > 0)
		lamp.intensity = 1.8 + Mathf.PingPong(Time.time,factor);
}