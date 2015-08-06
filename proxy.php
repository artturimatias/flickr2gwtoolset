<?php

// simple proxy for flickr API

$apikey = 'YOUR API KEY';
$apiurl = 'https://api.flickr.com/services/rest/?method=flickr.';
$url = '';

$photos_by_set 	= "photosets.getPhotos&api_key=".$apikey."&photoset_id=";
$photos_by_user = "people.getPhotos&api_key=".$apikey."&user_id=";
$photo_size 	= "photos.getSizes&api_key=".$apikey."&photo_id=";
$photo_info 	= "photos.getInfo&api_key=".$apikey."&photo_id=";

if( $_GET["command"] ) {
	switch ($_GET["command"]) {
		case 'flickr.people.getPhotos':
			$url = $apiurl.$photos_by_user.$_GET["user_id"];
			break;
		case 'flickr.photosets.getPhotos':
			$url = $apiurl.$photos_by_set.$_GET["photoset_id"];
			break;
		case 'flickr.photos.getSizes':
			$url = $apiurl.$photo_size.$_GET["photo_id"];
			break;
		case 'flickr.photos.getInfo':
			$url = $apiurl.$photo_info.$_GET["photo_id"];
			break;
		}


}


$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
if(curl_errno($ch)){
    echo 'Request Error:' . curl_error($ch);
} else {
    echo $result;
}

?>
