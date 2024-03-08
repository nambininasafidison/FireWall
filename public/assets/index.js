function sendCommand() {
    const commandInput = document.getElementById('commandInput').value;
    
    fetch('http://localhost:3000/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: commandInput })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('output').innerText = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}