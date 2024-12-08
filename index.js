document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const messageElement = document.getElementById('message');
    const file = fileInput.files[0];

    // Reset message
    messageElement.textContent = '';
    messageElement.className = 'message';

    if (!file) {
        messageElement.textContent = "Please select a file!";
        messageElement.className += ' error';
        return;
    }

    const uploadUrl = "<Your Azure Blob Upload URL>"; // Replace with your Azure Blob Storage URL

    // Display uploading message
    messageElement.textContent = "Uploading...";
    messageElement.className = 'message';

    try {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
            },
            body: file
        });

        if (response.ok) {
            messageElement.textContent = `File "${file.name}" uploaded successfully!`;
            messageElement.className += ' success';
        } else {
            messageElement.textContent = "File upload failed!";
            messageElement.className += ' error';
        }
    } catch (error) {
        messageElement.textContent = "An error occurred during upload!";
        messageElement.className += ' error';
        console.error("Upload Error:", error);
    }
});
