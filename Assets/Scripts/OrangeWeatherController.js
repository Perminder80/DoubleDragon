// main controller...

var customGUI: GUIStyle;
var customGUIShadow: GUIStyle;

var forwardStyle: GUIStyle;
var backwardStyle: GUIStyle;
var settingStyle: GUIStyle;
var searchStyle: GUIStyle;
var gpsStyle: GUIStyle;
var numbersStyle: GUIStyle;
var numbersStyleShadow: GUIStyle;

var timeStyle: GUIStyle;
var timeStyleShadow: GUIStyle;

private var dataConnection: WeatherData;
private var initialized: boolean = false;

static var selectedWeatherID: int;
static var selectedWeatherObject: WeatherObject;
static var isForward: boolean = false;
static var isChangingState: boolean = false;
static var muteSound: boolean = false;
//var forwardTex: Texture2D;
//var backwardTex: Texture2D;
//var locationTex: Texture2D;
//var accuTex: Texture2D;
var lineSep: Texture2D;

//var findTex: Texture2D;
//var GPSTex: Texture2D;


var blueBack: Texture2D;
//var blueCircle: Texture2D;
//var pinkCircle: Texture2D;


var optionsSkin: GUISkin ;
var rowSelectedStyle: GUIStyle;
var rowStyle: GUIStyle;

var infoScreenStyle: GUIStyle;
var infoScreenHeaderStyle: GUIStyle;

// Internal variables for managing touches and drags
private var selected: int  = -1;

private var scrollVelocity: float  = 0f;
private var timeTouchPhaseEnded: float  = 0f;
private var previousDelta: float  = 0f;
private var inertiaDuration: float  = 0.5f;

static var scrollPosition: Vector2 ;

// size of the window and scrollable list
public var numRows: int ;
public var rowSize: Vector2 ;
public var windowMargin: Vector2 ;
public var infowindowMargin: Vector2 ;

public var listMargin: Vector2 ;

private var windowRect: Rect ;


private var locationToSearch: String = "";
static var locationCode: String = "";

static var displaySearchUI: boolean = false;
static var displayInfoScreen: boolean = false;

static var shouldFetchByLocationCode: boolean = false;
static var shouldFetchByGPS: boolean = false;

private var canGoForward: boolean = true;
private var canGoBackward: boolean = false;

private var textHasChanged: boolean = false;
private var timeStart: float = 0;
private var timeToWait: float = 2;
private var shouldDoSearch: boolean = false;
static var dateFormat: System.Globalization.DateTimeFormatInfo = new System.Globalization.CultureInfo("en-US").DateTimeFormat;
function Awake () {

	// do localization
	
	var lang: String = Application.systemLanguage.ToString();
	if(lang == "English")
	{
		WeatherData.txtMan= TextManager("English");
		WeatherData.langID = 1;
		dateFormat = new System.Globalization.CultureInfo("en-US").DateTimeFormat;
	}
	else if (lang == "Spanish")
	{
		WeatherData.txtMan= TextManager("Spanish");
		WeatherData.langID = 2;
		dateFormat = new System.Globalization.CultureInfo("es-ES").DateTimeFormat;

	}
	else if (lang == "French")
	{
		WeatherData.txtMan= TextManager("French");
		WeatherData.langID = 3;
		dateFormat = new System.Globalization.CultureInfo("fr-FR").DateTimeFormat;

	}
//	else if (lang == "Portuguese")
//	{
//		WeatherData.txtMan= TextManager("Portuguese");
//		WeatherData.langID = 5;
//		dateFormat = new System.Globalization.CultureInfo("pt-PT").DateTimeFormat;

//	}
	else if (lang == "German")
	{
		WeatherData.txtMan= TextManager("German");
		WeatherData.langID = 9;
		dateFormat = new System.Globalization.CultureInfo("de-DE").DateTimeFormat;

	}
	else if (lang == "Polish")
	{
		WeatherData.txtMan= TextManager("Polish");
		WeatherData.langID = 21;
		dateFormat = new System.Globalization.CultureInfo("pl-PL").DateTimeFormat;

	}
	else// default to English
	{
		WeatherData.txtMan= TextManager("English");
		WeatherData.langID = 1;
		dateFormat = new System.Globalization.CultureInfo("en-US").DateTimeFormat;

	}
}
function Start()
{
	var lastKnownSearch = PlayerPrefs.GetString("lastCode");
	
	
	selectedWeatherObject = null;
	dataConnection = (GetComponent("WeatherData") as WeatherData);
	
	dataConnection.delegate = this;
	
	if(lastKnownSearch.Length == 0 || lastKnownSearch == null)
	{
		dataConnection.Fetch();
	}
	else
	{
//		print(lastKnownSearch);
		dataConnection.StartCoroutine(dataConnection.ParseWeatherDataWithLocationCode(lastKnownSearch));
	}

}

// delegate function called from the weatherdata
function DidFinishLoading()
{
	if(!initialized)//FTU show current weather
	{
		initialized = true;
		selectedWeatherID = 0;
		selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
		canGoForward = true;
		canGoBackward = false;
		
	}
	else
	{
		// not FTU
		SunAnimController.lastDate = System.DateTime(1,1,1);// hack... TODO: polish the refresh mechanism
		selectedWeatherID = 0;

		selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
		canGoForward = true;
		canGoBackward = false;
	}
	
}

function Update()
{
	// check whether we have the data?
	if(selectedWeatherID == 0)
	{
		canGoForward = true;
		canGoBackward = false;
	}
	else if (selectedWeatherID == WeatherData.weatherObjects.length - 1)
	{
		canGoForward = false;
		canGoBackward = true;
	}
	else
	{
		canGoForward = true;
		canGoBackward = true;
	}
	
	if(WeatherData.dataUpdateFinished)
	{
		
		
	}
	else
	{
		// we dont have the data yet... or the weather data being refreshed
	}
	
	if (Input.GetKeyDown(KeyCode.Escape))
   		 Application.Quit();
	

	if(displaySearchUI || displayInfoScreen)
	{
		if (Input.touchCount != 1)
		{
			selected = -1;
	
			if ( scrollVelocity != 0.0f )
			{
				// slow down over time
				var t: float = (Time.time - timeTouchPhaseEnded) / inertiaDuration;
				var frameVelocity: float = Mathf.Lerp(scrollVelocity, 0, t);
				scrollPosition.y += frameVelocity * Time.deltaTime;
				
				// after N seconds, we've stopped
				if (t >= inertiaDuration) scrollVelocity = 0.0f;
			}
			return;
		}
		
		var touch: Touch = Input.touches[0];
		if (touch.phase == TouchPhase.Began)
		{
			selected = TouchToRowIndex(touch.position);
			previousDelta = 0.0f;
			scrollVelocity = 0.0f;
		}
		else if (touch.phase == TouchPhase.Canceled)
		{
			selected = -1;
			previousDelta = 0f;
		}
		else if (touch.phase == TouchPhase.Moved)
		{
			// dragging
			selected = -1;
			#if UNITY_ANDROID

			previousDelta = touch.deltaPosition.y * 5;
			scrollPosition.y += touch.deltaPosition.y * 5;
			#endif
			previousDelta = touch.deltaPosition.y;
			scrollPosition.y += touch.deltaPosition.y;
		}
		else if (touch.phase == TouchPhase.Ended)
		{
	        // Was it a tap, or a drag-release?
	        if ( selected > -1 )
	        {
	            Debug.Log("Player selected row " + selected);
	            
	            // trigger weather search
	            if(selected < WeatherData.searchResults.length)
	            { 
//		            locationCode = (WeatherData.searchResults[selected]as SearchObject).locationCode;
//		            locationToSearch = "";
//					WeatherData.searchResults.Clear();
//		            displaySearchUI = false;
//		            shouldFetchByLocationCode = true;
	            }
	        }
			else
			{
				// impart momentum, using last delta as the starting velocity
				// ignore delta < 10; precision issues can cause ultra-high velocity
				#if UNITY_ANDROID
					if (Mathf.Abs(touch.deltaPosition.y) >= 10) 
					scrollVelocity = (touch.deltaPosition.y *5/ touch.deltaTime) ;				
				#endif
				if (Mathf.Abs(touch.deltaPosition.y) >= 10) 
					scrollVelocity = (touch.deltaPosition.y / touch.deltaTime) ;
				timeTouchPhaseEnded = Time.time;
			}
		}
	}
}

