import { httpService } from '../http.service';

export const messageService = {
	getMessages,
	getConversations,
	deleteConversation,
};

async function getMessages(otherUserId) {
	return httpService.get(`message/${otherUserId}?_t=${Date.now()}`);
}

async function getConversations() {
	return httpService.get(`message/conversations?_t=${Date.now()}`);
}

async function deleteConversation(otherUserId) {
	return httpService.delete(`message/${otherUserId}`);
}
