//@script ExecuteInEditMode()
var optionsSkin: GUISkin ;
var rowSelectedStyle: GUIStyle;

// Internal variables for managing touches and drags
private var selected: int  = -1;
private var scrollVelocity: float  = 0f;
private var timeTouchPhaseEnded: float  = 0f;
private var previousDelta: float  = 0f;
private var inertiaDuration: float  = 0.5f;

public var scrollPosition: Vector2 ;

// size of the window and scrollable list
public var numRows: int ;
public var rowSize: Vector2 ;
public var windowMargin: Vector2 ;
public var listMargin: Vector2 ;

private var windowRect: Rect ;

private var dataConnection: WeatherData;

private var locationToSearch: String = "";
static var locationCode: String = "";

static var displaySearchUI: boolean = false;
static var shouldFetchByLocationCode: boolean = false;
static var shouldFetchByGPS: boolean = false;

function Start()
{
	dataConnection = (GetComponent("WeatherData") as WeatherData);
	
}
function Update()
{
	if(displaySearchUI)
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
		            locationCode = (WeatherData.searchResults[selected]as SearchObject).locationCode;
		            locationToSearch = "";
					WeatherData.searchResults.Clear();
		            displaySearchUI = false;
		            shouldFetchByLocationCode = true;
	            }
	        }
			else
			{
				// impart momentum, using last delta as the starting velocity
				// ignore delta < 10; precision issues can cause ultra-high velocity
				if (Mathf.Abs(touch.deltaPosition.y) >= 10) 
					scrollVelocity = (touch.deltaPosition.y / touch.deltaTime) ;
				timeTouchPhaseEnded = Time.time;
			}
		}
	}
}

function OnGUI ()
{
	if(displaySearchUI)
	{

		windowRect = new Rect(windowMargin.x, windowMargin.y, 
        				 Screen.width- (2*windowMargin.x), Screen.height - (2*windowMargin.y));
	    GUI.Window(0, windowRect, DoWindow as GUI.WindowFunction, "");
	
		GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3(Screen.width / 320.0, Screen.height / 480.0, 1)); 

		
		if(locationToSearch == "")
		{
			GUI.Label(Rect (60, 10, 180, 30), "type city name (no spaces)",rowSelectedStyle);
		}
		locationToSearch = GUI.TextField (Rect (60, 10, 180, 30), locationToSearch);
	
		if(GUI.Button(Rect(260, 10, 50, 30),"Find"))
		{
			// go search
			dataConnection.SearchForLocation(locationToSearch);
			
		}
		if(GUI.Button(Rect(10, 440, 300, 30),"use my location"))
		{
			// go search
			locationToSearch = "";
			WeatherData.searchResults.Clear();
			displaySearchUI = false;
			shouldFetchByGPS = true;
		}
	    GUI.skin = optionsSkin;
	    

    }
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
           	var rowLabel: String = (WeatherData.searchResults[iRow]as SearchObject).city+ " " +(WeatherData.searchResults[iRow] as SearchObject).state;
           	
           	if ( iRow == selected )
           	{
            	fClicked = GUI.Button(rBtn, rowLabel, rowSelectedStyle);
           	}
           	else
            {
           		fClicked = GUI.Button(rBtn, rowLabel);
            }
            
            // Allow mouse selection, if not running on iPhone.
            // Note: this code will be triggered 
            if ( fClicked && Application.platform != RuntimePlatform.IPhonePlayer )
            {
               Debug.Log("Player mouse-clicked on row " + iRow);
            }
       	}
       	            
        rBtn.y += rowSize.y;
    }
    GUI.EndScrollView();
}

function TouchToRowIndex(touchPos: Vector2 ) :int
{
	var y: float = Screen.height - touchPos.y;  // invert coordinates
	
	y += scrollPosition.y;  // adjust for scroll position
	y -= windowMargin.y;    // adjust for window y offset
	y -= listMargin.y;      // adjust for scrolling list offset within the window
	var irow: int = (y / rowSize.y);
	
	irow = Mathf.Min(irow, WeatherData.searchResults.length);  // they might have touched beyond last row
	return irow;
}

 