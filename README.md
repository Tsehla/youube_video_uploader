# youtube_video_upload

upload youtube video automaticaly<br><br>

# to run
node index<br><br>


-> on first run you will have to login to youtube, Profile details will be saved in [ ./chrome-profile ] for re-use, no ogin necessary after succesful login.<br><br>

restart the code to do upload<br><br><br>


# Provide to start function
<br><br>
uploadVideo(<br>
    youtube_channel_id ="UCLyNoRpn3tiBrini8FlebGQ", //https://studio.youtube.com/channel/UCLyNoRpn3tiBrini8FlebGQ<br>
    videoPath = path.join(__dirname + "./videos/video.mp4" ),<br>
    title = 'video 1123', //video title<br>
    description = "video description",<br>
    tags = ['video','video3'], //leave empty to use chanel set default tags<br>
    visibility = "private", //options = private | unlisted | public<br>
    // thumbnailPath: 'C:/Users/gladiatortoise/Desktop/TestThumbnail.jpg',<br>
    video_has_paid_promotions = false,//if video is sponsored<br>
    is_made_for_kids = false,<br>
    is_video_shorts = true, //add #Shorts tag in description //doesnt guarantee syste will treat video as shorts, but will suggest to system<br>
);<br><br>


# Tip : if pupeteer incompartibility problem
<br>
-> delete all dependencies in [ package.json ] and re-install latest versions<br><br>

# youtube video limitation // by chatGPT
<br><br>
As of my last knowledge update in January 2022, YouTube doesn't have a specific limit on the number of videos you can upload in a day. However, there are some general guidelines and restrictions you should be aware of:<br><br>

Video Length: Videos must be no longer than 12 hours.<br>
File Size: Videos must be smaller than 128GB.<br>
Video Formats: YouTube supports a variety of video formats, including MP4, AVI, WMV, FLV, and more.<br>
While there's no explicit limit on the number of videos, YouTube does have policies in place to prevent abuse and spam. If you upload a large number of videos in a short period, YouTube's automated systems might flag your account for review.<br><br>

Keep in mind that YouTube's policies and features may change, so it's always a good idea to check the latest information on YouTube's Help Center or community guidelines for the most up-to-date details.<br><br>








