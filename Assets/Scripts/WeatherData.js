// here we fetch and store the data from the weather source, organize localization

//finished ?



static var dataUpdateFinished: boolean = false;
static var dataSearchFinished: boolean = false;

var delegate: OrangeWeatherController;
//location
private var didUpdateLocation: boolean = false;
private var locInfo: LocationInfo = new LocationInfo();
private var locationCode: String = "";

//data
private var weatherUrl: String = "http://orfr.accu-weather.com/widget/orfr/weather-data.asp?";
private var searchUrl: String = "http://orfr.accu-weather.com/widget/orfr/city-find.asp?location=";

//static var weatherData: Hashtable = new Hashtable();

private var forcastDays: Array = new Array();
private var current: Hashtable = new Hashtable();
static var local: Hashtable = new Hashtable();//location info
static var weatherURL: String = "http://www.accuweather.com";
static var searchResults: Array = new Array();

static var weatherObjects: Array = new Array();
static var hasError:boolean = false;
static var errorMessage:String = "";
static var isSearching: boolean = false;
static var isLoading: boolean = false;
private var didLocationServiceFail: boolean = false;

static var langID: int = 1;//default is english
static var txtMan: TextManager;
static var metric: int = 1; // default is metric

function Awake()
{
//	locInfo = new LocationInfo();
//	didUpdateLocation = false;

	var str:String = PlayerPrefs.GetString("metricValue");
	
		if(str == null || str == "")
		{
			metric = 1;
		}
		else
		{
			print(str);
			metric = System.Convert.ToInt16(str);
			
		}

}
function RemoveAccents(text: String): String
{
	text = text.Replace("À","A");
	text = text.Replace("Á","A");
	text = text.Replace("Â","A");
	text = text.Replace("Ã","A");
	text = text.Replace("Ä","A");
	text = text.Replace("Å","A");
	text = text.Replace("Æ","AE");
	text = text.Replace("Ç","C");
	text = text.Replace("È","E");
	text = text.Replace("É","E");
	text = text.Replace("Ê","E");
	text = text.Replace("Ë","E");
	text = text.Replace("Ì","I");
	text = text.Replace("Í","I");
	text = text.Replace("Î","I");
	text = text.Replace("Ï","I");
	text = text.Replace("Ð","D");
	text = text.Replace("Ñ","N");
	text = text.Replace("Ò","O");
	text = text.Replace("Ó","O");
	text = text.Replace("Ô","O");
	text = text.Replace("Õ","O");
	text = text.Replace("Ö","O");
	text = text.Replace("Ø","O");
	text = text.Replace("Ù","U");
	text = text.Replace("Ú","U");
	text = text.Replace("Û","U");
	text = text.Replace("Ü","U");
	text = text.Replace("Ý","Y");
	text = text.Replace("Þ","a");
	text = text.Replace("ß","B");
	text = text.Replace("à","a");
	text = text.Replace("á","a");
	text = text.Replace("â","a");
	text = text.Replace("ã","a");
	text = text.Replace("ä","a");
	text = text.Replace("å","a");
	text = text.Replace("æ","ae");
	text = text.Replace("ç","c");
	text = text.Replace("è","e");
	text = text.Replace("é","e");
	text = text.Replace("ê","e");
	text = text.Replace("ë","e");
	text = text.Replace("ì","i");
	text = text.Replace("í","i");
	text = text.Replace("î","i");
	text = text.Replace("ï","i");
	text = text.Replace("ñ","n");
	text = text.Replace("ò","o");
	text = text.Replace("ó","o");
	text = text.Replace("ô","o");
	text = text.Replace("õ","o");
	text = text.Replace("ö","o");
	text = text.Replace("ø","o");
	text = text.Replace("ù","u");
	text = text.Replace("ú","u");
	text = text.Replace("û","u");
	text = text.Replace("ü","u");
	text = text.Replace("ý","y");
	text = text.Replace("ÿ","y");
	text = text.Replace("Œ","OE");
	text = text.Replace("œ","oe");
	text = text.Replace("Š","S");
	text = text.Replace("š","s");
	text = text.Replace("Ÿ","Y");
	return text;
}
function AddAccents(text: String): String
{
	text = text.Replace("&#192;","À");
	text = text.Replace("&#193;","Á");
	text = text.Replace("&#194;","Â");
	text = text.Replace("&#195;","Ã");
	text = text.Replace("&#196;","Ä");
	text = text.Replace("&#197;","Å");
	text = text.Replace("&#198;","Æ");
	text = text.Replace("&#199;","Ç");
	text = text.Replace("&#200;","È");
	text = text.Replace("&#201;","É");
	text = text.Replace("&#202;","Ê");
	text = text.Replace("&#203;","Ë");
	text = text.Replace("&#204;","Ì");
	text = text.Replace("&#205;","Í");
	text = text.Replace("&#206;","Î");
	text = text.Replace("&#207;","Ï");
	text = text.Replace("&#208;","Ð");
	text = text.Replace("&#209;","Ñ");
	text = text.Replace("&#210;","Ò");
	text = text.Replace("&#211;","Ó");
	text = text.Replace("&#212;","Ô");
	text = text.Replace("&#213;","Õ");
	text = text.Replace("&#214;","Ö");
	text = text.Replace("&#216;","Ø");
	text = text.Replace("&#217;","Ù");
	text = text.Replace("&#218;","Ú");
	text = text.Replace("&#219;","Û");
	text = text.Replace("&#220;","Ü");
	text = text.Replace("&#221;","Ý");
	text = text.Replace("&#222;","Þ");
	text = text.Replace("&#223;","ß");
	text = text.Replace("&#224;","à");
	text = text.Replace("&#225;","á");
	text = text.Replace("&#226;","â");
	text = text.Replace("&#227;","ã");
	text = text.Replace("&#228;","ä");
	text = text.Replace("&#229;","å");
	text = text.Replace("&#230;","æ");
	text = text.Replace("&#231;","ç");
	text = text.Replace("&#232;","è");
	text = text.Replace("&#233;","é");
	text = text.Replace("&#234;","ê");
	text = text.Replace("&#235;","ë");
	text = text.Replace("&#236;","ì");
	text = text.Replace("&#237;","í");
	text = text.Replace("&#238;","î");
	text = text.Replace("&#239;","ï");
	text = text.Replace("&#240;","ð");
	text = text.Replace("&#241;","ñ");
	text = text.Replace("&#242;","ò");
	text = text.Replace("&#243;","ó");
	text = text.Replace("&#244;","ô");
	text = text.Replace("&#245;","õ");
	text = text.Replace("&#246;","ö");
	text = text.Replace("&#248;","ø");
	text = text.Replace("&#249;","ù");
	text = text.Replace("&#250;","ú");
	text = text.Replace("&#251;","û");
	text = text.Replace("&#252;","ü");
	text = text.Replace("&#253;","ý");
	text = text.Replace("&#254;","þ");
	text = text.Replace("&#255;","ÿ");
	text = text.Replace("&#338;","Œ");
	text = text.Replace("&#339;","œ");
	text = text.Replace("&#352;","Š");
	text = text.Replace("&#353;","š");
	text = text.Replace("&#376;","Ÿ");
	

	return text;
}
function AddAccentsFromHex(text: String): String
{
	text = text.Replace("&#x104;","Ą");
	text = text.Replace("&#x105;","ą");
	text = text.Replace("&#x106;","Ć");
	text = text.Replace("&#x107;","ć");
	text = text.Replace("&#xd3;","Ó");
	text = text.Replace("&#xd4;","Ô");
	text = text.Replace("&#x141;","Ł");
	text = text.Replace("&#x142;","ł");
	text = text.Replace("&#x143;","Ń");
	text = text.Replace("&#x144;","ń");
	text = text.Replace("&#x15a;","Ś");
	text = text.Replace("&#x15b;","ś");
	text = text.Replace("&#x179;","Ź");
	text = text.Replace("&#x17a;","ź");
	text = text.Replace("&#x17b;","Ż");
	text = text.Replace("&#x17c;","ż");
	text = text.Replace("&#x118;","Ę");
	text = text.Replace("&#x119;","ę");



	return text;
}
function SearchForLocation(location: String)
{
	dataSearchFinished = false;
	hasError = false;
		print(location);

	searchResults.Clear();
//	if(location.IndexOf("&#") != -1)
//	{
//	location = RemoveAccents(location);
		
//		print(location);
//	}
	var www : WWW = new WWW (searchUrl + WWW.EscapeURL(location.Replace("+"," "),System.Text.Encoding.GetEncoding("ISO-8859-1"))+"&langid="+langID);
	isSearching = true;

	yield www;
	if(www.error != null)
	{
		hasError = true;
		isSearching = false;
		errorMessage = txtMan.GetText("CONNECTION_ERROR");
	}
	else
	{
	var parser: XMLParser = new XMLParser();
	var mainNode: XMLNode = parser.Parse(WWW.UnEscapeURL(System.Text.Encoding.GetEncoding("ISO-8859-1").GetString(www.bytes),System.Text.Encoding.GetEncoding("ISO-8859-1")));
	var numOfUS: int  = System.Convert.ToInt32(mainNode.GetValue("adc_database>0>citylist>0>@us"));
	var arr:XMLNodeList=mainNode.GetNodeList("adc_database>0>citylist>0>location");
	if(arr !=null)
	{	
		for(var i=numOfUS ; i< arr.length; i++)
		{
			var node: SearchObject = new SearchObject() ;
			
			node.locationCode = (arr[i] as XMLNode).GetValue("@location");
//			print(node.locationCode);
			node.state = (arr[i] as XMLNode).GetValue("@state");
			node.city = (arr[i] as XMLNode).GetValue("@city");
//			if((node.city as String).IndexOf("&#") != -1)
//			{
//				node.city = AddAccents(node.city);
//			}
			if((node.state as String).IndexOf("&#x") != -1)
			{
				node.state = AddAccentsFromHex(node.state);
			}
			if((node.city as String).IndexOf("&#x") != -1)
			{
				node.city = AddAccentsFromHex(node.city);
			}
			if((node.state as String).IndexOf("&#") != -1)
			{
				node.state = AddAccents(node.state);
			}
			if((node.city as String).IndexOf("&#") != -1)
			{
				node.city = AddAccents(node.city);
			}
			
			if((node.state as String).IndexOf("&#") == -1 && (node.city as String).IndexOf("&#") == -1 && (node.locationCode as String).IndexOf("%") == -1)
				searchResults.Add(node);
		}
		for(i=0 ; i< numOfUS; i++)
		{
			var nodeUS: SearchObject = new SearchObject() ;
			
			nodeUS.locationCode = (arr[i] as XMLNode).GetValue("@location");
			nodeUS.state = (arr[i] as XMLNode).GetValue("@state")+" USA";
			nodeUS.city = (arr[i] as XMLNode).GetValue("@city");
			searchResults.Add(nodeUS);
		}
	}
	else
	{
		hasError = true;
		errorMessage = txtMan.GetText("NO_RESULTS");
	}
	isSearching = false;

	dataSearchFinished = true;
	}
}