function ChangeState(forward: boolean)
{
	if(!isChangingState && !DogController.isDogInteracting)
	{
		if(forward)
		{	// move forward
			if(selectedWeatherID == WeatherData.weatherObjects.length - 1)
			{
				// do nothing?
			}
			else if (selectedWeatherID == 0)
			{
				//check whether to skip the midday forcast of the current day
				if(SunAnimController.shouldSkip)
				{
					isForward = true;
	
					selectedWeatherID+=2;
					selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
					StateDidChange();
				}
				else
				{
					isForward = true;
	
					selectedWeatherID++;
					selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
					StateDidChange();
				}
			}
			else
			{
				isForward = true;
	
				selectedWeatherID++;
				selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
				StateDidChange();
			}
			
			
		}
		else
		{	// move backword
		
			if(selectedWeatherID == 0)
			{
				// do nothing?
			}
			else if(selectedWeatherID == 2)
			{
				//check whether to skip the midday forcast of the current day
				if(SunAnimController.shouldSkip)
				{
					isForward = false;
	
					selectedWeatherID-=2;
					selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
					StateDidChange();
				}
				else
				{
					isForward = false;
		
					selectedWeatherID--;
					selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
					StateDidChange();
				}
			}
			else
			{
				isForward = false;
	
				selectedWeatherID--;
				selectedWeatherObject = WeatherData.weatherObjects[selectedWeatherID];
				StateDidChange();
	
			}
			
		}
	}
}


