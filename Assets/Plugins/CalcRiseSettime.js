static var RiseTime: float;
static var SetTime: float;

static function CalculateSunRiseSunSet(date: System.DateTime, lat: float, lng: float, offset: float)
{
	// calc the day of the year
	var N1: float = Mathf.Floor(275.0 * date.Month /9.0);
	var N2: float = Mathf.Floor((date.Month +9.0)/12.0);
	var N3: float = 1 + Mathf.Floor((date.Year - 4 * Mathf.Floor(date.Year / 4) + 2) / 3);
	var N = N1 - (N2 * N3) + date.Day - 30;
	
	// convert the longitude to hour value and calculate an approximate time

	var lngHour: float = lng / 15.0;

 	 var tRise = N + ((6 - lngHour) / 24.0);
	 var tSet = N + ((18 - lngHour) / 24.0);
	 
	// calculate the Sun's mean anomaly

	var MRise = (0.9856 * tRise) - 3.289;
	var MSet = (0.9856 * tSet) - 3.289;

	// calculate the Sun's true longitude

	var LRise = MRise + (1.916 * Mathf.Sin(Mathf.PI/180.0 *MRise)) + (0.020 * Mathf.Sin(Mathf.PI/180.0 *2 * MRise)) + 282.634;
	var LSet = MSet + (1.916 * Mathf.Sin(Mathf.PI/180.0 *MSet)) + (0.020 * Mathf.Sin(Mathf.PI/180.0 *2 * MSet)) + 282.634;
	
	if(LRise < 0)
	{
		LRise += 360;
	}
	if(LSet < 0)
	{
		LSet += 360;
	}
	if(LRise > 360)
	{
		LRise -= 360;
	}
	if(LSet > 360)
	{
		LSet -= 360;
	}
	// calculate the Sun's right ascension

	var RARise = (180.0/Mathf.PI) * Mathf.Atan(0.91764 * Mathf.Tan(Mathf.PI/180.0 *LRise));
	var RASet = (180.0/Mathf.PI) * Mathf.Atan(0.91764 * Mathf.Tan(Mathf.PI/180.0 *LSet));

	if(RARise < 0)
	{
		RARise += 360;
	}
	if(RASet < 0)
	{
		RASet += 360;
	}
	if(RARise > 360)
	{
		RARise -= 360;
	}
	if(RASet > 360)
	{
		RASet -= 360;
	}
	
	// right ascension value needs to be in the same quadrant as L

	var LquadrantRise  = (Mathf.Floor( LRise/90.0)) * 90;
	var RAquadrantRise = (Mathf.Floor(RARise/90.0)) * 90;
	RARise = RARise + (LquadrantRise - RAquadrantRise);
	
	var LquadrantSet  = (Mathf.Floor( LSet/90.0)) * 90;
	var RAquadrantSet = (Mathf.Floor(RASet/90.0)) * 90;
	RASet = RASet + (LquadrantSet - RAquadrantSet);
	
	//right ascension value needs to be converted into hours

	RARise = RARise / 15.0;
	RASet = RASet / 15.0;
	
	//calculate the Sun's declination

	var sinDecRise = 0.39782 * Mathf.Sin(Mathf.PI/180.0 *LRise);
	var cosDecRise = Mathf.Cos(Mathf.PI/180.0 *(180.0/Mathf.PI) *Mathf.Asin(sinDecRise));
	
	var sinDecSet = 0.39782 * Mathf.Sin(Mathf.PI/180.0 *LSet);
	var cosDecSet = Mathf.Cos(Mathf.PI/180.0 *(180.0/Mathf.PI) *Mathf.Asin(sinDecSet));
	
	//calculate the Sun's local hour angle

	var cosHRise = (Mathf.Cos(Mathf.PI/180.0 *90.5) - (sinDecRise * Mathf.Sin(Mathf.PI/180.0 *lat))) / (cosDecRise * Mathf.Cos(Mathf.PI/180.0 *lat));
	var cosHSet = (Mathf.Cos(Mathf.PI/180.0 *90.5) - (sinDecSet * Mathf.Sin(Mathf.PI/180.0 *lat))) / (cosDecSet * Mathf.Cos(Mathf.PI/180.0 *lat));


	if (cosHRise >  1)
		return;
	if (cosHSet < -1)
		return;
		
	// finish calculating H and convert into hours

	 var HRise =(360 - ( (180.0/Mathf.PI) *Mathf.Acos(cosHRise)));
	 var HSet = (180.0/Mathf.PI) *Mathf.Acos(cosHSet);
	 HRise = HRise / 15.0;
	 HSet = HSet / 15.0;
	 
	 //calculate local mean time of rising/setting

	var TRise = HRise + RARise - (0.06571 * tRise) - 6.622;
	var TSet = HSet + RASet - (0.06571 * tSet) - 6.622;
	
	// adjust back to UTC

	var UTRise = TRise - lngHour;
	var UTSet = TSet - lngHour;
	if(UTRise < 0)
	{
		UTRise += 24;
	}
	if(UTSet < 0)
	{
		UTSet += 24;
	}
	if(UTRise > 24)
	{
		UTRise -= 24;
	}
	if(UTSet > 24)
	{
		UTSet -= 24;
	}
	
	// convert UT value to local time zone of latitude/longitude

	RiseTime = UTRise + offset;
	SetTime = UTSet + offset;
	
	if(RiseTime < 0)
	{
		RiseTime += 24;
	}
	if(SetTime < 0)
	{
		SetTime += 24;
	}
	if(RiseTime > 24)
	{
		RiseTime -= 24;
	}
	if(SetTime > 24)
	{
		SetTime -= 24;
	}

}