function TestConnection() :boolean
{
	if (Application.internetReachability == NetworkReachability.NotReachable)
	{
		hasError = true;
		errorMessage = txtMan.GetText("CONNECTION_ERROR");	
		forcastDays.Clear();
		current.Clear();
		local.Clear();
		weatherObjects.Clear();
		return false;
	} 
	else
	{
		return true;
	}
}
function ParseWeatherDataWithLocationCode(locCode: String)
{
	PlayerPrefs.SetString("lastCode",locCode);

//	PlayerPrefs.Save();
	dataUpdateFinished = false;
	hasError = false;
	isLoading = true;
	TestConnection();
//	print(locCode);

	var www : WWW = new WWW (weatherUrl + "location=" + WWW.EscapeURL(locCode.Replace("+"," "),System.Text.Encoding.GetEncoding("ISO-8859-1")) +"&langid="+langID +"&metric="+metric);
	// Wait for download to complete
	yield www;
	

	if(www.error != null)
	{
		hasError = true;
		errorMessage = txtMan.GetText("CONNECTION_ERROR");
		weatherObjects.Clear();
	}	
	else
	{
	forcastDays.Clear();
	current.Clear();
	local.Clear();
//	string xmlText= System.Text.Encoding.GetEncoding("ISO-8859-1").GetString(www.bytes); 
	var textToParse: String = System.Text.Encoding.GetEncoding("ISO-8859-1").GetString(www.bytes); ;
	var reader = TinyXmlReader(textToParse);
    while (reader.Read())
    {
      if (reader.tagName == "forecast" && reader.isOpeningTag)// forecast
        {
            while(reader.Read("forecast")) // read as long as not encountering the closing tag for forecast
            {
            	
                if (reader.isOpeningTag && reader.tagName == "day")
                {
                	var dayweather: Hashtable = new Hashtable();
                	while(reader.Read("day")) // read as long as not encountering the closing tag for day
					{
                  	  	if(reader.isOpeningTag && reader.tagName == "daytime")
                  	  	{
                  	  		var daytimeweather: Hashtable = new Hashtable();
                  	  		
                  	  		while(reader.Read("daytime"))
                  	  		{
                  	  			if(!daytimeweather.ContainsKey(reader.tagName))
	                  	  			daytimeweather.Add(reader.tagName, reader.content);
                  	  		}
                  	  		
                  	  		dayweather.Add("daytime",daytimeweather);
//                  	  		daytimeweather.Clear();
                  	  	}
                  	  	if(reader.isOpeningTag && reader.tagName == "nighttime")
                  	  	{
                  	  		var nighttimeweather: Hashtable = new Hashtable();
                  	  		
                  	  		while(reader.Read("nighttime"))
                  	  		{
                  	  			if(!nighttimeweather.ContainsKey(reader.tagName))
                  	  				nighttimeweather.Add(reader.tagName, reader.content);
                  	  		}
                  	  		
                  	  		dayweather.Add("nighttime",nighttimeweather);
//                  	  		nighttimeweather.Clear();
                  	  	}
                  	  	if(reader.isOpeningTag && reader.tagName != "nighttime" && reader.tagName != "daytime")
                  	  	{
                  	  		if(!dayweather.ContainsKey(reader.tagName))
                  	  			dayweather.Add(reader.tagName,reader.content);
                  	  	}
                  	  
                  	}
             		forcastDays.Add(dayweather);
//             		dayweather.Clear();

                }
            }
            
        }
       else if (reader.tagName == "currentconditions" && reader.isOpeningTag)// current weather for our location
       {
           while(reader.Read("currentconditions")) // read as long as not encountering the closing tag for currentconditions
			{
				if(!current.ContainsKey(reader.tagName)) 
				{
					current.Add(reader.tagName,reader.content);

				}
			}
       }
       else if (reader.tagName == "local" && reader.isOpeningTag)// current location
       {
           while(reader.Read("local")) // read as long as not encountering the closing tag for local
			{
				if(!local.ContainsKey(reader.tagName)) 
				{
					local.Add(reader.tagName,reader.content);

				}
			}
       }


    }

//   	weatherData.Add("forecasts",forcastDays);
//   	weatherData.Add("current_weather",current);
//   	weatherData.Add("local",local);
   	
	
   	CreateWeatherObjectsList();
//   	print(forcastDays.length);
	}
}
function ParseWeatherData()
{
//	weatherData.Clear();
	isLoading = true;
	
//	print(weatherUrl + "slat=" + locInfo.latitude +"&slon=" + locInfo.longitude);
	PlayerPrefs.SetString("lastCode","");
	PlayerPrefs.Save();
	var www : WWW = new WWW (weatherUrl + "slat=" + (iPhoneInput.lastLocation.latitude).ToString("f2") +"&slon=" + (iPhoneInput.lastLocation.longitude).ToString("f2")+"&langid="+langID +"&metric="+metric);
//	var www : WWW = new WWW ("http://oruk.accu-weather.com/widget/oruk/weather-data.asp?metric=1&slat=51.49875&slon=-0.277661");
//	// Wait for download to complete
//	
	print(www.url);
	yield www;
	if(www.error != null)
	{
		hasError = true;
		errorMessage = txtMan.GetText("CONNECTION_ERROR");
		weatherObjects.Clear();
	}
	else
	{	
	// test data
//	var testData: TextAsset = Resources.Load("testData") as TextAsset;
	
	forcastDays.Clear();
	
	current.Clear();
	local.Clear();
	var textToParse: String = System.Text.Encoding.GetEncoding("ISO-8859-1").GetString(www.bytes); ;
//	var textToParse: String = testData.text;
	var reader = TinyXmlReader(textToParse);
	
    while (reader.Read())
    {
      if (reader.tagName == "forecast" && reader.isOpeningTag)// forecast
        {
            while(reader.Read("forecast")) // read as long as not encountering the closing tag for forecast
            {
            	
                if (reader.isOpeningTag && reader.tagName == "day")
                {
                	var dayweather: Hashtable = new Hashtable();
                	while(reader.Read("day")) // read as long as not encountering the closing tag for day
					{
                  	  	if(reader.isOpeningTag && reader.tagName == "daytime")
                  	  	{
                  	  		var daytimeweather: Hashtable = new Hashtable();
                  	  		
                  	  		while(reader.Read("daytime"))
                  	  		{
                  	  			if(!daytimeweather.ContainsKey(reader.tagName))
	                  	  			daytimeweather.Add(reader.tagName, reader.content);
                  	  		}
                  	  		
                  	  		dayweather.Add("daytime",daytimeweather);
//                  	  		daytimeweather.Clear();
                  	  	}
                  	  	if(reader.isOpeningTag && reader.tagName == "nighttime")
                  	  	{
                  	  		var nighttimeweather: Hashtable = new Hashtable();
                  	  		
                  	  		while(reader.Read("nighttime"))
                  	  		{
                  	  			if(!nighttimeweather.ContainsKey(reader.tagName))
                  	  				nighttimeweather.Add(reader.tagName, reader.content);
                  	  		}
                  	  		
                  	  		dayweather.Add("nighttime",nighttimeweather);
//                  	  		nighttimeweather.Clear();
                  	  	}
                  	  	if(reader.isOpeningTag && reader.tagName != "nighttime" && reader.tagName != "daytime")
                  	  	{
                  	  		if(!dayweather.ContainsKey(reader.tagName))
                  	  			dayweather.Add(reader.tagName,reader.content);
                  	  	}
                  	  
                  	}
             		forcastDays.Add(dayweather);
//             		dayweather.Clear();

                }
            }
            
        }
       else if (reader.tagName == "currentconditions" && reader.isOpeningTag)// current weather for our location
       {
           while(reader.Read("currentconditions")) // read as long as not encountering the closing tag for currentconditions
			{
				if(!current.ContainsKey(reader.tagName)) 
				{
					current.Add(reader.tagName,reader.content);

				}
			}
       }
       else if (reader.tagName == "local" && reader.isOpeningTag)// current location
       {
           while(reader.Read("local")) // read as long as not encountering the closing tag for local
			{
				if(!local.ContainsKey(reader.tagName)) 
				{
					local.Add(reader.tagName,reader.content);

				}
			}
       }


    }

//   	weatherData.Add("forecasts",forcastDays);
//   	weatherData.Add("current_weather",current);
//   	weatherData.Add("local",local);
   	

   	CreateWeatherObjectsList();
//   	print(forcastDays.length);
	}
}
function GetRainAmountFromID(weatherID: int) : float
{
	if(weatherID < 12)
	{
		return 0.0;
	}
	
	else if((weatherID > 11 && weatherID < 15) || (weatherID >38 && weatherID < 41) || weatherID == 25)
	{
		return 0.5;
	}
	
	else if(weatherID == 18 || weatherID == 26 || weatherID == 29 || weatherID == 24 || weatherID == 15 )
	{
		return 1.0;
	}
	else if(weatherID == 16 ||weatherID == 17 || weatherID == 41 || weatherID == 42)
	{
		return 0.5;
	}
	else
	{
		return 0.0;
	}
	
}
function GetSnowAmountFromID(weatherID: int) : float
{
	if(weatherID == 19 ||weatherID == 20 ||weatherID == 21 || weatherID == 43 || weatherID == 25)
	{
		return 0.25;//flurries
	}
	
	else if(weatherID == 22 ||weatherID == 23 ||weatherID == 44 || weatherID == 29)
	{
		return 1;//Snow
	}
	else
	{
		return 0.0;//no snow
	}
	
}
function GetThunderFromID(weatherID: int) : boolean
{
	if(weatherID == 15 ||weatherID == 16 ||weatherID == 17 || weatherID == 41 || weatherID == 42)
	{
		return true;
	}
	
	else
	{
		return false;//no thunder
	}
	
}
function GetCloudAmountFromID(weatherID: int) : float
{
	if(weatherID == 2 || weatherID == 34)
	{
		return 0.1;
	}
	else if (weatherID == 1 || weatherID == 5 || weatherID == 33 || weatherID == 37)
	{
		return 0.0;
	}
	
	else if (weatherID >=38 || weatherID == 6 || weatherID == 4 || weatherID == 13 || weatherID == 16 || weatherID == 20 || weatherID == 23)
	{
		return 0.75;
	} 
	else if (weatherID == 3 || weatherID == 14 || weatherID == 21 || weatherID == 17 || weatherID == 35 || weatherID == 41 || weatherID == 36 || weatherID == 35 )
	{
		return 0.25;
	}
	else
	{
		return 1.0;
	}
}
function CreateWeatherObjectsList()
{
	weatherObjects.Clear();
	
	// add current weather data
	weatherURL = (current["url"]as String).Replace("&amp;","&");
	weatherURL = weatherURL.Replace("|","%7c");
	weatherURL = weatherURL.Replace("+","%20");

	weatherURL = weatherURL.Replace("metric=0","metric="+metric);

//	print(weatherURL);
	var currentWeather: WeatherObject = new WeatherObject();
	currentWeather.temp = System.Convert.ToInt32(current["temperature"]);

	currentWeather.rainAmount = GetRainAmountFromID(System.Convert.ToInt32(current["weathericon"]));
	currentWeather.snowAmount = GetSnowAmountFromID(System.Convert.ToInt32(current["weathericon"]));

//	var cloudcover: String =current["cloudcover"] as String;
//	print(cloudcover);
//	cloudcover = cloudcover.Replace("%","");
	currentWeather.cloudPercent =  GetCloudAmountFromID(System.Convert.ToInt32(current["weathericon"]));
//		print(currentWeather.cloudPercent);

	
	var dt: System.DateTime = new System.DateTime();

	dt = System.DateTime.Now;

	currentWeather.day = dt.ToString("dddd");

	var currentDayForcast: Hashtable = forcastDays[0] as Hashtable;

//	currentWeather.sunRise = System.Convert.ToDateTime(currentDayForcast["obsdate"] as String +" "+ (currentDayForcast["sunrise"] as String));
//	currentWeather.sunSet = System.Convert.ToDateTime(currentDayForcast["obsdate"] as String +" "+ (current["sunset"] as String));
	
	currentWeather.date = System.Convert.ToDateTime(currentDayForcast["obsdate"] as String +" "+ (current["observationtime"] as String));
	currentWeather.windSpeed = System.Convert.ToInt32(current["windspeed"]);
	
	if(langID == 21)
	{
		currentWeather.description = AddAccentsFromHex(AddAccents(current["weathertext"]));
	}
	else
	{
		if(langID != 1)
		{
			currentWeather.description = AddAccents(current["weathertext"]);
		}
		else
		{
			currentWeather.description = current["weathertext"];
		}
	}
	currentWeather.isCurrent = true;
	
	if(System.Convert.ToInt32(current["weathericon"]) == 11)
		currentWeather.isFoggy = true;
	else
		currentWeather.isFoggy = false;
		
		
	currentWeather.isThunder = GetThunderFromID(System.Convert.ToInt32(current["weathericon"]));

//	var sunRiseTime: float = currentWeather.sunRise.Hour + ((currentWeather.sunRise.Minute/60.0 * 100.0)/100.0);
//			
//	var sunSetTime: float = currentWeather.sunSet.Hour + ((currentWeather.sunSet.Minute/60.0 * 100.0)/100.0);
	
	var currentOffsetHours: float ;
	var currentOffsetMinutes: float;
	if((local["timeZone"] as String).Length ==5)
	{
	
		currentOffsetHours= System.Convert.ToInt32((local["timeZone"] as String).Substring(0,2));
		currentOffsetMinutes= System.Convert.ToInt32((local["timeZone"] as String).Substring(3,2));
	}
	if((local["timeZone"] as String).Length ==3)
	{
		currentOffsetHours= System.Convert.ToInt32((local["timeZone"] as String).Substring(0,1));
		currentOffsetMinutes= System.Convert.ToInt32((local["timeZone"] as String).Substring(2,2));
	}
	if((local["timeZone"] as String).Length ==6)
	{
		currentOffsetHours= System.Convert.ToInt32((local["timeZone"] as String).Substring(0,3));
		currentOffsetMinutes= System.Convert.ToInt32((local["timeZone"] as String).Substring(4,2));
	}
	
	var offsetTime: float = currentOffsetHours + ((currentOffsetMinutes/60.0 * 100.0)/100.0);
	
	if(System.Convert.ToBoolean(local["isDaylight"]))
	{
		offsetTime +=1;
	}
//	print(offsetTime);
	CalcRiseSettime.CalculateSunRiseSunSet(System.Convert.ToDateTime(currentDayForcast["obsdate"] as String +" "+ (current["observationtime"] as String)), parseFloat(local["lat"] as String), parseFloat(local["lon"] as String),offsetTime);
	
//	print(CalcRiseSettime.RiseTime + " " +CalcRiseSettime.SetTime);
	
	var sunRiseTime: float = CalcRiseSettime.RiseTime;
		var sunSetTime: float = CalcRiseSettime.SetTime;
		
		var midnightTime: float = (24 - (sunSetTime - sunRiseTime))/2;
	var currentTime: float = dt.Hour + ((dt.Minute/60.0 * 100.0)/100.0);
	
	var currentTimeHours: float = System.Convert.ToInt32((local["time"] as String).Substring(0,2));
	var currentTimeMinutes: float = System.Convert.ToInt32((local["time"] as String).Substring(3,2));
	
	var currentLocalTime: float = currentTimeHours + ((currentTimeMinutes/60.0 * 100.0)/100.0);
	
	if(currentLocalTime < sunRiseTime-0.25 || currentLocalTime > sunSetTime +0.25)
	{
		currentWeather.isDayTime = false;
	}
	else
		currentWeather.isDayTime = true;
	weatherObjects.Add(currentWeather);

	// add forecasts

	for(var i = 0; i< forcastDays.length; i++)
	{
		var forecast: Hashtable = forcastDays[i] as Hashtable;
		var forecastday: Hashtable = forecast["daytime"] as Hashtable;
		var forecastnight: Hashtable = forecast["nighttime"] as Hashtable;

		var dayWeather: WeatherObject = new WeatherObject();
		var nightWeather: WeatherObject = new WeatherObject();
		
		// day details
		dayWeather.temp = System.Convert.ToInt32(forecastday["hightemperature"]);
		dayWeather.weatherID = forecastday["weathericon"];

		dayWeather.rainAmount = GetRainAmountFromID(System.Convert.ToInt32(forecastday["weathericon"]));
		dayWeather.snowAmount = GetSnowAmountFromID(System.Convert.ToInt32(forecastday["weathericon"]));
		dayWeather.cloudPercent = GetCloudAmountFromID(System.Convert.ToInt32(forecastday["weathericon"]));
		dayWeather.sunRise = System.Convert.ToDateTime(forecast["obsdate"] as String +" "+ (forecast["sunrise"] as String));
		dayWeather.sunSet = System.Convert.ToDateTime(forecast["obsdate"] as String +" "+ (forecast["sunset"] as String));
		dayWeather.date = dayWeather.sunSet;
		dayWeather.windSpeed = System.Convert.ToInt32(forecastday["windspeed"]);
		if(langID == 21)
		{
			dayWeather.description = AddAccentsFromHex(forecastday["txtshort"]);				
			dayWeather.day = AddAccentsFromHex(forecast["daycode"]);

		}
		else
		{
			if(langID != 1)
			{
				dayWeather.description = AddAccents(forecastday["txtshort"]);
				dayWeather.day = AddAccents(forecast["daycode"]);

			}
			else
			{
				dayWeather.description = forecastday["txtshort"];
				dayWeather.day = forecast["daycode"];

			}
		}
		dayWeather.isDayTime = true;//mid day
		
		if((weatherObjects[i * 2] as WeatherObject).snowAmount ==1)
		{
			dayWeather.afterHeavySnow = true;
		}
		else
		{
			dayWeather.afterHeavySnow = false;
		}
		if(System.Convert.ToInt32(forecastday["weathericon"]) == 11)
			dayWeather.isFoggy = true;
		else
			dayWeather.isFoggy = false;
			
		dayWeather.isThunder = GetThunderFromID(System.Convert.ToInt32(forecastday["weathericon"]));//mid day

		weatherObjects.Add(dayWeather);
		
		// night details
		nightWeather.temp = System.Convert.ToInt32(forecastnight["lowtemperature"]);
		nightWeather.weatherID = forecastnight["weathericon"];
		nightWeather.rainAmount = GetRainAmountFromID(System.Convert.ToInt32(forecastnight["weathericon"]));
		nightWeather.snowAmount = GetSnowAmountFromID(System.Convert.ToInt32(forecastnight["weathericon"]));
		nightWeather.cloudPercent = GetCloudAmountFromID(System.Convert.ToInt32(forecastnight["weathericon"]));
		
		nightWeather.sunRise = System.Convert.ToDateTime(forecast["obsdate"] as String +" "+ (forecast["sunrise"] as String));
		nightWeather.sunSet = System.Convert.ToDateTime(forecast["obsdate"] as String +" "+ (forecast["sunset"] as String));
		nightWeather.date = nightWeather.sunSet;
		nightWeather.windSpeed = System.Convert.ToInt32(forecastnight["windspeed"]);
		
		if(langID == 21)//polish
		{
			nightWeather.description = AddAccentsFromHex(forecastnight["txtshort"]);
			nightWeather.day =  AddAccentsFromHex(forecast["daycode"]);
		}
		else
		{
			if(langID != 1)
			{
				nightWeather.description = AddAccents(forecastnight["txtshort"]);
				nightWeather.day =  AddAccents(forecast["daycode"]);

			}
			else
			{
				nightWeather.description = forecastnight["txtshort"];
				nightWeather.day =  forecast["daycode"];

			}
		}
		
		nightWeather.isDayTime = false;
		if((weatherObjects[(i * 2) + 1] as WeatherObject).snowAmount ==1)
		{
			nightWeather.afterHeavySnow = true;
		}
		else
		{
			nightWeather.afterHeavySnow = false;
		}
		if(System.Convert.ToInt32(forecastnight["weathericon"]) == 11)
			nightWeather.isFoggy = true;
		else
			nightWeather.isFoggy = false;
			
			
		nightWeather.isThunder = GetThunderFromID(System.Convert.ToInt32(forecastnight["weathericon"]));//mid day
		weatherObjects.Add(nightWeather);
		

	}
	isLoading = false;

	dataUpdateFinished = true;
   	delegate.DidFinishLoading();
}

