// Display file name and size when a file is selected
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    const messageElement = document.getElementById('message');

    // Reset the message
    messageElement.textContent = '';
    messageElement.className = 'message';

    if (file) {
        // Display selected file name and size
        messageElement.textContent = `Selected file: "${file.name}" (${(file.size / 1024).toFixed(2)} KB)`;
        console.log(`File selected: Name: "${file.name}", Size: ${file.size} bytes`);
    } else {
        messageElement.textContent = "No file selected.";
        console.error("No file selected.");
    }
});

// Handle file upload when the form is submitted
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const fileInput = document.getElementById('fileInput');
    const messageElement = document.getElementById('message');
    const file = fileInput.files[0]; // Get the selected file

    // Reset the message
    messageElement.className = 'message';

    if (!file) {
        messageElement.textContent = "Please select a file!";
        messageElement.className += ' error';
        console.error("No file selected");
        return;
    }

    // Attempt to fetch the SAS URL dynamically from /api/config
    let uploadUrl = null;
    try {
        console.log("Fetching SAS URL from /api/config...");
        const response = await fetch("/api/config");
        if (!response.ok) {
            throw new Error(`Failed to fetch SAS URL. HTTP status: ${response.status}`);
        }
        const config = await response.json();
        uploadUrl = config.STORAGE_UPLOAD_URL; // Extract the SAS URL
        console.log("SAS URL successfully fetched:", uploadUrl);
    } catch (error) {
        console.error("Error fetching SAS URL from /api/config:", error);
        messageElement.textContent = "Failed to fetch upload URL. Please try again.";
        messageElement.className += ' error';
        return;
    }

    // Display uploading message
    messageElement.textContent = `Uploading file: "${file.name}"...`;
    console.log(`Uploading file "${file.name}" to SAS URL:`, uploadUrl);

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
            console.log(`File "${file.name}" uploaded successfully!`);
        } else {
            messageElement.textContent = `Failed to upload file "${file.name}". Please try again.`;
            messageElement.className += ' error';
            console.error(`Upload failed with status: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        messageElement.textContent = `An error occurred while uploading "${file.name}".`;
        messageElement.className += ' error';
        console.error("Upload Error:", error);
    }
});
