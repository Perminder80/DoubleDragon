#pragma strict

var lives : GUIText;
var numLives : int;

function Start () {

	numLives = 3;
}

function Update () {

	lives.text = "LIVES: "+numLives;

}