function LateUpdate()
{
	// check the location
	if(iPhoneSettings.locationServiceStatus == LocationServiceStatus.Running && !didUpdateLocation)
	{
		if(iPhoneInput.lastLocation != null)
		{
			didUpdateLocation = true;
//			locInfo = iPhoneInput.lastLocation;
//			Debug.Log(locInfo.latitude+" "+locInfo.longitude);
//	
			stopLocationUpdate();
			ParseWeatherData();
		}
		else
		{
			print("location unknown error");
			isLoading = false;
			stopLocationUpdate();

			
		}
		
	}
	else if ( iPhoneSettings.locationServiceStatus == LocationServiceStatus.Failed)
	{
		// get location failed... alert the user?
		if(!didLocationServiceFail)
		{
			didLocationServiceFail = true;
			stopLocationUpdate();
			print("location service failed");
			hasError = true;
			errorMessage = txtMan.GetText("LOCATION_ERROR");
			isLoading = false;
		}
	}
	
}
function stopLocationUpdate()
{
	iPhoneSettings.StopLocationServiceUpdates();

}
function Fetch()
{
	
	hasError = false;
	// get the location
	didUpdateLocation = false;
	didLocationServiceFail = false;
	isLoading = true;
	if(TestConnection())
	{
		iPhoneSettings.StartLocationServiceUpdates();
	}

//	test TODO: remove
//	dataUpdateFinished = false;
//
//	ParseWeatherData();

}
function FetchByLocationCode(loc: String)
{
	locationCode = loc;
	dataUpdateFinished = false;
	hasError = false;
	if(TestConnection())
	{
		ParseWeatherDataWithLocationCode(loc);
	}
}