// the UI
function OnGUI()
{
	if(displayInfoScreen)
	{
		GUI.skin = optionsSkin;
		GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3(Screen.width / 320.0, Screen.height / 480.0, 1)); 
		if (GUI.Button(Rect(255,10,60,40),WeatherData.txtMan.GetText("BACK"),settingStyle))
		{
				displayInfoScreen = false;
		}
		
		if (GUI.Button(Rect(15,10,135,40),WeatherData.txtMan.GetText("CONTACT"),settingStyle))
		{
				Application.OpenURL("mailto:weatherdog.apps.olpz@gmail.com");

		}
		windowRect = new Rect(windowMargin.x, windowMargin.y * Screen.height/480.0, 
	        				 Screen.width- (2*windowMargin.x), Screen.height - (2*windowMargin.y));
		GUI.Window(0, windowRect, DoInfoWindow as GUI.WindowFunction, "");
	}
	else
	{
		if(displaySearchUI)
		{
	
			GUI.skin = optionsSkin;

			windowRect = new Rect(windowMargin.x, windowMargin.y * Screen.height/480.0, 
	        				 Screen.width- (2*windowMargin.x), Screen.height - (2*windowMargin.y));
		    GUI.Window(0, windowRect, DoWindow as GUI.WindowFunction, "");
		
			GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3(Screen.width / 320.0, Screen.height / 480.0, 1)); 
	
			
	
	//		locationToSearch = locationToSearch.Replace(" ","");
			var oldSearchTerm = locationToSearch;
			locationToSearch = GUI.TextField (Rect (10, 10, 155, 30), locationToSearch,optionsSkin.GetStyle("Textfield"));
			if(locationToSearch == "")
			{
				GUI.Label(Rect (10, 10, 155, 30), WeatherData.txtMan.GetText("FIND_A_CITY"),optionsSkin.GetStyle("Textfield"));
			}
			else
			{
				GUI.Label(Rect (15, 10, 180, 30), "",rowSelectedStyle);
	
			}
			if(oldSearchTerm != locationToSearch && locationToSearch.Length > 3)
			{
				// wait for a while.....?
				textHasChanged = true;
				timeStart = Time.time;
	//			dataConnection.SearchForLocation(locationToSearch);
	
			}
			
			if(textHasChanged && (Time.time - timeStart) > timeToWait)
			{
				textHasChanged = false;
				print(locationToSearch);
				if(!WeatherData.isSearching)
					dataConnection.SearchForLocation(locationToSearch);			
			}
			if(GUI.Button(Rect(160, 5, 40, 40),"",searchStyle))
			{
				// go search
				if(!WeatherData.isSearching)
					dataConnection.SearchForLocation(locationToSearch);
				
			}
			if(GUI.Button(Rect(205, 5, 40, 50),"",gpsStyle))
			{
				// go search
				displaySearchUI = false;
				locationToSearch = "";
				WeatherData.searchResults.Clear();
				dataConnection.Fetch();
			}
			if (GUI.Button(Rect(250,8,65,40),WeatherData.txtMan.GetText("CANCEL"),settingStyle))
			{
					displaySearchUI = false;
			}
			
		    
	
	    }
		GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3(Screen.width / 320.0, Screen.height / 480.0, 1)); 
		
		
		
		if(!displaySearchUI)
		{
			if(WeatherData.dataUpdateFinished && selectedWeatherObject != null && !WeatherData.isLoading && !WeatherData.hasError )
			{
//				GUI.DrawTexture(Rect(10, 430,300,40),blueBack);
				GUI.DrawTexture(Rect(10, 5,300,50),blueBack);
				
//				GUI.DrawTexture(Rect(265,5,40,34),pinkCircle);
//				GUI.DrawTexture(Rect(12,5,40,34),blueCircle);
//				GUI.DrawTexture(Rect(80,40,170,1),lineSep);


				if(canGoForward)
				{
					if (GUI.Button(Rect(280,435,30,30),"",forwardStyle) || GUI.Button(Rect(260,420,60,60),"" ,timeStyle))
					{
						ChangeState(true);
					}
				}
				if(canGoBackward)
				{
					if (GUI.Button(Rect(12,435,30,30),"",backwardStyle)|| GUI.Button(Rect(0,420,60,60),"" ,timeStyle))
					{
						ChangeState(false);
					}
				}
				
				//location
				if(GUI.Button(Rect(80,5,160,50),"" ,timeStyle))
				{
					displaySearchUI = true;
	
				}
				
				GUI.Label(Rect(50,12,220,20), WeatherData.local["city"] as String,timeStyle);
				
				
				// toggle metric
				if(GUI.Button(Rect(0,2,50,50),"" ,numbersStyleShadow) || GUI.Button(Rect(270,2,50,50),"" ,numbersStyleShadow))
				{
					var i:int;
					
					if(WeatherData.metric == 0)
					{
						WeatherData.metric = 1;
							PlayerPrefs.SetString("metricValue",WeatherData.metric+"");

						// change the current numbers to metric
						
						for(i = 0; i<WeatherData.weatherObjects.length; i++)
						{
							(WeatherData.weatherObjects[i] as WeatherObject).temp = Mathf.Round(((WeatherData.weatherObjects[i] as WeatherObject).temp -32) * 5.0/9.0);
							
							(WeatherData.weatherObjects[i] as WeatherObject).windSpeed	= Mathf.Round((WeatherData.weatherObjects[i] as WeatherObject).windSpeed * 1.609344 ); 
							
						}
					}
					else
					{
						WeatherData.metric = 0;
						// change the current numbers to fah.
						PlayerPrefs.SetString("metricValue",WeatherData.metric+"");

						for(i = 0; i<WeatherData.weatherObjects.length; i++)
						{
							(WeatherData.weatherObjects[i] as WeatherObject).temp = Mathf.Round((((WeatherData.weatherObjects[i] as WeatherObject).temp) * 9.0/5.0) + 32);
							
							(WeatherData.weatherObjects[i] as WeatherObject).windSpeed	= Mathf.Round((WeatherData.weatherObjects[i] as WeatherObject).windSpeed * 0.621371192); 

							
						}
					}
	
				}
				
				
//				GUI.Label(Rect(100,42,180,60),selectedWeatherObject.description,customGUIShadow);
		
//				GUI.Label(Rect(100,0,220,46),WeatherData.local["city"] as String ,numbersStyle);
				GUI.Label(Rect(50,35,220,15),selectedWeatherObject.description,numbersStyle);
		
				//temp
				
				if(WeatherData.metric == 1)
				{
//					GUI.Label(Rect(20,2,80,46),selectedWeatherObject.temp+"°C", numbersStyleShadow);
//					
//					GUI.Label(Rect(20,42,80,46),selectedWeatherObject.windSpeed+"kph", customGUIShadow);

					GUI.Label(Rect(19,37,20,20),"°C", numbersStyle);
			
					GUI.Label(Rect(17,15,30,30),selectedWeatherObject.temp +"", customGUI);
					
					GUI.Label(Rect(270,37,30,20),"kph", numbersStyle);

					
					GUI.Label(Rect(270,15,30,30),selectedWeatherObject.windSpeed+"", customGUI);
				}
				else
				{
//					GUI.Label(Rect(20,2,80,46),selectedWeatherObject.temp+"°F", numbersStyleShadow);
//					
//					GUI.Label(Rect(20,42,80,46),selectedWeatherObject.windSpeed+"mph", customGUIShadow);
					GUI.Label(Rect(19,37,20,20),"°F", numbersStyle);

//			
					GUI.Label(Rect(17,15,30,30),selectedWeatherObject.temp+"", customGUI);
					GUI.Label(Rect(270,35,30,20),"mph", numbersStyle);

					
					GUI.Label(Rect(270,15,30,30),selectedWeatherObject.windSpeed+"", customGUI);
					
				}
				//time
				
				var dt: System.DateTime = new System.DateTime();
		
				dt = System.DateTime.Now;
		
//				selectedWeatherObject.day = dt.ToString("dddd");
				if(selectedWeatherObject.isCurrent)
				{
	//				GUI.Label(Rect(120,422,80,40),dt.ToString("H:mm"), customGUIShadow);
	//				GUI.Label(Rect(120,422,80,40),WeatherData.local["time"]as String, customGUIShadow);
	
	//				GUI.Label(Rect(60,452,200,30),dt.ToString("dddd") +" "+ dt.ToString("MMM d"), numbersStyleShadow);
//					GUI.Label(Rect(60,417,200,60),WeatherData.txtMan.GetText("NOW"), timeStyleShadow);
	
	//				GUI.Label(Rect(120,420,80,40),dt.ToString("H:mm"), customGUI);
	//				GUI.Label(Rect(120,420,80,40),WeatherData.local["time"]as String, customGUI);
	
	//				GUI.Label(Rect(60,450,200,30),dt.ToString("dddd") +" "+ dt.ToString("MMM d"), numbersStyle);
					GUI.Label(Rect(40,440,240,20),WeatherData.txtMan.GetText("NOW"), timeStyle);
	
	
				}
				
				else
				{
					var timeOftheDay: String;
					if(selectedWeatherObject.isDayTime)
					{
						
	//					GUI.Label(Rect(120,422,80,40),"Day", customGUIShadow);
	//	
	//					GUI.Label(Rect(120,420,80,40),"Day", customGUI);
						if(dt.Day == (WeatherData.weatherObjects[0] as WeatherObject).date.Day)
						{
							if(selectedWeatherID == 1)
							{
//								GUI.Label(Rect(60,417,200,60),WeatherData.txtMan.GetText("TODAY"), timeStyleShadow);
			
								GUI.Label(Rect(40,440,240,20),WeatherData.txtMan.GetText("TODAY"), timeStyle);
			
							}
							else if(selectedWeatherID == 3)
							{
//								GUI.Label(Rect(60,417,200,60),WeatherData.txtMan.GetText("TOMORROW")+" "+WeatherData.txtMan.GetText("DAY"), timeStyleShadow);
			
								GUI.Label(Rect(40,440,240,20),WeatherData.txtMan.GetText("TOMORROW")+" "+WeatherData.txtMan.GetText("DAY"), timeStyle);
			
							}
							else
							{
//								GUI.Label(Rect(60,417,200,60),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("DAY"), timeStyleShadow);
				
								GUI.Label(Rect(40,440,240,20),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("DAY"), timeStyle);
							}
						}
						else
						{
//							GUI.Label(Rect(60,417,200,60),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("DAY"), timeStyleShadow);
			
							GUI.Label(Rect(40,440,240,20),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("DAY"), timeStyle);
						}
		
					}
					else
					{
	//					GUI.Label(Rect(120,422,80,40),"Night", customGUIShadow);
	//	
	//					GUI.Label(Rect(120,420,80,40),"Night", customGUI);
						if(dt.Day == (WeatherData.weatherObjects[0] as WeatherObject).date.Day)
						{
							if(selectedWeatherID == 2)
							{
//								GUI.Label(Rect(60,417,200,60),WeatherData.txtMan.GetText("TONIGHT"), timeStyleShadow);
			
								GUI.Label(Rect(40,440,240,60),WeatherData.txtMan.GetText("TONIGHT"), timeStyle);
			
							}
							else if(selectedWeatherID == 4)
							{
//								GUI.Label(Rect(60,417,200,60),WeatherData.txtMan.GetText("TOMORROW")+" "+WeatherData.txtMan.GetText("NIGHT"), timeStyleShadow);
			
								GUI.Label(Rect(40,440,240,20),WeatherData.txtMan.GetText("TOMORROW")+" "+WeatherData.txtMan.GetText("NIGHT"), timeStyle);
			
							}
							else
							{
//								GUI.Label(Rect(60,417,200,60),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("NIGHT"), timeStyleShadow);
				
								GUI.Label(Rect(40,440,240,20),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("NIGHT"), timeStyle);
							}
			
						}
						else
						{
//							GUI.Label(Rect(60,417,200,60),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("NIGHT"), timeStyleShadow);
			
							GUI.Label(Rect(40,440,240,20),selectedWeatherObject.day +" "+WeatherData.txtMan.GetText("NIGHT"), timeStyle);
						}
		
					}
	//				GUI.Label(Rect(60,452,200,30),selectedWeatherObject.date.ToString("dddd") +" "+ selectedWeatherObject.date.ToString("MMM d"), numbersStyleShadow);
	//	
	//				GUI.Label(Rect(60,450,200,30),selectedWeatherObject.date.ToString("dddd") +" "+ selectedWeatherObject.date.ToString("MMM d"), numbersStyle);
				}
		
			}
			else
			{
					var message: String = "";
					if(WeatherData.hasError)
					{
						message = WeatherData.errorMessage;
					}
					else
					{
						if(WeatherData.isLoading)
							message = WeatherData.txtMan.GetText("LOADING");
					}
					if(GUI.Button(Rect(40,14,240,200),message, timeStyleShadow))
					{
						displaySearchUI = true;
					}
					
		
					GUI.Label(Rect(40,12,240,200),message, timeStyle);
		
			}
		}
		
		if(!displaySearchUI)
		{
//			if (GUI.Button(Rect(275,40,40,40),"",searchStyle))
//			{
//					displaySearchUI = true;
//			}
//			if (GUI.Button(Rect(275,90,40,40),"",settingStyle))
//			{
//					displayInfoScreen = true;
//					scrollPosition = Vector2(0,0);
//			}
//			
//			if(!muteSound)
//			{
//				if (GUI.Button(Rect(275,140,40,40),soundOnTex, customGUI))
//				{
//						muteSound = true;
//				}
//			}
//			else
//			{
//				if (GUI.Button(Rect(275,140,40,40),soundOffTex, customGUI))
//				{
//						muteSound = false;
//				}
//			}
//			if (GUI.Button(Rect(245,370,80,40),accuTex,customGUI))
//			{
//				Application.OpenURL((WeatherData.weatherURL.Replace(" ","%20")));
//			}
		}
		else
		{
//			if (GUI.Button(Rect(250,10,65,40),WeatherData.txtMan.GetText("CANCEL"),settingStyle))
//			{
//					displaySearchUI = false;
//			}
		}
		
		
	}
	

}
function DoInfoWindow (windowID: int ) 
{
	

	var rScrollFrame: Rect = new Rect(0, 20, 340, 350);
	var creds:String;
//	var rList: Rect = new Rect(0, 0, rowSize.x, WeatherData.searchResults.length*rowSize.y);
#if UNITY_ANDROID
if (WeatherData.langID != 3)
{
	creds = "GENERAL CONDITIONS FOR USE OF THE WEATHER DOG FOR ANDROID\n\n";

creds+="PREAMBLE\n\n";
creds+="The Weather Dog Service is a service that enables Users to have an access to a funny Weather presentation on a device compatible with Android OS 2.2+ (hereinafter the ‘Service’).\n"+
"This Service is offered by the company France Telecom R&D UK LTD (Private company limited by shares) N° 419 33 79, headquartered at Building 10, Chiswick Park 566, Chiswick High Road, W4 5XS London (hereinafter referred to as ‘ORANGE’).\n"+
"The Service accessible via the Weather Dog software application is open to any individual who wishes to use the Service for his/her own needs and for strictly personal, non-commercial purposes.\n"+
"The Service is provided free-of-charge.\n"+
"Access to and use of the Service are subject to these General Conditions of Use (hereinafter the ‘GCU’), which the User expressly accepts when registering for the Service.\n\n"+

"ARTICLE 1 - DEFINITIONS\n"+
"In these GCU, the following terms shall, unless otherwise stated, have the meaning given to them in this article:\n"+
"Application: refers to the software application entitled Weather Dog, which provides access to the Service,  is available for free on the GOOGLE Inc, Android Market and which the User has chosen to download onto his/her Device for free from the Android Market\n"+
"Networks: Refers to the electronic communication networks open to the public operated by ORANGE, whatever the technology or standards used by these networks (cable, satellite, ADSL, optical fibre, GSM, GPRS, EDGE, UMTS, Wi-Fi, WIMAX, etc.).\n"+
"Service: Refers to a service entitled Weather Dog which is connected to the Networks.\n"+
"Device / Devices: : Refer to Android operating system (2.2+) terminal devices (particularly, but not only, touch-screen tablet-type mobile devices) which may be connected to the Internet via the Networks.\n"+
"User: Refers to a natural person, be it an adult or a minor who has obtained prior permission from his/her legal representative, who uses the Service for his/her own needs and for purely personal, non-commercial purposes.\n\n"+

"ARTICLE 2 – PURPOSE\n"+
"The purpose of these GCU is to lay down the conditions in which:\n"+
"-	the Service is made available to Users;\n"+
"-	the Users must use the Service.\n\n"+

"ARTICLE 3 – ACCESS TO THE SERVICE\n"+
"In order to be able to access to the Service from the Application, the User must have a Device and have subscribed to a ’data’ option in his/her mobile phone subscription, regardless of the mobile phone operator with which the User has taken out his/her subscription.\n\n"+ 

"ARTICLE 4 - COST OF THE SERVICE\n"+
"The Service is provided by ORANGE free of charge (excluding (i) mobile phone subscription costs (ii) charges for connection and access to the Internet network).\n\n"+

"ARTICLE 5 – RESPONSIBILITY AND GUARANTEES OF THE USER\n"+
"The User guarantees (i) that he/she does not live in a country that is the subject of an embargo by the United States government or that is designated by the United States government as a ‘terrorist supporting country’ and (ii) that he/she does not feature on a list of ‘prohibited or restricted parties’ established by the United States government.\n"+
"The User guarantees that he/she will comply with the terms of any contracts agreed with third parties that are applicable within the context of use of the Application. In particular, the User must check that he/she is not in violation of the terms of his/her (voice/data) subscription with his/her mobile phone operator.\n\n"+

"ARTICLE 6 - RESPONSIBILITY OF ORANGE\n"+ 
"ORANGE is responsible for implementing the necessary resources for the correct operation of the Service and shall take the measures necessary to maintain the continuity and quality of this Service.\n"+
"In order to continue to benefit fully from the Service, the User may have to download the updates proposed by ORANGE when they are made available. In this respect, any Application downloaded by a User is valid for a limited time only, given these updates and the potential technical, legislative or regulatory changes over which ORANGE has no control.\n"+ 
"ORANGE in no way guarantees that the Service and/or Application are error-free or suited to the specific needs of the User.\n"+
//"ORANGE and the User recognise and accept that ORANGE LABS, and not Apple, shall, within the framework of the operation and use of the Service, answer any action for liability (i) for damage caused by things, (ii) based on the violation of an applicable law or regulation, (iii) based on the violation of the provisions of consumer law and intellectual property law, whether these actions be brought by a User or a third party.\n"+
//"ORANGE and the User recognise and accept that Apple and its subsidiaries are parties to these general conditions and that, from the moment these general conditions are accepted by the User, Apple will have grounds to demand that the User fulfil his/her contractual obligations under these general conditions.\n\n"+

"ARTICLE 7 – SUSPENSION AND TERMINATION\n"+
"ORANGE reserves the right to stop providing the Service on the GOOGLE Inc, Android Market AppStore without prior notice and without paying any indemnity. Similarly, ORANGE may permanently stop providing the Service to Users.\n\n"+

"ARTICLE 8 - INTELLECTUAL PROPERTY\n"+
"8.1 Rights of ORANGE\n"+ 
"ORANGE is and remains the owner of its Service, the Application, software, software applications, graphic guidelines, trademarks, logos, concepts, technologies, software, databases and content made available to the Users.\n"+
"The User recognises that he/she does not acquire any intellectual property rights over the elements belonging to ORANGE. He/she shall also strictly refrain from using these elements for any other purpose than that set out in these GCU.\n"+
"Any improvements, updates, derived products or upgrades concerning the Service, be they performed, created or developed by ORANGE, are and will remain the property of ORANGE, and you recognise and expressly accept that any contribution in the form of services, suggestions, ideas, reports, identification or defects, expenditure, or any other contribution made by the User shall not confer any right, title or interest in any of the elements or components of the Service.\n"+
"8.2 Right of usage (licence)\n"+
"ORANGE hereby grants the User a non-exclusive, non-transferable, revocable right of use, which is valid for the whole world and cannot give rise to a sub-licence, for the Application and/or the software components of the Application.\n"+
"This authorisation is granted for as long as the Service remains available free of charge and the user uses the Application on a device compatible with the Android operating system.\n"+
"This authorisation is subject to compliance with these GCU and the Usage Rules available from the GOOGLE Inc, Android Market AppStore\n"+
"Authorisation does not authorise the User to access or use any source code of the Application and/or the software components of the Application.\n"+
"The User must not:\n"+
"a.	Use, copy, modify or distribute the Application and/or the software components of the  Application, except as expressly authorised in these conditions of use;\n"+
"b.	Disassemble, decompile or translate the Application and/or the software components of the Application, except as expressly authorised by the applicable laws or regulations;\n"+
"c.	Sub-licence or assign the Application and/or the software components of the Application.\n\n"+

"ARTICLE 9 – APPLICABLE LAW AND GENERAL PROVISIONS\n"+
"If one or more stipulations of the present GCU should be declared null and void by application of a law or regulation, or as the result of a definitive decision of a competent jurisdiction, the other stipulations shall maintain all of their force and scope of applicability.\n"+
"The stipulations declared null and void shall then be replaced by stipulations that are closer in content to the initially decided stipulations.\n"+
"The parties will not be held responsible, or considered as having breached these GCU, in the event of any delay or incomplete performance caused by a case of force majeure as defined by the case law of the French courts.\n"+
"These GCU are subject to French law.\n\n"+

"ARTICLE 10 - CONTACT\n"+
"Any claim or challenge concerning the Service must be sent by email in the ‘Contact us’ section of the Application.\n\n";

 	creds += "\n\nLEGAL INFORMATIONS\n\n";
    creds += "Editor:\nFRANCE TELECOM R&D LTD (\"ORANGE LABS\") Private company limited by shares N° 419 33 79\n";
    creds += "Address: Building 10 Chiswick Park, 566 Chiswick High Road, W4 5XS LONDON\n";
    creds += "Phone number: +44 208 987 1900\n\n";
    creds += "Publisher director:\nMarie-Noëlle JEGO-LAVEISSIERE\n\n"; 
	creds += "Hosting services provider:\nFrance TELECOM SA\nRCS Paris 380 129866\nHead office: 6 place d'Alleray\n75015 PARIS\nPhone number: 01 44 44 22 22\n\n"; 
    creds += "Credits:\nORANGE LABS\n\n\n"; 
    creds += "DATA\n\nORANGE LABS holds and keeps the identifications data of its Users in accordance with the regulations in force.Any claim or challenge concerning the service must be sent by email in the \"Contact us\" section of the Application WEATHER DOG\n\n\n"; 
	creds += "THIRD PARTIES SOFTWARE\n\n";
	creds += "Lightwight XML Parser script - Copyright 2010 - Fraser McCormick\nThis script is ditributed under the terms and conditions of the MIT license\n(http://www.opensource.org/licenses/mit-license.php)\n";

    scrollPosition = GUI.BeginScrollView (rScrollFrame, scrollPosition, Rect(0,0,320,5000), false, false);
    
    GUI.Label(Rect(30,3550,260,30),"LEGAL NOTICE \"WEATHER DOG\"",infoScreenHeaderStyle);
                
	GUI.Label(Rect(20,10,280,5000),creds, infoScreenStyle);
} 
else if (WeatherData.langID == 3)//french
{
	creds = "CONDITIONS GENERALES D’UTILISATION DU SERVICE WEATHER DOG POUR ANDROID\n\n";

creds+="PRÉAMBULE\n\n";
creds+="Le service Weather Dog permet à tout client Utilisateur titulaire d’un Terminal sous système d’exploitation Android de  consulter une météo présentée sous forme amusante et divertissante (ci-après le « Service »).\n"+
"Ce Service est proposé par la société France Télécom SA au capital de 10 595 434 424 euros enregistrée au RCS de Paris sous le n° 380 129 866 dont le siège social est situé 6 place d’Alleray 75015 Paris (ci-après désignée « ORANGE »).\n"+
"Le Service, accessible via l’application logicielle Weather Dog, est ouvert à toute personne physique souhaitant utiliser le Service pour ses besoins propres et dans le cadre d’un usage strictement personnel et non commercial.\n"+
"Le Service est proposé à titre gratuit. \n"+
"L’accès et l’utilisation du Service sont soumis aux présentes Conditions Générales d’Utilisation (ci-après les « CGU ») que l’Utilisateur accepte expressément lors de son inscription au Service.\n\n"+

"ARTICLE 1 - DÉFINITIONS\n"+
"Dans les présentes CGU, les termes suivants ont, sauf précision contraire, le sens qui leur est donné dans cet article :\n"+
"Application : désigne l’application logicielle appelée Weather Dog, donnant accès au Service, disponible à titre gratuit dans la boutique d’applications de la société GOOGLE Inc, Android Market et que l’Utilisateur a choisi de télécharger sur son Terminal.\n"+
"Réseaux : désignent les réseaux de communications électroniques ouverts au public interconnectés et exploités par tout opérateur quelles que soient les technologies ou les normes utilisées par ces réseaux (câble, satellite, ADSL, fibre optique, GSM, GPRS, EDGE, UMTS, Wi-FI, WIMAX, etc.).\n"+
"Service : désigne un service appelé Weather Dog  connecté sur les Réseaux.\n"+
"Terminal / Terminaux : désignent tous équipements terminaux sous système d’exploitation Android (en particulier, mais de façon non limitative, les terminaux mobiles et tablettes tactiles) susceptibles d’être connectés à l’Internet via les Réseaux.\n"+
"Utilisateur : désigne une personne physique majeure ou mineure ayant obtenu au préalable l’autorisation de son représentant légal, et utilisant le Service, pour ses besoins propres, dans le cadre d’un usage strictement personnel et non commercial.\n\n"+

"ARTICLE 2 – OBJET\n"+
"Les présentes CGU ont pour objet de définir les conditions dans lesquelles :\n"+
"-	le Service est mis à disposition des Utilisateurs ;\n"+
"-	les Utilisateurs doivent utiliser le Service.\n\n"+

"ARTICLE 3 – ACCÈS AU SERVICE\n"+
"Pour pouvoir utiliser le Service via l’Application, l’Utilisateur doit disposer d’un Terminal et avoir souscrit à une option « data » sur son abonnement de téléphonie mobile, et ce quelque soit l’opérateur de téléphonie mobile auprès de qui l’Utilisateur a souscrit son abonnement.\n\n"+ 

"ARTICLE 4 - COUT DU SERVICE\n"+
"Le Service est proposé par ORANGE à titre gratuit (hors frais (i) d’abonnement de téléphonie mobile et (ii) de connexion et d’accès au réseau Internet).\n\n"+

"ARTICLE 5 - RESPONSABILITÉ ET GARANTIES DE L’UTILISATEUR\n"+
"L’Utilisateur garantit (i) qu’il ne réside pas dans un pays faisant l'objet d'un embargo du gouvernement des États-Unis ou désigné par le gouvernement des États-Unis comme un pays soutenant le terrorisme (« terrorist supporting country ») et (ii) qu’il ne figure pas sur une liste, établie par le gouvernement des États-Unis, de parties prohibées ou restreintes (« prohibited or restricted parties »).\n"+
"L’Utilisateur garantit se conformer aux termes des contrats conclus avec des tiers et applicables dans le cadre de l’utilisation de l’Application. En particulier, l’utilisateur doit s’assurer ne pas être en violation des termes de son abonnement (voix/data) souscrit auprès de son opérateur de téléphonie mobile.\n\n"+

"ARTICLE 6 - RESPONSABILITÉ D’ORANGE \n"+ 
"Orange est responsable de la mise en place des moyens nécessaires à la bonne marche du Service et prend les mesures nécessaires au maintien de la continuité et de la qualité de ce Service.\n"+
"Afin de continuer à bénéficier pleinement du Service, l’Utilisateur pourra être amené à télécharger les mises à jour proposées par Orange lorsque celles-ci auront été rendues disponibles. A cet égard, toute Application téléchargée par un Utilisateur a une validité limitée dans le temps, compte tenu de ces mises à jour et des éventuelles évolutions techniques, législatives ou réglementaires, dont Orange n’a pas le contrôle.\n"+ 
//"ORANGE in no way guarantees that the Service and/or Application are error-free or suited to the specific needs of the User.\n"+
//"ORANGE and the User recognise and accept that ORANGE LABS, and not Apple, shall, within the framework of the operation and use of the Service, answer any action for liability (i) for damage caused by things, (ii) based on the violation of an applicable law or regulation, (iii) based on the violation of the provisions of consumer law and intellectual property law, whether these actions be brought by a User or a third party.\n"+
//"ORANGE and the User recognise and accept that Apple and its subsidiaries are parties to these general conditions and that, from the moment these general conditions are accepted by the User, Apple will have grounds to demand that the User fulfil his/her contractual obligations under these general conditions.\n\n"+

"ARTICLE 7 – SUSPENSION - RÉSILIATION\n"+
"Orange se réserve la possibilité de procéder à l’arrêt de la mise à disposition depuis l’application store du Service, Android Market, sans préavis et sans indemnité. De même, Orange pourra arrêter définitivement la fourniture du Service auprès des Utilisateurs.\n\n"+

"ARTICLE 8 - PROPRIETE INTELLECTUELLE\n"+
"8.1 Droit d’ORANGE LABS\n"+ 
"ORANGE est et reste propriétaire de son Service, de l’Application, logiciels, applications logicielles, charte graphique, marques, logos, concepts, technologie, bases de données, contenus mis à la disposition des Utilisateurs.\n"+
"L’Utilisateur reconnaît qu’il n’acquiert aucun droit de propriété intellectuelle sur les éléments, appartenant à ORANGE. Il s’interdit en outre formellement de les utiliser dans un cadre autre que celui exclusivement prévu aux présentes CGU.\n"+
"Toutes les améliorations, mises à jour, produits dérivés, évolutions, qu'elles soient réalisées, créés ou développés par ORANGE concernant le Service sont et demeureront la propriété de ORANGE, et vous reconnaissez et acceptez expressément que toute contribution sous forme de services, de suggestions, d’idées, de rapports, d'identification des défauts, de dépenses, ou toutes autres contributions faîtes par l’Utilisateur, ne donne ou accorde aucun droit, titre ou intérêt dans l'un quelconque des éléments ou composants du Service.\n"+
"8.2 Droit d’usage (licence)\n"+
"Orange accorde à l’Utilisateur, par les présentes, un droit d’utilisation non-exclusif, non-transférable, révocable, valable pour le monde entier et ne pouvant faire l’objet de sous-licence, de l’Application et/ou des composants logiciels de l’Application\n"+
"Cette autorisation est accordée pour autant que le Service est disponible gratuitement et que l’utilisateur utilise l’Application sur un Terminal compatible avec un système d’exploitation Androïd .\n"+
"Cette autorisation est soumise au respect des présentes CGU et les Règles d’Usage disponibles sur le site Terms of Service d’Android Market de GOOGLE.\n"+
"L’autorisation n’autorise l’Utilisateur ni à accéder à, ni à utiliser aucun code source de l’Application et/ou des composants logiciels de l’Application.\n"+
"L’Utilisateur ne doit pas :\n"+
"a.	utiliser, copier, modifier ou distribuer l’Application et/ou des composants logiciels de l’Application, sauf comme expressément autorisé par les présentes Conditions d’Utilisation ;\n"+
"b.	désassembler, décompiler ou traduire l’Application et/ou des composants logiciels de l’Application, sauf comme expressément autorisé par les lois ou règlements qui sont applicables ;\n"+
"c.	sous-licencier ou concéder l’Application et/ou des composants logiciels de l’Application.\n\n"+

"ARTICLE 9 - LOI APPLICABLE – DISPOSITIONS GÉNÉRALES\n"+
"Si une ou plusieurs stipulations des présentes CGU sont nulles ou déclarées comme telles en application d’une loi, d’un règlement ou à la suite d’une décision définitive d’une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.\n"+
"Les stipulations déclarées nulles et non valides seront alors remplacées par des stipulations qui se rapprocheront le plus quant à leur contenu des stipulations initialement arrêtées.\n"+
"Les parties ne seront pas tenues pour responsables, ou considérées comme ayant failli aux présentes CGU, pour tout retard ou inexécution, lorsque la cause du retard ou de l’inexécution est liée à un cas de force majeure telle que définie par la jurisprudence des tribunaux français.\n"+
"Les présentes CGU sont soumises à la loi française.\n\n"+

"ARTICLE 10 - CONTACT\n"+
"Toute réclamation ou contestation relative au Service doit être transmise par courrier électronique, dans la rubrique « Nous contacter » de l’Application.\n\n";

 	creds += "\n\nINFORMATIONS LÉGALES\n\n";
    creds += "Éditeur:\nFRANCE TELECOM R&D UK LTD (\"ORANGE LABS\") Private company limited by shares N° 419 33 79\n";
    creds += "Adresse : Building 10 Chiswick Park 566, Chiswick High Road, W4 5XS LONDON\n";
    creds += "Numero de téléphone : +442 089 87 1900\n\n";
    creds += "Directeur de la publication:\nMarie-Noëlle JEGO-LAVEISSIERE\n\n"; 
	creds += "Hébergeur:\nFrance TELECOM SA\nRCS Paris 380 129866\nSiège social: 6 place d'Alleray\n75015 PARIS\nN° de téléphone: 01 44 44 22 22\n\n"; 
    creds += "Crédits:\nORANGE LABS\n\n\n"; 
    creds += "DONNÉES\n\nORANGE LABS détient et conserve les données d’identification de ses Utilisateurs conformément à la réglementation en vigueur. Vous pouvez à tout moment accéder et modifier vos informations personnelles dans la rubrique « Nous contacter » de l’application WEATHER DOG\n\n\n"; 
	creds += "Logiciels Tiers:\n\n";
	creds += "Lightwight XML Parser script - Copyright 2010 - Fraser McCormick\nThis script is ditributed under the terms and conditions of the MIT license\n(http://www.opensource.org/licenses/mit-license.php)\n";
    scrollPosition = GUI.BeginScrollView (rScrollFrame, scrollPosition, Rect(0,0,320,4800), false, false);
    
    GUI.Label(Rect(17,3700,300,30),"MENTIONS LEGALES WEATHER DOG",infoScreenHeaderStyle);
                
	GUI.Label(Rect(20,10,280,4800),creds, infoScreenStyle);
} 
#endif 

#if UNITY_IPHONE
if (WeatherData.langID != 3)
{
creds = "GENERAL CONDITIONS FOR USE OF THE WEATHER DOG FOR APPLE iOS\n\n";

creds+="PREAMBLE\n\n";
creds+="The Weather Dog Service is a service that enables Users to have an access to a funny Weather presentation on a device compatible with Apple iOS (hereinafter the ‘Service’).\n"+
"This Service is offered by the company France Telecom R&D UK LTD (Private company limited by shares) N° 419 33 79, headquartered at Building 10, Chiswick Park 566, Chiswick High Road, W4 5XS London (hereinafter referred to as ‘ORANGE’).\n"+
"The Service accessible via the Weather Dog software application is open to any individual who wishes to use the Service for his/her own needs and for strictly personal, non-commercial purposes.\n"+
"The Service is provided free-of-charge.\n"+
"Access to and use of the Service are subject to these General Conditions of Use (hereinafter the ‘GCU’), which the User expressly accepts when registering for the Service.\n\n"+

"ARTICLE 1 - DEFINITIONS\n"+
"In these GCU, the following terms shall, unless otherwise stated, have the meaning given to them in this article:\n"+
"Application: refers to the software application entitled Weather Dog, which provides access to the Service and which the User has chosen to download onto his/her Device for free from the Apple AppStore.\n"+
"Networks: Refers to the electronic communication networks open to the public operated by ORANGE, whatever the technology or standards used by these networks (cable, satellite, ADSL, optical fibre, GSM, GPRS, EDGE, UMTS, Wi-Fi, WIMAX, etc.).\n"+
"Service: Refers to a service entitled Weather Dog which is connected to the Networks.\n"+
"Device / Devices: Refer to all Apple iOS terminal devices (particularly, but not only, touch-screen tablet-type mobile devices) which may be connected to the Internet via the Networks.\n"+
"User: Refers to a natural person, be it an adult or a minor who has obtained prior permission from his/her legal representative, who uses the Service for his/her own needs and for purely personal, non-commercial purposes.\n\n"+

"ARTICLE 2 – PURPOSE\n"+
"The purpose of these GCU is to lay down the conditions in which:\n"+
"-	the Service is made available to Users;\n"+
"-	the Users must use the Service.\n\n"+

"ARTICLE 3 – ACCESS TO THE SERVICE\n"+
"In order to be able to access to the Service from the Application, the User must have a Device and have subscribed to a ’data’ option in his/her mobile phone subscription, regardless of the mobile phone operator with which the User has taken out his/her subscription.\n\n"+ 

"ARTICLE 4 - COST OF THE SERVICE\n"+
"The Service is provided by ORANGE free of charge (excluding (i) mobile phone subscription costs (ii) charges for connection and access to the Internet network).\n\n"+

"ARTICLE 5 – RESPONSIBILITY AND GUARANTEES OF THE USER\n"+
"The User guarantees (i) that he/she does not live in a country that is the subject of an embargo by the United States government or that is designated by the United States government as a ‘terrorist supporting country’ and (ii) that he/she does not feature on a list of ‘prohibited or restricted parties’ established by the United States government.\n"+
"The User guarantees that he/she will comply with the terms of any contracts agreed with third parties that are applicable within the context of use of the Application. In particular, the User must check that he/she is not in violation of the terms of his/her (voice/data) subscription with his/her mobile phone operator.\n\n"+

"ARTICLE 6 - RESPONSIBILITY OF ORANGE\n"+ 
"ORANGE is responsible for implementing the necessary resources for the correct operation of the Service and shall take the measures necessary to maintain the continuity and quality of this Service.\n"+
"In order to continue to benefit fully from the Service, the User may have to download the updates proposed by ORANGE when they are made available. In this respect, any Application downloaded by a User is valid for a limited time only, given these updates and the potential technical, legislative or regulatory changes over which ORANGE has no control.\n"+ 
"Any action for liability, loss or damage resulting from a non-conformity in the Service, or the failure of the Service to comply with the terms of any kind of guarantee of any nature whatsoever, shall be the sole responsibility of ORANGE LABS.\n"+
"ORANGE and the User recognise and accept that ORANGE LABS, and not Apple, shall, within the framework of the operation and use of the Service, answer any action for liability (i) for damage caused by things, (ii) based on the violation of an applicable law or regulation, (iii) based on the violation of the provisions of consumer law and intellectual property law, whether these actions be brought by a User or a third party.\n"+
"ORANGE and the User recognise and accept that Apple and its subsidiaries are parties to these general conditions and that, from the moment these general conditions are accepted by the User, Apple will have grounds to demand that the User fulfil his/her contractual obligations under these general conditions.\n\n"+

"ARTICLE 7 – SUSPENSION AND TERMINATION\n"+
"ORANGE reserves the right to stop providing the Service in the Apple AppStore without prior notice and without paying any indemnity. Similarly, ORANGE may permanently stop providing the Service to Users.\n\n"+

"ARTICLE 8 - INTELLECTUAL PROPERTY\n"+
"8.1 Rights of ORANGE\n"+ 
"ORANGE is and remains the owner of its Service, the Application, software, software applications, graphic guidelines, trademarks, logos, concepts, technologies, software, databases and content made available to the Users.\n"+
"The User recognises that he/she does not acquire any intellectual property rights over the elements belonging to ORANGE. He/she shall also strictly refrain from using these elements for any other purpose than that set out in these GCU.\n"+
"Any improvements, updates, derived products or upgrades concerning the Service, be they performed, created or developed by ORANGE, are and will remain the property of ORANGE, and you recognise and expressly accept that any contribution in the form of services, suggestions, ideas, reports, identification or defects, expenditure, or any other contribution made by the User shall not confer any right, title or interest in any of the elements or components of the Service.\n"+
"8.2 Right of usage (licence)\n"+
"ORANGE hereby grants the User a non-exclusive, non-transferable, revocable right of use, which is valid for the whole world and cannot give rise to a sub-licence, for the Application and/or the software components of the Application.\n"+
"This authorisation is granted for as long as the Service remains available free of charge and the user uses the Application on a device compatible with Apple iOS.\n"+
"This authorisation is subject to compliance with these GCU and the Usage Rules available in the App Store Terms of Service.\n"+
"Authorisation does not authorise the User to access or use any source code of the Application and/or the software components of the Application.\n"+
"The User must not:\n"+
"a.	Use, copy, modify or distribute the Application and/or the software components of the  Application, except as expressly authorised in these conditions of use;\n"+
"b.	Disassemble, decompile or translate the Application and/or the software components of the Application, except as expressly authorised by the applicable laws or regulations;\n"+
"c.	Sub-licence or assign the Application and/or the software components of the Application.\n\n"+

"ARTICLE 9 – APPLICABLE LAW AND GENERAL PROVISIONS\n"+
"If one or more stipulations of the present GCU should be declared null and void by application of a law or regulation, or as the result of a definitive decision of a competent jurisdiction, the other stipulations shall maintain all of their force and scope of applicability.\n"+
"The stipulations declared null and void shall then be replaced by stipulations that are closer in content to the initially decided stipulations.\n"+
"The parties will not be held responsible, or considered as having breached these GCU, in the event of any delay or incomplete performance caused by a case of force majeure as defined by the case law of the French courts.\n"+
"These GCU are subject to French law.\n\n"+

"ARTICLE 10 - CONTACT\n"+
"Any claim or challenge concerning the Service must be sent by email in the ‘Contact us’ section of the Application.\n\n";

 	creds += "\n\nLEGAL INFORMATIONS\n\n";
    creds += "Editor:\nFRANCE TELECOM R&D LTD (\"ORANGE LABS\") Private company limited by shares N° 419 33 79\n";
    creds += "Address: Building 10 Chiswick Park, 566 Chiswick High Road, W4 5XS LONDON\n";
    creds += "Phone number: +44 208 987 1900\n\n";
    creds += "Publisher director:\nMarie-Noëlle JEGO-LAVEISSIERE\n\n"; 
	creds += "Hosting services provider:\nFrance TELECOM SA\nRCS Paris 380 129866\nHead office: 6 place d'Alleray\n75015 PARIS\nPhone number: 01 44 44 22 22\n\n"; 
    creds += "Credits:\nORANGE LABS\n\n\n"; 
    creds += "DATA\n\nORANGE LABS holds and keeps the identifications data of its Users in accordance with the regulations in force.Any claim or challenge concerning the service must be sent by email in the \"Contact us\" section of the Application WEATHER DOG\n\n\n"; 
	creds += "THIRD PARTIES SOFTWARE\n\n";
	creds += "Lightwight XML Parser script - Copyright 2010 - Fraser McCormick\nThis script is ditributed under the terms and conditions of the MIT license\n(http://www.opensource.org/licenses/mit-license.php)\n";
	creds += "Appirater - Copyright 2010. Arash Payan. This library is distributed under the terms of the MIT/X11.\n";

	scrollPosition = GUI.BeginScrollView (rScrollFrame, scrollPosition, Rect(0,0,320,5200), false, false);
    GUI.Label(Rect(17,3850,300,30),"LEGAL NOTICE \"WEATHER DOG\"",infoScreenHeaderStyle);
                
	GUI.Label(Rect(20,10,280,5200),creds, infoScreenStyle);
} 
if (WeatherData.langID == 3)//french
{ 
creds = "CONDITIONS GENERALES D’UTILISATION DU SERVICE WEATHER DOG POUR iOS APPLE\n\n";

creds+="PRÉAMBULE\n\n";
creds+="Le service Weather Dog permet à tout Utilisateur titulaire d’un Terminal compatible avec l’iOS d’Apple de  consulter une météo présentée sous forme amusante et divertissante (ci-après le « Service »).\n"+
"Ce Service est proposé par la société France Telecom R&D UK LTD (Private company limited by shares) N° 419 33 79 dont le siège social est situé Building 10, Chiswick Park 566, Chiswick High Road, W4 5XS London (ci-après désignée « ORANGE »).\n"+
"Le Service, accessible via l’application logicielle Weather Dog, est ouvert à toute personne physique souhaitant utiliser le Service pour ses besoins propres et dans le cadre d’un usage strictement personnel et non commercial.\n"+
"Le Service est proposé à titre gratuit.\n"+
"L’accès et l’utilisation du Service sont soumis aux présentes Conditions Générales d’Utilisation (ci-après les « CGU ») que l’Utilisateur accepte expressément lors de son inscription au Service.\n\n"+

"ARTICLE 1 - DÉFINITIONS\n"+
"Dans les présentes CGU, les termes suivants ont, sauf précision contraire, le sens qui leur est donné dans cet article:\n"+
"Application : désigne l’application logicielle appelée Weather Dog, donnant accès au Service, disponible, à titre gratuit dans l’AppStore d’Apple et que l’Utilisateur a choisi de télécharger sur son Terminal.\n"+
"Réseaux : désignent les réseaux de communications électroniques ouverts au public interconnectés et exploités par tout opérateur quelles que soient les technologies ou les normes utilisées par ces réseaux (câble, satellite, ADSL, fibre optique, GSM, GPRS, EDGE, UMTS, Wi-FI, WIMAX, etc.).\n"+
"Service : désigne un service appelé Weather Dog  connecté sur les Réseaux.\n"+
"Terminal / Terminaux : désignent tous équipements terminaux utilisant l’iOS d’Apple (en particulier, mais de façon non limitative, les terminaux mobiles et tablettes tactiles) susceptibles d’être connectés à l’Internet via les Réseaux.\n"+
"Utilisateur : désigne une personne physique majeure ou mineure ayant obtenu au préalable l’autorisation de son représentant légal, et utilisant le Service, pour ses besoins propres, dans le cadre d’un usage strictement personnel et non commercial.\n\n"+

"ARTICLE 2 – OBJET\n"+
"Les présentes CGU ont pour objet de définir les conditions dans lesquelles :\n"+
"-  le Service est mis à disposition des Utilisateurs;\n"+
"-	les Utilisateurs doivent utiliser le Service.\n\n"+

"ARTICLE 3 – ACCÈS AU SERVICE\n"+
"Pour pouvoir utiliser le Service via l’Application, l’Utilisateur doit disposer d’un Terminal et avoir souscrit à une option « data » sur son abonnement de téléphonie mobile, et ce quelque soit l’opérateur de téléphonie mobile auprès de qui l’Utilisateur a souscrit son abonnement.\n\n"+ 

"ARTICLE 4 - COUT DU SERVICE\n"+
"Le Service est proposé par ORANGE à titre gratuit (hors frais (i) d’abonnement de téléphonie mobile et (ii) de connexion et d’accès au réseau Internet).\n\n"+

"ARTICLE 5 - RESPONSABILITÉ ET GARANTIES DE L’UTILISATEUR\n"+
"L’Utilisateur garantit (i) qu’il ne réside pas dans un pays faisant l'objet d'un embargo du gouvernement des États-Unis ou désigné par le gouvernement des États-Unis comme un pays soutenant le terrorisme (« terrorist supporting country ») et (ii) qu’il ne figure pas sur une liste, établie par le gouvernement des États-Unis, de parties prohibées ou restreintes (« prohibited or restricted parties »).\n"+
"L’Utilisateur garantit se conformer aux termes des contrats conclus avec des tiers et applicables dans le cadre de l’utilisation de l’Application. En particulier, l’utilisateur doit s’assurer ne pas être en violation des termes de son abonnement (voix/data) souscrit auprès de son opérateur de téléphonie mobile.\n\n"+

"ARTICLE 6 - RESPONSABILITÉ D’ORANGE\n"+ 
"ORANGE est responsable de la mise en place des moyens nécessaires à la bonne marche du Service et prend les mesures nécessaires au maintien de la continuité et de la qualité de ce Service.\n"+
"Afin de continuer à bénéficier pleinement du Service, l’Utilisateur pourra être amené à télécharger les mises à jour proposées par ORANGE lorsque celles-ci auront été rendues disponibles. A cet égard, toute Application téléchargée par un Utilisateur a une validité limitée dans le temps, compte tenu de ces mises à jour et des éventuelles évolutions techniques, législatives ou réglementaires, dont ORANGE n’a pas le contrôle. ORANGE ne garantit en aucune manière que le Service et/ou l’Application sont exempts d’erreurs ou adaptés aux besoins spécifiques de l’Utilisateur.\n"+ 
"Toute action en responsabilité, perte, dommage résultants d’un défaut de conformité du Service ou du non-respect par le Service de toute forme de garantie, de quelque nature que ce soit, relève de la seule responsabilité d’ORANGE.\n"+
"ORANGE et l’Utilisateur reconnaissent et acceptent qu’ORANGE, et non Apple, devra répondre, dans le cadre de l’exploitation et de l’utilisation du Service, de toute action en responsabilité et notamment de toute action en responsabilité (i) du fait des choses, (ii) fondée sur la violation d’une loi ou d’un règlement applicable, (iii) fondée sur la violation des dispositions relatives au droit de la consommation et au droit de la propriété intellectuelle, que ces actions soient le fait d’un Utilisateur ou d’un tiers.\n"+
"ORANGE et l’Utilisateur reconnaissent et acceptent que Apple et ses filiales sont parties aux présentes CG et que, à compter de l’acceptation des présentes CG par l’Utilisateur, Apple sera fondée à exiger de l’Utilisateur l’exécution des obligations qu’il a contractées au titre des présentes CG.\n\n"+

"ARTICLE 7 – SUSPENSION - RÉSILIATION\n"+
"ORANGE se réserve la possibilité de procéder à l’arrêt de la mise à disposition du Service dans l’AppStore d’Apple sans préavis et sans indemnité. De même, ORANGE pourra arrêter définitivement la fourniture du Service auprès des Utilisateurs.\n\n"+

"ARTICLE 8 - PROPRIETE INTELLECTUELLE\n"+
"8.1 Droit d’ORANGE LABS\n"+ 
"ORANGE est et reste propriétaire de son Service, de l’Application, logiciels, applications logicielles, charte graphique, marques, logos, concepts, technologie, bases de données, contenus mis à la disposition des Utilisateurs.\n"+
"L’Utilisateur reconnaît qu’il n’acquiert aucun droit de propriété intellectuelle sur les éléments, appartenant à ORANGE. Il s’interdit en outre formellement de les utiliser dans un cadre autre que celui exclusivement prévu aux présentes CGU.\n"+
"Toutes les améliorations, mises à jour, produits dérivés, évolutions, qu'elles soient réalisées, créés ou développés par ORANGE concernant le Service sont et demeureront la propriété de ORANGE, et vous reconnaissez et acceptez expressément que toute contribution sous forme de services, de suggestions, d’idées, de rapports, d'identification des défauts, de dépenses, ou toutes autres contributions faîtes par l’Utilisateur, ne donne ou accorde aucun droit, titre ou intérêt dans l'un quelconque des éléments ou composants du Service.\n"+
"8.2 Droit d’usage (licence)\n"+
"ORANGE accorde à l’Utilisateur, par les présentes, un droit d’utilisation non-exclusif, non-transférable, révocable, valable pour le monde entier et ne pouvant faire l’objet de sous-licence, de l’Application et/ou des composants logiciels de l’Application.\n"+
"Cette autorisation est accordée pour autant que le Service est disponible gratuitement et que l’utilisateur utilise l’Application sur un Terminal compatible avec l’iOS d’Apple.\n"+
"Cette autorisation est soumise au respect des présentes CGU et les Règles d’Usage disponibles dans l’App Store Terms of Service.\n"+
"L’autorisation faite à l’Utilisateur ne comprend ni le droit d’accès ni le droit d’utilisation d’aucun code source de l’Application et/ou des composants logiciels de l’Application.\n"+
"L’Utilisateur ne doit pas :\n"+
"a.	utiliser, copier, modifier ou distribuer l’Application et/ou des composants logiciels de l’Application, sauf comme expressément autorisé par les présentes Conditions d’Utilisation ;\n"+
"b.	désassembler, décompiler ou traduire l’Application et/ou des composants logiciels de l’Application, sauf comme expressément autorisé par les lois ou règlements qui sont applicables ;\n"+
"c.	sous-licencier ou concéder l’Application et/ou des composants logiciels de l’Application.\n\n"+

"ARTICLE 9 - LOI APPLICABLE – DISPOSITIONS GÉNÉRALES\n"+
"Si une ou plusieurs stipulations des présentes CGU sont nulles ou déclarées comme telles en application d’une loi, d’un règlement ou à la suite d’une décision définitive d’une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.\n"+
"Les stipulations déclarées nulles et non valides seront alors remplacées par des stipulations qui se rapprocheront le plus quant à leur contenu des stipulations initialement arrêtées.\n"+
"Les parties ne seront pas tenues pour responsables, ou considérées comme ayant failli aux présentes CGU, pour tout retard ou inexécution, lorsque la cause du retard ou de l’inexécution est liée à un cas de force majeure telle que définie par la jurisprudence des tribunaux français.\n"+
"Les présentes CGU sont soumises à la loi française.\n\n"+

"ARTICLE 10 - CONTACT\n"+
"Toute réclamation ou contestation relative au Service doit être transmise par courrier électronique, dans la rubrique « Nous contacter » de l’Application.\n\n";

 	creds += "\n\nINFORMATIONS LÉGALES\n\n";
    creds += "Éditeur:\nFRANCE TELECOM R&D UK LTD (\"ORANGE LABS\") Private company limited by shares N° 419 33 79\n";
    creds += "Adresse : Building 10 Chiswick Park 566, Chiswick High Road, W4 5XS LONDON\n";
    creds += "Numero de téléphone : +442 089 87 1900\n\n";
    creds += "Directeur de la publication:\nMarie-Noëlle JEGO-LAVEISSIERE\n\n"; 
	creds += "Hébergeur:\nFrance TELECOM SA\nRCS Paris 380 129866\nSiège social: 6 place d'Alleray\n75015 PARIS\nN° de téléphone: 01 44 44 22 22\n\n"; 
    creds += "Crédits:\nORANGE LABS\n\n\n"; 
    creds += "DONNÉES\n\nORANGE LABS détient et conserve les données d’identification de ses Utilisateurs conformément à la réglementation en vigueur. Vous pouvez à tout moment accéder et modifier vos informations personnelles dans la rubrique « Nous contacter » de l’application WEATHER DOG\n\n\n"; 
	creds += "Logiciels Tiers:\n\n";
	creds += "Lightwight XML Parser script - Copyright 2010 - Fraser McCormick\nThis script is ditributed under the terms and conditions of the MIT license\n(http://www.opensource.org/licenses/mit-license.php)\n";
	creds += "Appirater - Copyright 2010. Arash Payan. This library is distributed under the terms of the MIT/X11.\n";

    scrollPosition = GUI.BeginScrollView (rScrollFrame, scrollPosition, Rect(0,0,320,5350), false, false);
    GUI.Label(Rect(17,4120,300,30),"MENTIONS LEGALES WEATHER DOG",infoScreenHeaderStyle);
                
	GUI.Label(Rect(20,10,280,5350),creds, infoScreenStyle);
}
#endif 
    GUI.EndScrollView();
    
    
 
}
function DoWindow (windowID: int ) 
{
	
	var listSize: Vector2 = new Vector2(windowRect.width - 2*listMargin.x,
								   windowRect.height - 2*listMargin.y);

	var rScrollFrame: Rect = new Rect(listMargin.x, listMargin.y, listSize.x, listSize.y);

	var rList: Rect = new Rect(0, 0, rowSize.x, WeatherData.searchResults.length*rowSize.y);
	
    scrollPosition = GUI.BeginScrollView (rScrollFrame, scrollPosition, rList, false, false);
        
	var rBtn: Rect = new Rect(0, 0, rowSize.x, rowSize.y);
	
    for (var iRow = 0; iRow < WeatherData.searchResults.length; iRow++)
    {
       	// draw call optimization: don't actually draw the row if it is not visible
        if ( rBtn.yMax >= scrollPosition.y && 
             rBtn.yMin <= (scrollPosition.y + rScrollFrame.height) )
       	{
        	var fClicked: boolean = false; 
           	var rowLabel: String = WWW.UnEscapeURL((WeatherData.searchResults[iRow]as SearchObject).city,System.Text.Encoding.ASCII)+ " " +(WeatherData.searchResults[iRow] as SearchObject).state;
           	
           	if ( iRow == selected )
           	{
            	fClicked = GUI.Button(rBtn, rowLabel, rowSelectedStyle);
           	}
           	else
            {
           		fClicked = GUI.Button(rBtn, rowLabel, rowStyle);
            }
            
            // Allow mouse selection, if not running on iPhone.
            // Note: this code will be triggered 
            if ( fClicked )
            {
//               Debug.Log("Player mouse-clicked on row " + iRow);
		            displaySearchUI = false;

 					locationCode = (WeatherData.searchResults[iRow]as SearchObject).locationCode;
		            locationToSearch = "";
					WeatherData.searchResults.Clear();
					dataConnection.ParseWeatherDataWithLocationCode(locationCode);
            }
       	}
       	            
        rBtn.y += rowSize.y;
    }
    GUI.EndScrollView();
    
    if(WeatherData.hasError)
	{
		GUI.Label(Rect (40, 50, 240, 200),WeatherData.errorMessage ,timeStyle);

	}
	else
	{
		if(WeatherData.isSearching)
			GUI.Label(Rect (40, 50, 240, 90),WeatherData.txtMan.GetText("SEARCHING") ,timeStyle);
	
	}
}
function RefreshByLocation()
{
	dataConnection.FetchByLocationCode(locationCode);

}
function RefreshByGPS()
{
	dataConnection.Fetch();

}
function TouchToRowIndex(touchPos: Vector2 ) :int
{
	var y: float = Screen.height - touchPos.y;  // invert coordinates
	
	y += scrollPosition.y;  // adjust for scroll position
	y -= windowMargin.y * Screen.height/480.0;    // adjust for window y offset
	y -= listMargin.y;      // adjust for scrolling list offset within the window
	var irow: int = (y / rowSize.y);
	
	irow = Mathf.Min(irow, WeatherData.searchResults.length);  // they might have touched beyond last row
	return irow;
}
function StateDidChange()
{
	// the state changed... fire updates
	isChangingState = true;
}


