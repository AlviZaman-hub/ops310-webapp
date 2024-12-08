document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const messageElement = document.getElementById('message');
    const file = fileInput.files[0];

    // Reset the message
    messageElement.textContent = '';
    messageElement.className = 'message';

    // Display the selected file name
    if (file) {
        messageElement.textContent = `Selected file: "${file.name}" (${(file.size / 1024).toFixed(2)} KB)`;
    } else {
        messageElement.textContent = "Please select a file!";
        messageElement.className += ' error';
        return;
    }

    // Attempt to fetch the SAS URL dynamically
    let uploadUrl = null;
    try {
        const response = await fetch("/api/config");
        if (!response.ok) {
            throw new Error("Failed to fetch configuration");
        }
        const config = await response.json();
        uploadUrl = config.STORAGE_UPLOAD_URL;
    } catch (error) {
        console.error("Error fetching SAS URL from /api/config:", error);
        // Fallback to a hardcoded SAS URL
        uploadUrl = "https://ops310prj2sazaman1.blob.core.windows.net/incoming-files?sp=rcw&st=2024-12-08T08:31:56Z&se=2024-12-15T16:31:56Z&spr=https&sv=2022-11-02&sr=c&sig=tZFrRPRFuwsRaCYmwflqwjZi8BCCmwuVFqGKkyeGi5M%3D";
    }

    if (!uploadUrl) {
        messageElement.textContent = "Failed to obtain upload URL.";
        messageElement.className += ' error';
        return;
    }

    // Display uploading message
    messageElement.textContent = `Uploading file: "${file.name}"...`;
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
            messageElement.textContent = `Failed to upload file "${file.name}". Please try again.`;
            messageElement.className += ' error';
        }
    } catch (error) {
        messageElement.textContent = `An error occurred while uploading "${file.name}".`;
        messageElement.className += ' error';
        console.error("Upload Error:", error);
    }
});
