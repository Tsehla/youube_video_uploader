const fs = require("fs");
const path = require("path");

// load puppeteer
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
StealthPlugin.enabledEvasions.delete('iframe.contentWindow');
StealthPlugin.enabledEvasions.delete('navigator.plugins');
puppeteer.use(StealthPlugin);


function uploadVideo(
    youtube_channel_id ="UCLyNoRpn3tiBrini8FlebGQ", //https://studio.youtube.com/channel/UCLyNoRpn3tiBrini8FlebGQ
    videoPath = path.join(__dirname + "./videos/video.mp4" ),
    title = 'video 1123', //video title
    description = "video description",
    tags = ['video','video3'],
    visibility = "private", //private | unlisted | public
    // thumbnailPath: 'C:/Users/gladiatortoise/Desktop/TestThumbnail.jpg',
    video_has_paid_promotions = false,
    is_made_for_kids = false,
    is_video_shorts = true, //add #Shorts tag in description //doesnt guarantee syste will treat video as shorts, but will suggest to system
){


    
    if(is_video_shorts){ //if shorts

        if(tags && typeof(tags) === 'object'){ //i tags
            tags.unshift('#Shorts')
        }

        if(description){//if description
            description = description + '\n\n#shorts';
        }

    }



    const window_height = 768;
    const window_width = 1366;
    // const studio_url = "https://studio.youtube.com/";
    const studio_url = "https://studio.youtube.com/channel/"+youtube_channel_id;


    const DEFAULT_ARGS = [
        '--disable-background-networking',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        // BlinkGenPropertyTrees disabled due to crbug.com/937609
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain',
        "--hide-scrollbars"
    ];

    try {
        (async () => {


            //local profile
            const profilePath = path.join(__dirname, 'chrome-profile');

            const browser = await puppeteer.launch(
                {
                    'headless': false,    // have window
                    // executablePath: "C:\Program Files\Google\Chrome\Application\chrome.exe", //null,
                    userDataDir: profilePath,
                    // ignoreDefaultArgs: DEFAULT_ARGS,
                    // autoClose: false,
                    args: ['--lang=en-US,en',
                        `--window-size=${window_width},${window_height}`,
                        '--enable-audio-service-sandbox',
                        '--no-sandbox',
                        
                    ],
                }
            );


            

            let page = await browser.newPage();
            await page.setViewport({'width': window_width, 'height': window_height});
            await page.goto(studio_url, options = {'timeout': 20 * 1000});

            await page.waitForSelector('#create-icon').then(async ()=>{ 

                console.log("now process file:\t" + videoPath);

                //click video create options icon /button
                console.log('clicking upload create button');
                await page.click('#create-icon');

                //click upload video
                await page.click('#text-item-0 > ytcp-ve');
                await sleep(500);


                //click select files button and upload file
                const [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    page.click('#select-files-button > div'), // some button that triggers file selection
                ]);
                await fileChooser.accept([videoPath]);

                console.log('Adding video to upload : '+ videoPath)
                // wait 10 seconds
                await sleep(10_000);




                // title content
                const text_box = await page.$x("//*[@id=\"textbox\"]");
                await page.evaluate(()=>{
                    // document.querySelector('#textbox').focus();
                    // document.querySelector('#textbox').innerHTML=''
                    // document.querySelector('#textbox').click()

                    document.querySelectorAll('#textbox')[0].focus();
                    document.querySelectorAll('#textbox')[0].innerHTML='';
                    document.querySelectorAll('#textbox')[0].click();
                })
                
                console.log('Typing video title');
                await text_box[0].type(title);
                // await text_box[0].type(title_prefix + file_name.replace('.mp4', ''));
                //  await page.type('#textbox', title_prefix + file_name.replace('.mp4',''));
                await sleep(1000);



                // Description content
                await page.evaluate(()=>{
                    document.querySelectorAll('#textbox')[1].focus();
                    document.querySelectorAll('#textbox')[1].innerHTML='';
                    document.querySelectorAll('#textbox')[1].click();
                })
                await text_box[1].type(description);
                console.log('Typing video description');
                await sleep(1000);


                // add video to the second playlists
                // await page.click('#basics > ytcp-video-metadata-playlists > ytcp-text-dropdown-trigger > ytcp-dropdown-trigger > div');
                // await page.click('#items > ytcp-ve:nth-child(3)');
                // await page.click('#dialog > div.action-buttons.style-scope.ytcp-playlist-dialog > ytcp-button.save-button.action-button.style-scope.ytcp-playlist-dialog > div');
                // await sleep(500);

                //not made for kids eadio buttin
                console.log('Choosing if video is made for kids option : ' + is_made_for_kids);
                await page.evaluate((is_made_for_kids) => {
                    
                    // Select the second radio button and click it
                    if(is_made_for_kids){

                        document.querySelectorAll('div#offRadio.style-scope.tp-yt-paper-radio-button')[0].click();; //made for kids option
                    }
                    else {

                        document.querySelectorAll('div#offRadio.style-scope.tp-yt-paper-radio-button')[1].click(); //not made for kids option
                    }

                },is_made_for_kids);


                //click show more button 
                await page.evaluate(()=>{
                    document.querySelector('#toggle-button').click();
                })


                console.log('Choosing if video is sponsored option : ' + video_has_paid_promotions);
                if(video_has_paid_promotions){
                    await page.evaluate(()=>{
                        // document.querySelector('#checkbox').click()
                        document.querySelector("#has-ppp").click()
                    })
                }

                //tags add
                await page.focus(`[aria-label="Tags"]`);


                console.log("video tags adding if provided")
                await page.evaluate((tags)=>{
               
                    if(tags && typeof(tags) === 'object' && tags.length > 0){

                        document.querySelector('#clear-button').click();

                        document.querySelector('#text-input').value=tags.join(', ').substring(0, 495) + ', ';

                    }
                }, tags)
                // await page.type(`[aria-label="Tags"]`, tags.join(', ').substring(0, 495) + ', ');



                //click next - to video elements page
                console.log("goto [ video elements Page ] ")
                await page.evaluate(() => {
                    document.querySelector('#next-button').click()
                })
                await sleep(1000);

                //click next to video checks/copyright page
                // await page.click('#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog');
                console.log("goto [ video copyright checks Page ] ")
                await page.evaluate(() => {
                    document.querySelector('#next-button').click()
                })
                await sleep(1000);


                //video listing visibility page
                console.log("goto [ video listing options Page ] ")
                await page.evaluate(() => {
                    document.querySelector('#next-button').click()
                })
                await sleep(1000);


                //video youtube url
                var vide_url = await page.evaluate(()=>{
                    // return document.getElementById("share-url").href
                    return document.querySelector(".video-url-fadeable.style-scope.ytcp-video-info").innerText
                })

                //video listings ---
                //unlisted
                console.log("setting video listing option as : "+ visibility)
                await page.evaluate((visibility) => {

                    if(visibility === "private"){ //private
                   
                        document.querySelectorAll('tp-yt-paper-radio-button')[0].click()
                    }
                    else if(visibility === "public"){ //publick
                        document.querySelectorAll('tp-yt-paper-radio-button')[2].click()
                    } 
                    else { //unlisted
                        document.querySelectorAll('tp-yt-paper-radio-button')[1].click();
                    }
                
                },visibility);



                console.log('clicking done button')
                await page.click('#done-button');

                await sleep(5000);
                // // close

                await page.click('#close-button > div');

                // wait 60 seconds
                await sleep(60 * 1000);
                
                await browser.close();

                console.log("file succesfully uploaded. video Youtube url : ", vide_url);

            }).catch(e=>{
                console.log('upload error : '+e);
            });
        })();

    } catch (error) {
        console.log('puppeter start err : ',error); 
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
uploadVideo()
