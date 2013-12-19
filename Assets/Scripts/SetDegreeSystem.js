
function Update () {
	if(WeatherData.metric == 0)
	{
		GetComponent(TextMesh).text = "F";
	}
	else
	{
		GetComponent(TextMesh).text = "C";

	}
}