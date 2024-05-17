document.addEventListener('DOMContentLoaded', function () {
  const modalHTML = `
      <div id="image-picker-modal" style="display: none;">
          <div id="modal-content">
              <span id="close-modal" style="float:right; cursor:pointer;">&times;</span>
              <p>Select an image to add to your URSTYLE account:</p>
              <div id="images-container"></div>
              <button id="upload-selected">Upload Selected</button>
          </div>
      </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('image-picker-modal');
  const closeModal = document.getElementById('close-modal');
  closeModal.onclick = function() {
      modal.style.display = "none";
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "toggleModal") {
          modal.style.display = modal.style.display === "none" ? "block" : "none";
          // Optionally load images or perform other actions here
      }
  });
});

// Function to populate images or handle UI interactions
