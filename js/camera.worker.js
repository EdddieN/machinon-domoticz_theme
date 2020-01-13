self.addEventListener('message', async event => {
  const cameraURL = "/camsnapshot.jpg?idx=" + event.data + "&t=" + Date.now();

  fetch(cameraURL)
  .then(function(response) {
    if(response.ok) {
        response.blob().then(function(blob) {
           // Send the image data to the main thread!
           self.postMessage({
             cameraId: event.data,
             blob: blob,
           })
        })
    }
  })
  .catch(function(error) {
    console.log("Error fetching " + cameraURL + " --> " + error.message);
  });
})
