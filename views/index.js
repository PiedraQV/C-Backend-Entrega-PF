const socket = io();

// Chat form
const $chatForm = document.querySelector('#chat-form');
const $userEmail = document.querySelector('#user-email');
const $chatMessage = document.querySelector('#chat-message');
const $tableChat = document.querySelector('#table-chat');

$chatForm.addEventListener('submit', e => {
	e.preventDefault();
	if ($userEmail.value == '') return alert('Ingresa tu email');
	const message = {
		email: $userEmail.value,
		message: $chatMessage.value,
		date: new Date().toLocaleString()
	}
	socket.emit('message', message);
	e.target.reset();
});

const renderChat = messages => {
	if (messages.length > 0) {
		$tableChat.innerHTML = '';
		messages.forEach(message => {
			$tableChat.innerHTML += `
		<div>
			<b class="text-primary">${message.email}</b>
			[<span style="color: brown;">${message.date}</span>]
			: <i class="text-success">${message.message}</i>
		</div > `;
		})
		$chatMessage.focus();
	}
}

socket.on('messages', messages => {
	renderChat(messages);
});