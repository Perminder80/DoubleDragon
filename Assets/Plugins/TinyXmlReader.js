function HTMLDecode(Str: String) : String
{
	// nothing fancy.... we simply replace the special characters
	Str = Str.Replace("&amp;","&");
		
	Str = Str.Replace("&quot;","\"");

	Str = Str.Replace("&#039;","'");

	Str = Str.Replace("&lt;","<");
		
	Str = Str.Replace("&gt;",">");
	
	return Str;

}
class TinyXmlReader
{

private var xmlString = "";
private var idx = 0;

function TinyXmlReader(aXmlString : String)
{
    xmlString = aXmlString;
}

var tagName = "";
var isOpeningTag = false;
var content = "";

function Read() : boolean
{
	
    idx = xmlString.IndexOf("<", idx);
    if (idx == -1)
    {
        return false;
    }
    ++idx;

    var endOfTag = xmlString.IndexOf(">", idx);
    if (endOfTag == -1)
    {
        return false;
    }

    tagName = xmlString.Substring(idx, endOfTag-idx);

	//Yaser: Addition to ignore attributes
	if(tagName.Contains(" "))
	{
		var ws = tagName.Split(" "[0]);
		tagName = ws[0].Trim();
//		Debug.Log(tagName);
	}
	

    idx = endOfTag;

    // check if a closing tag
    if (tagName.StartsWith("/"))
    {
        isOpeningTag = false;
        tagName = tagName.Remove(0, 1); // remove the slash
    }
    else
    {
        isOpeningTag = true;
    }

    // if an opening tag, get the content
    if (isOpeningTag)
    {
        var startOfCloseTag = xmlString.IndexOf("<", idx);
        content = xmlString.Substring(idx+1, startOfCloseTag-idx-1);
        content = content.Trim();
    }

    return true;
}

// returns false when the endingTag is encountered
function Read(endingTag : String) : boolean
{
    var retVal = Read();
    if (tagName == endingTag && !isOpeningTag)
    {
        retVal = false;
    }
    return retVal;
}

}