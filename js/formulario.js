const btn = document.getElementById('button');

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    if (validateForm()) {
        btn.value = 'Sending...';

        const serviceID = 'service_ja9mpkr';
        const templateID = 'template_yn2fv6t';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Send Email';
                alert(JSON.stringify(err));
            });
    }
});

function validateForm() {
    const nameInput = document.getElementById('from_name');
    const lastNameInput = document.getElementById('last-name');
    const numberInput = document.getElementById('number');

    if (!nameInput.value || !lastNameInput.value || !numberInput.value) {
        alert('Por favor, completa todos los campos obligatorios.');
        return false;
    }

    return true;
}
