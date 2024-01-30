transcripts = []
active_transcript = null;

class RCClient {
    constructor(ip="https://rsctesting.personal.b0vik.dev", api_key="debug") {
        this.ip = ip;
        this.api_key = api_key;
    }
    async retrieveCompletedTranscripts(currentUrl) {
        const data = {
            transcriptType: 'public-url',
            audioUrl: currentUrl,
            format: 'vtt'
        };

        const response = await fetch(`${this.ip}/retrieveCompletedTranscripts`, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${this.api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`error from rsc: ${response.status}`);
        }

        return await response.json();
    }
}

let intervalId = setInterval(function () {
    // hack: wait until subtitles menu shows up in body w/ a setInterval before putting a MutationObserver on it
    let targetNode = document.getElementById('ytp-id-18');

    if (targetNode) {
        let observer = new MutationObserver(function (mutationsList, observer) {
            // Function to execute when mutations are observed
            console.log('The #ytp-id-18 subtree was modified.');
            try {
                let targetElement = mutationsList[0].target.childNodes[1].childNodes[1];
                let existingElements = targetElement.getElementsByClassName('ytp-menuitem-label');
                let alreadyExists = targetElement.innerText.includes("Generate") // FIXME: these checks are ugly and will be broken by i18n
                let correctElement = targetElement.innerText.startsWith("Off")
                console.log(targetElement);

                if (!alreadyExists && correctElement) {
                    let newElement = document.createElement('div');
                    newElement.className = 'ytp-menuitem';
                    newElement.tabIndex = 0;
                    newElement.setAttribute('role', 'menuitemradio');
                    newElement.setAttribute('aria-checked', 'false');

                    let label = document.createElement('div');
                    label.className = 'ytp-menuitem-label';
                    label.textContent = ' Generate...';
                    let img = document.createElement('img');
                    // console.log("image url: " + chrome.runtime.getURL('resources/images/output.png'));
                    img.src = chrome.runtime.getURL('resources/images/output.png');
                    img.style.float = 'left';
                    img.width = 16;
                    img.height = 16;
                    label.appendChild(img);

                    newElement.appendChild(label);
                    transcripts.forEach(transcript => {
                        let transcriptListing = document.createElement('div');
                        transcriptListing.className = 'ytp-menuitem';
                        transcriptListing.tabIndex = 0;
                        transcriptListing.setAttribute('role', 'menuitemradio');
                        transcriptListing.setAttribute('aria-checked', 'false');
                        transcriptListing.addEventListener('click', () => {
                            console.log("clicked");
                            targetElement.children[0].click(); // click the 'off' button to close the dialog and disable yt's subtitles
                            active_transcript = transcript;
                            var blob = new Blob([transcript.text], {type: 'text/vtt'});
                            var url = URL.createObjectURL(blob);
                            var trackElement = document.createElement('track');
                            trackElement.src = url;
                            trackElement.kind = 'subtitles';
                            trackElement.srclang = 'en';
                            trackElement.label = 'English';
                            trackElement.mode = "showing";
                            trackElement.default = true;
                            video_element = document.querySelector('.html5-main-video');
                            video_element.appendChild(trackElement);
                            // Array.from(targetElement.children).forEach(child => {
                            //     child.setAttribute('aria-checked', 'false');
                            // });
                            // transcriptListing.setAttribute('aria-checked', 'true');
                        });

                        let label = document.createElement('div');
                        label.className = 'ytp-menuitem-label';
                        label.textContent = ` English (${transcript.requestedModel})`;
                        let img = document.createElement('img');
                        // console.log("image url: " + chrome.runtime.getURL('resources/images/output.png'));
                        img.src = chrome.runtime.getURL('resources/images/output.png');
                        img.style.float = 'left';
                        img.width = 16;
                        img.height = 16;
                        label.appendChild(img);

                        transcriptListing.appendChild(label);
                        targetElement.appendChild(transcriptListing)
                    });
                    targetElement.appendChild(newElement);

                    // Add click event listener
                    newElement.addEventListener('click', function () {
                        let moviePlayerDiv = document.getElementById('movie_player');
                        if (moviePlayerDiv) {
                            let newDiv = document.createElement('div');
                            newDiv.textContent = 'Some text';
                            newDiv.style.cssText = "z-index: 5000; bottom: 100px; position: absolute; right: 100px; background-color: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px;";

                            let button1 = document.createElement('button');
                            button1.textContent = 'Button 1';
                            newDiv.appendChild(button1);

                            let button2 = document.createElement('button');
                            button2.textContent = 'Button 2';
                            newDiv.appendChild(button2);

                            // Insert the div above the last two divs
                            let lastChild = moviePlayerDiv.lastChild;
                            moviePlayerDiv.insertBefore(newDiv, lastChild);
                        }
                    });
                }
            } catch (error) {
                if (error instanceof TypeError) {
                    // Handle TypeError here
                } else {
                    console.log('An error occurred:', error);
                    // Handle other types of errors here
                }
            }
        });

        // Options for the observer (which mutations to observe)
        let config = { attributes: true, childList: true, subtree: true };

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    } else {
        console.log(`Target node ytp-id-18 not found.`);
    }
}, 100);
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

let client = new RCClient();
client.retrieveCompletedTranscripts(`https://www.youtube.com/watch?v=${youtube_parser(window.location.href)}`).then(result => {
    transcripts = result.transcripts
    console.log(transcripts)
}).catch(error => {
    console.trace('Error:', error);
});