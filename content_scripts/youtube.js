let intervalId = setInterval(function() {
    let targetNode = document.getElementById('ytp-id-18');

    if (targetNode) {
let observer = new MutationObserver(function(mutationsList, observer) {
 // Function to execute when mutations are observed
 console.log('The #ytp-id-18 subtree was modified.');
 try {
     let targetElement = mutationsList[0].target.childNodes[1].childNodes[1];
     let existingElements = targetElement.getElementsByClassName('ytp-menuitem-label');
     let alreadyExists = Array.from(existingElements).some(el => el.textContent === 'RSC');

     if (!alreadyExists) {
         let newElement = document.createElement('div');
         newElement.className = 'ytp-menuitem';
         newElement.tabIndex = 0;
         newElement.setAttribute('role', 'menuitemradio');
         newElement.setAttribute('aria-checked', 'false');

         let label = document.createElement('div');
         label.className = 'ytp-menuitem-label';
         label.textContent = 'RSC';

         newElement.appendChild(label);
         targetElement.appendChild(newElement);

         // Add click event listener
newElement.addEventListener('click', function() {
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