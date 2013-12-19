var dogBark1: AudioClip;
var dogBark2: AudioClip;
var dogGrowl1: AudioClip;
var dogWhine1: AudioClip;
var dogWhine2: AudioClip;
var dogPant: AudioClip;
var dogSnore: AudioClip;
function bark1 () {
	audio.clip = dogBark1;
	audio.Play();
}
function bark2 () {
	audio.clip = dogBark2;
	audio.Play();
}
function whine1 () {
	audio.clip = dogWhine1;
	audio.Play();
}
function whine2 () {
	audio.clip = dogWhine2;
	audio.Play();
}
function growl () {
	audio.clip = dogGrowl1;
	audio.Play();
}
function pant () {
	audio.clip = dogPant;
	audio.Play();
}

function snore()
{
	audio.clip = dogSnore;
	audio.Play();
}

function Update()
{
	audio.mute = OrangeWeatherController.muteSound;	
}
