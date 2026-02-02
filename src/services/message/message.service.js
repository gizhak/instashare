import { httpService } from '../http.service';

export const messageService = {
	getMessages,
	getConversations,
	deleteConversation,
};

async function getMessages(otherUserId) {
	return httpService.get(`message/${otherUserId}`);
}

async function getConversations() {
	return httpService.get('message/conversations');
}

async function deleteConversation(otherUserId) {
	return httpService.delete(`message/${otherUserId}`);
}
