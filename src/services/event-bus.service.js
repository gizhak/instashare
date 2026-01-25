export const SHOW_MSG = 'show-msg';

function createEventEmitter() {
	const listenersMap = {};
	return {
		on(evName, listener) {
			listenersMap[evName] = listenersMap[evName]
				? [...listenersMap[evName], listener]
				: [listener];
			return () => {
				listenersMap[evName] = listenersMap[evName].filter(
					(func) => func !== listener
				);
			};
		},
		emit(evName, data) {
			if (!listenersMap[evName]) return;
			listenersMap[evName].forEach((listener) => listener(data));
		},
	};
}

export const eventBus = createEventEmitter();

export function showUserMsg(msg) {
	eventBus.emit(SHOW_MSG, msg);
}

export function confirmUserMsg(txt) {
	eventBus.emit(SHOW_MSG, { txt, type: 'confirm' });
}

export function showSuccessMsg(txt) {
	showUserMsg({ txt, type: 'success' });
}
export function showErrorMsg(txt) {
	showUserMsg({ txt, type: 'error' });
}

export function showGeneralMsg(txt) {
	showUserMsg({ txt, type: 'general' });
}

export function showLoadingMsg() {
	showUserMsg({ txt: 'Loading...', type: 'loading' });
}

export function confirmMsg(txt) {
	confirmUserMsg(txt);
}

window.showUserMsg = showUserMsg;
window.confirmMsg = confirmMsg;
