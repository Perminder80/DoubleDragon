

import System.IO;//using System.IO;

//================================================== =============================================
// TextManager
// 08/06/2011
//
// Reads text files in the Assets\Resources\Languages directory into a Hashtable. The text file
// consists of one line that has the key name while the next line has the actual
// text to display. This is used to localize a game.
//
// Example:
// Assume we have a text file called English.txt in Assets\Resources\Languages
// The file looks like this:
//
// HELLO
// Hello and welcome!
// GOODBYE
// Goodbye and thanks for playing!
//
// in code we load the language file automatically at start
// LoadLanguage("English");
//
// then we can retrieve text by calling
// var adm_texto = TextManager(Application.systemLanguage.ToString()) ; //Here we load the file with our
// // Language
// textGUI.text = adm_texto.GetText("HELP"); //Load the localized string
//
//
// will return a String containing "Hello and welcome!"
//
//================================================== =============================================

class TextManager{

//DECLARATIONS
private var textTable : Hashtable;
var filename : String; // name of the text asset

function TextManager(mypath:String){
filename=mypath;
LoadLanguage(filename);
}

public function LoadLanguage( filename : String ) : boolean
{

var fullpath : String = "Languages/" + filename;

var textAsset : TextAsset = Resources.Load(fullpath, typeof(TextAsset));
if (textAsset == null)
{
Debug.Log(fullpath + " file not found.");
return false;
}

// create the text hash table if one doesn't exist
if (textTable == null)
{
textTable = new Hashtable();
}

// clear the hashtable
textTable.Clear();

var reader : StringReader = new StringReader(textAsset.text);
var key : String;
var val : String;
while(true)
{
key = reader.ReadLine();
val = reader.ReadLine();
if (key != null && val != null)
{
// TODO: add error handling here in case of duplicate keys
textTable.Add(key, val);
}
else
{
break;
}
}


reader.Close();

return true;
}


public function GetText( key : String ): String
{
// TODO: add error handling here in case the key doesn't exist
return textTable[key];
}
} 